import type { MetadataRoute } from "next";
import db from "../lib/db";

type ReportRow = {
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
  let reports: ReportRow[] = [];

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

    reports = rows as ReportRow[];
  } catch (error) {
    console.error("Sitemap reports fetch failed:", error);
  }

  return [
    {
      url: absUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absUrl("/reports"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...reports.map(
      (report): MetadataRoute.Sitemap[number] => ({
        url: absUrl(`/reports/${safeSlug(report.slug)}`),
        lastModified: getValidDate(report.updated_at),
        changeFrequency: "daily",
        priority: 0.8,
      })
    ),
  ];
}