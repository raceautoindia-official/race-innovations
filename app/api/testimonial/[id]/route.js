import { NextResponse } from "next/server";
import db from "@/lib/db";
import { s3Client } from "@/lib/s3Client";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";



export async function GET(req) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();

    console.log("Request received with ID:", id); 

    

    const [rows] = await db.query("SELECT * FROM testimonial WHERE id = ?", [id]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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



