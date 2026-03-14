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

    const slug = body.slug?.trim() || slugify(body.title || "");

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
        body.currency || "USD",
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

        body.isFeatured ? 1 : 0,
        body.isActive === false ? 0 : 1,
        Number(body.sortOrder || 0),
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Report created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("POST admin reports error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create report" },
      { status: 500 }
    );
  }
}