"use client";

import { useParams } from "next/navigation";
import { forwardRef, useState, useRef, useEffect, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
import {
  IoChevronBack,
  IoChevronForward,
  IoDownloadOutline,
  IoLockClosedOutline,
  IoClose,
} from "react-icons/io5";
import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";
import axios from "axios";
import "./flip.css";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Page = forwardRef(({ pageNumber, width, isCover = false }, ref) => {
  return (
    <div
      ref={ref}
      className={`flip-page ${isCover ? "flip-cover-page" : ""}`}
      data-density={isCover ? "hard" : "soft"}
    >
      <ReactPdfPage pageNumber={pageNumber} width={width} />
    </div>
  );
});
Page.displayName = "Page";

export default function Flip() {
  const { title_slug } = useParams();

  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [pageFormat, setPageFormat] = useState("a4-landscape");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerifyPassword, setIsVerifyPassword] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewport, setViewport] = useState({
    width: 1400,
    height: 900,
  });

  const book = useRef(null);

  const PAGE_FORMATS = {
    "a4-portrait": { width: 500, height: 707 },
    "a4-landscape": { width: 707, height: 500 },
  };

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatSize = PAGE_FORMATS[pageFormat] || PAGE_FORMATS["a4-landscape"];
  const isMobile = viewport.width <= 768;

  const layout = useMemo(() => {
    const sideButtonSpace = isMobile ? 0 : 140;
    const horizontalPadding = isMobile ? 12 : 80;
    const topArea = isMobile ? 105 : 120;
    const bottomToolbar = isMobile ? 104 : 104;
    const stageVerticalPadding = isMobile ? 12 : 36;

    const availableWidth = Math.max(
      220,
      viewport.width - sideButtonSpace - horizontalPadding
    );
    const availableHeight = Math.max(
      260,
      viewport.height - topArea - bottomToolbar - stageVerticalPadding
    );

    if (isMobile) {
      const singleScale = Math.min(
        availableWidth / formatSize.width,
        availableHeight / formatSize.height
      );

      const singleWidth = Math.floor(formatSize.width * singleScale);
      const singleHeight = Math.floor(formatSize.height * singleScale);

      return {
        width: singleWidth,
        height: singleHeight,
        usePortrait: true,
      };
    }

    const spreadScale = Math.min(
      availableWidth / (formatSize.width * 2),
      availableHeight / formatSize.height
    );

    const spreadPageWidth = Math.floor(formatSize.width * spreadScale);
    const spreadPageHeight = Math.floor(formatSize.height * spreadScale);

    return {
      width: spreadPageWidth,
      height: spreadPageHeight,
      usePortrait: false,
    };
  }, [viewport, formatSize, isMobile]);

  const pdfPageWidth = layout.width;

  useEffect(() => {
    const fetchFlipbook = async () => {
      try {
        const res = await axios.get(`/api/flipbook/${title_slug}`);
        const data = res.data?.[0];

        if (!data) {
          toast.error("Flipbook not found");
          return;
        }

        const fullUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${data.content}`;
        setPdfUrl(fullUrl);
        setShowDownload(data.download !== 0);
        setPageFormat(data.page_format || "a4-landscape");
      } catch (err) {
        console.error("Error fetching flipbook data:", err);
        toast.error("Unable to load flipbook");
      }
    };

    if (title_slug) fetchFlipbook();
  }, [title_slug]);

const nextPage = () => book.current?.pageFlip()?.flipNext();
const prevPage = () => book.current?.pageFlip()?.flipPrev();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onFlip = (e) => {
    setCurrentPage((e.data || 0) + 1);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsReady(true);
  };

  const openModal = () => {
    setPassword("");
    setPasswordError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPassword("");
    setPasswordError("");
    setIsModalOpen(false);
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post("/api/flipbook/verify-password", {
        title_slug,
        password,
      });

      if (response.status === 201) {
        setIsVerifyPassword(true);
        toast.success("Password verified successfully");
        closeModal();
      } else {
        setPasswordError("Incorrect password, please try again.");
      }
    } catch (error) {
      console.error("Password verification error:", error);
      setPasswordError("Incorrect password, please try again.");
    }
  };

  const flattenPdf = async () => {
    try {
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const pdfDoc = await PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas context not available");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const imageDataUrl = canvas.toDataURL("image/jpeg", 1.0);
        const imageBytes = await fetch(imageDataUrl).then((res) =>
          res.arrayBuffer()
        );

        const embeddedImage = await pdfDoc.embedJpg(imageBytes);
        const newPage = pdfDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "flipbook.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (err) {
      console.error("Flatten error:", err);
      toast.error("Failed to download PDF");
    }
  };

  useEffect(() => {
    if (isVerifyPassword && showDownload && pdfUrl) {
      flattenPdf();
      setIsVerifyPassword(false);
    }
  }, [isVerifyPassword, showDownload, pdfUrl]);

  return (
    <div className="flipbook-shell">
      <div className="flipbook-topbar">
        <div className="flipbook-topbar-inner">
          <div>
            <span className="flipbook-badge">DIGITAL FLIPBOOK</span>
            <h1 className="flipbook-title">RACE AUTO INDIA E-MAGAZINE</h1>
          </div>

          <div className="flipbook-page-counter">
            {isReady && numPages ? `${currentPage} / ${numPages}` : "Loading..."}
          </div>
        </div>
      </div>

      <div className="flipbook-stage">
        {!isMobile && (
          <button
            onClick={prevPage}
            className="flipbook-side-btn flipbook-side-btn-left"
            aria-label="Previous page"
            type="button"
          >
            <IoChevronBack />
          </button>
        )}

        <div className="flipbook-viewer-card">
          <div className="flipbook-viewer-inner">
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
              {isReady && numPages && (
                <HTMLFlipBook
                  key={`${pageFormat}-${layout.width}-${layout.height}-${layout.usePortrait}`}
                  ref={book}
                  showCover={true}
                  startPage={0}
                  width={layout.width}
                  height={layout.height}
                  minWidth={layout.width}
                  maxWidth={layout.width}
                  minHeight={layout.height}
                  maxHeight={layout.height}
                  size="fixed"
                  drawShadow={true}
                  maxShadowOpacity={0.16}
                  mobileScrollSupport={false}
                  usePortrait={layout.usePortrait}
                  startZIndex={0}
                  autoSize={false}
                  clickEventForward={false}
                  useMouseEvents={true}
                  swipeDistance={30}
                  showPageCorners={!isMobile}
                  disableFlipByClick={true}
                  flippingTime={850}
                  onFlip={onFlip}
                  className="premium-flipbook"
                  style={{ margin: "0 auto" }}
                >
                  {Array.from({ length: numPages }, (_, i) => {
                    const pageNumber = i + 1;
                    const isCover =
                      pageNumber === 1 || pageNumber === numPages;

                    return (
                      <Page
                        key={i}
                        pageNumber={pageNumber}
                        width={pdfPageWidth}
                        isCover={isCover}
                      />
                    );
                  })}
                </HTMLFlipBook>
              )}
            </Document>
          </div>
        </div>

        {!isMobile && (
          <button
            onClick={nextPage}
            className="flipbook-side-btn flipbook-side-btn-right"
            aria-label="Next page"
            type="button"
          >
            <IoChevronForward />
          </button>
        )}
      </div>

      <div className="flipbook-toolbar">
        <div className="flipbook-toolbar-inner">
          <button
            onClick={prevPage}
            className="flipbook-tool-btn"
            title="Previous"
            type="button"
          >
            <IoChevronBack />
          </button>

          <div className="flipbook-page-chip">
            Page {isReady && numPages ? `${currentPage} of ${numPages}` : "..."}
          </div>

          <button
            onClick={nextPage}
            className="flipbook-tool-btn"
            title="Next"
            type="button"
          >
            <IoChevronForward />
          </button>

          <div className="flipbook-toolbar-divider" />

          {showDownload ? (
            <button
              onClick={openModal}
              className="flipbook-download-btn"
              title="Download PDF"
              type="button"
            >
              <IoDownloadOutline />
              <span>Download</span>
            </button>
          ) : (
            <button
              className="flipbook-download-btn disabled"
              disabled
              type="button"
            >
              <IoLockClosedOutline />
              <span>Download Locked</span>
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="flipbook-modal-overlay" onClick={closeModal}>
          <div className="flipbook-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="flipbook-modal-close"
              onClick={closeModal}
              type="button"
            >
              <IoClose />
            </button>

            <div className="flipbook-modal-header">
              <div className="flipbook-modal-icon">
                <IoLockClosedOutline />
              </div>
              <h2>Enter Password</h2>
              <p>Enter the download password to access this PDF.</p>
            </div>

            <div className="flipbook-modal-body">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="flipbook-password-input"
              />

              {passwordError ? (
                <p className="flipbook-password-error">{passwordError}</p>
              ) : null}

              <div className="flipbook-modal-actions">
                <button
                  className="flipbook-secondary-btn"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="flipbook-primary-btn"
                  onClick={handlePasswordSubmit}
                  type="button"
                >
                  Verify & Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}