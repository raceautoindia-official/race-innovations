import db from "@/lib/db";

function parseJson(value, fallback = []) {
  try {
    if (!value) return fallback;
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
}

function toSafeLimit(value, fallback = 12) {
  const num = Number(value);

  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return fallback;
  }

  const intVal = Math.floor(num);

  if (intVal <= 0) {
    return fallback;
  }

  return intVal;
}

function mapReport(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    previewTitle: row.preview_title,
    company: row.company,
    description: row.description,
    region: row.region,
    period: row.period,
    badge: row.badge,
    accent: row.accent,
    price: row.price,
    currency: row.currency,
    formatText: row.format_text,
    licenseText: row.license_text,
    deliveryText: row.delivery_text,
    pages: row.pages,
    geography: row.geography,
    forecastText: row.forecast_text,
    publisher: row.publisher,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    heroDescription: row.hero_description,
    whyThisReport: row.why_this_report,
    sampleTableTitle: row.sample_table_title,
    sampleTableNote: row.sample_table_note,
    sampleTable: parseJson(row.sample_table_json, { columns: [], rows: [] }),
    tags: parseJson(row.tags_json, []),
    highlights: parseJson(row.highlights_json, []),
    sections: parseJson(row.sections_json, []),
    buyers: parseJson(row.buyers_json, []),
    deliverables: parseJson(row.deliverables_json, []),
    faqs: parseJson(row.faqs_json, []),
    isFeatured: !!row.is_featured,
    isActive: !!row.is_active,
    sortOrder: row.sort_order ?? 0,
    sampleImage: row.sample_image || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

export async function getAllReports() {
  const [rows] = await db.query(`
    SELECT *
    FROM reports
    WHERE is_active = 1
    ORDER BY created_at DESC, id DESC
  `);

  return rows.map(mapReport);
}

export async function getFeaturedReports(limit = 12) {
  const safeLimit = toSafeLimit(limit, 12);

  const [rows] = await db.query(
    `
    SELECT *
    FROM reports
    WHERE is_active = 1
      AND is_featured = 1
    ORDER BY created_at DESC, id DESC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(mapReport);
}

export async function getReportBySlug(slug) {
  if (!slug) return null;

  const normalizedSlug = decodeURIComponent(String(slug)).trim();

  const [rows] = await db.query(
    `
    SELECT *
    FROM reports
    WHERE is_active = 1
      AND (
        slug = ?
        OR TRIM(slug) = ?
        OR LOWER(TRIM(slug)) = LOWER(?)
      )
    ORDER BY id DESC
    LIMIT 1
    `,
    [normalizedSlug, normalizedSlug, normalizedSlug]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapReport(rows[0]);
}