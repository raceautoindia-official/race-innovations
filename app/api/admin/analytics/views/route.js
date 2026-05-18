import { NextResponse } from "next/server";
import db from "../../../../../lib/db";

async function ensureViewsTable() {
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
  } catch {}
}

export async function GET(req) {
  try {
    await ensureViewsTable();

    const { searchParams } = new URL(req.url);
    const type = String(searchParams.get("type") || "").trim().toLowerCase();
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "100", 10) || 100, 1),
      500
    );

    const whereType =
      type === "report" || type === "blog" ? type : null;

    // Aggregated view counts per slug, with display title joined from the
    // appropriate source table (reports vs blogs).
    let reportRows = [];
    let blogRows = [];

    if (!whereType || whereType === "report") {
      const [rows] = await db.query(
        `
        SELECT
          pv.slug,
          pv.content_type,
          COUNT(*)                              AS total_views,
          COUNT(DISTINCT pv.viewer_hash)        AS unique_views,
          SUM(pv.viewed_at >= NOW() - INTERVAL 1 DAY)   AS views_24h,
          SUM(pv.viewed_at >= NOW() - INTERVAL 7 DAY)   AS views_7d,
          SUM(pv.viewed_at >= NOW() - INTERVAL 30 DAY)  AS views_30d,
          MAX(pv.viewed_at)                     AS last_viewed,
          r.title                               AS title,
          r.report_type                         AS report_type
        FROM page_views pv
        LEFT JOIN reports r ON r.slug = pv.slug
        WHERE pv.content_type = 'report'
        GROUP BY pv.slug, pv.content_type, r.title, r.report_type
        ORDER BY total_views DESC
        LIMIT ?
        `,
        [limit]
      );
      reportRows = rows;
    }

    if (!whereType || whereType === "blog") {
      const [rows] = await db.query(
        `
        SELECT
          pv.slug,
          pv.content_type,
          COUNT(*)                              AS total_views,
          COUNT(DISTINCT pv.viewer_hash)        AS unique_views,
          SUM(pv.viewed_at >= NOW() - INTERVAL 1 DAY)   AS views_24h,
          SUM(pv.viewed_at >= NOW() - INTERVAL 7 DAY)   AS views_7d,
          SUM(pv.viewed_at >= NOW() - INTERVAL 30 DAY)  AS views_30d,
          MAX(pv.viewed_at)                     AS last_viewed,
          b.title                               AS title
        FROM page_views pv
        LEFT JOIN blogs b ON b.slug = pv.slug
        WHERE pv.content_type = 'blog'
        GROUP BY pv.slug, pv.content_type, b.title
        ORDER BY total_views DESC
        LIMIT ?
        `,
        [limit]
      );
      blogRows = rows;
    }

    // High-level totals across the whole site for the dashboard header.
    const [[totals]] = await db.query(`
      SELECT
        COUNT(*)                                            AS total_views,
        COUNT(DISTINCT viewer_hash)                         AS unique_visitors,
        SUM(viewed_at >= NOW() - INTERVAL 1 DAY)            AS views_24h,
        SUM(viewed_at >= NOW() - INTERVAL 7 DAY)            AS views_7d,
        SUM(viewed_at >= NOW() - INTERVAL 30 DAY)           AS views_30d
      FROM page_views
    `);

    return NextResponse.json({
      success: true,
      totals: totals || {
        total_views: 0,
        unique_visitors: 0,
        views_24h: 0,
        views_7d: 0,
        views_30d: 0,
      },
      reports: reportRows,
      blogs: blogRows,
    });
  } catch (error) {
    console.error("analytics views error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
