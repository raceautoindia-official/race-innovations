"use client";

import React, { useEffect, useMemo, useState } from "react";
import Pagination from "../components/common/Pagination";

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

function cleanValue(value) {
  return String(value ?? "").trim();
}

function uniqueClean(values) {
  return Array.from(new Set(values.map((v) => cleanValue(v)).filter(Boolean)));
}

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
  const [rawCategoryValues, setRawCategoryValues] = useState([]);
  const [rawCountryValues, setRawCountryValues] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
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
          setReports(normalized);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
        if (active) {
          setReports([]);
          setRawCategoryValues([]);
          setRawCountryValues([]);
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
    return ["All", ...uniqueClean([...CATEGORY_OPTIONS, ...rawCategoryValues])];
  }, [rawCategoryValues]);

  const countries = useMemo(() => {
    return ["All", ...uniqueClean([...COUNTRY_OPTIONS, ...rawCountryValues])];
  }, [rawCountryValues]);

  const filteredReports = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return reports.filter((report) => {
      const matchCategory =
        selectedCategory === "All" || report.category === selectedCategory;

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

      return matchCategory && matchCountry && matchSearch;
    });
  }, [reports, selectedCategory, selectedCountry, searchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCountry, searchText]);

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
        style={{
          borderTop: "1px solid #dde3f0",
          borderBottom: "1px solid #dde3f0",
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef4ff 45%, #f9f5ff 100%)",
        }}
      >
        <div className="container-fluid px-4 px-md-5 px-lg-5">
          <div
            className="text-center"
            style={{
              paddingTop: "38px",
              paddingBottom: "34px",
              borderBottom: "1px solid rgba(47, 69, 191, 0.12)",
            }}
          >
            <div
              style={{
                color: "#223e6c",
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "2.4px",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              TRUSTED BY LEADING ORGANIZATIONS
            </div>

            <div className="row justify-content-center g-3">
              {trustedItems.map((item, index) => {
                const stylesList = [
                  {
                    background:
                      "linear-gradient(135deg, #eef4ff 0%, #dce8ff 100%)",
                    color: "#2346a0",
                    border: "1px solid #c9d8ff",
                    boxShadow: "0 10px 24px rgba(35, 70, 160, 0.10)",
                  },
                  {
                    background:
                      "linear-gradient(135deg, #eefcf4 0%, #ddf7e8 100%)",
                    color: "#177245",
                    border: "1px solid #c7ecd6",
                    boxShadow: "0 10px 24px rgba(23, 114, 69, 0.10)",
                  },
                  {
                    background:
                      "linear-gradient(135deg, #fff5ea 0%, #ffe7cc 100%)",
                    color: "#b05a00",
                    border: "1px solid #ffd6a8",
                    boxShadow: "0 10px 24px rgba(176, 90, 0, 0.10)",
                  },
                  {
                    background:
                      "linear-gradient(135deg, #f5efff 0%, #e8dbff 100%)",
                    color: "#6b39b2",
                    border: "1px solid #d9c2ff",
                    boxShadow: "0 10px 24px rgba(107, 57, 178, 0.10)",
                  },
                  {
                    background:
                      "linear-gradient(135deg, #eefbff 0%, #d7f1fb 100%)",
                    color: "#0f6e8c",
                    border: "1px solid #bae7f7",
                    boxShadow: "0 10px 24px rgba(15, 110, 140, 0.10)",
                  },
                  {
                    background:
                      "linear-gradient(135deg, #fff0f5 0%, #ffdbe8 100%)",
                    color: "#b03060",
                    border: "1px solid #ffc4d9",
                    boxShadow: "0 10px 24px rgba(176, 48, 96, 0.10)",
                  },
                ];

                const itemStyle = stylesList[index % stylesList.length];

                return (
                  <div key={index} className="col-6 col-md-auto">
                    <div
                      style={{
                        ...itemStyle,
                        fontSize: "18px",
                        fontWeight: 700,
                        padding: "14px 24px",
                        borderRadius: "999px",
                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                        cursor: "default",
                      }}
                    >
                      {item}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
            <div className="row text-center justify-content-center">
              {stats.map((stat, index) => (
                <div key={index} className="col-6 col-lg-3 mb-4 mb-lg-0">
                  <div
                    style={{
                      color: "#2f45bf",
                      fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                      fontWeight: 800,
                      lineHeight: "1",
                      marginBottom: "10px",
                    }}
                  >
                    {stat.value}
                  </div>

                  <div
                    style={{
                      color: "#41506b",
                      fontSize: "18px",
                      fontWeight: 700,
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
          paddingTop: "56px",
          paddingBottom: "64px",
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

          <div className="row justify-content-center mb-4">
            <div className="col-12 col-xl-11">
              <div
                className="row g-2 align-items-center"
                style={{
                  backgroundColor: "#f8faff",
                  border: "1px solid #e3e8f4",
                  borderRadius: "20px",
                  padding: "16px",
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
                      height: "48px",
                      borderRadius: "14px",
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
                    Country
                  </label>
                  <select
                    className="form-select"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      color: "#24324a",
                      fontWeight: 500,
                      boxShadow: "none",
                    }}
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
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
                    Search
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title, country, category..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      color: "#24324a",
                      fontWeight: 500,
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="col-12">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-1">
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
                        padding: "9px 16px",
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
                          height: "170px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
                              height: "170px",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div style={{ maxWidth: "90%", padding: "20px 16px" }}>
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
                          <span>◉ {report.country || "Country not specified"}</span>
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
                          <a
                            href={report.slug ? `/reports/${report.slug}` : "#"}
                            style={{
                              color: "#2f45bf",
                              fontWeight: 800,
                              fontSize: "15px",
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
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
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
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
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
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
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
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
                    Designation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    placeholder="Enter your Designation"
                    value={enquiryForm.designation}
                    onChange={handleEnquiryChange}
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
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
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    placeholder="Enter your Location"
                    value={enquiryForm.location}
                    onChange={handleEnquiryChange}
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
                    Area of Interest <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    name="area_of_interest"
                    value={enquiryForm.area_of_interest}
                    onChange={handleEnquiryChange}
                    required
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                    }}
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
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
                    Preferred Mode of Contact{" "}
                    <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    name="preferred_contact"
                    value={enquiryForm.preferred_contact}
                    onChange={handleEnquiryChange}
                    required
                    style={{
                      height: "48px",
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                    }}
                  >
                    <option value="">Select Contact Method</option>
                    <option>Email</option>
                    <option>Phone</option>
                  </select>
                </div>

                <div className="col-12">
                  <label
                    className="form-label"
                    style={{ fontWeight: 700, color: "#334155" }}
                  >
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
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #d7dfef",
                      boxShadow: "none",
                      resize: "none",
                    }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeEnquiryModal}
                  disabled={submittingEnquiry}
                  className="btn px-4 py-2"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#2f45bf",
                    border: "1px solid rgba(47, 69, 191, 0.25)",
                    borderRadius: "14px",
                    fontWeight: 700,
                  }}
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