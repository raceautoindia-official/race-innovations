"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BuyNowModal from "../components/BuyNowModal";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as ReactPdfPage, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  isValidIndianMobile,
  normalizeIndianMobile,
  INVALID_MOBILE_MESSAGE,
} from "../../lib/validation/phone";
import useFlipbookPageSize from "../../lib/hooks/useFlipbookPageSize";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const FlipPage = React.forwardRef(function FlipPage(
  { pageNumber, pageWidth, pageHeight, isCover = false },
  ref
) {
  return (
    <div
      ref={ref}
      className="book-page"
      style={{
        width: pageWidth,
        height: pageHeight,
        background: "#ffffff",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isCover
          ? "inset 0 0 0 1px rgba(0,0,0,0.06)"
          : "inset 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {!isCover && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "18px",
            left: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0.04), transparent)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      )}
      <ReactPdfPage
        pageNumber={pageNumber}
        width={pageWidth}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading=""
        devicePixelRatio={
          typeof window !== "undefined"
            ? Math.min(2, window.devicePixelRatio || 1)
            : 1
        }
      />
    </div>
  );
});

export default function ReportDetailClientActions({ report }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pdfError, setPdfError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (isSampleOpen) {
      document.body.classList.add("reader-open");
    } else {
      document.body.classList.remove("reader-open");
    }
    return () => {
      document.body.classList.remove("reader-open");
    };
  }, [isSampleOpen]);

  const pageSize = useFlipbookPageSize();
  const isMobile = pageSize.isMobile;
  const viewerSize = {
    pageWidth: pageSize.pageWidth,
    pageHeight: pageSize.pageHeight,
  };
  const stageBottom = pageSize.toolbarHeight + pageSize.bottomSafe;
  const stageTop = pageSize.topSafe;

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

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    if (!isSampleOpen) return undefined;
    function onKeyDown(event) {
      if (event.key === "ArrowLeft") {
        const api = flipBookRef.current?.pageFlip?.();
        if (api) api.flipPrev();
      } else if (event.key === "ArrowRight") {
        const api = flipBookRef.current?.pageFlip?.();
        if (api) api.flipNext();
      } else if (event.key === "Escape") {
        setIsSampleOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSampleOpen]);

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

  function getPageFlip() {
    return flipBookRef.current?.pageFlip?.();
  }

  function goToPrevPage(e) {
    e?.stopPropagation?.();
    const pageFlip = getPageFlip();
    if (pageFlip) pageFlip.flipPrev();
  }

  function goToNextPage(e) {
    e?.stopPropagation?.();
    const pageFlip = getPageFlip();
    if (pageFlip) pageFlip.flipNext();
  }

  function goToPage(n) {
    const pageFlip = getPageFlip();
    if (!pageFlip) return;
    const target = Math.max(1, Math.min(Number(n) || 1, numPages));
    pageFlip.flip(target - 1);
  }

  function handlePageInputCommit() {
    const n = parseInt(pageInput, 10);
    if (Number.isNaN(n)) {
      setPageInput(String(currentPage));
      return;
    }
    goToPage(n);
  }

  async function handleEnquirySubmit(e) {
    e.preventDefault();

    if (!isValidIndianMobile(enquiryForm.phone)) {
      setEnquiryStatus({ type: "error", message: INVALID_MOBILE_MESSAGE });
      return;
    }

    setSubmittingEnquiry(true);
    setEnquiryStatus({ type: "", message: "" });

    try {
      const payload = {
        ...enquiryForm,
        phone: normalizeIndianMobile(enquiryForm.phone),
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
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={enquiryForm.phone}
                    onChange={handleEnquiryChange}
                    pattern="^(\+?91[\s-]?)?[6-9]\d{9}$"
                    title={INVALID_MOBILE_MESSAGE}
                    inputMode="tel"
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

      {isSampleOpen && mounted && createPortal(
        <div
          className="reader-shell"
          onClick={closeSamplePopup}
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100dvh",
            background:
              "radial-gradient(ellipse at center, #1f2937 0%, #0b0f17 70%, #05070b 100%)",
            zIndex: 2147483647,
            overflow: "hidden",
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeSamplePopup();
            }}
            aria-label="Close"
            style={{
              position: "fixed",
              top: isMobile ? "14px" : "22px",
              right: isMobile ? "14px" : "26px",
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "26px",
              lineHeight: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              zIndex: 100002,
            }}
          >
            ×
          </button>

          <div
            className="reader-stage"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: `${stageTop}px`,
              left: 0,
              right: 0,
              bottom: `${stageBottom}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "0 4px" : "0 8px",
              overflow: "hidden",
              zIndex: 100000,
            }}
          >
            {!samplePdfUrl ? (
              <div
                style={{
                  background: "#fff",
                  padding: "28px 34px",
                  borderRadius: "16px",
                  color: "#334155",
                  fontWeight: 700,
                  boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
                }}
              >
                Sample PDF not available.
              </div>
            ) : pdfError ? (
              <div
                style={{
                  background: "#fff",
                  padding: "28px 34px",
                  borderRadius: "16px",
                  color: "#b91c1c",
                  fontWeight: 700,
                  boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
                }}
              >
                {pdfError}
              </div>
            ) : (
              <Document
                file={samplePdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div
                    style={{
                      background: "#fff",
                      padding: "24px 28px",
                      borderRadius: "14px",
                      fontWeight: 600,
                      color: "#334155",
                    }}
                  >
                    Loading PDF...
                  </div>
                }
                error={
                  <div
                    style={{
                      background: "#fff",
                      padding: "24px 28px",
                      borderRadius: "14px",
                      fontWeight: 600,
                      color: "#b91c1c",
                    }}
                  >
                    Failed to load sample PDF.
                  </div>
                }
              >
                {numPages > 0 ? (
                  <div
                    className="book-holder"
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      margin: "0 auto",
                      filter:
                        "drop-shadow(0 22px 48px rgba(0,0,0,0.5))",
                    }}
                  >
                    <HTMLFlipBook
                      key={`${viewerSize.pageWidth}x${viewerSize.pageHeight}-${isMobile ? "p" : "l"}`}
                      ref={flipBookRef}
                      width={viewerSize.pageWidth}
                      height={viewerSize.pageHeight}
                      size="fixed"
                      minWidth={viewerSize.pageWidth}
                      maxWidth={viewerSize.pageWidth}
                      minHeight={viewerSize.pageHeight}
                      maxHeight={viewerSize.pageHeight}
                      showCover={false}
                      drawShadow={true}
                      flippingTime={700}
                      usePortrait={isMobile}
                      startPage={0}
                      autoSize={false}
                      mobileScrollSupport={true}
                      maxShadowOpacity={0.5}
                      clickEventForward={true}
                      useMouseEvents={true}
                      swipeDistance={30}
                      showPageCorners={!isMobile}
                      disableFlipByClick={false}
                      onFlip={handleFlip}
                      className="premium-flipbook"
                      style={{
                        margin: "0 auto",
                        background: "transparent",
                      }}
                    >
                      {flipbookPages.map((pageNum, index) => (
                        <FlipPage
                          key={pageNum}
                          pageNumber={pageNum}
                          pageWidth={viewerSize.pageWidth}
                          pageHeight={viewerSize.pageHeight}
                          isCover={index === 0}
                        />
                      ))}
                    </HTMLFlipBook>

                    {!isMobile ? (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: "50%",
                          width: "26px",
                          transform: "translateX(-50%)",
                          background:
                            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)",
                          pointerEvents: "none",
                          zIndex: 2,
                          mixBlendMode: "multiply",
                        }}
                      />
                    ) : null}
                  </div>
                ) : (
                  <div
                    style={{
                      background: "#fff",
                      padding: "24px 28px",
                      borderRadius: "14px",
                      fontWeight: 600,
                      color: "#334155",
                    }}
                  >
                    Preparing pages...
                  </div>
                )}
              </Document>
            )}
          </div>

          {numPages > 0 && !pdfError ? (
            <>
              <button
                type="button"
                onClick={goToPrevPage}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                style={{
                  position: "fixed",
                  display: isMobile ? "none" : "flex",
                  left: "max(28px, calc(50% - 47vw))",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "56px",
                  height: "56px",
                  borderRadius: "999px",
                  border: "none",
                  background:
                    currentPage <= 1
                      ? "rgba(20,184,166,0.35)"
                      : "linear-gradient(180deg, #14b8a6 0%, #0d9488 100%)",
                  color: "#ffffff",
                  fontSize: "26px",
                  fontWeight: 800,
                  cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 10px 30px rgba(13, 148, 136, 0.45), inset 0 0 0 1px rgba(255,255,255,0.18)",
                  zIndex: 100001,
                  opacity: currentPage <= 1 ? 0.55 : 1,
                  transition: "transform 0.15s ease",
                }}
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage >= numPages}
                aria-label="Next page"
                style={{
                  position: "fixed",
                  display: isMobile ? "none" : "flex",
                  right: "max(28px, calc(50% - 47vw))",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "56px",
                  height: "56px",
                  borderRadius: "999px",
                  border: "none",
                  background:
                    currentPage >= numPages
                      ? "rgba(20,184,166,0.35)"
                      : "linear-gradient(180deg, #14b8a6 0%, #0d9488 100%)",
                  color: "#ffffff",
                  fontSize: "26px",
                  fontWeight: 800,
                  cursor:
                    currentPage >= numPages ? "not-allowed" : "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 10px 30px rgba(13, 148, 136, 0.45), inset 0 0 0 1px rgba(255,255,255,0.18)",
                  zIndex: 100001,
                  opacity: currentPage >= numPages ? 0.55 : 1,
                  transition: "transform 0.15s ease",
                }}
              >
                ›
              </button>
            </>
          ) : null}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "8px" : "14px",
              padding: isMobile ? "8px 10px" : "10px 16px",
              background: "rgba(15, 23, 42, 0.78)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "999px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              color: "#e2e8f0",
              fontWeight: 600,
              zIndex: 100001,
              maxWidth: "calc(100vw - 24px)",
              flexWrap: "nowrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "999px",
                padding: "4px 10px",
                fontSize: "13px",
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                value={pageInput}
                onChange={(e) =>
                  setPageInput(e.target.value.replace(/[^0-9]/g, ""))
                }
                onBlur={handlePageInputCommit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handlePageInputCommit();
                  }
                }}
                disabled={!numPages}
                style={{
                  width: "44px",
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: 700,
                  outline: "none",
                  fontSize: "14px",
                  padding: 0,
                }}
              />
              <span style={{ color: "#94a3b8" }}>/</span>
              <span style={{ color: "#cbd5e1", fontWeight: 700 }}>
                {numPages || "–"}
              </span>
            </div>

            <div
              style={{
                background: "rgba(20,184,166,0.18)",
                color: "#5eead4",
                borderRadius: "999px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 700,
                border: "1px solid rgba(20,184,166,0.35)",
                whiteSpace: "nowrap",
              }}
            >
              100%
            </div>

            <button
              type="button"
              onClick={goToPrevPage}
              disabled={!numPages || currentPage <= 1}
              aria-label="Previous"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#cbd5e1",
                cursor:
                  !numPages || currentPage <= 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                opacity: !numPages || currentPage <= 1 ? 0.5 : 1,
              }}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={!numPages || currentPage >= numPages}
              aria-label="Next"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#cbd5e1",
                cursor:
                  !numPages || currentPage >= numPages
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                opacity: !numPages || currentPage >= numPages ? 0.5 : 1,
              }}
            >
              ›
            </button>

            <button
              type="button"
              aria-label="Sound"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#cbd5e1",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
              onClick={(e) => e.preventDefault()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </button>

            <button
              type="button"
              onClick={closeSamplePopup}
              aria-label="Exit"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#cbd5e1",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setIsBuyNowOpen(true)}
              style={{
                background:
                  "linear-gradient(180deg, #f97316 0%, #ea580c 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: isMobile ? "8px 14px" : "10px 18px",
                fontWeight: 800,
                fontSize: isMobile ? "12px" : "13px",
                letterSpacing: "0.3px",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow:
                  "0 10px 24px rgba(234, 88, 12, 0.45), inset 0 0 0 1px rgba(255,255,255,0.15)",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
