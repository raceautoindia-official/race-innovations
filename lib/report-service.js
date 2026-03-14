

import db from "./db";
import { normalizeReportRow } from "./report-utils";

export async function getAllReports() {
  const [rows] = await db.query(
    `SELECT * FROM reports ORDER BY sort_order ASC, id DESC`
  );
  return rows.map(normalizeReportRow);
}

export async function getFeaturedReports(limit = 6) {
  const [rows] = await db.query(
    `SELECT * FROM reports
     WHERE is_featured = 1 AND is_active = 1
     ORDER BY sort_order ASC, id DESC
     LIMIT ?`,
    [Number(limit)]
  );
  return rows.map(normalizeReportRow);
}

export async function getReportById(id) {
  const [rows] = await db.query(
    `SELECT * FROM reports WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows.length ? normalizeReportRow(rows[0]) : null;
}

export async function getReportBySlug(slug) {
  const [rows] = await db.query(
    `SELECT * FROM reports WHERE slug = ? AND is_active = 1 LIMIT 1`,
    [slug]
  );
  return rows.length ? normalizeReportRow(rows[0]) : null;
}