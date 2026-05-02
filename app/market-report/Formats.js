"use client";
import React from "react";

export default function WhyChooseRaceSection() {
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
  const items = [
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19V10" />
          <path d="M10 19V5" />
          <path d="M16 19v-7" />
          <path d="M22 19V3" />
          <path d="M2 19h20" />
        </svg>
      ),
      title: "Data-Driven Forecasts",
      desc: "Rigorous quantitative models with OEM-level granularity across every major automotive market.",
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 0 18" />
          <path d="M12 3a15 15 0 0 0 0 18" />
        </svg>
      ),
      title: "Global Coverage",
      desc: "Country-wise automotive intelligence spanning 50+ markets with local analyst expertise.",
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
          <path d="M9.5 12.5l1.8 1.8 3.7-4.2" />
        </svg>
      ),
      title: "Trusted Methodology",
      desc: "Proprietary research frameworks validated by 500+ enterprise clients worldwide.",
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      ),
      title: "Timely Delivery",
      desc: "Flash reports and quarterly updates ensuring you have the latest market intelligence.",
    },
  ];

  return (
    <>
    <section
      style={{
        backgroundColor: "#1d2f57",
        paddingTop: "90px",
        paddingBottom: "90px",
      }}
    >
      <div className="container-fluid px-4 px-md-5 px-lg-5">
        <div className="text-center mb-5">
          <h2
            className="fw-bold mb-2"
            style={{
              color: "#ffffff",
              fontSize: "clamp(2rem, 3.4vw, 3.5rem)",
              lineHeight: "1.15",
              letterSpacing: "-0.5px",
            }}
          >
            Why Choose RACE Innovations
          </h2>

          <p
            className="mb-0"
            style={{
              color: "#b8c4da",
              fontSize: "clamp(1rem, 1.4vw, 1.5rem)",
              lineHeight: "1.6",
            }}
          >
            The intelligence advantage that sets us apart
          </p>
        </div>

        <div className="row g-4 g-lg-5 justify-content-center">
          {items.map((item, index) => (
            <div key={index} className="col-12 col-md-6 col-xl-3">
              <div
                className="text-center h-100"
                style={{
                  padding: "24px 14px",
                }}
              >
                <div
                  className="mx-auto d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.10)",
                    color: "#e43b32",
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  className="fw-bold mb-3"
                  style={{
                    color: "#ffffff",
                    fontSize: "clamp(1.25rem, 1.5vw, 1.9rem)",
                    lineHeight: "1.35",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="mb-0 mx-auto"
                  style={{
                    color: "#b8c4da",
                    fontSize: "1rem",
                    lineHeight: "1.65",
                    maxWidth: "340px",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
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
    </>
  );
}