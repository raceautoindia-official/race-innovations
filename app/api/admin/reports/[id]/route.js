import { NextResponse } from "next/server";

import { getReportById } from "../../../../../lib/report-service";
import { slugify } from "../../../../../lib/report-utils";
import db from "../../../../../lib/db";

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

export async function GET(req, { params }) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Report id is required" },
        { status: 400 }
      );
    }

    const report = await getReportById(id);

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
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Report id is required" },
        { status: 400 }
      );
    }

    const existingReport = await getReportById(id);

    if (!existingReport) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const title = normalizeText(body.title, existingReport.title || "");
    const slug =
      normalizeText(body.slug) || slugify(title || existingReport.title || "");

    const sampleImage =
      body.sampleImage !== undefined
        ? body.sampleImage
        : body.sample_image !== undefined
          ? body.sample_image
          : existingReport.sampleImage;

    const samplePdf =
      body.samplePdf !== undefined
        ? body.samplePdf
        : body.sample_pdf !== undefined
          ? body.sample_pdf
          : existingReport.samplePdf || existingReport.sample_pdf || "";

    await db.query(
      `UPDATE reports SET
        slug = ?, title = ?, preview_title = ?, company = ?, description = ?, region = ?, category = ?, country = ?, period = ?, badge = ?, accent = ?,
        price = ?, currency = ?, format_text = ?, license_text = ?, delivery_text = ?, pages = ?, geography = ?, forecast_text = ?, publisher = ?,
        meta_title = ?, meta_description = ?, hero_description = ?, why_this_report = ?,
        sample_table_title = ?, sample_table_note = ?, sample_image = ?, sample_pdf = ?,
        tags_json = ?, highlights_json = ?, sections_json = ?, buyers_json = ?, deliverables_json = ?, faqs_json = ?,
        is_featured = ?, is_active = ?, sort_order = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        slug,
        title,
        normalizeText(body.previewTitle, body.title || existingReport.previewTitle || title),
        normalizeText(body.company, existingReport.company || "RACE Innovations"),
        normalizeText(body.description, existingReport.description || ""),
        normalizeText(body.region, existingReport.region || ""),
        normalizeText(body.category, existingReport.category || ""),
        normalizeText(body.country, existingReport.country || ""),
        normalizeText(body.period, existingReport.period || ""),
        normalizeText(body.badge, existingReport.badge || "NEW"),
        normalizeText(body.accent, existingReport.accent || "#2f45bf"),

        body.price ?? existingReport.price ?? null,
        normalizeText(body.currency, existingReport.currency || "INR"),
        normalizeText(body.formatText, existingReport.formatText || "PDF + Excel"),
        normalizeText(body.licenseText, existingReport.licenseText || "Single User"),
        normalizeText(body.deliveryText, existingReport.deliveryText || "Within 24 hours"),
        body.pages ?? existingReport.pages ?? null,
        normalizeText(body.geography, existingReport.geography || ""),
        normalizeText(body.forecastText, existingReport.forecastText || ""),
        normalizeText(body.publisher, existingReport.publisher || "RACE Innovations"),

        normalizeText(body.metaTitle, existingReport.metaTitle || ""),
        normalizeText(body.metaDescription, existingReport.metaDescription || ""),
        normalizeText(body.heroDescription, existingReport.heroDescription || ""),
        normalizeText(body.whyThisReport, existingReport.whyThisReport || ""),

        normalizeText(body.sampleTableTitle, existingReport.sampleTableTitle || ""),
        normalizeText(body.sampleTableNote, existingReport.sampleTableNote || ""),
        sampleImage ? String(sampleImage).trim() : null,
        samplePdf ? String(samplePdf).trim() : null,

        toJson(body.tags ?? existingReport.tags ?? [], []),
        toJson(body.highlights ?? existingReport.highlights ?? [], []),
        toJson(body.sections ?? existingReport.sections ?? [], []),
        toJson(body.buyers ?? existingReport.buyers ?? [], []),
        toJson(body.deliverables ?? existingReport.deliverables ?? [], []),
        toJson(body.faqs ?? existingReport.faqs ?? [], []),

        body.isFeatured !== undefined
          ? body.isFeatured ? 1 : 0
          : existingReport.isFeatured ? 1 : 0,

        body.isActive !== undefined
          ? body.isActive ? 1 : 0
          : existingReport.isActive ? 1 : 0,

        body.sortOrder !== undefined
          ? Number(body.sortOrder || 0)
          : Number(existingReport.sortOrder || 0),

        id,
      ]
    );

    const updatedReport = await getReportById(id);

    return NextResponse.json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
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
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Report id is required" },
        { status: 400 }
      );
    }

    const existingReport = await getReportById(id);

    if (!existingReport) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    await db.query(`DELETE FROM reports WHERE id = ?`, [id]);

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