"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import BuyNowModal from "@/app/components/BuyNowModal";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const NAVBAR_OFFSET = 92;

export default function ReportDetailClientActions({ report }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pdfError, setPdfError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const flipBookRef = useRef(null);

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
    area_of_interest: report?.title || "",
    preferred_contact: "",
    message: report?.title
      ? `I would like to request a sample for: ${report.title}`
      : "",
  });

  const samplePdfUrl = report?.samplePdf || report?.sample_pdf || "";

  const flipbookPages = useMemo(
    () => Array.from({ length: numPages }, (_, i) => i + 1),
    [numPages]
  );

  useEffect(() => {
    if (isEnquiryOpen || isSampleOpen || isBuyNowOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isEnquiryOpen, isSampleOpen, isBuyNowOpen]);

  function openEnquiryModal() {
    setEnquiryStatus({ type: "", message: "" });
    setIsEnquiryOpen(true);
  }

  function closeEnquiryModal() {
    if (submittingEnquiry) return;
    setIsEnquiryOpen(false);
  }

  function openSamplePopup() {
    setNumPages(0);
    setPdfError("");
    setCurrentPage(1);
    setIsSampleOpen(true);
  }

  function closeSamplePopup() {
    setIsSampleOpen(false);
    setNumPages(0);
    setPdfError("");
    setCurrentPage(1);
  }

  function handleEnquiryChange(e) {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function onDocumentLoadSuccess({ numPages: totalPages }) {
    setNumPages(totalPages);
    setPdfError("");
    setCurrentPage(1);
  }

  function onDocumentLoadError(error) {
    console.error("PDF load error:", error);
    setPdfError("Failed to load sample PDF.");
    setNumPages(0);
  }

  function handleFlip(e) {
    setCurrentPage((e?.data || 0) + 1);
  }

  function goToPrevPage() {
    const book = flipBookRef.current?.pageFlip?.();
    if (book) book.flipPrev();
  }

  function goToNextPage() {
    const book = flipBookRef.current?.pageFlip?.();
    if (book) book.flipNext();
  }

  async function handleEnquirySubmit(e) {
    e.preventDefault();
    setSubmittingEnquiry(true);
    setEnquiryStatus({ type: "", message: "" });

    try {
      const payload = {
        ...enquiryForm,
        report_title: report?.title || "",
        report_slug: report?.slug || "",
        sample_pdf: samplePdfUrl || "",
      };

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Error submitting enquiry");
      }

      setEnquiryStatus({
        type: "success",
        message:
          samplePdfUrl && String(samplePdfUrl).trim()
            ? data?.message || "Enquiry submitted successfully"
            : "Request submitted successfully. Our team will contact you shortly.",
      });

      setEnquiryForm({
        name: "",
        company_name: "",
        email: "",
        designation: "",
        phone: "",
        location: "",
        area_of_interest: report?.title || "",
        preferred_contact: "",
        message: report?.title
          ? `I would like to request a sample for: ${report.title}`
          : "",
      });

      if (samplePdfUrl && String(samplePdfUrl).trim()) {
        setTimeout(() => {
          setIsEnquiryOpen(false);
          setEnquiryStatus({ type: "", message: "" });
          openSamplePopup();
        }, 350);
      } else {
        setTimeout(() => {
          setIsEnquiryOpen(false);
          setEnquiryStatus({ type: "", message: "" });
        }, 1200);
      }
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
      <div className="d-grid gap-2">
        <button
          type="button"
          className="btn"
          onClick={() => setIsBuyNowOpen(true)}
          style={{
            backgroundColor: "#3b4cca",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            minHeight: "58px",
          }}
        >
          Buy Now
        </button>

        <button
          type="button"
          className="btn"
          onClick={openEnquiryModal}
          style={{
            backgroundColor: "#22345f",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            minHeight: "58px",
          }}
        >
          Request Sample
        </button>
      </div>

      {isBuyNowOpen && (
        <BuyNowModal
          report={report}
          isOpen={isBuyNowOpen}
          onClose={() => setIsBuyNowOpen(false)}
        />
      )}

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
                  Request Sample
                </h3>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#647089",
                    fontSize: "15px",
                  }}
                >
                  Fill in your details to view the sample PDF for "{report?.title}".
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
                  <label className="form-label fw-bold">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={enquiryForm.name}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Company Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="company_name"
                    value={enquiryForm.company_name}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={enquiryForm.email}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    value={enquiryForm.designation}
                    onChange={handleEnquiryChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Phone Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={enquiryForm.phone}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={enquiryForm.location}
                    onChange={handleEnquiryChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Area of Interest *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="area_of_interest"
                    value={enquiryForm.area_of_interest}
                    onChange={handleEnquiryChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">
                    Preferred Mode of Contact *
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
                  <label className="form-label fw-bold">Message *</label>
                  <textarea
                    className="form-control"
                    name="message"
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
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingEnquiry}
                  className="btn"
                  style={{
                    backgroundColor: "#2f45bf",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 700,
                    opacity: submittingEnquiry ? 0.8 : 1,
                  }}
                >
                  {submittingEnquiry ? "Submitting..." : "Submit & View Sample"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSampleOpen && (
        <div
          onClick={closeSamplePopup}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.76) 0%, rgba(15,23,42,0.82) 100%)",
            zIndex: 10000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: `${NAVBAR_OFFSET}px 20px 20px`,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "1320px",
              height: `calc(100vh - ${NAVBAR_OFFSET + 20}px)`,
              backgroundColor: "#ffffff",
              borderRadius: "28px",
              boxShadow: "0 30px 90px rgba(15, 23, 42, 0.35)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                alignItems: "center",
                gap: "16px",
                padding: "20px 28px",
                borderBottom: "1px solid #e2e8f0",
                background: "#ffffff",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {report?.title || "Sample Report"}
                </h3>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: 1.4,
                  }}
                >
                  Flip through the sample pages
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {numPages > 0 && !pdfError ? (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevPage}
                      disabled={currentPage <= 1}
                      className="btn btn-outline-secondary"
                      style={{
                        minWidth: "96px",
                        height: "48px",
                        fontWeight: 700,
                        borderRadius: "14px",
                      }}
                    >
                      Prev
                    </button>

                    <div
                      style={{
                        minWidth: "72px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#334155",
                        fontSize: "15px",
                      }}
                    >
                      {currentPage} / {numPages}
                    </div>

                    <button
                      type="button"
                      onClick={goToNextPage}
                      disabled={currentPage >= numPages}
                      className="btn"
                      style={{
                        minWidth: "96px",
                        height: "48px",
                        backgroundColor: "#7380d8",
                        color: "#fff",
                        fontWeight: 700,
                        borderRadius: "14px",
                        border: "none",
                      }}
                    >
                      Next
                    </button>
                  </>
                ) : null}

                <button
                  type="button"
                  onClick={closeSamplePopup}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "38px",
                    lineHeight: 1,
                    color: "#475569",
                    cursor: "pointer",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "28px",
                overflow: "auto",
              }}
            >
              {!samplePdfUrl ? (
                <div
                  style={{
                    background: "#fff",
                    padding: "28px 34px",
                    borderRadius: "20px",
                    color: "#334155",
                    fontWeight: 700,
                    boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  Sample PDF not available.
                </div>
              ) : pdfError ? (
                <div
                  style={{
                    background: "#fff",
                    padding: "28px 34px",
                    borderRadius: "20px",
                    color: "#b91c1c",
                    fontWeight: 700,
                    boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  {pdfError}
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Document
                    file={samplePdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div
                        style={{
                          background: "#fff",
                          padding: "24px 28px",
                          borderRadius: "18px",
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        Loading PDF...
                      </div>
                    }
                    error={<div>Failed to load sample PDF.</div>}
                  >
                    {numPages > 0 ? (
                      <HTMLFlipBook
                        ref={flipBookRef}
                        width={520}
                        height={700}
                        minWidth={260}
                        maxWidth={560}
                        minHeight={340}
                        maxHeight={760}
                        size="stretch"
                        showCover={true}
                        drawShadow={true}
                        flippingTime={700}
                        usePortrait={true}
                        startPage={0}
                        autoSize={true}
                        mobileScrollSupport={true}
                        maxShadowOpacity={0.45}
                        clickEventForward={true}
                        useMouseEvents={true}
                        swipeDistance={30}
                        showPageCorners={true}
                        disableFlipByClick={false}
                        onFlip={handleFlip}
                        style={{
                          margin: "0 auto",
                          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.14)",
                          borderRadius: "12px",
                        }}
                      >
                        {flipbookPages.map((pageNum) => (
                          <div
                            key={pageNum}
                            style={{
                              backgroundColor: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #dbe3f1",
                              overflow: "hidden",
                            }}
                          >
                            <Page
                              pageNumber={pageNum}
                              width={520}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </div>
                        ))}
                      </HTMLFlipBook>
                    ) : (
                      <div
                        style={{
                          background: "#fff",
                          padding: "24px 28px",
                          borderRadius: "18px",
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        Preparing pages...
                      </div>
                    )}
                  </Document>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}