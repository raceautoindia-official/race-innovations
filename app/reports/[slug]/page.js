"use client";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import React, { useEffect, useState } from "react";

export default function ReportDetailPage() {
    const [openFaq, setOpenFaq] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1200);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const theme = {
        primaryBlue: "#3346c7",
        deepBlue: "#22345f",
        lightBg: "#f5f5f7",
        heading: "#111111",
        headingBlue: "#1f2f63",
        mutedText: "#6b7890",
        softBorder: "#d9deea",
        lightBlueBg: "#eef2ff",
    };

    const tags = [
        "LATEST EDITION",
        "FORECAST INCLUDED",
        "OEM INTELLIGENCE",
        "EV COVERAGE",
        "SEGMENT-WISE ANALYSIS",
    ];

    const highlights = [
        "Complete market sizing with historical data and forward-looking projections",
        "OEM-level volume analysis with market share breakdown",
        "Segment-wise deep dive across all major vehicle categories",
        "Policy and regulatory impact assessment on market dynamics",
        "Electrification trajectory with BEV and PHEV adoption curves",
        "Production, sales, and export analysis with quarterly granularity",
    ];

    const reportSections = [
        "Executive Summary & Key Findings",
        "Market Overview & Macroeconomic Context",
        "Vehicle Sales Analysis by Segment",
        "OEM Performance & Market Share",
        "Electric Vehicle Market Deep Dive",
        "Production & Capacity Analysis",
        "Regulatory & Policy Landscape",
        "Five-Year Market Forecast",
        "Strategic Recommendations",
    ];

    const buyers = [
        "Automotive OEM strategy and planning teams",
        "Management consulting firms",
        "Government trade and industry bodies",
        "Tier-1 and Tier-2 automotive suppliers",
        "Private equity and investment analysts",
        "Academic and research institutions",
    ];

    const deliverables = [
        {
            title: "PDF Report",
            desc: "280-page comprehensive analysis",
            icon: "📄",
        },
        {
            title: "Excel Data Pack",
            desc: "All charts and data tables in editable format",
            icon: "⇩",
        },
        {
            title: "Analyst Access",
            desc: "30-minute post-purchase consultation",
            icon: "💬",
        },
        {
            title: "Update Access",
            desc: "12-month access to interim updates",
            icon: "◔",
        },
    ];

    const faqs = [
        {
            q: "What format will I receive the report in?",
            a: "The report is delivered in PDF format along with an Excel data pack containing key tables and structured market data.",
        },
        {
            q: "Can I request a customized version of this report?",
            a: "Yes. We can tailor the report scope, segment coverage, OEM coverage, forecast horizon, and output structure based on your requirements.",
        },
        {
            q: "Is a sample available before purchase?",
            a: "Yes. A sample preview or selected extract can be shared for review before final purchase confirmation.",
        },
        {
            q: "What license options are available?",
            a: "We offer single-user, team, and enterprise licensing options depending on your organization size and usage requirements.",
        },
        {
            q: "How frequently is the report updated?",
            a: "This report includes the current edition and can also be supported with periodic updates depending on the subscription or engagement structure.",
        },
    ];

    const sidebarCard = (
        <div
            style={{
                backgroundColor: "#ffffff",
                border: `1px solid ${theme.softBorder}`,
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 10px 26px rgba(16, 33, 63, 0.04)",
            }}
        >
            <h3
                className="fw-bold mb-3"
                style={{
                    color: theme.headingBlue,
                    fontSize: "clamp(1.15rem, 1.5vw, 1.7rem)",
                    lineHeight: "1.35",
                }}
            >
                Indian Automotive Market 2025 &amp; Forecast Report
            </h3>

            <div
                style={{
                    color: "#7a869b",
                    fontSize: "0.82rem",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                }}
            >
                Starting From
            </div>

            <div
                className="fw-bold mb-3"
                style={{
                    color: theme.headingBlue,
                    fontSize: "clamp(2.1rem, 2.4vw, 3rem)",
                    lineHeight: "1",
                }}
            >
                $3,450
            </div>

            <div className="mb-3">
                {[
                    ["Format", "PDF + Excel"],
                    ["License", "Single User"],
                    ["Delivery", "Within 24 hours"],
                ].map((row, idx) => (
                    <div
                        key={idx}
                        className="d-flex justify-content-between align-items-center mb-1"
                        style={{
                            color: theme.mutedText,
                            fontSize: "0.95rem",
                        }}
                    >
                        <span>{row[0]}</span>
                        <span
                            className="fw-semibold"
                            style={{ color: theme.headingBlue, fontSize: "0.95rem" }}
                        >
                            {row[1]}
                        </span>
                    </div>
                ))}
            </div>

            <div className="d-grid gap-2">
                <button
                    className="btn"
                    style={{
                        backgroundColor: theme.primaryBlue,
                        color: "#ffffff",
                        borderRadius: "12px",
                        padding: "11px 16px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        border: "none",
                    }}
                >
                    Buy Now
                </button>

                <button
                    className="btn"
                    style={{
                        backgroundColor: theme.deepBlue,
                        color: "#ffffff",
                        borderRadius: "12px",
                        padding: "11px 16px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        border: "none",
                    }}
                >
                    Request Sample
                </button>

                <button
                    className="btn"
                    style={{
                        backgroundColor: "#ffffff",
                        color: theme.deepBlue,
                        border: `1px solid ${theme.softBorder}`,
                        borderRadius: "12px",
                        padding: "11px 16px",
                        fontWeight: 600,
                        fontSize: "1rem",
                    }}
                >
                    Request Customization
                </button>

                <button
                    className="btn"
                    style={{
                        backgroundColor: "#ffffff",
                        color: theme.deepBlue,
                        border: `1px solid ${theme.softBorder}`,
                        borderRadius: "12px",
                        padding: "11px 16px",
                        fontWeight: 600,
                        fontSize: "1rem",
                    }}
                >
                    Talk to Analyst
                </button>
            </div>

            <div
                className="text-center mt-3"
                style={{
                    color: "#8994a7",
                    fontSize: "0.82rem",
                    lineHeight: "1.5",
                }}
            >
                Secure payment · Instant access · Volume discounts available
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <main className="main-content" style={{ backgroundColor: theme.lightBg }}>
                <section style={{ paddingTop: "42px", paddingBottom: "56px" }}>
                    <div className="container-fluid px-4 px-md-5 px-lg-5">
                        <div
                            className="mb-4"
                            style={{
                                color: theme.mutedText,
                                fontSize: "1rem",
                                fontWeight: 500,
                            }}
                        >
                            <span>Home</span>
                            <span className="mx-3">›</span>
                            <span>Reports</span>
                            <span className="mx-3">›</span>
                            <span style={{ color: "#44536f" }}>
                                Indian Automotive Market 2025 &amp; Forecast Report
                            </span>
                        </div>

                        <div className="mb-4">
                            <a
                                href="/reports"
                                className="text-decoration-none"
                                style={{
                                    color: theme.primaryBlue,
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                }}
                            >
                                ← Back to Reports
                            </a>
                        </div>

                        <div className="row g-5 align-items-start">
                            <div className="col-12 col-xl-8">
                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                backgroundColor: theme.lightBlueBg,
                                                color: theme.primaryBlue,
                                                borderRadius: "8px",
                                                padding: "8px 14px",
                                                fontSize: "0.88rem",
                                                fontWeight: 700,
                                                letterSpacing: "0.6px",
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h1
                                    className="fw-bold mb-4"
                                    style={{
                                        color: theme.heading,
                                        fontSize: "clamp(2.4rem, 4vw, 4.3rem)",
                                        lineHeight: "1.08",
                                        letterSpacing: "-0.6px",
                                    }}
                                >
                                    Indian Automotive Market 2025 &amp; Forecast Report
                                </h1>

                                <p
                                    style={{
                                        color: theme.mutedText,
                                        fontSize: "clamp(1.1rem, 1.5vw, 1.7rem)",
                                        lineHeight: "1.6",
                                        maxWidth: "1100px",
                                        marginBottom: "34px",
                                    }}
                                >
                                    Comprehensive analysis of India&apos;s automotive landscape
                                    including passenger vehicles, commercial vehicles, and
                                    two-wheelers with OEM-level market share and five-year forecast.
                                </p>

                                <div className="row g-4">
                                    {[
                                        { label: "Published", value: "January 2025", icon: "🗓" },
                                        { label: "Format", value: "PDF + Excel", icon: "📄" },
                                        { label: "Pages", value: "280 pages", icon: "📋" },
                                        { label: "Geography", value: "India", icon: "◉" },
                                        { label: "Forecast", value: "2025–2030", icon: "◔" },
                                        { label: "Publisher", value: "RACE Innovations", icon: "▣" },
                                    ].map((item, index) => (
                                        <div key={index} className="col-12 col-md-6 col-lg-4">
                                            <div className="d-flex align-items-start gap-3">
                                                <div
                                                    style={{
                                                        color: theme.primaryBlue,
                                                        fontSize: "1.15rem",
                                                        lineHeight: 1,
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <div
                                                        style={{
                                                            color: theme.mutedText,
                                                            fontSize: "1rem",
                                                            marginBottom: "2px",
                                                        }}
                                                    >
                                                        {item.label}
                                                    </div>
                                                    <div
                                                        className="fw-semibold"
                                                        style={{
                                                            color: theme.headingBlue,
                                                            fontSize: "1.15rem",
                                                        }}
                                                    >
                                                        {item.value}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                          
                        </div>
                    </div>
                </section>

                <section style={{ paddingBottom: "70px" }}>
                    <div className="container-fluid px-4 px-md-5 px-lg-5">
                        <div className="row g-5 align-items-start">
                            <div className="col-12 col-xl-8">
                                <section className="mb-5">
                                    <h2
                                        className="fw-bold mb-4"
                                        style={{
                                            color: theme.headingBlue,
                                            fontSize: "clamp(2rem, 3vw, 3rem)",
                                        }}
                                    >
                                        Key Highlights
                                    </h2>

                                    <div className="d-flex flex-column gap-3">
                                        {highlights.map((item, index) => (
                                            <div key={index} className="d-flex align-items-start gap-3">
                                                <div
                                                    style={{
                                                        color: theme.primaryBlue,
                                                        fontSize: "1.15rem",
                                                        lineHeight: 1.2,
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

                                <section className="mb-5">
                                    <h2
                                        className="fw-bold mb-4"
                                        style={{
                                            color: theme.headingBlue,
                                            fontSize: "clamp(2rem, 3vw, 3rem)",
                                        }}
                                    >
                                        Why This Report Matters
                                    </h2>

                                    <p
                                        style={{
                                            color: theme.mutedText,
                                            fontSize: "1.15rem",
                                            lineHeight: "1.8",
                                            maxWidth: "1100px",
                                        }}
                                    >
                                        In a rapidly evolving automotive landscape shaped by
                                        electrification, shifting consumer preferences, and regulatory
                                        pressures, access to accurate and granular market data is
                                        critical. This report equips decision-makers with the
                                        intelligence needed to navigate market uncertainty, identify
                                        growth opportunities, and benchmark competitive positioning
                                        across the India automotive market.
                                    </p>
                                </section>

                                <section className="mb-5">
                                    <h2
                                        className="fw-bold mb-4"
                                        style={{
                                            color: theme.headingBlue,
                                            fontSize: "clamp(2rem, 3vw, 3rem)",
                                        }}
                                    >
                                        What&apos;s Inside the Report
                                    </h2>

                                    <div className="row g-3">
                                        {reportSections.map((item, index) => (
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
                                                            color: theme.primaryBlue,
                                                            fontWeight: 700,
                                                            fontSize: "1.5rem",
                                                            minWidth: "40px",
                                                        }}
                                                    >
                                                        {String(index + 1).padStart(2, "0")}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: theme.headingBlue,
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

                                <section className="mb-5">
                                    <h2
                                        className="fw-bold mb-4"
                                        style={{
                                            color: theme.headingBlue,
                                            fontSize: "clamp(2rem, 3vw, 3rem)",
                                        }}
                                    >
                                        Sample Data Preview
                                    </h2>

                                    <div
                                        style={{
                                            backgroundColor: "#ffffff",
                                            border: `1px solid ${theme.softBorder}`,
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: "#f1f4f8",
                                                color: theme.primaryBlue,
                                                fontSize: "0.95rem",
                                                fontWeight: 700,
                                                letterSpacing: "1px",
                                                textTransform: "uppercase",
                                                padding: "16px 24px",
                                            }}
                                        >
                                            India — Vehicle Sales by Segment (Units, Thousands)
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table mb-0 align-middle">
                                                <thead>
                                                    <tr>
                                                        <th style={{ padding: "18px 24px", color: theme.headingBlue }}>Segment</th>
                                                        <th className="text-end" style={{ padding: "18px 24px", color: theme.headingBlue }}>2023</th>
                                                        <th className="text-end" style={{ padding: "18px 24px", color: theme.headingBlue }}>2024E</th>
                                                        <th className="text-end" style={{ padding: "18px 24px", color: theme.headingBlue }}>2025F</th>
                                                        <th className="text-end" style={{ padding: "18px 24px", color: theme.headingBlue }}>2030F</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        ["Passenger Vehicles", "4,120", "4,380", "4,620", "5,850"],
                                                        ["Commercial Vehicles", "980", "1,045", "1,110", "1,420"],
                                                        ["Electric Vehicles", "520", "780", "1,050", "2,800"],
                                                    ].map((row, idx) => (
                                                        <tr key={idx}>
                                                            <td style={{ padding: "18px 24px", color: "#4b5d79" }}>{row[0]}</td>
                                                            <td className="text-end" style={{ padding: "18px 24px", color: "#4b5d79" }}>{row[1]}</td>
                                                            <td className="text-end" style={{ padding: "18px 24px", color: "#4b5d79" }}>{row[2]}</td>
                                                            <td className="text-end" style={{ padding: "18px 24px", color: "#4b5d79" }}>{row[3]}</td>
                                                            <td className="text-end" style={{ padding: "18px 24px", color: "#4b5d79" }}>{row[4]}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td style={{ padding: "18px 24px", color: theme.headingBlue, fontWeight: 700 }}>Total</td>
                                                        <td className="text-end" style={{ padding: "18px 24px", color: theme.headingBlue, fontWeight: 700 }}>5,620</td>
                                                        <td className="text-end" style={{ padding: "18px 24px", color: theme.headingBlue, fontWeight: 700 }}>6,205</td>
                                                        <td className="text-end" style={{ padding: "18px 24px", color: theme.headingBlue, fontWeight: 700 }}>6,780</td>
                                                        <td className="text-end" style={{ padding: "18px 24px", color: theme.headingBlue, fontWeight: 700 }}>10,070</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div style={{ padding: "12px 24px", color: "#76849b", fontSize: "0.95rem" }}>
                                            * Sample data for illustration only. Full report contains detailed OEM-level breakdowns.
                                        </div>
                                    </div>
                                </section>

                                <section className="mb-5">
                                    <h2
                                        className="fw-bold mb-4"
                                        style={{
                                            color: theme.headingBlue,
                                            fontSize: "clamp(2rem, 3vw, 3rem)",
                                        }}
                                    >
                                        Who Should Buy This Report
                                    </h2>

                                    <div className="row g-3">
                                        {buyers.map((item, index) => (
                                            <div key={index} className="col-12 col-md-6">
                                                <div className="d-flex align-items-start gap-3">
                                                    <div style={{ color: theme.primaryBlue, fontSize: "1.1rem", marginTop: "4px" }}>
                                                        ◌
                                                    </div>
                                                    <div style={{ color: "#334765", fontSize: "1.15rem", lineHeight: "1.6" }}>
                                                        {item}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="mb-5">
                                    <h2
                                        className="fw-bold mb-4"
                                        style={{
                                            color: theme.headingBlue,
                                            fontSize: "clamp(2rem, 3vw, 3rem)",
                                        }}
                                    >
                                        Report Deliverables
                                    </h2>

                                    <div className="row g-4">
                                        {deliverables.map((item, index) => (
                                            <div key={index} className="col-12 col-md-6">
                                                <div
                                                    style={{
                                                        backgroundColor: "#ffffff",
                                                        border: `1px solid ${theme.softBorder}`,
                                                        borderRadius: "12px",
                                                        padding: "22px 22px",
                                                        minHeight: "120px",
                                                    }}
                                                >
                                                    <div className="d-flex align-items-start gap-3">
                                                        <div style={{ color: theme.primaryBlue, fontSize: "1.5rem", marginTop: "2px" }}>
                                                            {item.icon}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold" style={{ color: theme.headingBlue, fontSize: "1.15rem", marginBottom: "4px" }}>
                                                                {item.title}
                                                            </div>
                                                            <div style={{ color: theme.mutedText, fontSize: "1.05rem" }}>
                                                                {item.desc}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h2
                                        className="fw-bold text-center mb-5"
                                        style={{
                                            color: theme.headingBlue,
                                            fontSize: "clamp(2.2rem, 3.6vw, 4rem)",
                                        }}
                                    >
                                        Frequently Asked Questions
                                    </h2>

                                    <div className="mx-auto" style={{ maxWidth: "980px" }}>
                                        {faqs.map((item, index) => {
                                            const isOpen = openFaq === index;
                                            return (
                                                <div
                                                    key={index}
                                                    className="mb-3"
                                                    style={{
                                                        backgroundColor: "#ffffff",
                                                        border: `1px solid ${theme.softBorder}`,
                                                        borderRadius: "10px",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                                                        className="w-100 text-start border-0 bg-transparent"
                                                        style={{
                                                            padding: "24px 28px",
                                                            color: theme.headingBlue,
                                                            fontSize: "1.15rem",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                                            <span>{item.q}</span>
                                                            <span style={{ fontSize: "1.3rem", color: theme.primaryBlue }}>
                                                                {isOpen ? "−" : "⌄"}
                                                            </span>
                                                        </div>
                                                    </button>

                                                    {isOpen && (
                                                        <div
                                                            style={{
                                                                padding: "0 28px 24px 28px",
                                                                color: theme.mutedText,
                                                                fontSize: "1.05rem",
                                                                lineHeight: "1.8",
                                                            }}
                                                        >
                                                            {item.a}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </div>

                            <div className="col-12 col-xl-4">
                                {isDesktop ? (
                                    <>
                                        <div style={{ width: "100%", height: "1px" }} />
                                       <div className="col-12 col-xl-4">
  {isDesktop ? (
    <>
      <div style={{ width: "100%", height: "1px" }} />
      <div
        style={{
          position: "fixed",
          top: "130px",
          left: "50%",
          transform: "translateX(370px)",
          width: "330px",
          zIndex: 1000,
        }}
      >
        {sidebarCard}
      </div>
    </>
  ) : (
    sidebarCard
  )}
</div>
                                    </>
                                ) : (
                                    sidebarCard
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}