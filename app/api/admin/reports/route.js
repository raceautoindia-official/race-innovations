import { NextResponse } from "next/server";

import { getAllReports } from "@/lib/report-service";
import { slugify } from "@/lib/report-utils";
import db from "@/lib/db";

function toJson(value, fallback) {
  try {
    return JSON.stringify(value ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
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

export async function GET() {
  try {
    const reports = await getAllReports();
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
    const body = await req.json();

    const rawSlug = body.slug?.trim() || slugify(body.title || "");
    const slug = await getUniqueSlug(rawSlug || "report");

    const [result] = await db.query(
      `INSERT INTO reports (
        slug, title, preview_title, company, description, region, period, badge, accent,
        price, currency, format_text, license_text, delivery_text, pages, geography, forecast_text, publisher,
        meta_title, meta_description, hero_description, why_this_report,
        sample_table_title, sample_table_note, sample_table_json,
        tags_json, highlights_json, sections_json, buyers_json, deliverables_json, faqs_json,
        is_featured, is_active, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        body.title || "",
        body.previewTitle || body.title || "",
        body.company || "RACE Innovations",
        body.description || "",
        body.region || "",
        body.period || "",
        body.badge || "NEW",
        body.accent || "#2f45bf",

        body.price || null,
        body.currency || "RS",
        body.formatText || "PDF + Excel",
        body.licenseText || "Single User",
        body.deliveryText || "Within 24 hours",
        body.pages || null,
        body.geography || "",
        body.forecastText || "",
        body.publisher || "RACE Innovations",

        body.metaTitle || "",
        body.metaDescription || "",
        body.heroDescription || "",
        body.whyThisReport || "",

        body.sampleTableTitle || "",
        body.sampleTableNote || "",
        toJson(
          body.sampleTable || { columns: [], rows: [] },
          { columns: [], rows: [] }
        ),

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