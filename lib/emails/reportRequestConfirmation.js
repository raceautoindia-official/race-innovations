import { sendEmail } from "../awsclient";

const FROM_ADDRESS =
  process.env.NOREPLY_FROM ||
  "Race Innovations <no-reply@raceinnovations.in>";

const SUBJECT = "Thank You for Your Report Request";

function safe(value) {
  const v = value === undefined || value === null ? "" : String(value).trim();
  return v.length ? v : "N/A";
}

function escapeHtml(value) {
  return safe(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildReportRequestConfirmationText(data) {
  const name = safe(data?.name);
  const reportTitle = safe(data?.reportTitle);
  const companyName = safe(data?.companyName);
  const email = safe(data?.email);
  const designation = safe(data?.designation);
  const phoneNumber = safe(data?.phoneNumber);
  const location = safe(data?.location);
  const areaOfInterest = safe(data?.areaOfInterest);

  return `Dear ${name},

Thank you for requesting the teaser document for the ${reportTitle}.

We have received your enquiry with the following details:

Name: ${name}
Company Name: ${companyName}
Email: ${email}
Designation: ${designation}
Phone Number: ${phoneNumber}
Location: ${location}
Area of Interest: ${areaOfInterest}

Our team will review your request and share the relevant teaser document shortly.

Thanks & Regards,
Team Race Innovations Pvt. Ltd.

projecthead@raceinnovations.in | kh@raceinnovations.in
+91 9003031527 | +91 9840490241
`;
}

export function buildReportRequestConfirmationHtml(data) {
  const name = escapeHtml(data?.name);
  const reportTitle = escapeHtml(data?.reportTitle);
  const companyName = escapeHtml(data?.companyName);
  const email = escapeHtml(data?.email);
  const designation = escapeHtml(data?.designation);
  const phoneNumber = escapeHtml(data?.phoneNumber);
  const location = escapeHtml(data?.location);
  const areaOfInterest = escapeHtml(data?.areaOfInterest);

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
            <tr>
              <td style="padding:24px 28px;border-bottom:1px solid #e5e7eb;">
                <h1 style="margin:0;font-size:22px;color:#0f172a;">Race Innovations</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;font-size:15px;line-height:1.6;color:#1f2937;">
                <p style="margin:0 0 12px 0;">Dear ${name},</p>
                <p style="margin:0 0 12px 0;">
                  Thank you for requesting the teaser document for the <strong>${reportTitle}</strong>.
                </p>
                <p style="margin:0 0 12px 0;">
                  We have received your enquiry with the following details:
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:12px 0;font-size:14px;">
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;width:180px;font-weight:bold;">Name</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Company Name</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;">${companyName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Email</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Designation</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;">${designation}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Phone Number</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;">${phoneNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Location</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;">${location}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Area of Interest</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;">${areaOfInterest}</td>
                  </tr>
                </table>
                <p style="margin:12px 0;">
                  Our team will review your request and share the relevant teaser document shortly.
                </p>
                <p style="margin:24px 0 4px 0;">Thanks &amp; Regards,</p>
                <p style="margin:0 0 12px 0;font-weight:bold;">Team Race Innovations Pvt. Ltd.</p>
                <p style="margin:0;font-size:13px;color:#475569;">
                  projecthead@raceinnovations.in | kh@raceinnovations.in<br/>
                  +91 9003031527 | +91 9840490241
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendReportRequestConfirmationEmail(data) {
  const recipient = String(data?.email || "").trim();

  if (!recipient) {
    console.warn("Customer confirmation email skipped: missing recipient email");
    return { sent: false, reason: "missing-email" };
  }

  console.log("Customer confirmation email sending to:", recipient);

  const html = buildReportRequestConfirmationHtml(data);
  const text = buildReportRequestConfirmationText(data);

  try {
    const result = await sendEmail({
      to: recipient,
      subject: SUBJECT,
      html,
      text,
      from: FROM_ADDRESS,
    });
    console.log("Customer confirmation email sent:", {
      to: recipient,
      messageId: result?.MessageId,
    });
    return { sent: true, messageId: result?.MessageId };
  } catch (error) {
    console.error("Customer confirmation email failed:", {
      to: recipient,
      message: error?.message,
      name: error?.name,
      code: error?.Code,
    });
    return { sent: false, error };
  }
}
