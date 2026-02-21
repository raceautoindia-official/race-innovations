import { NextResponse } from "next/server";
import db from "@/lib/db";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// GET - Fetch the report by ID
export async function GET(req) {
  const { pathname} = new URL(req.url);
  const id = pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const [rows] = await db.query("SELECT * FROM report WHERE id = ?", [id]);
    if (!rows.length) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Update report
export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const formData = await req.formData();

    const fields = {
      company_name: formData.get("company_name"),
      project_name: formData.get("project_name"),
      date_of_survey: formData.get("date_of_survey"),
      end_clients: formData.get("end_clients"),
      width: formData.get("width"),
      height: formData.get("height"),
      weight: formData.get("weight"),
      length: formData.get("length"),
      from_location: formData.get("from_location"),
      to_location: formData.get("to_location"),
    };

    const pdf = formData.get("pdf_file");
    const image = formData.get("image_file");

    const uploadFile = async (file) => {
      if (!file || typeof file === "string") return null;
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name);
      const uuidName = `${uuidv4()}${ext}`;
      const s3Key = `uploads/${uuidName}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      return s3Key;
    };

    const pdfKey = await uploadFile(pdf);
    const imageKey = await uploadFile(image);

    let updateQuery = `UPDATE report SET 
      company_name = ?, project_name = ?, date_of_survey = ?, end_clients = ?, 
      width = ?, height = ?, weight = ?, length = ?, from_location = ?, to_location = ?`;
    const paramsArray = [
      fields.company_name,
      fields.project_name,
      fields.date_of_survey,
      fields.end_clients,
      fields.width,
      fields.height,
      fields.weight,
      fields.length,
      fields.from_location,
      fields.to_location,
    ];

    if (pdfKey) {
      updateQuery += ", pdf_file = ?";
      paramsArray.push(pdfKey);
    }

    if (imageKey) {
      updateQuery += ", image_file = ?";
      paramsArray.push(imageKey);
    }

    updateQuery += " WHERE id = ?";
    paramsArray.push(id);

    await db.query(updateQuery, paramsArray);

    return NextResponse.json({ message: "Report updated!" }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove a report
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await db.query("DELETE FROM report WHERE id = ?", [id]);

    return NextResponse.json({ message: "Report deleted!" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
