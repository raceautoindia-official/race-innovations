import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "../../../lib/db";

let tableEnsured = false;

async function ensureViewsTable() {
  if (tableEnsured) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content_type VARCHAR(20) NOT NULL,
        content_id INT NULL,
        slug VARCHAR(255) NOT NULL,
        viewer_hash VARCHAR(64) NULL,
        referrer VARCHAR(500) NULL,
        user_agent VARCHAR(500) NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_views_type_slug (content_type, slug),
        INDEX idx_views_content_id (content_id),
        INDEX idx_views_viewed_at (viewed_at)
      )
    `);
    tableEnsured = true;
  } catch (err) {
    console.error("ensureViewsTable failed:", err);
  }
}

const BOT_REGEX =
  /bot|crawler|spider|scrape|fetch|preview|monitor|pingdom|uptime|axios|node-fetch|curl|wget|headless|lighthouse|gtmetrix/i;

function getClientIp(req) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "0.0.0.0"
  );
}

function hashViewer(ip, ua) {
  // SHA256 of IP + UA — gives a stable anonymous fingerprint per visitor
  // without storing raw PII. Used to dedupe same-visitor refreshes.
  return crypto
    .createHash("sha256")
    .update(`${ip}::${ua || ""}`)
    .digest("hex");
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const contentType = String(body?.contentType || "")
      .trim()
      .toLowerCase();
    const slug = String(body?.slug || "").trim();
    const contentId =
      body?.contentId !== undefined && body?.contentId !== null
        ? Number(body.contentId) || null
        : null;

    if (
      !slug ||
      !["report", "blog"].includes(contentType)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const ua = req.headers.get("user-agent") || "";

    // Silently ignore bot traffic so the dashboard reflects real users.
    if (BOT_REGEX.test(ua)) {
      return NextResponse.json({ success: true, skipped: "bot" });
    }

    const ip = getClientIp(req);
    const viewerHash = hashViewer(ip, ua);

    await ensureViewsTable();

    // Dedupe: don't log more than one view from the same viewer hash on the
    // same content within a 30-minute window (counts a refresh as one view).
    const [recent] = await db.query(
      `SELECT id FROM page_views
       WHERE content_type = ?
         AND slug = ?
         AND viewer_hash = ?
         AND viewed_at >= (NOW() - INTERVAL 30 MINUTE)
       LIMIT 1`,
      [contentType, slug, viewerHash]
    );

    if (Array.isArray(recent) && recent.length > 0) {
      return NextResponse.json({ success: true, deduped: true });
    }

    const referrer = (req.headers.get("referer") || "").slice(0, 500);
    const userAgent = ua.slice(0, 500);

    await db.query(
      `INSERT INTO page_views
        (content_type, content_id, slug, viewer_hash, referrer, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [contentType, contentId, slug, viewerHash, referrer, userAgent]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("track-view error:", error);
    return NextResponse.json(
      { success: false, message: "Tracking failed" },
      { status: 500 }
    );
  }
}
