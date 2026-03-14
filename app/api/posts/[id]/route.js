import db from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(_req, { params }) {
  try {
    const conn = db;
    const id = params?.id;

    const [rows] = await conn.query(
      `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.cover_image,
        p.category_id,
        p.sub_category_id,
        p.market,
        p.keywords,
        p.status,
        p.published_at,
        p.created_at,
        p.linkedin_url,
        c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: rows[0] });
  } catch (error) {
    console.error("GET post by id error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const conn = db;
    const id = params?.id;
    const body = await req.json();

    const title = String(body.title || "").trim();
    const slug = String(body.slug || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();
    const categoryId = body.category_id ? Number(body.category_id) : null;
    const coverImage = body.cover_image ? String(body.cover_image).trim() : null;
    const status = String(body.status || "draft").trim();
    const linkedinUrl = body.linkedin_url ? String(body.linkedin_url || "").trim() : null;
    const keywords = Array.isArray(body.tags)
      ? body.tags.join(", ")
      : String(body.keywords || "").trim();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const publishedAt = status === "published" ? new Date() : null;

    await conn.query(
      `
      UPDATE posts
      SET
        title = ?,
        slug = ?,
        excerpt = ?,
        content = ?,
        cover_image = ?,
        category_id = ?,
        keywords = ?,
        status = ?,
        published_at = ?,
        linkedin_url = ?
      WHERE id = ?
      `,
      [
        title,
        slug,
        excerpt,
        content,
        coverImage,
        categoryId,
        keywords,
        status,
        publishedAt,
        linkedinUrl,
        id,
      ]
    );

    const [rows] = await conn.query(
      `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.cover_image,
        p.category_id,
        p.sub_category_id,
        p.market,
        p.keywords,
        p.status,
        p.published_at,
        p.created_at,
        p.linkedin_url,
        c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
      LIMIT 1
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      post: rows[0] || null,
    });
  } catch (error) {
    console.error("PUT post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const conn = db;
    const id = params?.id;

    const [result] = await conn.query(`DELETE FROM posts WHERE id = ?`, [id]);

    if (!result.affectedRows) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}