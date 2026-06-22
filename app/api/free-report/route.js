import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { sendEmail } from "../../../lib/awsclient";
import {
  isValidIndianMobile,
  normalizeIndianMobile,
  INVALID_MOBILE_MESSAGE,
} from "../../../lib/validation/phone";

// No-reply sender on an SES-verified domain (raceinnovations.in is NOT verified;
// raceautoindia.com is — so no-reply@raceautoindia.com delivers).
const CONFIRMATION_FROM =
  process.env.REPORT_CONFIRMATION_FROM ||
  "Race Innovations <no-reply@raceautoindia.com>";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Free report ("price = 0") requests. No payment is taken — we record the
 * lead, notify the team, and email the customer a confirmation. Mirrors the
 * paid flow (which is fulfilled manually) but skips Razorpay entirely.
 */
export async function POST(req) {
  try {
    const body = await req.json();

    const report_id = body?.report_id ?? "";
    const report_title = String(body?.report_title || "").trim();
    const report_slug = String(body?.report_slug || "").trim();
    const sample_pdf = String(body?.sample_pdf || "").trim();
    const flipbook_url = String(body?.flipbook_url || "").trim();
    const customer_name = String(body?.customer_name || "").trim();
    const customer_email = String(body?.customer_email || "").trim();
    const customer_phone = String(body?.customer_phone || "").trim();
    const customer_company = String(body?.customer_company || "").trim();

    if (!report_title) {
      return NextResponse.json(
        { success: false, message: "Report title is required." },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_email || !customer_phone) {
      return NextResponse.json(
        { success: false, message: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!isValidIndianMobile(customer_phone)) {
      return NextResponse.json(
        { success: false, message: INVALID_MOBILE_MESSAGE },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeIndianMobile(customer_phone);

    // Record the free request in the same table the paid flow uses so all
    // report leads live in one place. amount = 0, status = "free".
    try {
      await db.query(
        `INSERT INTO report_payments
          (report_id, report_title, amount, currency, customer_name,
           customer_email, customer_phone, razorpay_order_id, payment_status,
           payment_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(report_id || ""),
          report_title,
          0,
          "USD",
          customer_name,
          customer_email,
          normalizedPhone,
          `free_${Date.now()}`,
          "free",
          "free",
        ]
      );
    } catch (dbErr) {
      console.error("Free report DB insert failed:", dbErr);
      // Don't block the user on a logging failure — continue to emails.
    }

    // Build the report view link. Prefer the admin-provided flipbook URL; fall
    // back to the in-app sample reader, then the report page.
    const SITE = (
      process.env.NEXT_PUBLIC_SITE_URL || "https://raceinnovations.in"
    ).replace(/\/+$/, "");
    let viewLink = flipbook_url;
    if (!viewLink) {
      if (sample_pdf) {
        viewLink = `${SITE}/sample-flipbook?pdf=${encodeURIComponent(
          sample_pdf
        )}&title=${encodeURIComponent(report_title)}`;
      } else if (report_slug) {
        viewLink = `${SITE}/reports/${report_slug}`;
      }
    }

    // Single automated email to the customer with the free report access link.
    try {
      const linkBlock = viewLink
        ? `<p style="margin:0 0 8px 0;">
             Your requested free report is now available to view. Please use the
             link below to access the report:
           </p>
           <p style="margin:0 0 18px 0;">
             <a href="${escapeHtml(viewLink)}" target="_blank"
                style="display:inline-block;background:#2f45bf;color:#ffffff;
                       text-decoration:none;font-weight:bold;padding:12px 22px;
                       border-radius:10px;">View Free Report</a>
           </p>`
        : `<p style="margin:0 0 18px 0;">
             Your requested free report will be shared at this email address
             shortly.
           </p>`;

      const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid #e5e7eb;border-radius:8px;">
          <tr><td style="padding:24px 28px;border-bottom:1px solid #e5e7eb;">
            <h1 style="margin:0;font-size:22px;color:#0f172a;">Race Innovations</h1>
          </td></tr>
          <tr><td style="padding:24px 28px;font-size:15px;line-height:1.6;">
            <p style="margin:0 0 12px 0;">Dear ${escapeHtml(customer_name)},</p>
            <p style="margin:0 0 12px 0;">Thank you for submitting your report request.</p>
            <p style="margin:0 0 12px 0;"><strong>Report Title:</strong> ${escapeHtml(report_title)}</p>
            ${linkBlock}
            <p style="margin:0 0 12px 0;">
              This report provides useful insights on automotive market trends,
              OEM performance, vehicle category analysis, and future growth
              opportunities.
            </p>
            <p style="margin:0 0 12px 0;">
              For more detailed automotive data, forecasts, or customized market
              research support, feel free to contact us.
            </p>
            <p style="margin:24px 0 4px 0;">Thanks &amp; Regards,</p>
            <p style="margin:0 0 12px 0;font-weight:bold;">Team Race Innovations Pvt. Ltd.</p>
            <p style="margin:0;font-size:13px;color:#475569;">
              projecthead@raceinnovations.in | kh@raceinnovations.in<br/>
              +91 9003031527 | +91 9840490241
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

      await sendEmail({
        to: customer_email,
        subject: "Your Requested Free Report Access Link",
        html,
        from: CONFIRMATION_FROM,
        // No reply-to — this is a no-reply automated email.
      });
    } catch (custErr) {
      console.error("Free report customer email failed:", custErr);
    }

    return NextResponse.json({
      success: true,
      message: "Free report request received.",
      view_link: viewLink || "",
      sample_pdf: sample_pdf || "",
    });
  } catch (error) {
    console.error("Free report error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process free report request." },
      { status: 500 }
    );
  }
}
