import { NextResponse } from "next/server";
import db from "@/lib/db";
import { s3Client } from "@/lib/s3Client";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";


export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM testimonial");
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No testimonials found" }, { status: 404 });
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function POST(req) {
    try {
      const formData = await req.formData();
      const name = formData.get("name");
      const designation = formData.get("designation");
      const description = formData.get("description");
      const file = formData.get("file");
  
      if (!name || !designation || !description || !file) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }
  
      // Upload Image to S3
      const fileExtension = file.name.split(".").pop();
      const newFileName = `${uuidv4()}.${fileExtension}`;
      const s3Key = `uploads/testslider/${newFileName}`;
  
      const fileBuffer = Buffer.from(await file.arrayBuffer());
  
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: file.type,
      };
  
      try {
        await s3Client.send(new PutObjectCommand(uploadParams));
      } catch (s3Error) {
        console.error("S3 Upload Failed:", s3Error);
        return NextResponse.json({ error: "S3 Upload Failed", details: s3Error.message }, { status: 500 });
      }
  
      // Insert into Database
      try {
        const [result] = await db.query(
          "INSERT INTO testimonial (name, designation, description, image_url) VALUES (?, ?, ?, ?)",
          [name, designation, description, s3Key]
        );
  
        return NextResponse.json({ id: result.insertId, imageUrl: s3Key }, { status: 201 });
      } catch (dbError) {
        console.error("Database Insert Failed:", dbError);
        return NextResponse.json({ error: "Database Insert Failed", details: dbError.message }, { status: 500 });
      }
    } catch (error) {
      console.error("General Upload Error:", error);
      return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
  }





export async function PUT(req) {
    try {
        const data = await req.json();
        console.log("Received PUT Data:", data);

        const { id, name, designation, description, image_url } = data;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await db.query(
            "UPDATE testimonial SET name = ?, designation = ?, description = ?, image_url = ? WHERE id = ?",
            [name, designation, description, image_url, id]
        );

        return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await db.query("DELETE FROM testimonial WHERE id = ?", [id]);
        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
