import { NextResponse } from "next/server";
import { sendEmail, sendBulkEmails } from "../../../lib/awsclient";

// All assistant enquiries go to the existing enquiry inbox(es).
const TEAM_RECIPIENTS = [
  "kh@raceinnovations.in",
  "projecthead@raceinnovations.in",
];

// No-reply sender must be an SES-verified identity (raceautoindia.com domain).
const CONFIRMATION_FROM =
  process.env.REPORT_CONFIRMATION_FROM ||
  "Race Innovations <no-reply@raceautoindia.com>";

const FIELD_LABELS = {
  need: "What they need",
  solution: "Solution",
  segment: "Vehicle segment",
  market: "Market / Region",
  objective: "Objective",
  consultation: "Expert consultation",
  requirement: "Requirement",
  preferredDate: "Preferred date",
  preferredTime: "Preferred time",
  name: "Name",
  email: "Email",
  phone: "Phone",
};

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const category = String(body?.category || "").trim();
    const categoryTitle = String(
      body?.categoryTitle || category || "General"
    ).trim();
    const answers =
      body?.answers && typeof body.answers === "object" ? body.answers : {};

    const name = String(answers.name || "").trim();
    const email = String(answers.email || "").trim();
    const phone = String(answers.phone || "").trim();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Name, email and phone are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    // Order the answer rows sensibly (category-specific fields first, then contact).
    const order = [
      "need",
      "solution",
      "segment",
      "market",
      "objective",
      "consultation",
      "requirement",
      "preferredDate",
      "preferredTime",
      "name",
      "email",
      "phone",
    ];
    const keys = [
      ...order.filter((k) => k in answers),
      ...Object.keys(answers).filter((k) => !order.includes(k)),
    ];

    const rows = keys
      .map(
        (k) =>
          `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">${esc(
            FIELD_LABELS[k] || k
          )}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;">${esc(
            answers[k]
          )}</td></tr>`
      )
      .join("");

    const adminHtml = `
      <h3 style="margin:0 0 10px;">New Assistant Enquiry — ${esc(categoryTitle)}</h3>
      <table style="border-collapse:collapse;font-size:14px;">${rows}</table>
    `;

    // Notify the team (existing enquiry recipients).
    try {
      await sendBulkEmails(
        TEAM_RECIPIENTS,
        `New Enquiry (${categoryTitle}) — ${name}`,
        adminHtml
      );
    } catch (adminErr) {
      console.error("chatbot-enquiry admin email failed:", adminErr);
    }

    // Confirm to the customer (no-reply).
    try {
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
            <p style="margin:0 0 12px 0;">Dear ${esc(name)},</p>
            <p style="margin:0 0 12px 0;">
              Thank you for reaching out to RACE Innovations regarding
              <strong>${esc(categoryTitle)}</strong>. We have received your
              request and our team will contact you shortly.
            </p>
            <p style="margin:24px 0 4px 0;">Thanks &amp; Regards,</p>
            <p style="margin:0 0 10px 0;font-weight:bold;">Team Race Innovations Pvt. Ltd.</p>
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
        to: email,
        subject: "Thank you for contacting RACE Innovations",
        html,
        from: CONFIRMATION_FROM,
      });
    } catch (custErr) {
      console.error("chatbot-enquiry customer email failed:", custErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("chatbot-enquiry error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit enquiry." },
      { status: 500 }
    );
  }
}
