import db from "../lib/db";

let reportTypeColumnEnsured = false;

export async function ensureReportTypeColumn() {
  if (reportTypeColumnEnsured) return;
  try {
    const [cols] = await db.query(
      `SHOW COLUMNS FROM reports LIKE 'report_type'`
    );
    if (!Array.isArray(cols) || cols.length === 0) {
      await db.query(
        `ALTER TABLE reports
         ADD COLUMN report_type VARCHAR(32) NOT NULL DEFAULT 'market'`
      );
      await db.query(
        `CREATE INDEX idx_reports_report_type ON reports (report_type)`
      ).catch(() => {});
    }

    // Optional flipbook URL (used to deliver free reports). Auto-create so no
    // manual migration is needed on any environment.
    const [flipCols] = await db.query(
      `SHOW COLUMNS FROM reports LIKE 'flipbook_url'`
    );
    if (!Array.isArray(flipCols) || flipCols.length === 0) {
      await db.query(
        `ALTER TABLE reports ADD COLUMN flipbook_url VARCHAR(1000) NULL`
      );
    }

    reportTypeColumnEnsured = true;
  } catch (err) {
    console.error("ensureReportTypeColumn failed:", err);
  }
}

function safeJsonParse(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;

  if (Array.isArray(value) || typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapReportRow(row) {
  return {
    id: row.id,
    slug: row.slug || "",
    title: row.title || "",
    previewTitle: row.preview_title || "",
    company: row.company || "",
    description: row.description || "",
    region: row.region || "",

    reportType: row.report_type || "market",

    category: row.category || "",
    country: row.country || "",

    period: row.period || "",
    badge: row.badge || "",
    accent: row.accent || "",

    price: row.price,
    currency: row.currency || "",
    formatText: row.format_text || "",
    licenseText: row.license_text || "",
    deliveryText: row.delivery_text || "",
    pages: row.pages,
    geography: row.geography || "",
    forecastText: row.forecast_text || "",
    publisher: row.publisher || "",

    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    heroDescription: row.hero_description || "",
    whyThisReport: row.why_this_report || "",

    sampleTableTitle: row.sample_table_title || "",
    sampleTableNote: row.sample_table_note || "",
    sampleImage: row.sample_image || "",
    samplePdf: row.sample_pdf || "",
    flipbookUrl: row.flipbook_url || "",
    sampleTable: safeJsonParse(row.sample_table_json, {
      columns: [],
      rows: [],
    }),

    tags: safeJsonParse(row.tags_json, []),
    highlights: safeJsonParse(row.highlights_json, []),
    sections: safeJsonParse(row.sections_json, []),
    buyers: safeJsonParse(row.buyers_json, []),
    deliverables: safeJsonParse(row.deliverables_json, []),
    faqs: safeJsonParse(row.faqs_json, []),

    isFeatured: !!row.is_featured,
    isActive: !!row.is_active,
    sortOrder: Number(row.sort_order || 0),

    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

const REPORT_SELECT_FIELDS = `
  id,
  slug,
  title,
  preview_title,
  company,
  description,
  region,
  report_type,
  category,
  country,
  period,
  badge,
  accent,
  price,
  currency,
  format_text,
  license_text,
  delivery_text,
  pages,
  geography,
  forecast_text,
  publisher,
  meta_title,
  meta_description,
  hero_description,
  why_this_report,
  sample_table_title,
  sample_table_note,
  sample_image,
  sample_pdf,
  flipbook_url,
  sample_table_json,
  tags_json,
  highlights_json,
  sections_json,
  buyers_json,
  deliverables_json,
  faqs_json,
  is_featured,
  is_active,
  sort_order,
  created_at,
  updated_at
`;

// Categories that conceptually belong to LBI even if the row was saved
// before the `report_type` column existed or via the legacy market admin.
const LBI_CATEGORY_FALLBACK = [
  "ODC Route Feasibility Study Report",
  "Route Survey Report",
  "Logistics Intelligence Report",
  "Corridor Feasibility Report",
  "Port Connectivity Report",
  "Heavy Cargo Movement Report",
  "Location Based Intelligence Report",
];

export async function getAllReports({ reportType } = {}) {
  await ensureReportTypeColumn();

  if (reportType === "lbi") {
    // Match rows tagged report_type='lbi' OR rows whose category is in the
    // known LBI list (covers legacy rows where report_type wasn't set).
    const placeholders = LBI_CATEGORY_FALLBACK.map(() => "?").join(", ");
    const [rows] = await db.query(
      `SELECT ${REPORT_SELECT_FIELDS} FROM reports
       WHERE report_type = 'lbi' OR category IN (${placeholders})
       ORDER BY COALESCE(sort_order, 0) ASC, title ASC`,
      LBI_CATEGORY_FALLBACK
    );
    return (rows || []).map(mapReportRow);
  }

  if (reportType) {
    const [rows] = await db.query(
      `SELECT ${REPORT_SELECT_FIELDS} FROM reports
       WHERE report_type = ?
       ORDER BY COALESCE(sort_order, 0) ASC, title ASC`,
      [reportType]
    );
    return (rows || []).map(mapReportRow);
  }

  const [rows] = await db.query(
    `SELECT ${REPORT_SELECT_FIELDS} FROM reports
     ORDER BY COALESCE(sort_order, 0) ASC, title ASC`
  );

  return (rows || []).map(mapReportRow);
}

export async function getAllLbiReports() {
  return getAllReports({ reportType: "lbi" });
}

export async function getAllMarketReports() {
  await ensureReportTypeColumn();
  const [rows] = await db.query(
    `SELECT ${REPORT_SELECT_FIELDS} FROM reports
     WHERE report_type IS NULL OR report_type = '' OR report_type = 'market'
     ORDER BY COALESCE(sort_order, 0) ASC, title ASC`
  );
  return (rows || []).map(mapReportRow);
}

export async function getReportById(id) {
  await ensureReportTypeColumn();
  const [rows] = await db.query(
    `SELECT ${REPORT_SELECT_FIELDS} FROM reports WHERE id = ? LIMIT 1`,
    [id]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapReportRow(rows[0]);
}

export async function getReportBySlug(slug) {
  await ensureReportTypeColumn();
  const [rows] = await db.query(
    `SELECT ${REPORT_SELECT_FIELDS} FROM reports WHERE slug = ? LIMIT 1`,
    [slug]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapReportRow(rows[0]);
}