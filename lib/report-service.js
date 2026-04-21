import db from "../lib/db";

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

export async function getAllReports() {
  const [rows] = await db.query(`
    SELECT
      id,
      slug,
      title,
      preview_title,
      company,
      description,
      region,
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
    FROM reports
    ORDER BY COALESCE(sort_order, 0) ASC, title ASC
  `);

  return (rows || []).map(mapReportRow);
}

export async function getReportById(id) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        slug,
        title,
        preview_title,
        company,
        description,
        region,
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
      FROM reports
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapReportRow(rows[0]);
}

export async function getReportBySlug(slug) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        slug,
        title,
        preview_title,
        company,
        description,
        region,
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
      FROM reports
      WHERE slug = ?
      LIMIT 1
    `,
    [slug]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapReportRow(rows[0]);
}