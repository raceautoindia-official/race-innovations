import { redirect } from "next/navigation";
import { getReportBySlug } from "../../../lib/report-service";

export async function generateMetadata({ params }) {
  const slug = decodeURIComponent(params?.slug || "");
  const report = await getReportBySlug(slug);
  if (!report) return {};

  return {
    title: report.metaTitle || `${report.title} | LBI Report - RACE Innovations`,
    description:
      report.metaDescription ||
      report.description ||
      "Location Based Intelligence report from RACE Innovations.",
    keywords: [
      "LBI report",
      "Location Based Intelligence",
      "ODC route survey",
      "logistics intelligence",
      "RACE Innovations",
      report.title,
      report.category,
      report.region,
    ].filter(Boolean),
    alternates: {
      canonical: `https://raceinnovations.in/lbi-reports/${slug}`,
    },
  };
}

// LBI report detail reuses the same renderer as market reports — slugs are
// unique per report and the existing /reports/[slug] page already handles
// every field the LBI form supports (highlights, sections, deliverables,
// FAQs, pricing, sample request, related reports).
export default function LbiReportDetailPage({ params }) {
  const slug = decodeURIComponent(params?.slug || "");
  redirect(`/reports/${slug}`);
}
