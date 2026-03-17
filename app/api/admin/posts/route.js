import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(text = "") {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export async function GET(req) {
  try {
    const conn = typeof db === "function" ? await db() : db;
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(1000, Number(searchParams.get("limit") || 500)));

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
        p.tags,
        p.created_at,
        p.updated_at,
        c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC
      LIMIT ?
      `,
      [limit]
    );

    return NextResponse.json({
      success: true,
      posts: Array.isArray(rows) ? rows : [],
    });
  } catch (error) {
    console.error("GET /api/admin/posts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load posts" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const conn = typeof db === "function" ? await db() : db;
    const body = await req.json();

    const title = String(body?.title || "").trim();
    const slug = slugify(body?.slug || body?.title || "");
    const excerpt = String(body?.excerpt || "").trim();
    const content = String(body?.content || "").trim();
    const category_id = body?.category_id ? Number(body.category_id) : null;
    const cover_image = body?.cover_image ? String(body.cover_image).trim() : null;
    const status = String(body?.status || "draft").trim();
    const linkedin_url = body?.linkedin_url ? String(body.linkedin_url).trim() : null;
    const tags = JSON.stringify(Array.isArray(body?.tags) ? body.tags : []);

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const [existing] = await conn.query(
      `SELECT id FROM posts WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const [result] = await conn.query(
      `
      INSERT INTO posts
      (
        title,
        slug,
        excerpt,
        content,
        category_id,
        cover_image,
        status,
        linkedin_url,
        tags,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        title,
        slug,
        excerpt || null,
        content,
        category_id,
        cover_image,
        status,
        linkedin_url,
        tags,
      ]
    );

    return NextResponse.json({
      success: true,
      id: result?.insertId || null,
      slug,
    });
  } catch (error) {
    console.error("POST /api/admin/posts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}