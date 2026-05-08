import { NextResponse } from "next/server";

import {
  getAllReports,
  ensureReportTypeColumn,
} from "../../../../lib/report-service";
import { slugify } from "../../../../lib/report-utils";
import db from "../../../../lib/db";

function toJson(value, fallback) {
  try {
    return JSON.stringify(value ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
}

function normalizeText(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

async function getUniqueSlug(baseSlug) {
  const cleanBase = (baseSlug || "report").trim();
  let slug = cleanBase;
  let count = 1;

  while (true) {
    const [rows] = await db.query(
      `SELECT id FROM reports WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (!rows.length) return slug;

    count += 1;
    slug = `${cleanBase}-${count}`;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") || "").trim();

    let reports;
    if (type === "lbi") {
      reports = await getAllReports({ reportType: "lbi" });
    } else if (type === "market") {
      // Treat market or empty/legacy values as market
      const all = await getAllReports();
      reports = all.filter((r) => {
        const t = String(r.reportType || "").toLowerCase();
        return t === "" || t === "market";
      });
    } else {
      reports = await getAllReports();
    }

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error("GET admin reports error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await ensureReportTypeColumn();

    const body = await req.json();

    const rawSlug = normalizeText(body.slug) || slugify(body.title || "");
    const slug = await getUniqueSlug(rawSlug || "report");

    const title = normalizeText(body.title);
    const previewTitle = normalizeText(body.previewTitle, title);
    const company = normalizeText(body.company, "RACE Innovations");
    const description = normalizeText(body.description);
    const region = normalizeText(body.region);
    const category = normalizeText(body.category);
    const country = normalizeText(body.country);
    const period = normalizeText(body.period);
    const badge = normalizeText(body.badge, "NEW");
    const accent = normalizeText(body.accent, "#2f45bf");

    const reportTypeRaw = String(body.reportType || body.report_type || "market")
      .trim()
      .toLowerCase();
    const reportType = reportTypeRaw === "lbi" ? "lbi" : "market";

    const price =
      body.price === "" || body.price === undefined || body.price === null
        ? null
        : body.price;

    const currency = normalizeText(body.currency, "INR");
    const formatText = normalizeText(body.formatText, "PDF");
    const licenseText = normalizeText(body.licenseText, "Single User");
    const deliveryText = normalizeText(body.deliveryText, "Within 24 hours");

    const pages =
      body.pages === "" || body.pages === undefined || body.pages === null
        ? null
        : body.pages;

    const geography = normalizeText(body.geography);
    const forecastText = normalizeText(body.forecastText);
    const publisher = normalizeText(body.publisher, "RACE Innovations");

    const metaTitle = normalizeText(body.metaTitle);
    const metaDescription = normalizeText(body.metaDescription);
    const heroDescription = normalizeText(body.heroDescription);
    const whyThisReport = normalizeText(body.whyThisReport);

    const sampleTableTitle = normalizeText(body.sampleTableTitle);
    const sampleTableNote = normalizeText(body.sampleTableNote);
    const sampleImage = normalizeText(body.sampleImage, "") || null;
    const samplePdf =
      normalizeText(body.samplePdf ?? body.sample_pdf, "") || null;

    const [result] = await db.query(
      `INSERT INTO reports (
        slug, title, preview_title, company, description, region, report_type, category, country, period, badge, accent,
        price, currency, format_text, license_text, delivery_text, pages, geography, forecast_text, publisher,
        meta_title, meta_description, hero_description, why_this_report,
        sample_table_title, sample_table_note, sample_image, sample_pdf, sample_table_json,
        tags_json, highlights_json, sections_json, buyers_json, deliverables_json, faqs_json,
        is_featured, is_active, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

      [
        slug,
        title,
        previewTitle,
        company,
        description,
        region,
        reportType,
        category,
        country,
        period,
        badge,
        accent,

        price,
        currency,
        formatText,
        licenseText,
        deliveryText,
        pages,
        geography,
        forecastText,
        publisher,

        metaTitle,
        metaDescription,
        heroDescription,
        whyThisReport,

        sampleTableTitle,
        sampleTableNote,
        sampleImage,
        samplePdf,
        toJson(body.sampleTable || { columns: [], rows: [] }, {
          columns: [],
          rows: [],
        }),

        toJson(body.tags || [], []),
        toJson(body.highlights || [], []),
        toJson(body.sections || [], []),
        toJson(body.buyers || [], []),
        toJson(body.deliverables || [], []),
        toJson(body.faqs || [], []),

        body.isFeatured === false ? 0 : 1,
        body.isActive === false ? 0 : 1,
        Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 9999,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Report created successfully",
      id: result.insertId,
      slug,
    });
  } catch (error) {
    console.error("POST admin reports error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create report",
      },
      { status: 500 }
    );
  }
}