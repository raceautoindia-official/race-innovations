import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeParam(value) {
  if (Array.isArray(value)) return String(value[0] || "").trim();
  return String(value || "").trim();
}

function slugify(text = "") {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export async function GET(_req, { params }) {
  try {
    const { id: rawId } = await params;
    const id = normalizeParam(rawId);
    const conn = typeof db === "function" ? await db() : db;

    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
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
        p.tags,
        p.created_at,
        p.updated_at
      FROM posts p
      WHERE p.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: rows[0] });
  } catch (error) {
    console.error("GET /api/admin/posts/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id: rawId } = await params;
    const id = normalizeParam(rawId);
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

    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }

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
      `SELECT id FROM posts WHERE slug = ? AND id <> ? LIMIT 1`,
      [slug, id]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    await conn.query(
      `
      UPDATE posts
      SET
        title = ?,
        slug = ?,
        excerpt = ?,
        content = ?,
        category_id = ?,
        cover_image = ?,
        status = ?,
        linkedin_url = ?,
        tags = ?,
        updated_at = NOW()
      WHERE id = ?
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
        id,
      ]
    );

    return NextResponse.json({ success: true, id, slug });
  } catch (error) {
    console.error("PUT /api/admin/posts/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id: rawId } = await params;
    const id = normalizeParam(rawId);
    const conn = typeof db === "function" ? await db() : db;

    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }

    await conn.query(`DELETE FROM posts WHERE id = ?`, [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/posts/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}