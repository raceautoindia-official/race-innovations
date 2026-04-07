"use client";

import React, { useEffect, useMemo, useState } from "react";

export default function HomePage() {
  const trustedItems = [
    "Global OEMs",
    "Tier-1 Suppliers",
    "Strategy Consultants",
    "Investment Firms",
    "Government Bodies",
    "Research Institutions",
  ];

  const stats = [
    { value: "50+", label: "Countries Covered" },
    { value: "200+", label: "Reports Published" },
    { value: "500+", label: "Enterprise Clients" },
    { value: "15+", label: "Years of Expertise" },
  ];

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        setLoadingReports(true);
        setReportsError("");

        const res = await fetch("/api/admin/reports", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Failed to fetch reports: ${res.status}`);
        }

        const json = await res.json();
        const rawReports = Array.isArray(json?.data) ? json.data : [];

        const normalized = rawReports
          .filter((item) => {
            return (
              item?.isActive === true ||
              item?.isActive === 1 ||
              item?.isActive === "1" ||
              item?.is_active === true ||
              item?.is_active === 1 ||
              item?.is_active === "1"
            );
          })
          .map((item, index) => ({
            id: item.id ?? index + 1,
            slug: item.slug || "",
            title: item.title || "Untitled Report",
            previewTitle: item.previewTitle || item.preview_title || "",
            company: item.company || "",
            description: item.description || "",
            summary:
              item.previewTitle ||
              item.preview_title ||
              item.heroDescription ||
              item.hero_description ||
              item.metaDescription ||
              item.meta_description ||
              item.description ||
              "No summary available for this report.",
            region: item.region || "Other",
            geography: item.geography || "",
            period: item.period || "",
            badge: item.badge || "General",
            accent: item.accent || "#2f45bf",
            tags: Array.isArray(item.tags) ? item.tags : [],
          }));

        if (active) {
          setReports(normalized);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
        if (active) {
          setReports([]);
          setReportsError(error?.message || "Unable to load reports right now.");
        }
      } finally {
        if (active) {
          setLoadingReports(false);
        }
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const values = reports
      .map((r) => String(r.badge || "").trim())
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [reports]);

  const regions = useMemo(() => {
    const values = reports
      .map((r) => String(r.region || "").trim())
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [reports]);

  const filteredReports = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return reports.filter((report) => {
      const matchCategory =
        selectedCategory === "All" || report.badge === selectedCategory;

      const matchRegion =
        selectedRegion === "All" || report.region === selectedRegion;

      const matchSearch =
        !q ||
        String(report.title || "").toLowerCase().includes(q) ||
        String(report.previewTitle || "").toLowerCase().includes(q) ||
        String(report.company || "").toLowerCase().includes(q) ||
        String(report.geography || "").toLowerCase().includes(q) ||
        String(report.region || "").toLowerCase().includes(q) ||
        String(report.badge || "").toLowerCase().includes(q) ||
        String(report.description || "").toLowerCase().includes(q);

      return matchCategory && matchRegion && matchSearch;
    });
  }, [reports, selectedCategory, selectedRegion, searchText]);

  return (
    <>
      <section className="min-vh-100 d-flex align-items-center">
        <div className="container-fluid px-4 px-md-5 px-lg-5">
          <div className="row">
            <div className="col-12 col-lg-8 col-xl-7 ps-lg-5">
              <span
                className="d-inline-block px-3 py-2 mb-4 rounded-pill"
                style={{
                  border: "1px solid rgba(47, 69, 191, 0.25)",
                  color: "#2f45bf",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  backgroundColor: "#ffffff",
                }}
              >
                AUTOMOTIVE INTELLIGENCE
              </span>

              <h1
                className="fw-bold"
                style={{
                  fontSize: "clamp(2.5rem, 4.8vw, 4.6rem)",
                  lineHeight: "1.02",
                  letterSpacing: "-1px",
                  color: "#111111",
                  marginBottom: "24px",
                }}
              >
                Premium Automotive
                <br />
                <span style={{ color: "#2f45bf" }}>
                  Market Intelligence &amp;
                </span>
                <br />
                Forecast Reports
              </h1>

              <p
                style={{
                  maxWidth: "720px",
                  fontSize: "clamp(1rem, 1.8vw, 1.5rem)",
                  lineHeight: "1.5",
                  color: "#5f6b85",
                  fontWeight: 400,
                  marginBottom: "36px",
                }}
              >
                Country-wise, segment-wise, and OEM-level automotive insights
                for strategic decision-making
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <a
                  href="#reports"
                  className="btn px-4 py-3"
                  style={{
                    backgroundColor: "#2f45bf",
                    color: "#ffffff",
                    borderRadius: "22px",
                    fontWeight: 700,
                    minWidth: "190px",
                    border: "none",
                    boxShadow: "0 8px 20px rgba(47, 69, 191, 0.18)",
                  }}
                >
                  Explore Reports
                </a>

                <a
                  href="#contact"
                  className="btn px-4 py-3"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#2f45bf",
                    border: "1px solid rgba(47, 69, 191, 0.25)",
                    borderRadius: "22px",
                    fontWeight: 700,
                    minWidth: "190px",
                  }}
                >
                  Talk To Our Sales Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          borderTop: "1px solid #dde3f0",
          borderBottom: "1px solid #dde3f0",
        }}
      >
        <div className="container-fluid px-4 px-md-5 px-lg-5">
          <div
            className="text-center"
            style={{
              paddingTop: "42px",
              paddingBottom: "34px",
              borderBottom: "1px solid #dde3f0",
            }}
          >
            <div
              style={{
                color: "#6a7690",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "26px",
              }}
            >
              Trusted by leading organizations
            </div>

            <div className="row justify-content-center g-3">
              {trustedItems.map((item, index) => (
                <div key={index} className="col-6 col-md-auto">
                  <div
                    style={{
                      color: "#7b869d",
                      fontSize: "17px",
                      fontWeight: 500,
                      padding: "8px 18px",
                      borderRadius: "999px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e3e8f4",
                    }}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: "56px", paddingBottom: "56px" }}>
            <div className="row text-center justify-content-center">
              {stats.map((stat, index) => (
                <div key={index} className="col-6 col-lg-3 mb-4 mb-lg-0">
                  <div
                    style={{
                      color: "#2f45bf",
                      fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                      fontWeight: 700,
                      lineHeight: "1",
                      marginBottom: "10px",
                    }}
                  >
                    {stat.value}
                  </div>

                  <div
                    style={{
                      color: "#5f6b85",
                      fontSize: "18px",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="reports"
        style={{
          paddingTop: "90px",
          paddingBottom: "90px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="container-fluid px-4 px-md-5 px-lg-5">
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-xl-10 text-center">
              <span
                className="d-inline-block px-3 py-2 mb-3 rounded-pill"
                style={{
                  border: "1px solid rgba(47, 69, 191, 0.16)",
                  color: "#2f45bf",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  backgroundColor: "#f7f9ff",
                }}
              >
                REPORT LIBRARY
              </span>

              <h2
                style={{
                  fontSize: "clamp(2rem, 3vw, 3rem)",
                  fontWeight: 700,
                  color: "#111111",
                  marginBottom: "16px",
                }}
              >
                Search Reports by Category, Country &amp; Region
              </h2>

              <p
                style={{
                  maxWidth: "760px",
                  margin: "0 auto",
                  color: "#647089",
                  fontSize: "18px",
                  lineHeight: "1.6",
                }}
              >
                Dynamically loaded reports with live category filter, region
                filter, and country search.
              </p>
            </div>
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-12 col-xl-11">
              <div
                className="row g-3 align-items-center"
                style={{
                  backgroundColor: "#f8faff",
                  border: "1px solid #e3e8f4",
                  borderRadius: "24px",
                  padding: "22px",
                  boxShadow: "0 10px 24px rgba(20, 30, 70, 0.04)",
                }}
              >
                <div className="col-12 col-md-6 col-lg-4">
                  <label
                    className="d-block mb-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#41506b",
                    }}
                  >
                    Category
                  </label>
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      height: "54px",
                      borderRadius: "16px",
                      border: "1px solid #d7dfef",
                      color: "#24324a",
                      fontWeight: 500,
                      boxShadow: "none",
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label
                    className="d-block mb-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#41506b",
                    }}
                  >
                    Region
                  </label>
                  <select
                    className="form-select"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    style={{
                      height: "54px",
                      borderRadius: "16px",
                      border: "1px solid #d7dfef",
                      color: "#24324a",
                      fontWeight: 500,
                      boxShadow: "none",
                    }}
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-lg-4">
                  <label
                    className="d-block mb-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#41506b",
                    }}
                  >
                    Country / Search
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by country, title, region, category..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                      height: "54px",
                      borderRadius: "16px",
                      border: "1px solid #d7dfef",
                      color: "#24324a",
                      fontWeight: 500,
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="col-12">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-2">
                    <div
                      style={{
                        color: "#5f6b85",
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
                    >
                      {loadingReports
                        ? "Loading reports..."
                        : `${filteredReports.length} report${
                            filteredReports.length !== 1 ? "s" : ""
                          } found`}
                    </div>

                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedRegion("All");
                        setSearchText("");
                      }}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2f45bf",
                        border: "1px solid rgba(47, 69, 191, 0.22)",
                        borderRadius: "14px",
                        fontWeight: 700,
                        padding: "10px 18px",
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {reportsError ? (
            <div className="row justify-content-center">
              <div className="col-12 col-xl-8">
                <div
                  className="text-center"
                  style={{
                    border: "1px solid #f0d2d2",
                    borderRadius: "24px",
                    padding: "36px 24px",
                    backgroundColor: "#fff7f7",
                    color: "#a94442",
                    fontWeight: 600,
                  }}
                >
                  {reportsError}
                </div>
              </div>
            </div>
          ) : loadingReports ? (
            <div className="row g-4 justify-content-center">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="col-12 col-md-6 col-xl-4">
                  <div
                    style={{
                      borderRadius: "26px",
                      overflow: "hidden",
                      border: "1px solid #dfe6f2",
                      backgroundColor: "#ffffff",
                      minHeight: "650px",
                    }}
                  >
                    <div
                      style={{
                        height: "265px",
                        backgroundColor: "#eef2fb",
                      }}
                    />
                    <div style={{ padding: "30px" }}>
                      <div
                        style={{
                          height: "28px",
                          width: "60%",
                          backgroundColor: "#eef2fb",
                          borderRadius: "10px",
                          marginBottom: "16px",
                        }}
                      />
                      <div
                        style={{
                          height: "18px",
                          width: "90%",
                          backgroundColor: "#eef2fb",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                      />
                      <div
                        style={{
                          height: "18px",
                          width: "85%",
                          backgroundColor: "#eef2fb",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                      />
                      <div
                        style={{
                          height: "18px",
                          width: "70%",
                          backgroundColor: "#eef2fb",
                          borderRadius: "10px",
                          marginBottom: "30px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="row g-4 justify-content-center">
              {filteredReports.map((report) => (
                <div key={report.id} className="col-12 col-md-6 col-xl-4">
                  <div
                    style={{
                      borderRadius: "26px",
                      overflow: "hidden",
                      border: "1px solid #dfe6f2",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 12px 34px rgba(20, 30, 70, 0.05)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        background:
                          "linear-gradient(180deg, #eef2fb 0%, #edf2fb 100%)",
                        minHeight: "265px",
                        padding: "28px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "18px",
                          right: "18px",
                          backgroundColor: "#2f45bf",
                          color: "#ffffff",
                          borderRadius: "14px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: 800,
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                        }}
                      >
                        {report.badge || "New"}
                      </span>

                      <div style={{ maxWidth: "90%" }}>
                        <div
                          style={{
                            width: "106px",
                            height: "6px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(47,69,191,0.45)",
                            margin: "0 auto 26px auto",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "20px",
                            lineHeight: "1.45",
                            fontWeight: 700,
                            color: "#0e2b5c",
                            marginBottom: "12px",
                          }}
                        >
                          {report.previewTitle || report.title}
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            color: "#637391",
                            fontWeight: 600,
                          }}
                        >
                          {report.company || "RACE Innovations"}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "30px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "21px",
                          lineHeight: "1.4",
                          fontWeight: 800,
                          color: "#091f4d",
                          marginBottom: "16px",
                        }}
                      >
                        {report.title}
                      </h3>

                      <p
                        style={{
                          color: "#5f7295",
                          fontSize: "16px",
                          lineHeight: "1.9",
                          marginBottom: "26px",
                          minHeight: "140px",
                        }}
                      >
                        {report.description || report.summary}
                      </p>

                      <div
                        className="d-flex flex-wrap align-items-center gap-3 mb-3"
                        style={{
                          color: "#5b6f93",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        <span>◉ {report.geography || "Country not specified"}</span>
                        <span>◷ {report.period || "Period not specified"}</span>
                      </div>

                      {report.tags?.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-4">
                          {report.tags.slice(0, 5).map((tag, idx) => (
                            <span
                              key={idx}
                              style={{
                                display: "inline-block",
                                padding: "9px 14px",
                                borderRadius: "12px",
                                backgroundColor: "#eef2f7",
                                color: "#223e6c",
                                fontSize: "13px",
                                fontWeight: 800,
                                letterSpacing: "0.3px",
                                textTransform: "uppercase",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: "auto" }}>
                        <a
                          href={report.slug ? `/reports/${report.slug}` : "#"}
                          style={{
                            color: "#2f45bf",
                            fontWeight: 800,
                            fontSize: "18px",
                            textDecoration: "none",
                          }}
                        >
                          View Report →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-12 col-xl-8">
                <div
                  className="text-center"
                  style={{
                    border: "1px solid #e3e8f4",
                    borderRadius: "24px",
                    padding: "48px 24px",
                    backgroundColor: "#f8faff",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "26px",
                      fontWeight: 700,
                      color: "#111111",
                      marginBottom: "12px",
                    }}
                  >
                    No reports found
                  </h3>
                  <p
                    style={{
                      color: "#66738c",
                      fontSize: "17px",
                      marginBottom: 0,
                    }}
                  >
                    Try changing the category, region, or search text.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        id="contact"
        style={{
          paddingTop: "80px",
          paddingBottom: "80px",
          backgroundColor: "#f8faff",
          borderTop: "1px solid #e3e8f4",
        }}
      >
        <div className="container-fluid px-4 px-md-5 px-lg-5 text-center">
          <h2
            style={{
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 700,
              color: "#111111",
              marginBottom: "16px",
            }}
          >
            Need a custom report package?
          </h2>
          <p
            style={{
              color: "#66738c",
              fontSize: "18px",
              maxWidth: "760px",
              margin: "0 auto 28px auto",
              lineHeight: "1.6",
            }}
          >
            Speak with our team for tailored automotive intelligence, country
            coverage, segment studies, and enterprise subscriptions.
          </p>

          <a
            href="mailto:sales@example.com"
            className="btn px-4 py-3"
            style={{
              backgroundColor: "#2f45bf",
              color: "#ffffff",
              borderRadius: "20px",
              fontWeight: 700,
              minWidth: "200px",
              border: "none",
              boxShadow: "0 8px 20px rgba(47, 69, 191, 0.18)",
            }}
          >
            Contact Sales
          </a>
        </div>
      </section>
    </>
  );
}