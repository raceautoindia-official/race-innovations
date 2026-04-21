import { MetadataRoute } from "next";
import db from "../lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function isValidDate(date?: string | null): boolean {
  if (!date) return false;
  return !isNaN(Date.parse(date));
}

function getValidDate(date?: string | null): Date {
  return isValidDate(date) ? new Date(date as string) : new Date();
}

function safeSlug(slug?: string | null): string {
  return encodeURIComponent(String(slug || "").trim());
}

function absUrl(path: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:4000";

  return `${baseUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [reports]: any = await db.execute(`
    SELECT 
      title_slug,
      updated_at
    FROM reports
    WHERE title_slug IS NOT NULL
      AND title_slug != ''
  `);

  return [
    {
      url: absUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absUrl("/market-report"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...reports.map((report: any) => ({
      url: absUrl(`/market-report/${safeSlug(report.title_slug)}`),
      lastModified: getValidDate(report.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}