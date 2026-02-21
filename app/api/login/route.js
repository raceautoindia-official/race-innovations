import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "race@123";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    const [userRows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

    let user;

    if (userRows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

      const [newUserRows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
      user = newUserRows[0];

      await db.execute("INSERT INTO role (email, role) VALUES (?, ?)", [username, "user"]);
    } else {
      user = userRows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid username or password" }, { status: 400 });
      }
    }

    const [roleRows] = await db.execute(
      "SELECT * FROM role WHERE email = ? AND role IN ('admin', 'content_creator')",
      [user.username]
    );

    if (roleRows.length === 0) {
      return NextResponse.json({ error: "Access denied: Admins only" }, { status: 403 });
    }

    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      role: roleRows[0].role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secretKey);

    const response = NextResponse.json({ success: true, message: "Login successful" });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
