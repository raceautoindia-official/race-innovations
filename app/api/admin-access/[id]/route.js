// /api/admin-access/[id]/route.js
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(req, context) {
  const { id } = context.params;
  const { role, menus } = await req.json();

  try {
    const [result] = await db.execute(
      "UPDATE role SET role = ?, menus = ? WHERE id = ?",
      [role, menus, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const [rows] = await db.execute("SELECT * FROM role WHERE id = ?", [id]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const { id } = context.params;

  try {
    const [result] = await db.execute("DELETE FROM role WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
