import { NextResponse } from "next/server";
import db from "@/lib/db";
import { s3Client } from "@/lib/s3Client";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const applicationName = formData.get("applicationName");
        const footerAbout = formData.get("footerAbout");
        const optionURL = formData.get("optionURL");
        const copyright = formData.get("copyright");
        const file = formData.get("file");
        if (!applicationName || !footerAbout || !optionURL || !copyright) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        let logoUrl = null;
        if (file) {
            try {
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

                await s3Client.send(new PutObjectCommand(uploadParams));
                console.log(" S3 Upload Successful");

                logoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
            } catch (s3Error) {
                console.error(" S3 Upload Failed:", s3Error);
                return NextResponse.json(
                    { success: false, error: "S3 Upload Failed", details: s3Error.message },
                    { status: 500 }
                );
            }
        }
        const [result] = await db.query(
            "INSERT INTO general_settings (application_name, footer_about, option_url, logo, copyright) VALUES (?, ?, ?, ?, ?)",
            [applicationName, footerAbout, optionURL, logoUrl, copyright]
        );

        if (!result || result.affectedRows === 0) {
            console.error(" Database insertion failed");
            return NextResponse.json(
                { success: false, error: "Database insertion failed" },
                { status: 500 }
            );
        }

        console.log(" General Settings saved successfully!");
        return NextResponse.json({
            success: true,
            message: "General Settings saved successfully!",
            logoUrl
        });

    } catch (error) {
        console.error(" Error saving settings:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to save settings" },
            { status: 500 }
        );
    }
}
