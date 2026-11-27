// Turns report rows (from lib/report-service or /api/admin/reports) into the
// slim list the Market Reports library renders. Pure functions with no
// database or React imports, so the server page and the client listing
// (its fallback fetch) can both use them.

export function cleanValue(value) {
  return String(value ?? "").trim();
}

export function uniqueClean(values) {
  return Array.from(new Set(values.map((v) => cleanValue(v)).filter(Boolean)));
}

function isActiveReport(item) {
  return (
    item?.isActive === true ||
    item?.isActive === 1 ||
    item?.isActive === "1" ||
    item?.is_active === true ||
    item?.is_active === 1 ||
    item?.is_active === "1"
  );
}

function toListItem(item, index) {
  const category = cleanValue(item.category || item.badge || "General");
  const country = cleanValue(item.country || item.geography || "");
  const tags = Array.isArray(item.tags)
    ? item.tags
    : Array.isArray(item.tags_json)
    ? item.tags_json
    : [];

  return {
    id: item.id ?? index + 1,
    slug: item.slug || "",
    title: item.title || "Untitled Report",
    previewTitle: item.previewTitle || item.preview_title || "",
    company: item.company || "",
    description: item.description || "",
    // Cards show the description, or this when there is none (kept empty
    // otherwise so the page doesn't carry the text twice).
    summary: item.description
      ? ""
      : item.previewTitle ||
        item.preview_title ||
        item.heroDescription ||
        item.hero_description ||
        item.metaDescription ||
        item.meta_description ||
        "No summary available for this report.",
    region: item.region || "Other",
    country,
    category,
    period: item.period || "",
    sortOrder: Number(item.sortOrder ?? item.sort_order ?? 0),
    // Cards show at most four tags.
    tags: tags.slice(0, 4),
    sampleImage:
      item.sampleImage ||
      item.sample_image ||
      item.image ||
      item.coverImage ||
      item.cover_image ||
      "",
  };
}

/**
 * @param {Array} rawReports report rows
 * @returns {{ reports: Array, categoryValues: string[], countryValues: string[], regionValues: string[] }}
 *   reports: active reports, sorted by sort order then title.
 *   *Values: filter options found in the rows.
 */
export function buildMarketListing(rawReports) {
  const raw = Array.isArray(rawReports) ? rawReports : [];

  const reports = raw
    .filter(isActiveReport)
    .map(toListItem)
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return String(a.title || "").localeCompare(String(b.title || ""));
    });

  return {
    reports,
    categoryValues: uniqueClean(raw.map((item) => item?.category || "")),
    countryValues: uniqueClean(raw.map((item) => item?.country || "")),
    regionValues: uniqueClean(raw.map((item) => item?.region || "")),
  };
}
