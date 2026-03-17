import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeParam(value) {
  if (Array.isArray(value)) return String(value[0] || "").trim();
  return String(value || "").trim();
}

export async function GET(_req, { params }) {
  try {
    const slug = normalizeParam(params?.slug);
    const conn = typeof db === "function" ? await db() : db;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required", post: null },
        { status: 400 }
      );
    }

    const [rows] = await conn.query(
      `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.category_id,
        p.cover_image,
        p.status,
        p.linkedin_url,
        p.created_at,
        c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Post not found", post: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post: rows[0] });
  } catch (error) {
    console.error("GET /api/posts/[slug] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch post", post: null },
      { status: 500 }
    );
  }
}