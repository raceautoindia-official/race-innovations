import { NextResponse } from "next/server";
import db from "../../../lib/db";

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    // Accept both `post_id` (canonical) and `postId` (legacy client) param names.
    const post_id = searchParams.get("post_id") ?? searchParams.get("postId");
    if (!post_id) return json({ comments: [] });

    const [rows] = await db.query(
      `SELECT id, post_id, email, comment, created_at
       FROM comments
       WHERE post_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [post_id]
    );

    return json({ comments: rows });
  } catch (e) {
    console.error("GET /api/comments error:", e);
    return json({ comments: [], error: "Failed to load comments" }, 500);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    // Accept both `post_id` (canonical) and `postId` (legacy client) param names.
    const post_id = body?.post_id ?? body?.postId;
    const email = String(body?.email || "").trim();
    const comment = String(body?.comment || "").trim();

    if (!post_id || !comment) return json({ error: "post_id and comment are required" }, 400);

    await db.query(
      `INSERT INTO comments (post_id, email, comment, created_at)
       VALUES (?, ?, ?, NOW())`,
      [post_id, email || null, comment]
    );

    return json({ ok: true }, 201);
  } catch (e) {
    console.error("POST /api/comments error:", e);
    return json({ error: "Failed to post comment" }, 500);
  }
}