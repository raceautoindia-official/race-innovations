"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Pagination from "../components/common/Pagination";

const REPORTS_PER_PAGE = 6;

const LBI_CATEGORY_OPTIONS = [
  "ODC Route Feasibility Study Report",
  "Route Survey Report",
  "Logistics Intelligence Report",
  "Corridor Feasibility Report",
  "Port Connectivity Report",
  "Heavy Cargo Movement Report",
  "Location Based Intelligence Report",
];

function clean(value) {
  return String(value ?? "").trim();
}

function uniqueClean(values) {
  return Array.from(new Set(values.map(clean).filter(Boolean)));
}

export default function LbiReportsClient() {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [rawCategoryValues, setRawCategoryValues] = useState([]);
  const [rawRegionValues, setRawRegionValues] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await fetch("/api/admin/reports?type=lbi", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch LBI reports: ${res.status}`);
        }

        const json = await res.json();
        const raw = Array.isArray(json?.data) ? json.data : [];

        // Accept any truthy isActive variant (boolean true, 1, "1") and also
        // pass through rows where isActive is explicitly missing — only block
        // rows where isActive is explicitly false / 0.
        const activeOnly = raw.filter((item) => {
          if (item?.isActive === false) return false;
          if (item?.isActive === 0) return false;
          if (item?.isActive === "0") return false;
          return true;
        });

        if (!active) return;

        if (raw.length > 0 && activeOnly.length === 0) {
          console.warn(
            "[LBI] Reports loaded but all flagged inactive. Check isActive on the admin form.",
            raw
          );
        }

        setReports(activeOnly);
        setRawCategoryValues(
          uniqueClean(activeOnly.map((r) => r.category || ""))
        );
        setRawRegionValues(
          uniqueClean(activeOnly.map((r) => r.region || r.country || ""))
        );
      } catch (err) {
        console.error("LBI reports load error:", err);
        if (active) {
          setReports([]);
          setErrorMessage(err?.message || "Unable to load LBI reports.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...uniqueClean([...LBI_CATEGORY_OPTIONS, ...rawCategoryValues])],
    [rawCategoryValues]
  );

  const regions = useMemo(
    () => ["All", ...uniqueClean(rawRegionValues)],
    [rawRegionValues]
  );

  const filteredReports = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return reports.filter((r) => {
      const matchCategory =
        selectedCategory === "All" || r.category === selectedCategory;
      const matchRegion =
        selectedRegion === "All" ||
        r.region === selectedRegion ||
        r.country === selectedRegion;
      const matchSearch =
        !q ||
        String(r.title || "").toLowerCase().includes(q) ||
        String(r.description || "").toLowerCase().includes(q) ||
        String(r.region || "").toLowerCase().includes(q) ||
        String(r.country || "").toLowerCase().includes(q) ||
        String(r.category || "").toLowerCase().includes(q);
      return matchCategory && matchRegion && matchSearch;
    });
  }, [reports, searchText, selectedCategory, selectedRegion]);

  // Reset to the first page whenever the filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, selectedRegion]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / REPORTS_PER_PAGE)
  );

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * REPORTS_PER_PAGE;
    return filteredReports.slice(start, start + REPORTS_PER_PAGE);
  }, [filteredReports, currentPage]);

  return (
    <>
      <Navbar />
      <main className="main-content" style={{ backgroundColor: "#f7f9ff" }}>
        {/* Hero */}
        <section
          style={{
            background:
              "radial-gradient(circle at 12% 12%, rgba(47,69,191,0.10), transparent 36%), linear-gradient(180deg, #ffffff 0%, #eff3fb 100%)",
            paddingTop: "56px",
            paddingBottom: "44px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="container-fluid px-4 px-md-5 px-lg-5">
            <div className="row justify-content-center text-center">
              <div className="col-12 col-xl-10">
                <span
                  className="d-inline-block px-3 py-1 mb-3 rounded-pill"
                  style={{
                    background: "#eef2ff",
                    color: "#2f45bf",
                    border: "1px solid rgba(47,69,191,0.20)",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1.6px",
                    textTransform: "uppercase",
                  }}
                >
                  Location Based Intelligence
                </span>

                <h1
                  className="fw-bold"
                  style={{
                    color: "#0b1220",
                    fontSize: "clamp(2rem, 3.6vw, 3.4rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.6px",
                    marginBottom: "14px",
                  }}
                >
                  LBI Reports
                </h1>

                <p
                  style={{
                    maxWidth: "820px",
                    margin: "0 auto 28px",
                    color: "#475569",
                    fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                    lineHeight: 1.6,
                  }}
                >
                  Location Based Intelligence reports for ODC logistics, route
                  survey, route feasibility, port connectivity, corridor
                  intelligence and heavy cargo movement planning — by RACE
                  Innovations.
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a
                    href="#lbi-list"
                    className="btn px-4 py-3"
                    style={{
                      backgroundColor: "#2f45bf",
                      color: "#ffffff",
                      borderRadius: "16px",
                      fontWeight: 800,
                      minWidth: "180px",
                      border: "none",
                      boxShadow: "0 14px 30px rgba(47,69,191,0.22)",
                    }}
                  >
                    Explore Reports
                  </a>

                  <button
                    type="button"
                    className="btn px-4 py-3"
                    onClick={() =>
                      window.open(
                        "https://meetings.raceinnovations.in/login",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#2f45bf",
                      border: "1px solid rgba(47,69,191,0.25)",
                      borderRadius: "16px",
                      fontWeight: 800,
                      minWidth: "180px",
                    }}
                  >
                    Talk to Expert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Listing */}
        <section
          id="lbi-list"
          style={{ paddingTop: "44px", paddingBottom: "64px" }}
        >
          <div className="container-fluid px-4 px-md-5 px-lg-5">
            {/* Filters */}
            <div
              className="row justify-content-center mb-4"
              style={{ maxWidth: "1120px", margin: "0 auto" }}
            >
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search LBI reports..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    height: "50px",
                    borderRadius: "999px",
                    border: "1.5px solid #cbd5e1",
                    paddingLeft: "20px",
                    fontSize: "15px",
                  }}
                />
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    height: "50px",
                    borderRadius: "999px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1f2a44",
                    paddingLeft: "16px",
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "All" ? "All Categories" : c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  style={{
                    height: "50px",
                    borderRadius: "999px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1f2a44",
                    paddingLeft: "16px",
                  }}
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r === "All" ? "All Regions" : r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4"
              style={{ maxWidth: "1120px", margin: "0 auto" }}
            >
              <div style={{ color: "#64748b", fontSize: "14px", fontWeight: 600 }}>
                {loading
                  ? "Loading LBI reports..."
                  : `${filteredReports.length} report${
                      filteredReports.length === 1 ? "" : "s"
                    } found`}
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setSearchText("");
                  setSelectedCategory("All");
                  setSelectedRegion("All");
                }}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#2f45bf",
                  border: "1px solid rgba(47,69,191,0.22)",
                  borderRadius: "12px",
                  fontWeight: 700,
                  padding: "8px 16px",
                  fontSize: "13px",
                }}
              >
                Reset Filters
              </button>
            </div>

            {/* Cards */}
            {errorMessage ? (
              <div
                className="text-center mx-auto"
                style={{
                  maxWidth: "640px",
                  padding: "32px 20px",
                  background: "#fff7f7",
                  border: "1px solid #f0d2d2",
                  color: "#a94442",
                  borderRadius: "20px",
                  fontWeight: 600,
                }}
              >
                {errorMessage}
              </div>
            ) : loading ? (
              <div className="row g-4 justify-content-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="col-12 col-md-6 col-xl-4">
                    <div
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "20px",
                        height: "420px",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : filteredReports.length === 0 ? (
              <div
                className="text-center mx-auto"
                style={{
                  maxWidth: "640px",
                  padding: "48px 24px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "20px",
                }}
              >
                <h3
                  style={{
                    color: "#1f2a44",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    marginBottom: "8px",
                  }}
                >
                  No LBI reports available right now.
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
                  Please check back soon or contact our team for custom LBI
                  research.
                </p>
              </div>
            ) : (
              <>
                <div className="row g-4 justify-content-center">
                {paginatedReports.map((report) => {
                  const slug = report?.slug || "";
                  const href = slug ? `/lbi-reports/${slug}` : "#";
                  const cover =
                    report?.sampleImage ||
                    report?.image ||
                    report?.coverImage ||
                    "";

                  return (
                    <div key={report.id || slug} className="col-12 col-md-6 col-xl-4">
                      <article
                        className="lbi-card"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "20px",
                          overflow: "hidden",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 200ms ease, box-shadow 200ms ease",
                          boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "16 / 9",
                            background:
                              "linear-gradient(135deg, #eef2fb 0%, #dbe4f6 100%)",
                            overflow: "hidden",
                          }}
                        >
                          {cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cover}
                              alt={report.title || "LBI report"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : null}

                          {report.category ? (
                            <span
                              style={{
                                position: "absolute",
                                top: "12px",
                                left: "12px",
                                background: "rgba(47, 69, 191, 0.92)",
                                color: "#ffffff",
                                padding: "5px 11px",
                                borderRadius: "999px",
                                fontSize: "10px",
                                fontWeight: 800,
                                letterSpacing: "0.4px",
                                textTransform: "uppercase",
                              }}
                            >
                              {report.category}
                            </span>
                          ) : null}
                        </div>

                        <div
                          style={{
                            padding: "20px 22px 22px",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: "#091f4d",
                              lineHeight: 1.35,
                              margin: "0 0 10px",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {report.title}
                          </h3>

                          <p
                            style={{
                              color: "#5f7295",
                              fontSize: "13.5px",
                              lineHeight: 1.6,
                              margin: "0 0 14px",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              flex: 1,
                            }}
                          >
                            {report.description ||
                              report.previewTitle ||
                              "Location Based Intelligence report from RACE Innovations."}
                          </p>

                          <div
                            className="d-flex flex-wrap align-items-center gap-3 mb-3"
                            style={{
                              color: "#5b6f93",
                              fontSize: "12.5px",
                              fontWeight: 600,
                            }}
                          >
                            {report.region ? <span>◉ {report.region}</span> : null}
                            {report.country && report.country !== report.region ? (
                              <span>◉ {report.country}</span>
                            ) : null}
                            {report.price ? (
                              <span style={{ color: "#2f45bf", fontWeight: 800 }}>
                                {report.currency || ""} {report.price}
                              </span>
                            ) : null}
                          </div>

                          <div style={{ marginTop: "auto" }}>
                            <a
                              href={href}
                              className="btn w-100"
                              style={{
                                background: "#2f45bf",
                                color: "#ffffff",
                                borderRadius: "12px",
                                fontWeight: 800,
                                padding: "11px 14px",
                                fontSize: "14px",
                                border: "none",
                              }}
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-5">
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
        </section>

        <style jsx>{`
          .lbi-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 18px 36px rgba(15, 23, 42, 0.10);
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
