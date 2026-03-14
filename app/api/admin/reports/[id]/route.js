import { NextResponse } from "next/server";

import { getReportById } from "@/lib/report-service";
import { slugify } from "@/lib/report-utils";
import db from "@/lib/db";

function toJson(value, fallback) {
  try {
    return JSON.stringify(value ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
}

export async function GET(req, { params }) {
  try {
    const report = await getReportById(params.id);
    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error("GET report by id error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();


    const slug = body.slug?.trim() || slugify(body.title || "");

    await db.query(
      `UPDATE reports SET
        slug = ?, title = ?, preview_title = ?, company = ?, description = ?, region = ?, period = ?, badge = ?, accent = ?,
        price = ?, currency = ?, format_text = ?, license_text = ?, delivery_text = ?, pages = ?, geography = ?, forecast_text = ?, publisher = ?,
        meta_title = ?, meta_description = ?, hero_description = ?, why_this_report = ?,
        sample_table_title = ?, sample_table_note = ?, sample_image = ?,
        tags_json = ?, highlights_json = ?, sections_json = ?, buyers_json = ?, deliverables_json = ?, faqs_json = ?,
        is_featured = ?, is_active = ?, sort_order = ?
      WHERE id = ?`,
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
        body.currency || "INR",
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
        body.sampleImage || "",

        toJson(body.tags || [], []),
        toJson(body.highlights || [], []),
        toJson(body.sections || [], []),
        toJson(body.buyers || [], []),
        toJson(body.deliverables || [], []),
        toJson(body.faqs || [], []),

        body.isFeatured ? 1 : 0,
        body.isActive === false ? 0 : 1,
        Number(body.sortOrder || 0),
        params.id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Report updated successfully",
    });
  } catch (error) {
    console.error("PUT report error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = db();
    await db.query(`DELETE FROM reports WHERE id = ?`, [params.id]);

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("DELETE report error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete report" },
      { status: 500 }
    );
  }
}