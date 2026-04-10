"use client";
import React, { useState } from "react";

export default function ReportCategoriesSection() {
  const categories = [
    {
      title: "Market Forecast Reports",
      subtitle: "Forward-looking market forecasts and outlooks",
      type: "link",
      href: "https://raceautoanalytics.com/forecast/overview",
      icon: "MF",
    },
    {
      title: "Flash Reports",
      subtitle: "High-frequency market tracking and monthly updates",
      type: "link",
      href: "https://raceautoanalytics.com/flash-reports/overview",
      icon: "FR",
    },
    {
      title: "EV Intelligence",
      subtitle: "EV policy, adoption, and segment intelligence",
      type: "enquiry",
      icon: "EV",
    },
    {
      title: "Country Reports",
      subtitle: "Detailed country-level automotive market analysis",
      type: "enquiry",
      icon: "CR",
    },
    {
      title: "OEM Benchmarking",
      subtitle: "Competitive benchmarking across manufacturers",
      type: "enquiry",
      icon: "OB",
    },
    {
      title: "Segment Analysis",
      subtitle: "Insights by vehicle type and application segment",
      type: "enquiry",
      icon: "SA",
    },
    {
      title: "Production Forecasts",
      subtitle: "Production planning and manufacturing outlooks",
      type: "enquiry",
      icon: "PF",
    },
    {
      title: "Custom Research",
      subtitle: "Tailored intelligence based on business needs",
      type: "enquiry",
      icon: "CS",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
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

  function openEnquiryModal(categoryTitle) {
    setSelectedCategory(categoryTitle);
    setEnquiryStatus({ type: "", message: "" });
    setEnquiryForm((prev) => ({
      ...prev,
      area_of_interest: categoryTitle,
      message: `I’m interested in ${categoryTitle}. Please share more details.`,
    }));
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
        setSelectedCategory("");
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

  const cardStyle = (isHovered) => ({
    backgroundColor: "#ffffff",
    border: isHovered ? "1px solid rgba(47, 69, 191, 0.22)" : "1px solid #e2e8f0",
    borderRadius: "22px",
    minHeight: "210px",
    padding: "24px",
    boxShadow: isHovered
      ? "0 18px 40px rgba(47, 69, 191, 0.10)"
      : "0 8px 22px rgba(15, 23, 42, 0.04)",
    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
    transition: "all 0.25s ease",
    position: "relative",
    overflow: "hidden",
  });

  const renderCard = (item, index) => {
    const isHovered = hoveredIndex === index;

    const inner = (
      <div
        className="h-100 d-flex flex-column"
        style={cardStyle(isHovered)}
      >
        <div
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            backgroundColor: isHovered ? "#2f45bf" : "#eef3ff",
            color: isHovered ? "#ffffff" : "#2f45bf",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.8px",
            marginBottom: "18px",
            transition: "all 0.25s ease",
          }}
        >
          {item.icon}
        </div>

        <h3
          style={{
            color: "#0f172a",
            fontSize: "1.15rem",
            fontWeight: 800,
            lineHeight: "1.35",
            marginBottom: "10px",
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            color: "#64748b",
            fontSize: "0.96rem",
            lineHeight: "1.7",
            marginBottom: "22px",
          }}
        >
          {item.subtitle}
        </p>

        <div
          style={{
            marginTop: "auto",
            color: "#2f45bf",
            fontSize: "0.9rem",
            fontWeight: 800,
            letterSpacing: "0.3px",
          }}
        >
          {item.type === "link" ? "Open Report" : "Send Enquiry"}
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            backgroundColor: isHovered ? "#2f45bf" : "#dbe4ff",
            transition: "all 0.25s ease",
          }}
        />
      </div>
    );

    if (item.type === "link") {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none d-block h-100"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {inner}
        </a>
      );
    }

    return (
      <button
        type="button"
        className="w-100 h-100 text-start"
        onClick={() => openEnquiryModal(item.title)}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
        }}
      >
        {inner}
      </button>
    );
  };

  return (
    <>
      <section
        style={{
          backgroundColor: "#f7f9fc",
          paddingTop: "88px",
          paddingBottom: "88px",
        }}
      >
        <div className="container-fluid px-4 px-md-5 px-lg-5">
          <div className="text-center mb-5">
            <span
              className="d-inline-block px-3 py-2 mb-3 rounded-pill"
              style={{
                border: "1px solid rgba(47, 69, 191, 0.16)",
                color: "#2f45bf",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "1.4px",
                backgroundColor: "#f8fbff",
              }}
            >
              REPORT CATEGORIES
            </span>

            <h2
              className="fw-bold"
              style={{
                color: "#111827",
                fontSize: "clamp(2rem, 3vw, 3.2rem)",
                lineHeight: "1.15",
                marginBottom: "14px",
              }}
            >
              Explore Our Research Solutions
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "1.02rem",
                lineHeight: "1.8",
                maxWidth: "860px",
                margin: "0 auto",
              }}
            >
              Access ready-to-use intelligence products or send an enquiry for
              specialized research support based on your business requirements.
            </p>
          </div>

          <div className="row g-4">
            {categories.map((item, index) => (
              <div key={index} className="col-12 col-md-6 col-xl-3">
                {renderCard(item, index)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {isEnquiryOpen && (
        <div
          onClick={closeEnquiryModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.58)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "820px",
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 24px 70px rgba(15, 23, 42, 0.22)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                padding: "28px 28px 18px 28px",
                borderBottom: "1px solid #e8edf5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#2f45bf",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "1.4px",
                    marginBottom: "8px",
                  }}
                >
                  ENQUIRY FORM
                </div>
                <h3
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: "30px",
                    fontWeight: 800,
                    lineHeight: "1.2",
                  }}
                >
                  Request More Information
                </h3>
                <p
                  style={{
                    margin: "10px 0 0 0",
                    color: "#64748b",
                    fontSize: "15px",
                    lineHeight: "1.7",
                  }}
                >
                  You are enquiring about{" "}
                  <span style={{ color: "#2f45bf", fontWeight: 800 }}>
                    {selectedCategory}
                  </span>
                  .
                </p>
              </div>

              <button
                type="button"
                onClick={closeEnquiryModal}
                disabled={submittingEnquiry}
                style={{
                  border: "none",
                  background: "#f3f6fb",
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  fontSize: "24px",
                  lineHeight: 1,
                  color: "#64748b",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "24px 28px 28px 28px" }}>
              {enquiryStatus.message ? (
                <div
                  style={{
                    marginBottom: "18px",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    fontSize: "14px",
                    fontWeight: 700,
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
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Name <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter your name"
                      value={enquiryForm.name}
                      onChange={handleEnquiryChange}
                      required
                      style={{
                        height: "50px",
                        borderRadius: "14px",
                        border: "1px solid #d7dfef",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Company Name <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="company_name"
                      placeholder="Enter your company name"
                      value={enquiryForm.company_name}
                      onChange={handleEnquiryChange}
                      required
                      style={{
                        height: "50px",
                        borderRadius: "14px",
                        border: "1px solid #d7dfef",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Email <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      value={enquiryForm.email}
                      onChange={handleEnquiryChange}
                      required
                      style={{
                        height: "50px",
                        borderRadius: "14px",
                        border: "1px solid #d7dfef",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Designation
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="designation"
                      placeholder="Enter your designation"
                      value={enquiryForm.designation}
                      onChange={handleEnquiryChange}
                      style={{
                        height: "50px",
                        borderRadius: "14px",
                        border: "1px solid #d7dfef",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Phone Number <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={enquiryForm.phone}
                      onChange={handleEnquiryChange}
                      required
                      style={{
                        height: "50px",
                        borderRadius: "14px",
                        border: "1px solid #d7dfef",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      placeholder="Enter your location"
                      value={enquiryForm.location}
                      onChange={handleEnquiryChange}
                      style={{
                        height: "50px",
                        borderRadius: "14px",
                        border: "1px solid #d7dfef",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Area of Interest <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="area_of_interest"
                      value={enquiryForm.area_of_interest}
                      onChange={handleEnquiryChange}
                      required
                      style={{
                        height: "50px",
                        borderRadius: "14px",
                        border: "1px solid #d7dfef",
                        boxShadow: "none",
                        backgroundColor: "#f8fbff",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Preferred Mode of Contact <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      name="preferred_contact"
                      value={enquiryForm.preferred_contact}
                      onChange={handleEnquiryChange}
                      required
                      style={{
                        height: "50px",
                        borderRadius: "14px",
                        border: "1px solid #d7dfef",
                        boxShadow: "none",
                      }}
                    >
                      <option value="">Select contact method</option>
                      <option>Email</option>
                      <option>Phone</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label" style={{ fontWeight: 700, color: "#334155" }}>
                      Message <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="message"
                      placeholder="Enter your message"
                      rows={5}
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
                      fontWeight: 800,
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
                      fontWeight: 800,
                      opacity: submittingEnquiry ? 0.8 : 1,
                    }}
                  >
                    {submittingEnquiry ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}