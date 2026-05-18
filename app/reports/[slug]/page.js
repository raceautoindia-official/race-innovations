import React from "react";
import { notFound } from "next/navigation";
import { getReportBySlug, getAllReports } from "../../../lib/report-service";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ReportDetailClientActions from "../../components/ReportDetailClientActions";
import ReportAIQuestionBox from "../../components/ReportAIQuestionBox";
import PageViewTracker from "../../components/PageViewTracker";

export async function generateMetadata({ params }) {
  const slug = decodeURIComponent(params.slug || "");
  const report = await getReportBySlug(slug);
  if (!report) return {};

  return {
    title: report.metaTitle || report.title,
    description: report.metaDescription || report.description,
    keywords: [
      "AUTOMOTIVE INDUSTRY REPORTS",
      "AUTOMOTIVE INDUSTRY FORECAST",
      "MARKET REPORTS",
      "LATEST EDITION",
      "AUTOMOBILE INDUSTRY",
      "AUTOMOTIVE MARKET",
      "AUTOMOTIVE TRENDS",
      "AUTOMOTIVE INDUSTRY TRENDS",
    ],
  };
}

const LBI_CATEGORY_FALLBACK = [
  "ODC Route Feasibility Study Report",
  "Route Survey Report",
  "Logistics Intelligence Report",
  "Corridor Feasibility Report",
  "Port Connectivity Report",
  "Heavy Cargo Movement Report",
  "Location Based Intelligence Report",
];

function isLbiReport(report) {
  const t = String(report?.reportType || "").toLowerCase();
  if (t === "lbi") return true;
  return LBI_CATEGORY_FALLBACK.includes(String(report?.category || ""));
}

function computeRelatedReports(currentReport, allReports) {
  if (!currentReport || !Array.isArray(allReports) || allReports.length === 0) {
    return [];
  }

  const currentId = currentReport.id;
  const currentSlug = currentReport.slug;
  const currentCategory = String(currentReport.category || "").toLowerCase();
  const currentCountry = String(
    currentReport.country || currentReport.geography || ""
  ).toLowerCase();
  const currentIsLbi = isLbiReport(currentReport);

  const activeOthers = allReports.filter((item) => {
    const isActive =
      item?.isActive === true ||
      item?.isActive === 1 ||
      item?.isActive === "1" ||
      item?.is_active === true ||
      item?.is_active === 1 ||
      item?.is_active === "1";

    const isNotCurrent =
      item.id !== currentId && item.slug !== currentSlug;

    // Only suggest reports of the same family — never cross LBI ↔ market.
    const sameFamily = isLbiReport(item) === currentIsLbi;

    return isActive && isNotCurrent && sameFamily;
  });

  const scored = activeOthers.map((item) => {
    let score = 0;

    const itemCategory = String(item.category || item.badge || "").toLowerCase();
    const itemCountry = String(
      item.country || item.geography || ""
    ).toLowerCase();

    if (currentCategory && itemCategory === currentCategory) score += 50;
    if (currentCountry && itemCountry === currentCountry) score += 35;

    if (
      item.isFeatured === true ||
      item.isFeatured === 1 ||
      item.is_featured === 1
    ) {
      score += 15;
    }

    score += Math.max(0, 10 - Number(item.sortOrder ?? item.sort_order ?? 0));

    return { item, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => entry.item);
}

export default async function ReportDetailPage({ params }) {
  const slug = decodeURIComponent(params.slug || "");
  const [report, allReports] = await Promise.all([
    getReportBySlug(slug),
    getAllReports().catch(() => []),
  ]);

  if (!report) notFound();

  const relatedReports = computeRelatedReports(report, allReports);
  const reportIsLbi = isLbiReport(report);
  const browseAllHref = reportIsLbi ? "/lbi-reports" : "/market-report";

  const imageSrc =
    report.sampleImage ||
    report.sample_image ||
    report.image ||
    report.coverImage ||
    report.cover_image ||
    "";

  const normalizedReport = {
    ...report,
    samplePdf: report.samplePdf || report.sample_pdf || "",
  };

  return (
    <>
      <PageViewTracker
        contentType="report"
        slug={report.slug}
        contentId={report.id}
      />
      <Navbar />
      <main
        className="main-content"
        style={{ backgroundColor: "#f5f5f7", minHeight: "100vh" }}
      >
        <section style={{ paddingTop: "42px", paddingBottom: "56px" }}>
          <div className="container-fluid px-4 px-md-5 px-lg-5">
            <div className="mb-4">
              <a
                href={browseAllHref}
                className="text-decoration-none"
                style={{ color: "#3346c7", fontSize: "1.1rem", fontWeight: 600 }}
              >
                ← Back to {reportIsLbi ? "LBI Reports" : "Reports"}
              </a>
            </div>

            <div className="row g-5 align-items-start">
              <div className="col-12 col-lg-8">
                <h1
                  className="fw-bold mb-4"
                  style={{
                    color: "#111111",
                    fontSize: "clamp(2.4rem, 4vw, 4.3rem)",
                    lineHeight: "1.08",
                  }}
                >
                  {report.title}
                </h1>

                {!!(report.heroDescription || report.description) && (
                  <p
                    style={{
                      color: "#6b7890",
                      fontSize: "clamp(1.1rem, 1.5vw, 1.7rem)",
                      lineHeight: "1.6",
                      maxWidth: "1100px",
                      marginBottom: "34px",
                    }}
                  >
                    {report.heroDescription || report.description}
                  </p>
                )}

                <div className="row g-4 mb-5">
                  {[
                    { label: "Format", value: report.formatText || "-", icon: "📄" },
                    { label: "Pages", value: report.pages || "-", icon: "📋" },
                    {
                      label: "Geography",
                      value: report.geography || report.region || "-",
                      icon: "◉",
                    },
                    {
                      label: "Forecast",
                      value: report.forecastText || report.period || "-",
                      icon: "◔",
                    },
                    { label: "Publisher", value: report.publisher || "-", icon: "▣" },
                  ].map((item, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4">
                      <div className="d-flex align-items-start gap-3">
                        <div
                          style={{
                            color: "#3346c7",
                            fontSize: "1.15rem",
                            marginTop: "4px",
                          }}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <div
                            style={{
                              color: "#6b7890",
                              fontSize: "1rem",
                              marginBottom: "2px",
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            className="fw-semibold"
                            style={{ color: "#1f2f63", fontSize: "1.15rem" }}
                          >
                            {item.value}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <ReportAIQuestionBox report={report} />

                {!!report.highlights?.length && (
                  <section className="mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: "#1f2f63" }}>
                      Key Highlights
                    </h2>
                    <div className="d-flex flex-column gap-3">
                      {report.highlights.map((item, index) => (
                        <div key={index} className="d-flex align-items-start gap-3">
                          <div
                            style={{
                              color: "#3346c7",
                              fontSize: "1.15rem",
                              marginTop: "2px",
                            }}
                          >
                            ⊚
                          </div>
                          <div
                            style={{
                              color: "#334765",
                              fontSize: "1.15rem",
                              lineHeight: "1.7",
                            }}
                          >
                            {item}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {!!report.whyThisReport && (
                  <section className="mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: "#1f2f63" }}>
                      Why This Report Matters
                    </h2>
                    <p
                      style={{
                        color: "#6b7890",
                        fontSize: "1.15rem",
                        lineHeight: "1.8",
                      }}
                    >
                      {report.whyThisReport}
                    </p>
                  </section>
                )}

                {!!report.sections?.length && (
                  <section className="mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: "#1f2f63" }}>
                      What&apos;s Inside the Report
                    </h2>
                    <div className="row g-3">
                      {report.sections.map((item, index) => (
                        <div key={index} className="col-12 col-lg-6">
                          <div
                            style={{
                              backgroundColor: "#f1f4f9",
                              borderRadius: "10px",
                              padding: "18px 20px",
                              minHeight: "72px",
                              display: "flex",
                              alignItems: "center",
                              gap: "18px",
                            }}
                          >
                            <span
                              style={{
                                color: "#3346c7",
                                fontWeight: 700,
                                fontSize: "1.5rem",
                                minWidth: "40px",
                              }}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span
                              style={{
                                color: "#1f2f63",
                                fontSize: "1.15rem",
                                lineHeight: "1.5",
                              }}
                            >
                              {item}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {!!report.sampleTable?.columns?.length && (
                  <section className="mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: "#1f2f63" }}>
                      Sample Data Preview
                    </h2>

                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #d9deea",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#f1f4f8",
                          color: "#3346c7",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          padding: "16px 24px",
                        }}
                      >
                        {report.sampleTableTitle || "Sample Data"}
                      </div>

                      <div className="table-responsive">
                        <table className="table mb-0 align-middle">
                          <thead>
                            <tr>
                              {report.sampleTable.columns.map((col, i) => (
                                <th
                                  key={i}
                                  style={{ padding: "18px 24px", color: "#1f2f63" }}
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(report.sampleTable.rows || []).map((row, ridx) => (
                              <tr key={ridx}>
                                {row.map((cell, cidx) => (
                                  <td
                                    key={cidx}
                                    style={{
                                      padding: "18px 24px",
                                      color: "#4b5d79",
                                    }}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {!!report.sampleTableNote && (
                        <div
                          style={{
                            padding: "12px 24px",
                            color: "#76849b",
                            fontSize: "0.95rem",
                          }}
                        >
                          {report.sampleTableNote}
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {!!report.buyers?.length && (
                  <section className="mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: "#1f2f63" }}>
                      Who Should Buy This Report
                    </h2>
                    <div className="row g-3">
                      {report.buyers.map((item, index) => (
                        <div key={index} className="col-12 col-md-6">
                          <div className="d-flex align-items-start gap-3">
                            <div
                              style={{
                                color: "#3346c7",
                                fontSize: "1.1rem",
                                marginTop: "4px",
                              }}
                            >
                              ◌
                            </div>
                            <div
                              style={{
                                color: "#334765",
                                fontSize: "1.15rem",
                                lineHeight: "1.6",
                              }}
                            >
                              {item}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {!!report.deliverables?.length && (
                  <section className="mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: "#1f2f63" }}>
                      Report Deliverables
                    </h2>
                    <div className="row g-4">
                      {report.deliverables.map((item, index) => (
                        <div key={index} className="col-12 col-md-6">
                          <div
                            style={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #d9deea",
                              borderRadius: "12px",
                              padding: "22px",
                              minHeight: "120px",
                            }}
                          >
                            <div className="d-flex align-items-start gap-3">
                              <div
                                style={{
                                  color: "#3346c7",
                                  fontSize: "1.5rem",
                                  marginTop: "2px",
                                }}
                              >
                                {item.icon || "•"}
                              </div>
                              <div>
                                <div
                                  className="fw-bold"
                                  style={{
                                    color: "#1f2f63",
                                    fontSize: "1.15rem",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {item.title}
                                </div>
                                <div
                                  style={{
                                    color: "#6b7890",
                                    fontSize: "1.05rem",
                                  }}
                                >
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {!!report.faqs?.length && (
                  <section className="mb-5">
                    <h2
                      className="fw-bold text-center mb-5"
                      style={{ color: "#1f2f63" }}
                    >
                      Frequently Asked Questions
                    </h2>

                    <div className="mx-auto" style={{ maxWidth: "980px" }}>
                      {report.faqs.map((item, index) => (
                        <div
                          key={index}
                          className="mb-3"
                          style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #d9deea",
                            borderRadius: "10px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              padding: "24px 28px",
                              color: "#1f2f63",
                              fontSize: "1.15rem",
                              fontWeight: 600,
                            }}
                          >
                            {item.question}
                          </div>
                          <div
                            style={{
                              padding: "0 28px 24px 28px",
                              color: "#6b7890",
                              fontSize: "1.05rem",
                              lineHeight: "1.8",
                            }}
                          >
                            {item.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {!!report.tags?.length && (
                  <section className="mt-5 pt-3">
                    <h2 className="fw-bold mb-3" style={{ color: "#1f2f63" }}>
                      Tags
                    </h2>
                    <div className="d-flex flex-wrap gap-2">
                      {report.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#eef2ff",
                            color: "#3346c7",
                            borderRadius: "8px",
                            padding: "8px 14px",
                            fontSize: "0.88rem",
                            fontWeight: 700,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="col-12 col-lg-4">
                <div style={{ position: "sticky", top: "130px" }}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #d9deea",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "0 10px 26px rgba(16, 33, 63, 0.04)",
                    }}
                  >
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={report.title || "Report image"}
                        style={{
                          width: "100%",
                          height: "320px",
                          objectFit: "cover",
                          display: "block",
                          backgroundColor: "#eef2f8",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "320px",
                          background:
                            "linear-gradient(180deg, #eef2fb 0%, #edf2fb 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "24px",
                          textAlign: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              width: "90px",
                              height: "6px",
                              borderRadius: "999px",
                              backgroundColor: "rgba(51,70,199,0.35)",
                              margin: "0 auto 20px auto",
                            }}
                          />
                          <div
                            style={{
                              color: "#1f2f63",
                              fontSize: "1.1rem",
                              fontWeight: 700,
                              lineHeight: "1.5",
                            }}
                          >
                            {report.previewTitle || report.title}
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ padding: "20px" }}>
                      <h3 className="fw-bold mb-3" style={{ color: "#1f2f63" }}>
                        {report.title}
                      </h3>

                      <div
                        style={{
                          color: "#7a869b",
                          fontSize: "0.82rem",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Starting From
                      </div>

                      {!!(report.currency || report.price) && (
                        <div
                          className="fw-bold mb-3"
                          style={{ color: "#1f2f63", fontSize: "2.3rem" }}
                        >
                          {report.currency || ""} {report.price || ""}
                        </div>
                      )}

                      <div className="mb-3">
                        {[
                          ["Format", report.formatText || "-"],
                          ["License", report.licenseText || "-"],
                          ["Delivery", report.deliveryText || "-"],
                        ].map((row, idx) => (
                          <div
                            key={idx}
                            className="d-flex justify-content-between align-items-center mb-1"
                          >
                            <span>{row[0]}</span>
                            <span className="fw-semibold" style={{ color: "#1f2f63" }}>
                              {row[1]}
                            </span>
                          </div>
                        ))}
                      </div>

                      <ReportDetailClientActions report={normalizedReport} />
                    </div>
                  </div>

                  {relatedReports.length > 0 && (
                    <div
                      style={{
                        marginTop: "20px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #d9deea",
                        borderRadius: "14px",
                        boxShadow: "0 10px 26px rgba(16, 33, 63, 0.04)",
                        padding: "18px",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3
                          className="fw-bold mb-0"
                          style={{
                            color: "#1f2f63",
                            fontSize: "1.05rem",
                          }}
                        >
                          Related Reports
                        </h3>
                        <a
                          href={browseAllHref}
                          className="text-decoration-none"
                          style={{
                            color: "#2f45bf",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                          }}
                        >
                          See all →
                        </a>
                      </div>

                      <div className="d-flex flex-column gap-2">
                        {relatedReports.map((rec) => {
                          const recImage =
                            rec.sampleImage ||
                            rec.sample_image ||
                            rec.image ||
                            rec.coverImage ||
                            rec.cover_image ||
                            "";

                          const recHref = rec.slug
                            ? `/reports/${rec.slug}`
                            : "#";

                          return (
                            <a
                              key={rec.id || rec.slug}
                              href={recHref}
                              className="text-decoration-none"
                              style={{
                                color: "inherit",
                                display: "flex",
                                gap: "12px",
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #eef1f7",
                                backgroundColor: "#fafbfe",
                                transition:
                                  "background-color 160ms ease, border-color 160ms ease",
                              }}
                            >
                              <div
                                style={{
                                  flex: "0 0 64px",
                                  width: "64px",
                                  height: "64px",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  backgroundColor: "#eef2fb",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {recImage ? (
                                  <img
                                    src={recImage}
                                    alt={rec.title || "Report image"}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      display: "block",
                                    }}
                                  />
                                ) : (
                                  <span
                                    style={{
                                      color: "#2f45bf",
                                      fontSize: "0.7rem",
                                      fontWeight: 800,
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    REPORT
                                  </span>
                                )}
                              </div>

                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div
                                  style={{
                                    color: "#091f4d",
                                    fontSize: "0.88rem",
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                    marginBottom: "4px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {rec.title}
                                </div>
                                <div
                                  className="d-flex flex-wrap align-items-center gap-2"
                                  style={{
                                    color: "#5b6f93",
                                    fontSize: "0.72rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {rec.category ? (
                                    <span
                                      style={{
                                        color: "#2f45bf",
                                        backgroundColor: "#eef2ff",
                                        borderRadius: "6px",
                                        padding: "2px 6px",
                                        fontSize: "0.68rem",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.4px",
                                      }}
                                    >
                                      {rec.category}
                                    </span>
                                  ) : null}
                                  {rec.country ? <span>◉ {rec.country}</span> : null}
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}