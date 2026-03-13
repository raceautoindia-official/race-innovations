"use client";
import React from "react";

export default function WhyChooseRaceSection() {
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
  );
}