import type { MetadataRoute } from "next";
import db from "../lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

type SlugRow = {
  slug: string | null;
  updated_at?: string | Date | null;
  is_active?: number | boolean | null;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://raceinnovations.in";

function absUrl(path: string) {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function safeSlug(slug: string | null | undefined) {
  if (!slug) return "";
  return encodeURIComponent(String(slug).trim());
}

function getValidDate(value: string | Date | null | undefined) {
  if (!value) return new Date();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

// Days between `date` and now. Used to grade priority/changeFrequency by age.
function ageInDays(date: Date) {
  const ms = Date.now() - date.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function reportPriority(updatedAt: Date) {
  const age = ageInDays(updatedAt);
  if (age <= 14) return 0.9;   // hot — recently updated
  if (age <= 60) return 0.8;
  if (age <= 180) return 0.7;
  return 0.6;                  // older but still relevant
}

function reportChangeFreq(updatedAt: Date): "daily" | "weekly" | "monthly" {
  const age = ageInDays(updatedAt);
  if (age <= 14) return "daily";
  if (age <= 90) return "weekly";
  return "monthly";
}

function blogPriority(updatedAt: Date) {
  const age = ageInDays(updatedAt);
  if (age <= 14) return 0.8;
  if (age <= 60) return 0.7;
  if (age <= 180) return 0.6;
  return 0.5;
}

function blogChangeFreq(updatedAt: Date): "daily" | "weekly" | "monthly" {
  const age = ageInDays(updatedAt);
  if (age <= 14) return "weekly";
  return "monthly";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let reports: SlugRow[] = [];
  let blogs: SlugRow[] = [];

  try {
    const [rows] = await db.query(
      `
      SELECT slug, updated_at, is_active
      FROM reports
      WHERE slug IS NOT NULL
        AND slug <> ''
        AND (is_active = 1 OR is_active = TRUE)
      ORDER BY updated_at DESC
      `
    );

    reports = rows as SlugRow[];
  } catch (error) {
    console.error("Sitemap reports fetch failed:", error);
  }

  try {
    const [rows] = await db.query(
      `
      SELECT slug, updated_at
      FROM posts
      WHERE slug IS NOT NULL
        AND slug <> ''
      ORDER BY updated_at DESC
      `
    );

    blogs = rows as SlugRow[];
  } catch (error) {
    console.error("Sitemap blogs fetch failed:", error);
  }

  const now = new Date();

  // Tier 1 — homepage (top priority).
  const tier1: MetadataRoute.Sitemap = [
    {
      url: absUrl("/"),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  // Tier 2 — primary listings (refresh daily, very important for crawl).
  const tier2: MetadataRoute.Sitemap = [
    "/market-report",
    "/lbi-reports",
    "/reports",
    "/web-blog",
  ].map((path) => ({
    url: absUrl(path),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Tier 3 — main service / company landing pages.
  const tier3: MetadataRoute.Sitemap = [
    "/contact",
    "/about-us/vision-mission",
    "/about-us/management-team",
    "/about-us/investors",
    "/technic",
    "/intellect",
    "/connect",
    "/intellect/lbi",
    "/it",
    "/accounting-and-legal",
    "/corporate-profile",
    "/career",
    "/strategic-report",
    "/flash-reports",
  ].map((path) => ({
    url: absUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticEntries: MetadataRoute.Sitemap = [...tier1, ...tier2, ...tier3];

  const validReports = reports.filter(
    (r) => r.slug && String(r.slug).trim() !== ""
  );

  // Only emit the canonical /reports/{slug} URL — the /lbi-reports/{slug}
  // route redirects to /reports/{slug}, so listing both would surface as
  // "Page with redirect" errors in Google Search Console.
  // Priority + changeFrequency are graded by recency so Google spends crawl
  // budget on freshly updated reports first.
  const reportEntries: MetadataRoute.Sitemap = validReports.map((report) => {
    const updatedAt = getValidDate(report.updated_at);
    return {
      url: absUrl(`/reports/${safeSlug(report.slug)}`),
      lastModified: updatedAt,
      changeFrequency: reportChangeFreq(updatedAt),
      priority: reportPriority(updatedAt),
    };
  });

  const blogEntries: MetadataRoute.Sitemap = blogs
    .filter((b) => b.slug && String(b.slug).trim() !== "")
    .map((blog) => {
      const updatedAt = getValidDate(blog.updated_at);
      return {
        url: absUrl(`/web-blog/${safeSlug(blog.slug)}`),
        lastModified: updatedAt,
        changeFrequency: blogChangeFreq(updatedAt),
        priority: blogPriority(updatedAt),
      };
    });

  return [...staticEntries, ...reportEntries, ...blogEntries];
}
