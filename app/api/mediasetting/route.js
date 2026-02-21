import { NextResponse } from "next/server";
import db from "@/lib/db"; 

export async function POST(req) {
    try {
        const formData = await req.json();
        const { facebook, twitter, instagram, linkedin, youtube, telegram } = formData;

        if (!facebook || !twitter || !instagram || !linkedin || !youtube || !telegram) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        const [result] = await db.query(
            "INSERT INTO socialmedia_settings (facebook_url, twitter_url, instagram_url, linkedin_url, youtube_url, telegram_url) VALUES (?, ?, ?, ?, ?, ?)",
            [facebook, twitter, instagram, linkedin, youtube, telegram]
        );

        if (!result || result.affectedRows === 0) {
            return NextResponse.json(
                { success: false, error: "Database insertion failed" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Social media settings saved successfully!",
        });

    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to save settings" },
            { status: 500 }
        );
    }
}
