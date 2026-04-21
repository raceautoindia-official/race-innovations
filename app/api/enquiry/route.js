import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { sendBulkEmails } from "../../../lib/awsclient";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      company_name,
      email,
      designation,
      phone,
      location,
      area_of_interest,
      preferred_contact,
      message,
      report_title,
      report_slug,
      sample_pdf,
    } = body || {};

    if (
      !name?.trim() ||
      !company_name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !area_of_interest?.trim() ||
      !preferred_contact?.trim() ||
      !message?.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO enquiries (
        name,
        company_name,
        email,
        designation,
        phone,
        location,
        area_of_interest,
        preferred_contact,
        message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name.trim(),
      company_name.trim(),
      email.trim(),
      designation?.trim() || null,
      phone.trim(),
      location?.trim() || null,
      area_of_interest.trim(),
      preferred_contact.trim(),
      message.trim(),
    ];

    await db.query(insertQuery, values);

    const cleanReportTitle = report_title?.trim() || "-";
    const cleanReportSlug = report_slug?.trim() || "-";
    const cleanSamplePdf = sample_pdf?.trim() || "";

    const subject = `New Enquiry from ${name.trim()}`;
    const htmlContent = `
      <h3>New Enquiry Submitted</h3>
      <p><strong>Name:</strong> ${name.trim()}</p>
      <p><strong>Company:</strong> ${company_name.trim()}</p>
      <p><strong>Email:</strong> ${email.trim()}</p>
      <p><strong>Designation:</strong> ${designation?.trim() || "-"}</p>
      <p><strong>Phone:</strong> ${phone.trim()}</p>
      <p><strong>Location:</strong> ${location?.trim() || "-"}</p>
      <p><strong>Area of Interest:</strong> ${area_of_interest.trim()}</p>
      <p><strong>Preferred Contact:</strong> ${preferred_contact.trim()}</p>
      <p><strong>Message:</strong> ${message.trim()}</p>
      <hr />
      <p><strong>Report Title:</strong> ${cleanReportTitle}</p>
      <p><strong>Report Slug:</strong> ${cleanReportSlug}</p>
      <p><strong>Sample PDF Available:</strong> ${cleanSamplePdf ? "Yes" : "No"}</p>
      ${
        cleanSamplePdf
          ? `<p><strong>Sample PDF URL:</strong> <a href="${cleanSamplePdf}" target="_blank">${cleanSamplePdf}</a></p>`
          : ""
      }
    `;

    await sendBulkEmails(
      ["kh@raceinnovations.in", "projecthead@raceinnovations.in"],
      subject,
      htmlContent
    );

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Error submitting enquiry" },
      { status: 500 }
    );
  }
}