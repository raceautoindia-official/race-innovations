"use client";

import React, { useEffect, useMemo, useState } from "react";

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
  currency: "INR",
  formatText: "PDF + Excel",
  licenseText: "Single User",
  deliveryText: "Within 24 hours",
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

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reports", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setReports(json.data || []);
      }
    } catch (error) {
      setMessage("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const isEdit = useMemo(() => !!form.id, [form.id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function fillForm(report) {
    const reportCategory = report.category || "";
    const reportCountry = report.country || "";

    const isPresetCategory = CATEGORY_OPTIONS.includes(reportCategory);
    const isPresetCountry = COUNTRY_OPTIONS.includes(reportCountry);

    setForm({
      id: report.id,
      slug: report.slug || "",
      title: report.title || "",
      previewTitle: report.previewTitle || "",
      company: report.company || "RACE Innovations",
      description: report.description || "",
      region: report.region || "",
      country: isPresetCountry ? reportCountry : "",
      manualCountry: isPresetCountry ? "" : reportCountry,
      category: isPresetCategory ? reportCategory : "",
      manualCategory: isPresetCategory ? "" : reportCategory,
      period: report.period || "",
      badge: report.badge || "NEW",
      accent: report.accent || "#2f45bf",

      price: report.price || "",
      currency: report.currency || "INR",
      formatText: report.formatText || "PDF + Excel",
      licenseText: report.licenseText || "Single User",
      deliveryText: report.deliveryText || "Within 24 hours",
      pages: report.pages || "",
      geography: report.geography || "",
      forecastText: report.forecastText || "",
      publisher: report.publisher || "RACE Innovations",

      metaTitle: report.metaTitle || "",
      metaDescription: report.metaDescription || "",
      heroDescription: report.heroDescription || "",
      whyThisReport: report.whyThisReport || "",

      sampleTableTitle: report.sampleTableTitle || "",
      sampleTableNote: report.sampleTableNote || "",
      sampleImage: report.sampleImage || "",
      samplePdf: report.samplePdf || report.sample_pdf || "",

      tagsText: (report.tags || []).join("\n"),
      highlightsText: (report.highlights || []).join("\n"),
      sectionsText: (report.sections || []).join("\n"),
      buyersText: (report.buyers || []).join("\n"),
      deliverablesText: JSON.stringify(report.deliverables || [], null, 2),
      faqsText: JSON.stringify(report.faqs || [], null, 2),

      isFeatured: !!report.isFeatured,
      isActive: !!report.isActive,
      sortOrder: report.sortOrder || 0,
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
      const finalCategory = (form.manualCategory || "").trim() || form.category || "";
      const finalCountry = (form.manualCountry || "").trim() || form.country || "";

      const payload = {
        slug: form.slug,
        title: form.title,
        previewTitle: form.previewTitle,
        company: form.company,
        description: form.description,
        region: form.region,
        country: finalCountry,
        category: finalCategory,
        period: form.period,
        badge: form.badge,
        accent: form.accent,

        price: form.price || null,
        currency: form.currency || "INR",
        formatText: form.formatText,
        licenseText: form.licenseText,
        deliveryText: form.deliveryText,
        pages: form.pages || null,
        geography: form.geography,
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
        deliverables: JSON.parse(form.deliverablesText || "[]"),
        faqs: JSON.parse(form.faqsText || "[]"),

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

      setMessage(isEdit ? "Report updated successfully" : "Report created successfully");
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
                <div className="d-flex flex-column gap-2">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="border rounded p-3"
                      style={{ background: "#fff" }}
                    >
                      <div className="fw-bold">{report.title}</div>
                      <div className="text-muted small">{report.slug}</div>
                      {report.category ? (
                        <div className="small mt-1">
                          <span className="badge bg-light text-dark border me-1">
                            {report.category}
                          </span>
                        </div>
                      ) : null}
                      {report.country ? (
                        <div className="text-muted small mt-1">{report.country}</div>
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h1 className="h3 mb-3">{isEdit ? "Edit Report" : "Create Report"}</h1>

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