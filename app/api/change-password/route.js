import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "username and password are required" },
        { status: 400 }
      );
    }

    // 1) Check if user exists
    const [userRows] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 2) Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Update password in DB
    await db.execute(
      "UPDATE users SET password = ? WHERE username = ?",
      [hashedPassword, username]
    );

    // 4) Make sure this user is admin (optional, but matches your login logic)
    await db.execute(
      `
      INSERT INTO role (email, role)
      VALUES (?, 'admin')
      ON DUPLICATE KEY UPDATE role = 'admin'
      `,
      [username]
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
