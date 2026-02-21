import { NextResponse } from "next/server";
import db from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categories] = await db.query("SELECT id, name, slug FROM categories ORDER BY name ASC");
    const [subcategories] = await db.query(
      "SELECT id, category_id, name, slug FROM subcategories ORDER BY name ASC"
    );

    return NextResponse.json({
      categories: categories || [],
      subcategories: subcategories || [],
      markets: [],
    });
  } catch (err) {
    console.error("blog-meta error:", err);
    return NextResponse.json({ error: "Failed to load blog meta" }, { status: 500 });
  }
}
