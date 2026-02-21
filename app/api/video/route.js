import { NextResponse } from "next/server";
import db from "@/lib/db"; // Ensure correct path to your DB connection file

export async function POST(req) {
    try {
        const formData = await req.json();
        const { youtube_url } = formData; // Expect youtube_url, not youtube

        if (!youtube_url) {
            return NextResponse.json(
                { success: false, error: "YouTube URL is required" },
                { status: 400 }
            );
        }

        // Insert into database
        const [result] = await db.query(
            "INSERT INTO corporate (youtube_url) VALUES (?)",
            [youtube_url]
        );

        if (!result || result.affectedRows === 0) {
            return NextResponse.json(
                { success: false, error: "Database insertion failed" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Video saved successfully!",
        });

    } catch (error) {
        console.error("Error saving video:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to save video" },
            { status: 500 }
        );
    }
}
