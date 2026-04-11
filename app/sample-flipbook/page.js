"use client";

import React, { useEffect, useMemo, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function SampleFlipbookPage() {
  const [numPages, setNumPages] = useState(0);

  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const pdfUrl = searchParams?.get("pdf") || "";
  const title = searchParams?.get("title") || "Sample Report";

  const pages = useMemo(() => {
    return Array.from({ length: numPages }, (_, i) => i + 1);
  }, [numPages]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fc",
        padding: "24px 16px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: "6px 0 0 0",
                color: "#64748b",
                fontSize: "14px",
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
          <div
            style={{
              background: "#e8edf8",
              borderRadius: "24px",
              padding: "24px",
              display: "flex",
              justifyContent: "center",
              overflow: "auto",
            }}
          >
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading="Loading PDF...">
              {numPages > 0 ? (
                <HTMLFlipBook
                  width={420}
                  height={594}
                  size="stretch"
                  minWidth={280}
                  maxWidth={520}
                  minHeight={420}
                  maxHeight={720}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                >
                  {pages.map((pageNo) => (
                    <div
                      key={pageNo}
                      style={{
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #dbe3f1",
                      }}
                    >
                      <Page
                        pageNumber={pageNo}
                        width={420}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  ))}
                </HTMLFlipBook>
              ) : (
                <div style={{ padding: "40px", color: "#334155" }}>Loading pages...</div>
              )}
            </Document>
          </div>
        )}
      </div>
    </main>
  );
}