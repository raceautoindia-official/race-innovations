// Turns report rows (from lib/report-service or /api/admin/reports?type=lbi)
// into the slim list the LBI Reports page renders. No database or React
// imports, so the server page and the client fallback fetch share it.

function isListed(item) {
  // Only rows explicitly flagged inactive are hidden.
  if (item?.isActive === false) return false;
  if (item?.isActive === 0) return false;
  if (item?.isActive === "0") return false;
  return true;
}

export function buildLbiListing(rawReports) {
  const raw = Array.isArray(rawReports) ? rawReports : [];
  return raw.filter(isListed).map((r) => ({
    id: r.id ?? null,
    slug: r.slug || "",
    title: r.title || "",
    previewTitle: r.previewTitle || "",
    description: r.description || "",
    region: r.region || "",
    country: r.country || "",
    category: r.category || "",
    price: r.price ?? null,
    currency: r.currency || "",
    sampleImage: r.sampleImage || r.image || r.coverImage || "",
  }));
}
