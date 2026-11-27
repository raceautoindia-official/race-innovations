// Server-side data for the blog pages (/web-blog and /web-blog/[slug]).
//
// Same SQL as the public /api/posts, /api/posts/[slug] and /api/categories
// routes, read straight from MySQL so the pages arrive with their content in
// the HTML. (Those API routes were only called from the browser, and robots.txt
// blocks /api, so crawlers saw "No posts found".)
//
// The listing shows published posts only (drafts used to be listed too). A
// draft's own URL still opens, for previewing, but is marked noindex.
//
// Each function catches database errors and returns an empty result with
// ok: false, so `next build` on a machine without a database still succeeds.
// Pages use dbErrorShouldThrow() to decide whether to fail the render instead
// (see the note there).
//
// Server only: imports the mysql2 pool. Client components must not import it.

import { cache } from "react";
import db from "./db";
import { retireOldBucket } from "./s3url";

/**
 * True when a failed query should fail the render rather than produce an
 * empty page: in production, outside `next build`. These pages use ISR, and
 * when a regeneration throws Next keeps serving the last good version, while
 * an empty result would be cached for the whole revalidate window (an empty
 * listing, or a 404 for a real post). During the build and in local dev
 * (no database) the pages render empty instead.
 */
export function dbErrorShouldThrow() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  );
}

function toIso(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// The old S3 bucket answers 403 to everything; move stored URLs to the new one.
function fixImageUrl(value) {
  if (!value) return null;
  return retireOldBucket(String(value));
}

function fixContentUrls(html) {
  return String(html || "").replace(
    /:\/\/raceautonextjs-bucket\.s3\.ap-south-1\.amazonaws\.com/gi,
    (match) => retireOldBucket(match)
  );
}

// Fields the listing cards use. Dates become ISO strings, like the JSON the
// API returned, so the client component sees the same values as before.
function mapListRow(row) {
  return {
    id: row.id,
    title: row.title || "",
    slug: String(row.slug || "").trim(),
    cover_image: fixImageUrl(row.cover_image),
    category_id: row.category_id ?? null,
    category_name: row.category_name || null,
    category_slug: row.category_slug || null,
    published_at: toIso(row.published_at),
    created_at: toIso(row.created_at),
  };
}

function mapPostRow(row) {
  return {
    id: row.id,
    title: row.title || "",
    slug: String(row.slug || "").trim(),
    excerpt: row.excerpt || "",
    content: fixContentUrls(row.content),
    category_id: row.category_id ?? null,
    category_name: row.category_name || null,
    cover_image: fixImageUrl(row.cover_image),
    status: row.status || null,
    linkedin_url: row.linkedin_url || null,
    published_at: toIso(row.published_at),
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
  };
}

/**
 * All posts for the listing, newest first (same query as GET /api/posts, plus
 * the category slug the listing's category filter compares against).
 * @returns {Promise<{ ok: boolean, posts: object[] }>}
 */
export async function getBlogPosts({ limit = 500 } = {}) {
  try {
    const safeLimit = Math.max(1, Math.min(500, Number(limit) || 500));
    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.cover_image,
        p.category_id,
        p.published_at,
        p.created_at,
        c.name AS category_name,
        c.slug AS category_slug
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT ?
      `,
      [safeLimit]
    );
    return { ok: true, posts: Array.isArray(rows) ? rows.map(mapListRow) : [] };
  } catch (error) {
    console.error("getBlogPosts failed:", error?.message || error);
    return { ok: false, posts: [] };
  }
}

/**
 * Categories for the listing filter (same query as GET /api/categories).
 * @returns {Promise<{ ok: boolean, categories: {id, name, slug}[] }>}
 */
export async function getBlogCategories() {
  try {
    const [rows] = await db.query(
      `SELECT id, name, slug FROM categories ORDER BY name ASC`
    );
    const categories = (Array.isArray(rows) ? rows : []).map((c) => ({
      id: c.id,
      name: c.name || "",
      slug: c.slug || "",
    }));
    return { ok: true, categories };
  } catch (error) {
    console.error("getBlogCategories failed:", error?.message || error);
    return { ok: false, categories: [] };
  }
}

/**
 * One post by slug (same query as GET /api/posts/[slug], plus published_at
 * and updated_at for the visible date and the Article metadata).
 * Wrapped in React cache() so generateMetadata and the page share one query.
 * @returns {Promise<{ ok: boolean, post: object|null }>}
 */
export const getPostBySlug = cache(async function getPostBySlug(slug) {
  const s = String(slug || "").trim();
  if (!s) return { ok: true, post: null };

  try {
    const [rows] = await db.query(
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
        p.published_at,
        p.created_at,
        p.updated_at,
        c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ?
      LIMIT 1
      `,
      [s]
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return { ok: true, post: row ? mapPostRow(row) : null };
  } catch (error) {
    console.error("getPostBySlug failed:", s, error?.message || error);
    return { ok: false, post: null };
  }
});
