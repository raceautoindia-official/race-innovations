import React from "react";
import { notFound } from "next/navigation";
import { getReportBySlug } from "@/lib/report-service";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BuyNowModal from "@/app/components/BuyNowModal";

export async function generateMetadata({ params }) {
  const report = await getReportBySlug(params.slug);
  if (!report) return {};

  return {
    title: report.metaTitle || report.title,
    description: report.metaDescription || report.description,
  };
}

export default async function ReportDetailPage({ params }) {
  const report = await getReportBySlug(params.slug);
  if (!report) notFound();

  return (
    <>
      <Navbar />
      <main
        className="main-content"
        style={{ backgroundColor: "#f5f5f7", minHeight: "100vh" }}
      >
        <section style={{ paddingTop: "42px", paddingBottom: "56px" }}>
          <div className="container-fluid px-4 px-md-5 px-lg-5">
            <div
              className="mb-4"
              style={{ color: "#6b7890", fontSize: "1rem", fontWeight: 500 }}
            >
              <span>Home</span>
              <span className="mx-3">›</span>
              <span>Reports</span>
              <span className="mx-3">›</span>
              <span style={{ color: "#44536f" }}>{report.title}</span>
            </div>

            <div className="mb-4">
              <a
                href="/market-report"
                className="text-decoration-none"
                style={{ color: "#3346c7", fontSize: "1.1rem", fontWeight: 600 }}
              >
                ← Back to Reports
              </a>
            </div>

            <div className="row g-5 align-items-start">
              <div className="col-12 col-xl-8">
                {!!report.tags?.length && (
                  <div className="d-flex flex-wrap gap-2 mb-4">
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
                )}

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
                  <section>
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
              </div>

              <div className="col-12 col-xl-4">
                <div style={{ position: "sticky", top: "130px" }}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #d9deea",
                      borderRadius: "14px",
                      padding: "20px",
                      boxShadow: "0 10px 26px rgba(16, 33, 63, 0.04)",
                    }}
                  >
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

                    <div className="d-grid gap-2">
                      <BuyNowModal report={report} />
                      <button
                        className="btn"
                        style={{ backgroundColor: "#22345f", color: "#fff" }}
                      >
                       Buy Now
                      </button>
                      {/* <button className="btn btn-outline-secondary">
                        Request Customization
                      </button>
                      <button className="btn btn-outline-secondary">
                        Talk to Analyst
                      </button> */}
                    </div>
                  </div>
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