import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import s3Client from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name, city, email, mobile_no, date_of_birth, age,
      employer_name, employer_address, take_home_salary, work_experience_years,
      loan_required, repayable_installment, previous_loans,
      residence_type, months_in_current_residence,
      salary_slip, appointment_letter, address_id_proof, additional_income,
      created_at
    } = body;

    const query = `INSERT INTO loan_application (
      name, city, email, mobile_no, date_of_birth, age,
      employer_name, employer_address, take_home_salary, work_experience_years,
      loan_required, repayable_installment, previous_loans,
      residence_type, months_in_current_residence,
      salary_slip, appointment_letter, address_id_proof, additional_income,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      name, city, email, mobile_no, date_of_birth, age,
      employer_name, employer_address, take_home_salary, work_experience_years,
      loan_required, repayable_installment, previous_loans,
      residence_type, months_in_current_residence,
      salary_slip, appointment_letter, address_id_proof, additional_income,
      created_at
    ];

    await db.execute(query, values);
    return NextResponse.json({ success: true, message: "Data inserted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error inserting data", error: error.message }, { status: 500 });
  }
}

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
    return NextResponse.json({ success: false, message: "Error updating data", error: error.message }, { status: 500 });
  }
}
