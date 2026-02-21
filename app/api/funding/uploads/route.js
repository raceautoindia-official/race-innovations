import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import s3Client from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Upload multiple files to S3
 */
const uploadMultipleToS3 = async (files, folder) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const uploadedKeys = await Promise.all(
    files.map(async (file) => {
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
      return s3Key;
    })
  );

  return uploadedKeys.join(",");
};

/**
 * Handle POST request (Insert Loan Application)
 */
export async function POST(req) {
  try {
    // Check if the request is FormData (for file uploads)
    const contentType = req.headers.get("content-type");
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      console.log(formData)
      // Extract fields from FormData
      const name = formData.get("name");
      const city = formData.get("city");
      const email = formData.get("email");
      const mobile_no = formData.get("mobile_no");
      const date_of_birth = formData.get("date_of_birth");
      const age = formData.get("age");
      const employer_name = formData.get("employer_name");
      const employer_address = formData.get("employer_address");
      const take_home_salary = formData.get("take_home_salary");
      const work_experience_years = formData.get("work_experience_years");
      const previous_loan1 = formData.get("previous_loan1");
      const previous_loan2 = formData.get("previous_loan2");
      const previous_loan3 = formData.get("previous_loan3");      
      const repayable_installment = formData.get("repayable_installment");
  
      const residence_type = formData.get("residence_type");
      const months_in_current_residence = formData.get("months_in_current_residence");
      const created_at = new Date();

      // Upload files to S3
      const salary_slip = formData.get("salary_slip") ? await uploadMultipleToS3([formData.get("salary_slip")], "uploads/test") : null;
      const appointment_letter = formData.get("appointment_letter") ? await uploadMultipleToS3([formData.get("appointment_letter")], "uploads/test") : null;
      const address_id_proof = formData.get("address_id_proof") ? await uploadMultipleToS3([formData.get("address_id_proof")], "uploads/test") : null;
      const additional_income = formData.get("additional_income") ? await uploadMultipleToS3([formData.get("additional_income")], "uploads/test") : null;

      // Insert data into MySQL
      const query = `INSERT INTO loan_application (
        name, city, email, mobile_no, date_of_birth, age,
        employer_name, employer_address, take_home_salary, work_experience_years,
     repayable_installment, previous_loan1, previous_loan2, previous_loan3,
        residence_type, months_in_current_residence,
        salary_slip, appointment_letter, address_id_proof, additional_income,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const values = [
  name, city, email, mobile_no, date_of_birth, age,
  employer_name, employer_address, take_home_salary, work_experience_years,
repayable_installment, previous_loan1, previous_loan2, previous_loan3,
  residence_type, months_in_current_residence,
  salary_slip, appointment_letter, address_id_proof, additional_income,
  created_at
];

      await db.execute(query, values);

      return NextResponse.json({ success: true, message: "Data inserted successfully" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid request format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ success: false, message: "Error inserting data", error: error.message }, { status: 500 });
  }
}

/**
 * Handle PUT request (Update Loan Application)
 */
export async function PUT(req) {
  try {
    const { pathname } = new URL(req.url);
    const title = pathname.split("/").pop();
    const formData = await req.formData();
    const responsiveCode = formData.get("responsiveCode");
    const isChecked = formData.get("isChecked");
    
    const imageFields = ["salary", "letter", "address", "rent"];
    let query = "UPDATE loan_application SET";
    let queryParams = [];

    for (const field of imageFields) {
      const files = formData.getAll(field);
      if (files.length > 0) {
        const imageKeys = await uploadMultipleToS3(files, "uploads/test");
        query += ` ${field.replace("size_", "ad_code_")} = ?,`;
        queryParams.push(imageKeys);
      }
    }

    query += " responsive_ad_code = ?, is_responsive = ? WHERE ad_space = ?";
    queryParams.push(
      responsiveCode || null,
      isChecked === "true" ? 1 : 0,
      title
    );

    await db.execute(query, queryParams);
    return NextResponse.json({ success: true, message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ success: false, message: "Error updating data", error: error.message }, { status: 500 });
  }
}
