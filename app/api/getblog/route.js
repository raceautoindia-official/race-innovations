import { NextResponse } from "next/server";
import db from "@/lib/db"; // your DB connection

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const [rows] = await db.query("SELECT * FROM blog WHERE id = ?", [id]);
    if (!rows.length) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
