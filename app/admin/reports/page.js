"use client";

import React, { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/common/Pagination";

const CATEGORY_OPTIONS = [
  "Market Forecast Reports",
  "Flash Reports",
  "EV Intelligence",
  "Country Reports",
  "OEM Benchmarking",
  "Custom Research",
  "Aftermarket Reports",
  "Commercial Vehicle Reports",
  "Passenger Vehicle Reports",
  "Two Wheeler Reports",
  "Three Wheeler Reports",
  "Tractor Reports",
  "Construction Equipment Reports",
];

const COUNTRY_OPTIONS = [
  "India",
  "South Africa",
  "Australia",
  "Brazil",
  "Germany",
  "Japan",
  "Sweden",
  "Vietnam",
  "Chile",
  "Pakistan",
  "Colombia",
  "Peru",
  "Indonesia",
  "Thailand",
  "Malaysia",
  "Philippines",
  "Mexico",
  "USA",
  "UK",
  "Canada",
];

const emptyForm = {
  id: null,
  slug: "",
  title: "",
  previewTitle: "",
  company: "RACE Innovations",
  description: "",
  region: "",
  country: "",
  manualCountry: "",
  category: "",
  manualCategory: "",
  period: "",
  badge: "NEW",
  accent: "#2f45bf",

  price: "",
  currency: "USD",
  formatText: "PDF + Excel",
  licenseText: "Single User",
  deliveryText: "3 - 4 Weeks",
  pages: "",
  geography: "",
  forecastText: "",
  publisher: "RACE Innovations",

  metaTitle: "",
  metaDescription: "",
  heroDescription: "",
  whyThisReport: "",

  sampleTableTitle: "",
  sampleTableNote: "",
  sampleImage: "",
  samplePdf: "",

  tagsText: "",
  highlightsText: "",
  sectionsText: "",
  buyersText: "",
  deliverablesText: `[
  {
    "title": "PDF Report",
    "description": "280-page comprehensive analysis",
    "icon": "📄"
  }
]`,
  faqsText: `[
  {
    "question": "What format will I receive the report in?",
    "answer": "The report is delivered in PDF format along with an Excel data pack containing key tables and structured market data."
  }
]`,

  isFeatured: true,
  isActive: true,
  sortOrder: 0,
};

function textToArray(value) {
  return String(value || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function normalizeCompare(value) {
  return String(value || "").trim().toLowerCase();
}

function findPresetMatch(options, value) {
  const target = normalizeCompare(value);
  return options.find((item) => normalizeCompare(item) === target) || "";
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const REPORTS_PER_PAGE = 4;

  async function loadReports() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reports", { cache: "no-store" });
      const json = await res.json();

      if (json.success) {
        const data = Array.isArray(json.data) ? json.data : [];
        setReports(data);
        setCurrentPage(1);
      } else {
        setMessage(json.message || "Failed to load reports");
      }
    } catch {
      setMessage("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const isEdit = useMemo(() => !!form.id, [form.id]);

  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      const aSort = Number(a?.sortOrder ?? a?.sort_order ?? 0);
      const bSort = Number(b?.sortOrder ?? b?.sort_order ?? 0);

      if (aSort !== bSort) return aSort - bSort;
      return String(a?.title || "").localeCompare(String(b?.title || ""));
    });
  }, [reports]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedReports.length / REPORTS_PER_PAGE)
  );

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
    return sortedReports.slice(startIndex, startIndex + REPORTS_PER_PAGE);
  }, [sortedReports, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "category" && value) {
        next.manualCategory = "";
      }

      if (name === "country" && value) {
        next.manualCountry = "";
      }

      return next;
    });
  }

  function fillForm(report) {
    const rawCategory = String(
      report.category ??
        report.badge ??
        ""
    ).trim();

    const rawCountry = String(
      report.country ??
        report.geography ??
        ""
    ).trim();

    const matchedCategory = findPresetMatch(CATEGORY_OPTIONS, rawCategory);
    const matchedCountry = findPresetMatch(COUNTRY_OPTIONS, rawCountry);

    setForm({
      id: report.id ?? null,
      slug: report.slug || "",
      title: report.title || "",
      previewTitle: report.previewTitle || report.preview_title || "",
      company: report.company || "RACE Innovations",
      description: report.description || "",
      region: report.region || "",

      category: matchedCategory,
      manualCategory: matchedCategory ? "" : rawCategory,

      country: matchedCountry,
      manualCountry: matchedCountry ? "" : rawCountry,

      period: report.period || "",
      badge: report.badge || "NEW",
      accent: report.accent || "#2f45bf",

      price: report.price || "",
      currency: report.currency || "USD",
      formatText: report.formatText || report.format_text || "PDF + Excel",
      licenseText: report.licenseText || report.license_text || "Single User",
      deliveryText: report.deliveryText || report.delivery_text || "3 - 4 Weeks",
      pages: report.pages || "",
      geography: report.geography || rawCountry || "",
      forecastText: report.forecastText || report.forecast_text || "",
      publisher: report.publisher || "RACE Innovations",

      metaTitle: report.metaTitle || report.meta_title || "",
      metaDescription: report.metaDescription || report.meta_description || "",
      heroDescription: report.heroDescription || report.hero_description || "",
      whyThisReport: report.whyThisReport || report.why_this_report || "",

      sampleTableTitle:
        report.sampleTableTitle || report.sample_table_title || "",
      sampleTableNote: report.sampleTableNote || report.sample_table_note || "",
      sampleImage: report.sampleImage || report.sample_image || "",
      samplePdf: report.samplePdf || report.sample_pdf || "",

      tagsText: Array.isArray(report.tags) ? report.tags.join("\n") : "",
      highlightsText: Array.isArray(report.highlights)
        ? report.highlights.join("\n")
        : "",
      sectionsText: Array.isArray(report.sections)
        ? report.sections.join("\n")
        : "",
      buyersText: Array.isArray(report.buyers)
        ? report.buyers.join("\n")
        : "",
      deliverablesText: JSON.stringify(report.deliverables || [], null, 2),
      faqsText: JSON.stringify(report.faqs || [], null, 2),

      isFeatured:
        report.isFeatured === true ||
        report.isFeatured === 1 ||
        report.is_featured === 1,
      isActive:
        report.isActive === true ||
        report.isActive === 1 ||
        report.is_active === 1,
      sortOrder: report.sortOrder ?? report.sort_order ?? 0,
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setMessage("");
  }

  async function handleSampleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json?.url) {
        throw new Error(json?.error || "Image upload failed");
      }

      setForm((prev) => ({
        ...prev,
        sampleImage: json.url,
      }));
    } catch (error) {
      setMessage(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSamplePdfUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Please upload PDF only");
      return;
    }

    try {
      setUploadingPdf(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json?.url) {
        throw new Error(json?.error || "PDF upload failed");
      }

      setForm((prev) => ({
        ...prev,
        samplePdf: json.url,
      }));
    } catch (error) {
      setMessage(error.message || "Failed to upload PDF");
    } finally {
      setUploadingPdf(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const finalCategory =
        String(form.manualCategory || "").trim() ||
        String(form.category || "").trim();

      const finalCountry =
        String(form.manualCountry || "").trim() ||
        String(form.country || "").trim();

      if (!form.title.trim()) {
        throw new Error("Title is required");
      }

      if (!finalCategory) {
        throw new Error("Please select or enter a category");
      }

      if (!finalCountry) {
        throw new Error("Please select or enter a country");
      }

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

      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        previewTitle: form.previewTitle.trim(),
        company: form.company.trim(),
        description: form.description,
        region: form.region.trim(),
        country: finalCountry,
        category: finalCategory,
        period: form.period.trim(),
        badge: form.badge.trim(),
        accent: form.accent.trim(),

        price: form.price || null,
        currency: form.currency || "USD",
        formatText: form.formatText,
        licenseText: form.licenseText,
        deliveryText: form.deliveryText,
        pages: form.pages || null,
        geography: form.geography.trim() || finalCountry,
        forecastText: form.forecastText,
        publisher: form.publisher,

        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        heroDescription: form.heroDescription,
        whyThisReport: form.whyThisReport,

        sampleTableTitle: form.sampleTableTitle,
        sampleTableNote: form.sampleTableNote,
        sampleImage: form.sampleImage,
        samplePdf: form.samplePdf,

        tags: textToArray(form.tagsText),
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

      if (!json.success) {
        throw new Error(json.message || "Failed to save report");
      }

      setMessage(
        isEdit ? "Report updated successfully" : "Report created successfully"
      );

      await loadReports();

      if (!isEdit) {
        resetForm();
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this report?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Delete failed");
      }

      await loadReports();

      if (form.id === id) {
        resetForm();
      }
    } catch (error) {
      alert(error.message || "Failed to delete");
    }
  }

  return (
    <main className="container-fluid px-4 py-4">
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Reports</h2>
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

                          <div className="small mt-1">
                            <span className="badge bg-light text-dark border me-1">
                              Sort:{" "}
                              {Number(
                                report?.sortOrder ?? report?.sort_order ?? 0
                              )}
                            </span>
                          </div>

                          {report.category ? (
                            <div className="small mt-1">
                              <span className="badge bg-light text-dark border me-1">
                                {report.category}
                              </span>
                            </div>
                          ) : null}

                          {report.country ? (
                            <div className="text-muted small mt-1">
                              {report.country}
                            </div>
                          ) : null}

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
                      <div className="text-muted small">No reports found.</div>
                    )}
                  </div>

                  {sortedReports.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
                      <div className="small text-muted">
                        Showing {(currentPage - 1) * REPORTS_PER_PAGE + 1} to{" "}
                        {Math.min(
                          currentPage * REPORTS_PER_PAGE,
                          sortedReports.length
                        )}{" "}
                        of {sortedReports.length} reports
                      </div>

                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(p) => setCurrentPage(p)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h1 className="h3 mb-3">
                {isEdit ? "Edit Report" : "Create Report"}
              </h1>

              {message && <div className="alert alert-info py-2">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
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
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Preview Title</label>
                    <input
                      name="previewTitle"
                      value={form.previewTitle}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Company</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="form-control"
                      rows={3}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select category</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
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
                      placeholder="Type custom category if not in dropdown"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Country</label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select country</option>
                      {COUNTRY_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-8">
                    <label className="form-label">Manual Country</label>
                    <input
                      name="manualCountry"
                      value={form.manualCountry}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Type custom country if not in dropdown"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Region</label>
                    <input
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Period</label>
                    <input
                      name="period"
                      value={form.period}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Badge</label>
                    <input
                      name="badge"
                      value={form.badge}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Accent</label>
                    <input
                      name="accent"
                      value={form.accent}
                      onChange={handleChange}
                      className="form-control"
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

                  <div className="col-md-4">
                    <label className="form-label">Format</label>
                    <input
                      name="formatText"
                      value={form.formatText}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">License</label>
                    <input
                      name="licenseText"
                      value={form.licenseText}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Delivery</label>
                    <input
                      name="deliveryText"
                      value={form.deliveryText}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Geography</label>
                    <input
                      name="geography"
                      value={form.geography}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Forecast Text</label>
                    <input
                      name="forecastText"
                      value={form.forecastText}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Publisher</label>
                    <input
                      name="publisher"
                      value={form.publisher}
                      onChange={handleChange}
                      className="form-control"
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

                  <div className="col-12">
                    <label className="form-label">Why This Report</label>
                    <textarea
                      name="whyThisReport"
                      value={form.whyThisReport}
                      onChange={handleChange}
                      className="form-control"
                      rows={4}
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
                      rows={3}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tags (one per line)</label>
                    <textarea
                      name="tagsText"
                      value={form.tagsText}
                      onChange={handleChange}
                      className="form-control"
                      rows={5}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Highlights (one per line)</label>
                    <textarea
                      name="highlightsText"
                      value={form.highlightsText}
                      onChange={handleChange}
                      className="form-control"
                      rows={5}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Sections (one per line)</label>
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
                      rows={8}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">FAQs JSON</label>
                    <textarea
                      name="faqsText"
                      value={form.faqsText}
                      onChange={handleChange}
                      className="form-control font-monospace"
                      rows={8}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Sample Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSampleImageUpload}
                      className="form-control"
                    />
                    {uploadingImage && (
                      <div className="form-text text-primary">Uploading image...</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Sample PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleSamplePdfUpload}
                      className="form-control"
                    />
                    {uploadingPdf && (
                      <div className="form-text text-primary">Uploading PDF...</div>
                    )}
                    {form.samplePdf ? (
                      <div className="form-text text-success text-break">
                        PDF uploaded: {form.samplePdf}
                      </div>
                    ) : null}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Sample Table Note</label>
                    <input
                      name="sampleTableNote"
                      value={form.sampleTableNote}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Image Preview</label>
                    <div
                      className="border rounded d-flex align-items-center justify-content-center overflow-hidden"
                      style={{
                        minHeight: "220px",
                        background: "#f8fafc",
                      }}
                    >
                      {form.sampleImage ? (
                        <img
                          src={form.sampleImage}
                          alt="Sample preview"
                          style={{
                            width: "100%",
                            maxHeight: "260px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <span className="text-muted small">No image selected</span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Sort Order</label>
                    <input
                      name="sortOrder"
                      type="number"
                      value={form.sortOrder}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                        className="form-check-input"
                        id="isFeatured"
                      />
                      <label className="form-check-label" htmlFor="isFeatured">
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
                        id="isActive"
                      />
                      <label className="form-check-label" htmlFor="isActive">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving || uploadingImage || uploadingPdf}
                    >
                      {saving ? "Saving..." : isEdit ? "Update Report" : "Create Report"}
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