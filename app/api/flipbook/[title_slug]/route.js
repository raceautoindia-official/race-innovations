import { NextResponse } from "next/server";
import db from "@/lib/db";




// GET
export async function GET(req) {
  try { 
    const {pathname} = new URL(req.url);
    const title_slug = pathname.split("/").pop();
    const [rows] = await db.query("SELECT * FROM pdf WHERE title_slug = ?",[title_slug]);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}