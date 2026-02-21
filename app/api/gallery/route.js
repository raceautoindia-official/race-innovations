import { NextResponse } from "next/server";
import db from "@/lib/db";
import { s3Client } from "@/lib/s3Client";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const content = formData.get("content");
    const file = formData.get("image"); // ✅ Corrected the field name here

    if (!file) {
      console.error("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileExtension = file.name.split(".").pop();
    const newFileName = `${uuidv4()}.${fileExtension}`;
    const s3Key = `uploads/testslider/${newFileName}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const [result] = await db.query(
      "INSERT INTO gallery (content, content_images) VALUES (?, ?)",
      [content, s3Key]
    );

    return NextResponse.json(
      { id: result.insertId, imageUrl: s3Key, content },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
