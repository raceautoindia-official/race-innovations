import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { sendEmail } from "../../../lib/awsclient";

const CONFIRMATION_FROM =
  process.env.REPORT_CONFIRMATION_FROM ||
  "Race Innovations <no-reply@raceautoindia.com>";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Simple HTML page shown to the team member who clicked the link.
function page(title, message, ok) {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
  </head>
  <body style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;margin:0;padding:48px 16px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:34px;text-align:center;box-shadow:0 10px 30px rgba(15,23,42,0.06);">
      <div style="font-size:44px;line-height:1;margin-bottom:8px;">${ok ? "&#9989;" : "&#10060;"}</div>
      <h1 style="color:#0f172a;font-size:22px;margin:0 0 8px;">${esc(title)}</h1>
      <p style="color:#475569;font-size:15px;margin:0;">${esc(message)}</p>
    </div>
  </body>
</html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const token = searchParams.get("token");
    const action = String(searchParams.get("action") || "").toLowerCase();

    if (!id || !token || !["approve", "reject"].includes(action)) {
      return page("Invalid link", "This link is not valid.", false);
    }

    const [rows] = await db.query(
      `SELECT * FROM meeting_requests WHERE id = ? LIMIT 1`,
      [id]
    );
    const reqRow = Array.isArray(rows) && rows[0] ? rows[0] : null;

    if (!reqRow || reqRow.token !== token) {
      return page(
        "Invalid link",
        "This link is invalid or has expired.",
        false
      );
    }

    if (reqRow.status && reqRow.status !== "pending") {
      return page(
        "Already responded",
        `This request has already been ${reqRow.status}.`,
        reqRow.status === "approved"
      );
    }

    const newStatus = action === "approve" ? "approved" : "rejected";
    await db.query(
      `UPDATE meeting_requests SET status = ?, responded_at = NOW() WHERE id = ?`,
      [newStatus, id]
    );

    // Email the customer with the decision.
    try {
      const when =
        reqRow.preferred_date || reqRow.preferred_time
          ? `<p style="margin:0 0 12px;">Requested time: <strong>${esc(
              reqRow.preferred_date || ""
            )} ${esc(reqRow.preferred_time || "")}</strong></p>`
          : "";

      let subject;
      let bodyHtml;
      if (newStatus === "approved") {
        subject = "Your consultation is confirmed — RACE Innovations";
        bodyHtml = `
          <p style="margin:0 0 12px;">Dear ${esc(reqRow.name)},</p>
          <p style="margin:0 0 12px;">Good news! Your consultation request regarding
            <strong>${esc(reqRow.category_title || "your enquiry")}</strong> has been
            <strong style="color:#16a34a;">approved</strong>.</p>
          ${when}
          <p style="margin:0 0 12px;">Our expert will connect with you at the requested time.
            If anything changes, we'll reach out to you on your phone or email.</p>`;
      } else {
        subject = "Update on your consultation request — RACE Innovations";
        bodyHtml = `
          <p style="margin:0 0 12px;">Dear ${esc(reqRow.name)},</p>
          <p style="margin:0 0 12px;">Thank you for your interest in
            <strong>${esc(reqRow.category_title || "our services")}</strong>.
            Unfortunately, we're unable to confirm your requested time.</p>
          ${when}
          <p style="margin:0 0 12px;">Our team will reach out to you shortly to arrange an
            alternative slot that works for you.</p>`;
      }

      const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid #e5e7eb;border-radius:8px;">
          <tr><td style="padding:22px 26px;border-bottom:1px solid #e5e7eb;">
            <h1 style="margin:0;font-size:21px;color:#0f172a;">Race Innovations</h1>
          </td></tr>
          <tr><td style="padding:22px 26px;font-size:15px;line-height:1.6;">
            ${bodyHtml}
            <p style="margin:22px 0 4px;">Thanks &amp; Regards,</p>
            <p style="margin:0 0 10px;font-weight:bold;">Team Race Innovations Pvt. Ltd.</p>
            <p style="margin:0;font-size:13px;color:#475569;">
              projecthead@raceinnovations.in | kh@raceinnovations.in
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

      await sendEmail({
        to: reqRow.email,
        subject,
        html,
        from: CONFIRMATION_FROM,
      });
    } catch (mailErr) {
      console.error("meeting-response customer email failed:", mailErr);
    }

    return newStatus === "approved"
      ? page(
          "Meeting Approved",
          `A confirmation email has been sent to ${reqRow.email}.`,
          true
        )
      : page(
          "Meeting Rejected",
          `A decline email has been sent to ${reqRow.email}.`,
          false
        );
  } catch (error) {
    console.error("meeting-response error:", error);
    return page("Something went wrong", "Please try again later.", false);
  }
}
