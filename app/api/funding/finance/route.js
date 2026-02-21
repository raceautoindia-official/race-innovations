import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import s3Client from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Upload a file to S3 and return file path
 */
const uploadFileToS3 = async (file, folder) => {
  if (!file) return null; // Return NULL if no file is provided

  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const fileExtension = path.extname(file.name);
  const newFileName = `${uuidv4()}${fileExtension}`;
  const s3Key = `${folder}/${newFileName}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const uploadParams = {
    Bucket: bucketName,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: file.type,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return s3Key; // Return file path for database storage
};

/**
 * Handle POST request (Insert Loan Application)
 */
export async function POST(req) {
  try {
    // Check for valid FormData request
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Invalid request format" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    // Extract form fields
    const promotorName = formData.get("promotorName") || null;
    const companyName = formData.get("companyName") || null;
    const email = formData.get("email") || null;
    const mobileNo = formData.get("mobileNo") || null;
    const dateOfBirth = formData.get("dateOfBirth") || null;
    const city = formData.get("city") || null;
    const address = formData.get("address") || null;
    const cashProfit = formData.get("cashProfit") || null;
    const loanRequired = formData.get("loanRequired") || null;
    const repayableInstallment = formData.get("repayableInstallment") || null;
    const previousLoan1 = formData.get("previousLoan1") || null;
    const previousLoan2 = formData.get("previousLoan2") || null;
    const previousLoan3 = formData.get("previousLoan3") || null;
    const currentBusiness = formData.get("currentBusiness") || null;
    const totalExperience = formData.get("totalExperience") || null;
    const residenceType = formData.get("residenceType") || null;

    // Upload files to S3 and store file paths
    const selfOwned = await uploadFileToS3(formData.get("selfOwned"), "uploads");
    const parentOwned = await uploadFileToS3(formData.get("parentOwned"), "uploads");
    const rented = await uploadFileToS3(formData.get("rented"), "uploads");
    const monthsInResidence = formData.get("monthsInResidence") || null;
    const salarySlip = await uploadFileToS3(formData.get("salarySlip"), "uploads");
    const appointmentLetter = await uploadFileToS3(formData.get("appointmentLetter"), "uploads");
    const bankStatement = await uploadFileToS3(formData.get("bankStatement"), "uploads");
    const addressProof = await uploadFileToS3(formData.get("addressProof"), "uploads");
    const idProof = await uploadFileToS3(formData.get("idProof"), "uploads");
    const existingLoanDetails = await uploadFileToS3(formData.get("existingLoanDetails"), "uploads");
    const propertyDocuments = await uploadFileToS3(formData.get("propertyDocuments"), "uploads");

    const createdAt = new Date().toISOString();

    // ✅ Fixed SQL Query
    const query = `
      INSERT INTO finance (
        promotor_name, company_name, email, mobile_no, date_of_birth, city, address, 
        cash_profit, loan_required, repayable_installment, previous_loan1, previous_loan2, previous_loan3, 
        current_business, total_experience, residence_type, self_owned, parent_owned, rented, 
        months_in_residence, salary_slip, appointment_letter, bank_statement, address_proof, id_proof, 
        existing_loan_details, property_documents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      promotorName, companyName, email, mobileNo, dateOfBirth, city, address,
      cashProfit, loanRequired, repayableInstallment, previousLoan1, previousLoan2, previousLoan3,
      currentBusiness, totalExperience, residenceType, selfOwned, parentOwned, rented,
      monthsInResidence, salarySlip, appointmentLetter, bankStatement, addressProof, idProof,
      existingLoanDetails, propertyDocuments
    ];

    await db.execute(query, values);

    return NextResponse.json({
      success: true,
      message: "Data inserted successfully"
    });

  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { success: false, message: "Error inserting data", error: error.message },
      { status: 500 }
    );
  }
}
