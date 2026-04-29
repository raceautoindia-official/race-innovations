import type { MetadataRoute } from "next";
import db from "../lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

type SlugRow = {
  slug: string | null;
  updated_at?: string | Date | null;
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let reports: SlugRow[] = [];
  let blogs: SlugRow[] = [];

  try {
    const [rows] = await db.query(
      `
      SELECT slug, updated_at
      FROM reports
      WHERE slug IS NOT NULL
        AND slug <> ''
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
      FROM blogs
      WHERE slug IS NOT NULL
        AND slug <> ''
      ORDER BY updated_at DESC
      `
    );

    blogs = rows as SlugRow[];
  } catch (error) {
    console.error("Sitemap blogs fetch failed:", error);
  }

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: absUrl("/reports"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: absUrl("/web-blog"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  const reportEntries: MetadataRoute.Sitemap = reports
    .filter((r) => r.slug && String(r.slug).trim() !== "")
    .map((report) => ({
      url: absUrl(`/reports/${safeSlug(report.slug)}`),
      lastModified: getValidDate(report.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  const blogEntries: MetadataRoute.Sitemap = blogs
    .filter((b) => b.slug && String(b.slug).trim() !== "")
    .map((blog) => ({
      url: absUrl(`/web-blog/${safeSlug(blog.slug)}`),
      lastModified: getValidDate(blog.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...reportEntries, ...blogEntries];
}
