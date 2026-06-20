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
  } catch (err) {
    console.error("ensureViewsTable failed:", err);
  }
}

// Returns the aggregate row from page_views per slug for a given content_type.
// Standalone — no JOIN — so it works regardless of report/blog table schema.
async function aggregateBySlug(contentType, limit) {
  const [rows] = await db.query(
    `
    SELECT
      pv.slug,
      pv.content_type,
      MAX(pv.content_id)                                  AS content_id,
      COUNT(*)                                            AS total_views,
      COUNT(DISTINCT pv.viewer_hash)                      AS unique_views,
      SUM(pv.viewed_at >= NOW() - INTERVAL 1 DAY)         AS views_24h,
      SUM(pv.viewed_at >= NOW() - INTERVAL 7 DAY)         AS views_7d,
      SUM(pv.viewed_at >= NOW() - INTERVAL 30 DAY)        AS views_30d,
      MAX(pv.viewed_at)                                   AS last_viewed
    FROM page_views pv
    WHERE pv.content_type = ?
    GROUP BY pv.slug, pv.content_type
    ORDER BY total_views DESC
    LIMIT ?
    `,
    [contentType, limit]
  );
  return rows || [];
}

// Look up titles (and report_type when applicable) without failing if the
// columns or table don't exist on this database.
async function enrichTitles(rows, sourceTable, includeReportType = false) {
  if (!rows.length) return rows;

  const slugs = rows.map((r) => r.slug).filter(Boolean);
  if (slugs.length === 0) return rows;

  const placeholders = slugs.map(() => "?").join(", ");
  const selectCols = includeReportType
    ? "slug, title, report_type"
    : "slug, title";

  let mapped = new Map();

  try {
    const [titleRows] = await db.query(
      `SELECT ${selectCols} FROM ${sourceTable} WHERE slug IN (${placeholders})`,
      slugs
    );
    for (const t of titleRows || []) {
      mapped.set(String(t.slug), t);
    }
  } catch (err) {
    // Schema mismatch (e.g. no `title` column, or table missing). Retry
    // without the report_type column if that was the problem.
    if (includeReportType) {
      try {
        const [retryRows] = await db.query(
          `SELECT slug, title FROM ${sourceTable} WHERE slug IN (${placeholders})`,
          slugs
        );
        for (const t of retryRows || []) {
          mapped.set(String(t.slug), t);
        }
      } catch (err2) {
        console.error(`enrichTitles fallback (${sourceTable}) failed:`, err2);
      }
    } else {
      console.error(`enrichTitles (${sourceTable}) failed:`, err);
    }
  }

  return rows.map((r) => {
    const match = mapped.get(String(r.slug));
    return {
      ...r,
      title: match?.title || r.title || null,
      report_type: includeReportType
        ? match?.report_type || null
        : undefined,
    };
  });
}

async function fetchTotals() {
  try {
    const [[totals]] = await db.query(`
      SELECT
        COUNT(*)                                            AS total_views,
        COUNT(DISTINCT viewer_hash)                         AS unique_visitors,
        SUM(viewed_at >= NOW() - INTERVAL 1 DAY)            AS views_24h,
        SUM(viewed_at >= NOW() - INTERVAL 7 DAY)            AS views_7d,
        SUM(viewed_at >= NOW() - INTERVAL 30 DAY)           AS views_30d
      FROM page_views
    `);
    return (
      totals || {
        total_views: 0,
        unique_visitors: 0,
        views_24h: 0,
        views_7d: 0,
        views_30d: 0,
      }
    );
  } catch (err) {
    console.error("fetchTotals failed:", err);
    return {
      total_views: 0,
      unique_visitors: 0,
      views_24h: 0,
      views_7d: 0,
      views_30d: 0,
    };
  }
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

    const wantReports = !type || type === "report";
    const wantBlogs = !type || type === "blog";
    const wantFlipbooks = !type || type === "flipbook";

    // Run each section independently — one failure must not 500 the whole
    // endpoint.
    const totalsPromise = fetchTotals();

    const reportsPromise = wantReports
      ? aggregateBySlug("report", limit)
          .then((rows) => enrichTitles(rows, "reports", true))
          .catch((err) => {
            console.error("reports aggregate failed:", err);
            return [];
          })
      : Promise.resolve([]);

    const blogsPromise = wantBlogs
      ? aggregateBySlug("blog", limit)
          .then((rows) => enrichTitles(rows, "posts", false))
          .catch((err) => {
            console.error("blogs aggregate failed:", err);
            return [];
          })
      : Promise.resolve([]);

    // Flipbooks have no dedicated title table (slug is derived from the
    // magazine title), so we report the raw aggregate and let the UI show the
    // slug as the title.
    const flipbooksPromise = wantFlipbooks
      ? aggregateBySlug("flipbook", limit).catch((err) => {
          console.error("flipbooks aggregate failed:", err);
          return [];
        })
      : Promise.resolve([]);

    const [totals, reports, blogs, flipbooks] = await Promise.all([
      totalsPromise,
      reportsPromise,
      blogsPromise,
      flipbooksPromise,
    ]);

    return NextResponse.json({
      success: true,
      totals,
      reports,
      blogs,
      flipbooks,
    });
  } catch (error) {
    console.error("analytics views error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}
