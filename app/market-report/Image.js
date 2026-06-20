"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Pagination from "../components/common/Pagination";
import ReportsCertifications from "../components/ReportsCertifications";

const CATEGORY_OPTIONS = [
  "EV Intelligence",
  "Commercial Vehicle Reports",
  "Passenger Vehicle Reports",
  "Two Wheeler Reports",
  "Three Wheeler Reports",
  "Construction Equipment Reports",
];

// Categories that should never appear in the filter, even if older reports in
// the DB are still tagged with them (requested removal — see site corrections).
const REMOVED_CATEGORIES = new Set([
  "Market Forecast Reports",
  "Flash Reports",
  "Country Reports",
  "OEM Benchmarking",
  "Custom Research",
  "Aftermarket Reports",
  "Tractor Reports",
]);

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

function cleanValue(value) {
  return String(value ?? "").trim();
}

function uniqueClean(values) {
  return Array.from(new Set(values.map((v) => cleanValue(v)).filter(Boolean)));
}

export default function HomePage() {
  const [reports, setReports] = useState([]);
  const [rawCategoryValues, setRawCategoryValues] = useState([]);
  const [rawCountryValues, setRawCountryValues] = useState([]);
  const [rawRegionValues, setRawRegionValues] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 6;

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState({
    type: "",
    message: "",
  });

  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    company_name: "",
    email: "",
    designation: "",
    phone: "",
    location: "",
    area_of_interest: "",
    preferred_contact: "",
    message: "",
  });

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

        const allCategoriesFromDb = uniqueClean(
          rawReports.map((item) => item?.category || "")
        );

        const allCountriesFromDb = uniqueClean(
          rawReports.map((item) => item?.country || "")
        );

        const allRegionsFromDb = uniqueClean(
          rawReports.map((item) => item?.region || "")
        );

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
          .map((item, index) => {
            const category = cleanValue(item.category || item.badge || "General");
            const country = cleanValue(item.country || item.geography || "");

            return {
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
              country,
              category,
              geography: country,
              badge: category,
              period: item.period || "",
              accent: item.accent || "#2f45bf",
              sortOrder: Number(item.sortOrder ?? item.sort_order ?? 0),
              tags: Array.isArray(item.tags)
                ? item.tags
                : Array.isArray(item.tags_json)
                ? item.tags_json
                : [],
              sampleImage:
                item.sampleImage ||
                item.sample_image ||
                item.image ||
                item.coverImage ||
                item.cover_image ||
                "",
            };
          })
          .sort((a, b) => {
            if (a.sortOrder !== b.sortOrder) {
              return a.sortOrder - b.sortOrder;
            }
            return String(a.title || "").localeCompare(String(b.title || ""));
          });

        if (active) {
          setRawCategoryValues(allCategoriesFromDb);
          setRawCountryValues(allCountriesFromDb);
          setRawRegionValues(allRegionsFromDb);
          setReports(normalized);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
        if (active) {
          setReports([]);
          setRawCategoryValues([]);
          setRawCountryValues([]);
          setRawRegionValues([]);
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
    return [
      "All",
      ...uniqueClean([...CATEGORY_OPTIONS, ...rawCategoryValues]).filter(
        (c) => !REMOVED_CATEGORIES.has(c)
      ),
    ];
  }, [rawCategoryValues]);

  const countries = useMemo(() => {
    return ["All", ...uniqueClean([...COUNTRY_OPTIONS, ...rawCountryValues])];
  }, [rawCountryValues]);

  const regions = useMemo(() => {
    return ["All", ...uniqueClean(rawRegionValues)];
  }, [rawRegionValues]);

  const filteredReports = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return reports.filter((report) => {
      const matchCategory =
        selectedCategory === "All" || report.category === selectedCategory;

      const matchRegion =
        selectedRegion === "All" || report.region === selectedRegion;

      const matchCountry =
        selectedCountry === "All" || report.country === selectedCountry;

      const matchSearch =
        !q ||
        String(report.title || "").toLowerCase().includes(q) ||
        String(report.previewTitle || "").toLowerCase().includes(q) ||
        String(report.company || "").toLowerCase().includes(q) ||
        String(report.country || "").toLowerCase().includes(q) ||
        String(report.region || "").toLowerCase().includes(q) ||
        String(report.category || "").toLowerCase().includes(q) ||
        String(report.description || "").toLowerCase().includes(q);

      return matchCategory && matchRegion && matchCountry && matchSearch;
    });
  }, [reports, selectedCategory, selectedRegion, selectedCountry, searchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedRegion, selectedCountry, searchText]);

  useEffect(() => {
    const section = document.getElementById("reports");
    if (section) {
      const y = section.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    return filteredReports.slice(startIndex, startIndex + reportsPerPage);
  }, [filteredReports, currentPage]);

  function openEnquiryModal() {
    setEnquiryStatus({ type: "", message: "" });
    setIsEnquiryOpen(true);
  }

  function closeEnquiryModal() {
    if (submittingEnquiry) return;
    setIsEnquiryOpen(false);
    setEnquiryStatus({ type: "", message: "" });
  }

  function handleEnquiryChange(e) {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleEnquirySubmit(e) {
    e.preventDefault();
    setSubmittingEnquiry(true);
    setEnquiryStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiryForm),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Error submitting enquiry");
      }

      setEnquiryStatus({
        type: "success",
        message: data?.message || "Enquiry submitted successfully",
      });

      setEnquiryForm({
        name: "",
        company_name: "",
        email: "",
        designation: "",
        phone: "",
        location: "",
        area_of_interest: "",
        preferred_contact: "",
        message: "",
      });

      setTimeout(() => {
        setIsEnquiryOpen(false);
        setEnquiryStatus({ type: "", message: "" });
      }, 1200);
    } catch (error) {
      setEnquiryStatus({
        type: "error",
        message: error?.message || "Error submitting enquiry",
      });
    } finally {
      setSubmittingEnquiry(false);
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 991px) {
          .hero-title-one-line {
            white-space: normal !important;
          }
        }
      `}</style>

      <section
        className="d-flex align-items-center"
        style={{
          minHeight: "auto",
          paddingTop: "48px",
          paddingBottom: "48px",
        }}
      >
        <div className="container-fluid px-4 px-md-5 px-lg-5">
          <div className="row">
            <div className="col-12 ps-lg-5">
              <h1
                className="fw-bold hero-title-one-line"
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 3.4rem)",
                  lineHeight: "1.08",
                  letterSpacing: "-1px",
                  color: "#111111",
                  marginBottom: "24px",
                  whiteSpace: "nowrap",
                }}
              >
                Premium Automotive{" "}
                <span style={{ color: "#2f45bf" }}>
                  Market Intelligence &amp;
                </span>{" "}
                Forecast Reports
              </h1>

              <p
                style={{
                  maxWidth: "820px",
                  fontSize: "clamp(1rem, 1.8vw, 1.5rem)",
                  lineHeight: "1.5",
                  color: "#5f6b85",
                  fontWeight: 400,
                  margin: "0 auto 36px auto",
                  textAlign: "center",
                }}
              >
                Country-wise, segment-wise, and OEM-level automotive insights
                for strategic decision-making
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
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

                <button
                  type="button"
                  className="btn px-4 py-3"
                  onClick={openEnquiryModal}
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="reports"
        style={{
         
          paddingBottom: "54px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="container-fluid px-4 px-md-5 px-lg-5">
          <div className="row justify-content-center mb-4">
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
                  marginBottom: "12px",
                }}
              >
                Search Reports by Category and Country
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
                Preset and manually added categories and countries are both
                available in the filters.
              </p>
            </div>
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-12 col-xl-10">
              <div
                style={{
                  width: "100%",
                  maxWidth: "1120px",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    marginBottom: "18px",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Reports..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                      width: "100%",
                      height: "55px",
                      borderRadius: "999px",
                      border: "2px solid #555555",
                      backgroundColor: "#ffffff",
                      padding: "0 58px 0 22px",
                      fontSize: "clamp(16px, 1.4vw, 21px)",
                      fontWeight: 400,
                      color: "#111111",
                      boxShadow: "none",
                      outline: "none",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "30px",
                      lineHeight: 1,
                      color: "#9ca3af",
                      pointerEvents: "none",
                    }}
                  >
                    ⌕
                  </span>
                </div>

                <div className="row g-3 justify-content-center">
                  <div className="col-12 col-md-4">
                    <label
                      className="d-block mb-2"
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#334155",
                      }}
                    >
                      Category
                    </label>

                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{
                        height: "38px",
                        borderRadius: "12px",
                        border: "1px solid #d7dfef",
                        color: "#24324a",
                        fontSize: "13px",
                        fontWeight: 600,
                        boxShadow: "none",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label
                      className="d-block mb-2"
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#334155",
                      }}
                    >
                      Region
                    </label>

                    <select
                      className="form-select"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      style={{
                        height: "38px",
                        borderRadius: "12px",
                        border: "1px solid #d7dfef",
                        color: "#24324a",
                        fontSize: "13px",
                        fontWeight: 600,
                        boxShadow: "none",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label
                      className="d-block mb-2"
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#334155",
                      }}
                    >
                      Country
                    </label>

                    <select
                      className="form-select"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      style={{
                        height: "38px",
                        borderRadius: "12px",
                        border: "1px solid #d7dfef",
                        color: "#24324a",
                        fontSize: "13px",
                        fontWeight: 600,
                        boxShadow: "none",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4"
                  style={{
                    maxWidth: "1120px",
                    margin: "0 auto",
                  }}
                >
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
                      setSelectedCountry("All");
                      setSearchText("");
                      setCurrentPage(1);
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
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="col-12 col-md-6 col-xl-4">
                  <div
                    style={{
                      borderRadius: "22px",
                      overflow: "hidden",
                      border: "1px solid #dfe6f2",
                      backgroundColor: "#ffffff",
                      minHeight: "410px",
                    }}
                  >
                    <div
                      style={{ height: "170px", backgroundColor: "#eef2fb" }}
                    />
                    <div style={{ padding: "18px" }}>
                      <div
                        style={{
                          height: "22px",
                          width: "60%",
                          backgroundColor: "#eef2fb",
                          borderRadius: "10px",
                          marginBottom: "12px",
                        }}
                      />
                      <div
                        style={{
                          height: "14px",
                          width: "90%",
                          backgroundColor: "#eef2fb",
                          borderRadius: "10px",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          height: "14px",
                          width: "85%",
                          backgroundColor: "#eef2fb",
                          borderRadius: "10px",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          height: "14px",
                          width: "70%",
                          backgroundColor: "#eef2fb",
                          borderRadius: "10px",
                          marginBottom: "18px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReports.length > 0 ? (
            <>
              <div className="row g-4 justify-content-center">
                {paginatedReports.map((report) => (
                  <div key={report.id} className="col-12 col-md-6 col-xl-4">
                    <div
                      style={{
                        borderRadius: "22px",
                        overflow: "hidden",
                        border: "1px solid #dfe6f2",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 10px 26px rgba(20, 30, 70, 0.05)",
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
                          width: "100%",
                          aspectRatio: "3 / 2",
                          flexShrink: 0,
                          textAlign: "center",
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            backgroundColor: "#2f45bf",
                            color: "#ffffff",
                            borderRadius: "12px",
                            padding: "6px 12px",
                            fontSize: "11px",
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            zIndex: 2,
                          }}
                        >
                          {report.category || "New"}
                        </span>

                        {report.sampleImage ? (
                          <img
                            src={report.sampleImage}
                            alt={report.title || "Report image"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                              display: "block",
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              maxWidth: "90%",
                              margin: "0 auto",
                              padding: "42px 16px",
                            }}
                          >
                            <div
                              style={{
                                width: "82px",
                                height: "5px",
                                borderRadius: "999px",
                                backgroundColor: "rgba(47,69,191,0.45)",
                                margin: "0 auto 18px auto",
                              }}
                            />
                            <div
                              style={{
                                fontSize: "17px",
                                lineHeight: "1.35",
                                fontWeight: 700,
                                color: "#0e2b5c",
                                marginBottom: "8px",
                              }}
                            >
                              {report.previewTitle || report.title}
                            </div>
                            <div
                              style={{
                                fontSize: "14px",
                                color: "#637391",
                                fontWeight: 600,
                              }}
                            >
                              {report.company || "RACE Innovations"}
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          padding: "18px",
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "17px",
                            lineHeight: "1.3",
                            fontWeight: 800,
                            color: "#091f4d",
                            marginBottom: "10px",
                          }}
                        >
                          {report.title}
                        </h3>

                        <p
                          style={{
                            color: "#5f7295",
                            fontSize: "14px",
                            lineHeight: "1.65",
                            marginBottom: "14px",
                            minHeight: "72px",
                          }}
                        >
                          {report.description || report.summary}
                        </p>

                        <div
                          className="d-flex flex-wrap align-items-center gap-3 mb-3"
                          style={{
                            color: "#5b6f93",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          <span>
                            ◉ {report.country || "Country not specified"}
                          </span>
                          <span>◷ {report.period || "Period not specified"}</span>
                        </div>

                        {report.tags?.length > 0 && (
                          <div
                            className="d-flex flex-wrap gap-1 mb-3"
                            style={{ maxWidth: "100%" }}
                          >
                            {report.tags.slice(0, 4).map((tag, idx) => (
                              <span
                                key={idx}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "2px 7px",
                                  borderRadius: "999px",
                                  backgroundColor: "#eef2f7",
                                  color: "#223e6c",
                                  fontSize: "9px",
                                  fontWeight: 700,
                                  letterSpacing: "0px",
                                  textTransform: "uppercase",
                                  lineHeight: "1",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div style={{ marginTop: "auto" }}>
                          <Link
                            href={report.slug ? `/reports/${report.slug}` : "#"}
                            style={{
                              color: "#2f45bf",
                              fontWeight: 800,
                              fontSize: "15px",
                              textDecoration: "none",
                            }}
                          >
                            View Report →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                    Try changing the category, country, or search text.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <ReportsCertifications />

      {isEnquiryOpen && (
        <div
          onClick={closeEnquiryModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "760px",
              backgroundColor: "#ffffff",
              borderRadius: "22px",
              padding: "26px",
              boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "#111111",
                    fontSize: "28px",
                    fontWeight: 800,
                  }}
                >
                  Connect with Us
                </h3>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#647089",
                    fontSize: "15px",
                  }}
                >
                  Fill in your details for tailored business solutions.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEnquiryModal}
                disabled={submittingEnquiry}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "28px",
                  lineHeight: 1,
                  color: "#6b7280",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {enquiryStatus.message ? (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color:
                    enquiryStatus.type === "success" ? "#166534" : "#b91c1c",
                  backgroundColor:
                    enquiryStatus.type === "success" ? "#dcfce7" : "#fee2e2",
                  border:
                    enquiryStatus.type === "success"
                      ? "1px solid #bbf7d0"
                      : "1px solid #fecaca",
                }}
              >
                {enquiryStatus.message}
              </div>
            ) : null}

            <form onSubmit={handleEnquirySubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter your Name"
                    value={enquiryForm.name}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Company Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="company_name"
                    placeholder="Enter your Company Name"
                    value={enquiryForm.company_name}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Email <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter your Email"
                    value={enquiryForm.email}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Designation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    placeholder="Enter your Designation"
                    value={enquiryForm.designation}
                    onChange={handleEnquiryChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Phone Number <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    placeholder="Enter your Phone Number"
                    value={enquiryForm.phone}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    placeholder="Enter your Location"
                    value={enquiryForm.location}
                    onChange={handleEnquiryChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Area of Interest <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    name="area_of_interest"
                    value={enquiryForm.area_of_interest}
                    onChange={handleEnquiryChange}
                    required
                  >
                    <option value="">Select Your Area of Interest</option>
                    <option>Technic</option>
                    <option>Intellect</option>
                    <option>Connect</option>
                    <option>LBI Route Survey</option>
                    <option>Accounting & Legal</option>
                    <option>Market Report</option>
                    <option>Product Report</option>
                    <option>Strategic Report</option>
                    <option>Flash Report</option>
                    <option>Investors</option>
                    <option>Funding</option>
                    <option>IT Services</option>
                    <option>ODC Logistics</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Preferred Mode of Contact{" "}
                    <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    name="preferred_contact"
                    value={enquiryForm.preferred_contact}
                    onChange={handleEnquiryChange}
                    required
                  >
                    <option value="">Select Contact Method</option>
                    <option>Email</option>
                    <option>Phone</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Message <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <textarea
                    className="form-control"
                    name="message"
                    placeholder="Enter your Message"
                    rows={4}
                    value={enquiryForm.message}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeEnquiryModal}
                  disabled={submittingEnquiry}
                  className="btn btn-outline-secondary px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingEnquiry}
                  className="btn px-4 py-2"
                  style={{
                    backgroundColor: "#2f45bf",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 700,
                    opacity: submittingEnquiry ? 0.8 : 1,
                  }}
                >
                  {submittingEnquiry ? "Submitting..." : "Submit Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}