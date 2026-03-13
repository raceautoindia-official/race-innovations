"use client";
import React from "react";

export default function ReportCategoriesSection() {
  const categories = [
    { title: "Market Forecast Reports", href: "/reports/market-forecast" },
    { title: "Flash Reports", href: "/reports/flash-reports" },
    { title: "EV Intelligence", href: "/reports/ev-intelligence" },
    { title: "Country Reports", href: "/reports/country-reports" },
    { title: "OEM Benchmarking", href: "/reports/oem-benchmarking" },
    { title: "Segment Analysis", href: "/reports/segment-analysis" },
    { title: "Production Forecasts", href: "/reports/production-forecasts" },
    { title: "Custom Research", href: "/reports/custom-research" },
  ];

  return (
    <section
      style={{
        backgroundColor: "#f6f7fb",
        paddingTop: "90px",
        paddingBottom: "90px",
      }}
    >
      <div className="container-fluid px-4 px-md-5 px-lg-5">
        <div className="text-center mb-5">
          <h2
            className="fw-bold mb-0"
            style={{
              color: "#111827",
              fontSize: "clamp(2rem, 3.2vw, 3.3rem)",
              lineHeight: "1.15",
              letterSpacing: "-0.5px",
            }}
          >
            Report Categories
          </h2>
        </div>

        <div className="row g-4">
          {categories.map((item, index) => (
            <div key={index} className="col-12 col-sm-6 col-xl-3">
              <a
                href={item.href}
                className="text-decoration-none d-block h-100"
              >
                <div
                  className="h-100 d-flex flex-column align-items-center justify-content-center text-center"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #dfe5ef",
                    borderRadius: "14px",
                    minHeight: "130px",
                    padding: "28px 20px",
                    transition: "all 0.25s ease",
                    boxShadow: "0 4px 14px rgba(17, 24, 39, 0.03)",
                  }}
                >
                  <div
                    style={{
                      color: "#0f172a",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      lineHeight: "1.45",
                      marginBottom: "10px",
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      color: "#7b879c",
                      fontSize: "1.5rem",
                      lineHeight: 1,
                    }}
                  >
                    ›
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}