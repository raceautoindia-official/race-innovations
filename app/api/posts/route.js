import { NextResponse } from "next/server";

import { slugify } from "../../../lib/report-utils";
import db from "../../../lib/db";

export async function GET(req) {
  try {
    const conn = db;
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(500, Number(searchParams.get("limit") || 100)));

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
      ORDER BY p.created_at DESC
      LIMIT ?
      `,
      [limit]
    );

    return NextResponse.json({ success: true, posts: rows });
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const conn = db;

    const title = String(body.title || "").trim();
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

    const slugBase = String(body.slug || "").trim() || slugify(title);
    const slug = slugBase || `post-${Date.now()}`;

    const [existing] = await conn.query(
      `SELECT id FROM posts WHERE slug = ? LIMIT 1`,
      [slug]
    );

    let finalSlug = slug;
    if (existing.length > 0) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const publishedAt = status === "published" ? new Date() : null;

    const [result] = await conn.query(
      `
      INSERT INTO posts (
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category_id,
        keywords,
        status,
        published_at,
        created_at,
        linkedin_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `,
      [
        title,
        finalSlug,
        excerpt,
        content,
        coverImage,
        categoryId,
        keywords,
        status,
        publishedAt,
        linkedinUrl,
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
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      post: rows[0] || null,
    });
  } catch (error) {
    console.error("POST posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}