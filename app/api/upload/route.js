import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";

const REGION = process.env.AWS_S3_REGION;
const ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY;
const BUCKET = process.env.AWS_S3_BUCKET_NAME;
const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    if (!REGION) {
      return NextResponse.json({ error: "Missing AWS_REGION" }, { status: 500 });
    }

    if (!ACCESS_KEY_ID) {
      return NextResponse.json({ error: "Missing AWS_ACCESS_KEY_ID" }, { status: 500 });
    }

    if (!SECRET_ACCESS_KEY) {
      return NextResponse.json({ error: "Missing AWS_SECRET_ACCESS_KEY" }, { status: 500 });
    }

    if (!BUCKET) {
      return NextResponse.json({ error: "Missing AWS_S3_BUCKET_NAME" }, { status: 500 });
    }

    if (!PUBLIC_BASE_URL) {
      return NextResponse.json({ error: "Missing AWS_S3_PUBLIC_BASE_URL" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || "file";
    const ext = path.extname(originalName) || "";
    const fileName = `${crypto.randomUUID()}${ext}`;
    const key = `uploads/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );

    const url = `${PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({
      success: true,
      url,
      key,
      fileName,
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}