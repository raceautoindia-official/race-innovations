import { NextResponse } from 'next/server';
import db from '@/lib/db'; 
import { sendBulkEmails } from '@/lib/awsclient'; 

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
    } = body;


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
      name,
      company_name,
      email,
      designation || null,
      phone,
      location || null,
      area_of_interest,
      preferred_contact,
      message,
    ];

    await db.query(insertQuery, values);

  
    const subject = `New Enquiry from ${name}`;
    const htmlContent = `
      <h3>New Enquiry Submitted</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Designation:</strong> ${designation}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Area of Interest:</strong> ${area_of_interest}</p>
      <p><strong>Preferred Contact:</strong> ${preferred_contact}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;


    await sendBulkEmails([ 'kh@raceinnovations.in','projecthead@raceinnovations.in'], subject, htmlContent);

    return NextResponse.json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({ success: false, message: 'Error submitting enquiry' }, { status: 500 });
  }
}
