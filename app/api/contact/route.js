import { NextResponse } from "next/server";
import db from "../../../lib/db";
import {
  isValidIndianMobile,
  normalizeIndianMobile,
  INVALID_MOBILE_MESSAGE,
} from "../../../lib/validation/phone";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Received data:", body);
        const { address, email, phoneNumber } = body;
        if (!address || !email || !phoneNumber) {
            console.error("Validation Error: Missing required fields");
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        if (!isValidIndianMobile(phoneNumber)) {
            return NextResponse.json(
                { error: INVALID_MOBILE_MESSAGE, message: INVALID_MOBILE_MESSAGE },
                { status: 400 }
            );
        }
        const normalizedPhone = normalizeIndianMobile(phoneNumber);
        const [result] = await db.query(
            "INSERT INTO contact (address, email, phone) VALUES (?, ?, ?)",
            [address, email, normalizedPhone]
        );

        console.log("Database result:", result); 

        if (result.affectedRows === 0) {
            console.error("Database insertion failed");
            return NextResponse.json({ error: "Database insertion failed" }, { status: 500 });
        }

        return NextResponse.json({ message: "Settings saved successfully!" });
    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 500 });
    }
}
