import { permanentRedirect } from "next/navigation";

// LBI reports live at /reports/{slug} (the same renderer as market reports;
// slugs are unique across both). This old URL only forwards there with a
// permanent (308) redirect, so search engines move any signals to the
// canonical page. No metadata is needed: nothing is rendered here.
export default async function LbiReportDetailPage({ params }) {
  const { slug: rawSlug } = await params;
  let slug = rawSlug || "";
  try {
    slug = decodeURIComponent(slug);
  } catch {
    // Malformed escape: forward the slug as received.
  }
  permanentRedirect(`/reports/${encodeURIComponent(slug)}`);
}
