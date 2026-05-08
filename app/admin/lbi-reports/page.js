"use client";

import React, { useEffect, useMemo, useState } from "react";

const LBI_CATEGORY_OPTIONS = [
  "ODC Route Feasibility Study Report",
  "Route Survey Report",
  "Logistics Intelligence Report",
  "Corridor Feasibility Report",
  "Port Connectivity Report",
  "Heavy Cargo Movement Report",
  "Location Based Intelligence Report",
];

const REGION_OPTIONS = [
  "South India",
  "North India",
  "East India",
  "West India",
  "Pan India",
  "International",
];

const REPORTS_PER_PAGE = 6;

const emptyForm = {
  id: null,
  slug: "",
  title: "",
  previewTitle: "",
  description: "",
  heroDescription: "",

  reportType: "lbi",
  category: "",
  manualCategory: "",
  region: "",
  manualRegion: "",
  country: "India",
  routeFrom: "",
  routeTo: "",

  price: "",
  currency: "INR",
  pages: "",
  formatText: "PDF",
  licenseText: "Single User",
  deliveryText: "Within 24 hours",
  publisher: "RACE Innovations",
  period: "",
  forecastText: "",
  badge: "LBI",
  accent: "#2f45bf",

  metaTitle: "",
  metaDescription: "",

  sampleImage: "",
  samplePdf: "",

  tagsText: "",
  highlightsText: "",
  sectionsText: "",
  buyersText: "",

  deliverablesText: `[
  {
    "icon": "⇩",
    "title": "PDF Report",
    "description": "Detailed location-based intelligence report"
  },
  {
    "icon": "◎",
    "title": "Route Survey Findings",
    "description": "Field survey data, road condition, choke points"
  },
  {
    "icon": "?",
    "title": "Analyst Access",
    "description": "Post-purchase consultation with logistics analyst"
  }
]`,

  faqsText: `[
  {
    "question": "Can this LBI report be customized for a specific route?",
    "answer": "Yes. We can customize the route survey scope, corridor coverage, and reporting structure based on your origin-destination requirement."
  },
  {
    "question": "Does the report cover ODC movement feasibility?",
    "answer": "Yes. Our LBI reports cover ODC route feasibility, road geometry, vertical/horizontal clearance, choke points, and movement permissions."
  }
]`,

  isFeatured: false,
  isActive: true,
  sortOrder: 0,
};

function textToArray(value) {
  return String(value || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function presetMatch(options, value) {
  const t = String(value || "").trim().toLowerCase();
  return options.find((o) => o.toLowerCase() === t) || "";
}

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 1) return [];
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 5) return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  if (currentPage >= totalPages - 4) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export default function AdminLbiReportsPage() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [currentPage, setCurrentPage] = useState(1);

  const isEdit = useMemo(() => !!form.id, [form.id]);

  async function loadReports() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reports?type=lbi", {
        cache: "no-store",
      });
      const json = await res.json();
      if (json?.success) {
        setReports(Array.isArray(json.data) ? json.data : []);
      } else {
        setMessage({ type: "error", text: json?.message || "Failed to load reports" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load LBI reports" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      const aSort = Number(a?.sortOrder ?? a?.sort_order ?? 0);
      const bSort = Number(b?.sortOrder ?? b?.sort_order ?? 0);
      if (aSort !== bSort) return aSort - bSort;
      return String(a?.title || "").localeCompare(String(b?.title || ""));
    });
  }, [reports]);

  const totalPages = Math.max(1, Math.ceil(sortedReports.length / REPORTS_PER_PAGE));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * REPORTS_PER_PAGE;
    return sortedReports.slice(start, start + REPORTS_PER_PAGE);
  }, [sortedReports, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "category" && value) next.manualCategory = "";
      if (name === "region" && value) next.manualRegion = "";
      return next;
    });
  }

  function fillForm(report) {
    const matchedCategory = presetMatch(LBI_CATEGORY_OPTIONS, report.category);
    const matchedRegion = presetMatch(REGION_OPTIONS, report.region);

    setForm({
      id: report.id ?? null,
      slug: report.slug || "",
      title: report.title || "",
      previewTitle: report.previewTitle || "",
      description: report.description || "",
      heroDescription: report.heroDescription || "",

      reportType: "lbi",
      category: matchedCategory,
      manualCategory: matchedCategory ? "" : (report.category || ""),
      region: matchedRegion,
      manualRegion: matchedRegion ? "" : (report.region || ""),
      country: report.country || "India",
      routeFrom: "",
      routeTo: "",

      price: report.price || "",
      currency: report.currency || "INR",
      pages: report.pages || "",
      formatText: report.formatText || "PDF",
      licenseText: report.licenseText || "Single User",
      deliveryText: report.deliveryText || "Within 24 hours",
      publisher: report.publisher || "RACE Innovations",
      period: report.period || "",
      forecastText: report.forecastText || "",
      badge: report.badge || "LBI",
      accent: report.accent || "#2f45bf",

      metaTitle: report.metaTitle || "",
      metaDescription: report.metaDescription || "",

      sampleImage: report.sampleImage || "",
      samplePdf: report.samplePdf || "",

      tagsText: Array.isArray(report.tags) ? report.tags.join("\n") : "",
      highlightsText: Array.isArray(report.highlights) ? report.highlights.join("\n") : "",
      sectionsText: Array.isArray(report.sections) ? report.sections.join("\n") : "",
      buyersText: Array.isArray(report.buyers) ? report.buyers.join("\n") : "",

      deliverablesText: JSON.stringify(report.deliverables || [], null, 2),
      faqsText: JSON.stringify(report.faqs || [], null, 2),

      isFeatured: !!report.isFeatured,
      isActive: report.isActive !== false,
      sortOrder: report.sortOrder ?? 0,
    });

    setMessage({ type: "", text: "" });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setMessage({ type: "", text: "" });
  }

  async function uploadFile(file, kind) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok || !json?.url) {
      throw new Error(json?.error || `${kind} upload failed`);
    }
    return json.url;
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadFile(file, "Image");
      setForm((prev) => ({ ...prev, sampleImage: url }));
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Image upload failed" });
    } finally {
      setUploadingImage(false);
    }
  }

  async function handlePdfUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Please upload a PDF file" });
      return;
    }
    try {
      setUploadingPdf(true);
      const url = await uploadFile(file, "PDF");
      setForm((prev) => ({ ...prev, samplePdf: url }));
    } catch (err) {
      setMessage({ type: "error", text: err.message || "PDF upload failed" });
    } finally {
      setUploadingPdf(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const finalCategory =
        String(form.manualCategory || "").trim() || String(form.category || "").trim();
      const finalRegion =
        String(form.manualRegion || "").trim() || String(form.region || "").trim();

      if (!form.title.trim()) throw new Error("Title is required");
      if (!finalCategory) throw new Error("Please select or enter a category");

      let parsedDeliverables = [];
      let parsedFaqs = [];
      try {
        parsedDeliverables = JSON.parse(form.deliverablesText || "[]");
      } catch {
        throw new Error("Deliverables JSON is invalid");
      }
      try {
        parsedFaqs = JSON.parse(form.faqsText || "[]");
      } catch {
        throw new Error("FAQs JSON is invalid");
      }

      const tags = textToArray(form.tagsText);
      if (form.routeFrom.trim()) tags.push(`From: ${form.routeFrom.trim()}`);
      if (form.routeTo.trim()) tags.push(`To: ${form.routeTo.trim()}`);

      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        previewTitle: form.previewTitle.trim() || form.title.trim(),
        company: "RACE Innovations",
        description: form.description,
        reportType: "lbi",
        region: finalRegion,
        country: form.country.trim(),
        category: finalCategory,
        period: form.period.trim(),
        badge: form.badge.trim() || "LBI",
        accent: form.accent.trim() || "#2f45bf",

        price: form.price || null,
        currency: form.currency || "INR",
        formatText: form.formatText,
        licenseText: form.licenseText,
        deliveryText: form.deliveryText,
        pages: form.pages || null,
        geography: finalRegion || form.country.trim(),
        forecastText: form.forecastText,
        publisher: form.publisher,

        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        heroDescription: form.heroDescription,

        sampleImage: form.sampleImage,
        samplePdf: form.samplePdf,

        tags,
        highlights: textToArray(form.highlightsText),
        sections: textToArray(form.sectionsText),
        buyers: textToArray(form.buyersText),
        deliverables: parsedDeliverables,
        faqs: parsedFaqs,

        isFeatured: form.isFeatured,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder || 0),
      };

      const res = await fetch(
        isEdit ? `/api/admin/reports/${form.id}` : "/api/admin/reports",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!json?.success) throw new Error(json?.message || "Failed to save");

      setMessage({
        type: "success",
        text: isEdit ? "LBI report updated successfully" : "LBI report created successfully",
      });

      await loadReports();
      if (!isEdit) resetForm();
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this LBI report?")) return;
    try {
      const res = await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.message || "Delete failed");
      await loadReports();
      if (form.id === id) resetForm();
    } catch (error) {
      alert(error.message || "Failed to delete");
    }
  }

  return (
    <main className="container-fluid px-4 py-4">
      <div className="row g-4">
        {/* Listing column */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">LBI Reports</h2>
                <button className="btn btn-sm btn-primary" onClick={resetForm}>
                  New
                </button>
              </div>

              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <div className="d-flex flex-column gap-3">
                    {paginatedReports.length > 0 ? (
                      paginatedReports.map((report) => (
                        <div
                          key={report.id}
                          className="border rounded p-3"
                          style={{ background: "#fff" }}
                        >
                          <div className="fw-bold">{report.title}</div>
                          <div className="text-muted small">{report.slug}</div>
                          {report.category && (
                            <div className="small mt-1">
                              <span className="badge bg-light text-dark border me-1">
                                {report.category}
                              </span>
                            </div>
                          )}
                          {report.region && (
                            <div className="text-muted small mt-1">{report.region}</div>
                          )}
                          <div className="d-flex gap-2 mt-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => fillForm(report)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(report.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted small">No LBI reports yet.</div>
                    )}
                  </div>

                  {sortedReports.length > 0 && totalPages > 1 && (
                    <div className="d-flex flex-wrap gap-1 mt-3">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                      >
                        Prev
                      </button>
                      {getPaginationItems(currentPage, totalPages).map((item, idx) =>
                        typeof item === "string" ? (
                          <span key={`${item}-${idx}`} className="px-2 text-muted">
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            className={`btn btn-sm ${
                              currentPage === item ? "btn-primary" : "btn-outline-secondary"
                            }`}
                            onClick={() => setCurrentPage(item)}
                          >
                            {item}
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h1 className="h3 mb-3">
                {isEdit ? "Edit LBI Report" : "Create LBI Report"}
              </h1>

              {message.text ? (
                <div
                  className={`alert ${
                    message.type === "error" ? "alert-danger" : "alert-success"
                  } py-2`}
                >
                  {message.text}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title *</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Slug</label>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="auto-generated if empty"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Short Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="form-control"
                      rows={3}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Hero Description</label>
                    <textarea
                      name="heroDescription"
                      value={form.heroDescription}
                      onChange={handleChange}
                      className="form-control"
                      rows={3}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select category</option>
                      {LBI_CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Manual Category</label>
                    <input
                      name="manualCategory"
                      value={form.manualCategory}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Custom category if not in dropdown"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Region</label>
                    <select
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select region</option>
                      {REGION_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Manual Region</label>
                    <input
                      name="manualRegion"
                      value={form.manualRegion}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Custom region"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Route From</label>
                    <input
                      name="routeFrom"
                      value={form.routeFrom}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. National Highway corridors"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Route To</label>
                    <input
                      name="routeTo"
                      value={form.routeTo}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. Chennai Port"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Price</label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Currency</label>
                    <input
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Pages</label>
                    <input
                      name="pages"
                      value={form.pages}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Sort Order</label>
                    <input
                      name="sortOrder"
                      type="number"
                      value={form.sortOrder}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Meta Title</label>
                    <input
                      name="metaTitle"
                      value={form.metaTitle}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      value={form.metaDescription}
                      onChange={handleChange}
                      className="form-control"
                      rows={2}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tags (one per line)</label>
                    <textarea
                      name="tagsText"
                      value={form.tagsText}
                      onChange={handleChange}
                      className="form-control"
                      rows={4}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Highlights (one per line)</label>
                    <textarea
                      name="highlightsText"
                      value={form.highlightsText}
                      onChange={handleChange}
                      className="form-control"
                      rows={4}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Sections / TOC (one per line)</label>
                    <textarea
                      name="sectionsText"
                      value={form.sectionsText}
                      onChange={handleChange}
                      className="form-control"
                      rows={5}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Buyers (one per line)</label>
                    <textarea
                      name="buyersText"
                      value={form.buyersText}
                      onChange={handleChange}
                      className="form-control"
                      rows={5}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Deliverables JSON</label>
                    <textarea
                      name="deliverablesText"
                      value={form.deliverablesText}
                      onChange={handleChange}
                      className="form-control font-monospace"
                      rows={6}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">FAQs JSON</label>
                    <textarea
                      name="faqsText"
                      value={form.faqsText}
                      onChange={handleChange}
                      className="form-control font-monospace"
                      rows={6}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Cover Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-control"
                    />
                    {uploadingImage && (
                      <div className="form-text text-primary">Uploading image...</div>
                    )}
                    {form.sampleImage && (
                      <div className="form-text text-success text-break">
                        {form.sampleImage}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Sample / Full PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="form-control"
                    />
                    {uploadingPdf && (
                      <div className="form-text text-primary">Uploading PDF...</div>
                    )}
                    {form.samplePdf && (
                      <div className="form-text text-success text-break">
                        {form.samplePdf}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                        className="form-check-input"
                        id="lbiIsFeatured"
                      />
                      <label className="form-check-label" htmlFor="lbiIsFeatured">
                        Featured
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="form-check-input"
                        id="lbiIsActive"
                      />
                      <label className="form-check-label" htmlFor="lbiIsActive">
                        Active / Published
                      </label>
                    </div>
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving || uploadingImage || uploadingPdf}
                    >
                      {saving
                        ? "Saving..."
                        : isEdit
                        ? "Update LBI Report"
                        : "Create LBI Report"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
