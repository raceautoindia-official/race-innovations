import { NextResponse } from "next/server";
import db from "@/lib/db";
import { s3Client } from "@/lib/s3Client";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
    try {
        const [rows] = await db.query("SELECT * FROM homepage_slider");
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching slider images:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            console.error("No file uploaded");
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const fileExtension = file.name.split(".").pop();
        const newFileName = `${uuidv4()}.${fileExtension}`;
        const s3Key = `uploads/testslider/${newFileName}`; 

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        console.log("Uploading file to S3:", s3Key);

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: file.type,
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
            console.log("S3 Upload Successful");
        } catch (s3Error) {
            console.error(" S3 Upload Failed:", s3Error);
            return NextResponse.json({ error: "S3 Upload Failed", details: s3Error.message }, { status: 500 });
        }

        const imagePath = s3Key; 

        try {
            const [result] = await db.query("INSERT INTO homepage_slider (image_url) VALUES (?)", [imagePath]);
            console.log(" Database Insert Result:", result);
            return NextResponse.json({ id: result.insertId, imageUrl: imagePath }, { status: 201 });
        } catch (dbError) {
            console.error(" Database Insert Failed:", dbError);
            return NextResponse.json({ error: "Database Insert Failed", details: dbError.message }, { status: 500 });
        }
    } catch (error) {
        console.error(" General Upload Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}





export async function PUT(req) {
    try {
        const data = await req.json();
        console.log("Received PUT Data:", data);

        const { id, image_url } = data;
        if (!id || !image_url) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        await db.query("UPDATE homepage_slider SET image_url = ? WHERE id = ?", [image_url, id]);

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

        await db.query("DELETE FROM homepage_slider WHERE id = ?", [id]);
        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
