"use client";
import React from "react";

export default function FeaturedReportsPage() {
  const reports = [
    {
      id: 1,
      title: "Indian Automotive Market 2025 & Forecast Report",
      previewTitle: "Indian Automotive Market 2025 & Forecast Report",
      company: "RACE Innovations",
      description:
        "Comprehensive analysis of India's automotive landscape including passenger vehicles, commercial vehicles, and emerging mobility trends.",
      region: "India",
      period: "2025–2030",
      badge: "NEW",
      tags: ["MARKET FORECAST", "EV"],
      accent: "#2f45bf",
    },
    {
      id: 2,
      title: "China Electric Vehicle Market Outlook 2025–2032",
      previewTitle: "China Electric Vehicle Market Outlook 2025–2032",
      company: "RACE Innovations",
      description:
        "In-depth analysis of China's EV ecosystem including NEV penetration, battery supply chain, OEM strategies, and market outlook.",
      region: "China",
      period: "2025–2032",
      badge: "NEW",
      tags: ["EV INTELLIGENCE", "EV"],
      accent: "#2f45bf",
    },
    {
      id: 3,
      title: "European Passenger Vehicle Market Intelligence 2025",
      previewTitle: "European Passenger Vehicle Market Intelligence 2025",
      company: "RACE Innovations",
      description:
        "Pan-European passenger vehicle market analysis covering EU27 + UK with brand-level volumes, segment insights, and forecast trends.",
      region: "Europe",
      period: "2025–2030",
      badge: "NEW",
      tags: ["MARKET INTELLIGENCE", "EV"],
      accent: "#2f45bf",
    },
  ];

  return (
    <main style={{  minHeight: "100vh" }}>
      <section className="py-5 py-lg-6">
        <div className="container-fluid px-4 px-md-5 px-lg-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 mb-lg-5 gap-3">
            <div>
              <h1
                className="fw-bold mb-2"
                style={{
                  color: "#111827",
                  fontSize: "clamp(2rem, 3vw, 3.25rem)",
                  lineHeight: "1.1",
                  letterSpacing: "-0.5px",
                }}
              >
                Featured Reports
              </h1>
              <p
                className="mb-0"
                style={{
                  color: "#66748f",
                  fontSize: "clamp(1rem, 1.3vw, 1.35rem)",
                  lineHeight: "1.6",
                }}
              >
                Our latest automotive market intelligence publications
              </p>
            </div>

            <a
              href="/reports"
              className="text-decoration-none fw-semibold"
              style={{
                color: "#2f45bf",
                fontSize: "1.1rem",
              }}
            >
              View All <span style={{ fontSize: "1.15rem" }}>→</span>
            </a>
          </div>

          <div className="row g-4">
            {reports.map((report) => (
              <div key={report.id} className="col-12 col-md-6 col-xl-4">
                <div
                  className="h-100 d-flex flex-column"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e1e7f0",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(17, 24, 39, 0.04)",
                  }}
                >
                  {/* Top preview area */}
                  <div
                    style={{
                      background:
                        "linear-gradient(180deg, #f7f9ff 0%, #eef3ff 100%)",
                      minHeight: "220px",
                      position: "relative",
                      padding: "28px 26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        backgroundColor: "#2f45bf",
                        color: "#ffffff",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        padding: "6px 12px",
                        lineHeight: 1,
                        letterSpacing: "0.4px",
                      }}
                    >
                      {report.badge}
                    </span>

                    <div>
                      <div
                        style={{
                          width: "82px",
                          height: "5px",
                          borderRadius: "999px",
                          backgroundColor: "rgba(47, 69, 191, 0.45)",
                          margin: "0 auto 18px",
                        }}
                      />
                      <h3
                        className="fw-semibold mb-2"
                        style={{
                          color: "#1e293b",
                          fontSize: "1.25rem",
                          lineHeight: "1.45",
                        }}
                      >
                        {report.previewTitle}
                      </h3>
                      <div
                        style={{
                          color: "#6b7891",
                          fontSize: "1rem",
                          fontWeight: 500,
                        }}
                      >
                        {report.company}
                      </div>
                    </div>
                  </div>

                  {/* Bottom content area */}
                  <div className="d-flex flex-column flex-grow-1 p-4">
                    <h2
                      className="fw-bold mb-3"
                      style={{
                        color: "#0f172a",
                        fontSize: "1.18rem",
                        lineHeight: "1.45",
                      }}
                    >
                      {report.title}
                    </h2>

                    <p
                      className="mb-3"
                      style={{
                        color: "#627089",
                        fontSize: "1rem",
                        lineHeight: "1.75",
                        minHeight: "84px",
                      }}
                    >
                      {report.description}
                    </p>

                    <div className="d-flex flex-wrap gap-3 mb-3">
                      <div
                        className="d-flex align-items-center"
                        style={{ color: "#6c7890", fontSize: "0.98rem" }}
                      >
                        <span className="me-2">◉</span>
                        <span>{report.region}</span>
                      </div>

                      <div
                        className="d-flex align-items-center"
                        style={{ color: "#6c7890", fontSize: "0.98rem" }}
                      >
                        <span className="me-2">◷</span>
                        <span>{report.period}</span>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {report.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor:
                              tag === "EV" ? "rgba(47, 69, 191, 0.10)" : "#eef2f7",
                            color: tag === "EV" ? "#2f45bf" : "#334155",
                            border: "1px solid #e4eaf2",
                            borderRadius: "8px",
                            padding: "6px 10px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <a
                        href={`/reports/${report.id}`}
                        className="text-decoration-none fw-semibold"
                        style={{
                          color: "#2f45bf",
                          fontSize: "1.12rem",
                        }}
                      >
                        View Report <span style={{ fontSize: "1.15rem" }}>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}