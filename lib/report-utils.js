export function safeJsonParse(value, fallback) {
  try {
    if (value === null || value === undefined || value === "") return fallback;
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
}

export function normalizeReportRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title || "",
    previewTitle: row.preview_title || row.title || "",
    company: row.company || "RACE Innovations",
    description: row.description || "",
    region: row.region || "",
    period: row.period || "",
    badge: row.badge || "",
    accent: row.accent || "#2f45bf",

    price: row.price,
    currency: row.currency || "USD",
    formatText: row.format_text || "PDF + Excel",
    licenseText: row.license_text || "Single User",
    deliveryText: row.delivery_text || "Within 24 hours",
    pages: row.pages,
    geography: row.geography || "",
    forecastText: row.forecast_text || "",
    publisher: row.publisher || "RACE Innovations",

    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    heroDescription: row.hero_description || "",
    whyThisReport: row.why_this_report || "",

    sampleTableTitle: row.sample_table_title || "",
    sampleTableNote: row.sample_table_note || "",
    sampleTable: safeJsonParse(row.sample_table_json, { columns: [], rows: [] }),

    tags: safeJsonParse(row.tags_json, []),
    highlights: safeJsonParse(row.highlights_json, []),
    sections: safeJsonParse(row.sections_json, []),
    buyers: safeJsonParse(row.buyers_json, []),
    deliverables: safeJsonParse(row.deliverables_json, []),
    faqs: safeJsonParse(row.faqs_json, []),

    isFeatured: !!row.is_featured,
    isActive: !!row.is_active,
    sortOrder: row.sort_order || 0,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}