import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET all roles
export async function GET() {
  try {
    // const [users] = await db.query("SELECT * FROM users");
    const [roles] = await db.query("SELECT * FROM role");

    return NextResponse.json({  roles });
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST new role
export async function POST(req) {
  try {
    const { email, role, menus } = await req.json();

    if (!email || !role || !menus) {
      return NextResponse.json({ error: "Email, Role, and Menus are required" }, { status: 400 });
    }

    const [result] = await db.query(
      "INSERT INTO role (email, role, menus) VALUES (?, ?, ?)",
      [email, role, menus]
    );

    const [newUser] = await db.query("SELECT * FROM role WHERE id = ?", [result.insertId]);
    return NextResponse.json(newUser[0], { status: 201 });
  } catch (err) {
    console.error("Failed to create role:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function PUT(req, { params }) {
  const { id } = params;
  const { role, menus } = await req.json();

  if (!id || !role || !menus) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await db.query("UPDATE role SET role = ?, menus = ? WHERE id = ?", [role, menus, id]);
    const [updated] = await db.query("SELECT * FROM role WHERE id = ?", [id]);

    if (updated.length === 0) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("Failed to update role:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
