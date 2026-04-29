"use client";

import React, { useMemo, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as ReactPdfPage, pdfjs } from "react-pdf";
import useFlipbookPageSize from "../../lib/hooks/useFlipbookPageSize";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const FlipPage = React.forwardRef(function FlipPage(
  { pageNumber, pageWidth, pageHeight },
  ref
) {
  return (
    <div
      ref={ref}
      className="flipbook-page"
      style={{
        width: pageWidth,
        height: pageHeight,
        background: "#ffffff",
        overflow: "hidden",
        boxShadow: "0 18px 55px rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ReactPdfPage
        pageNumber={pageNumber}
        width={pageWidth}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={null}
      />
    </div>
  );
});

export default function SampleFlipbookPage() {
  const [numPages, setNumPages] = useState(0);
  const { pageWidth, pageHeight, isMobile } = useFlipbookPageSize();

  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const pdfUrl = searchParams?.get("pdf") || "";
  const title = searchParams?.get("title") || "Sample Report";

  const pages = useMemo(
    () => Array.from({ length: numPages }, (_, i) => i + 1),
    [numPages]
  );

  function onDocumentLoadSuccess({ numPages: total }) {
    setNumPages(total);
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(circle at center, #17202c 0%, #070b12 70%)",
        padding: isMobile ? "14px 12px 105px" : "24px 110px 125px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "6px 0 0 0",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            Flip through the sample report pages
          </p>
        </div>

        <a
          href="/"
          style={{
            textDecoration: "none",
            background: "#2f45bf",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "12px",
            fontWeight: 700,
          }}
        >
          Back
        </a>
      </div>

      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {!pdfUrl ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "center",
              border: "1px solid #e2e8f0",
            }}
          >
            No sample PDF found.
          </div>
        ) : (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div style={{ color: "#cbd5e1", padding: "24px" }}>
                Loading PDF...
              </div>
            }
          >
            {numPages > 0 ? (
              <HTMLFlipBook
                key={`${pageWidth}x${pageHeight}-${isMobile ? "p" : "l"}`}
                width={pageWidth}
                height={pageHeight}
                size="fixed"
                minWidth={pageWidth}
                maxWidth={pageWidth}
                minHeight={pageHeight}
                maxHeight={pageHeight}
                showCover={false}
                usePortrait={isMobile}
                mobileScrollSupport={true}
                drawShadow={true}
                flippingTime={700}
                swipeDistance={30}
                showPageCorners={!isMobile}
                maxShadowOpacity={0.5}
                className="premium-flipbook"
                style={{ margin: "0 auto" }}
              >
                {pages.map((pageNo) => (
                  <FlipPage
                    key={pageNo}
                    pageNumber={pageNo}
                    pageWidth={pageWidth}
                    pageHeight={pageHeight}
                  />
                ))}
              </HTMLFlipBook>
            ) : (
              <div style={{ padding: "40px", color: "#cbd5e1" }}>
                Loading pages...
              </div>
            )}
          </Document>
        )}
      </div>
    </main>
  );
}
