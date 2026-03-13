"use client";
import React from "react";

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

  return (
    <>
      {/* Hero Section */}
      <section
        className="min-vh-100 d-flex align-items-center"
        
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

                <a
                  href="#sample"
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
                  Request Sample
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
                  Talk to Analyst
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted + Stats Section */}
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
    </>
  );
}