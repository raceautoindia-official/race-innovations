"use client";

import React, {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { pdfjs } from "react-pdf";
import "./video.css";
import "core-js/full/promise/with-resolvers";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function LeftArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RightArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 4V15M12 15L7 10M12 15L17 10M5 19H19"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FlipPage = forwardRef(function FlipPage(
  { src, pageWidth, pageHeight, label },
  ref
) {
  return (
    <div
      className="corporate-flip-page"
      ref={ref}
      style={{
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
      }}
    >
      <div className="corporate-page-content">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={label || "Corporate profile page"}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div className="corporate-page-loading">Loading…</div>
        )}
      </div>
    </div>
  );
});

const StaticPDFViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [pageRatio, setPageRatio] = useState(0.707);
  const [pageImages, setPageImages] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [controlsVisible, setControlsVisible] = useState(false);
  const [viewerSize, setViewerSize] = useState({
    pageWidth: 620,
    pageHeight: 438,
  });
  const flipBookRef = useRef(null);
  const pdfUrl = "/pdf/corporate.pdf";

  // Load and pre-render every PDF page to an image data URL.
  useEffect(() => {
    let cancelled = false;
    let loadingTask;

    async function loadAndRender() {
      try {
        loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        setNumPages(pdf.numPages);
        setPageNumber(1);

        const firstPage = await pdf.getPage(1);
        const viewport1 = firstPage.getViewport({ scale: 1 });
        if (!cancelled && viewport1.width > 0 && viewport1.height > 0) {
          setPageRatio(viewport1.height / viewport1.width);
        }

        const images = new Array(pdf.numPages).fill(null);
        const renderScale = Math.min(
          2,
          (typeof window !== "undefined" && window.devicePixelRatio) || 1.5
        );

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          try {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: renderScale });

            const canvas = document.createElement("canvas");
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            const ctx = canvas.getContext("2d");

            await page.render({ canvasContext: ctx, viewport }).promise;
            images[i - 1] = canvas.toDataURL("image/jpeg", 0.92);

            // Stream images in as they finish so users see early pages quickly.
            if (!cancelled) {
              setPageImages([...images]);
            }
          } catch (err) {
            console.error("Failed rendering page", i, err);
          }
        }
      } catch (err) {
        console.error("Failed to load PDF:", err);
        if (!cancelled) {
          setLoadError("Unable to load corporate profile PDF.");
        }
      }
    }

    loadAndRender();

    return () => {
      cancelled = true;
      if (loadingTask?.destroy) {
        try {
          loadingTask.destroy();
        } catch {}
      }
    };
  }, []);

  // Compute page size to fill 90-94% of the viewport while preserving the
  // real PDF aspect ratio detected from page 1.
  useEffect(() => {
    if (typeof window === "undefined") return;

    function updateSize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;
      setIsMobile(mobile);

      const PAGE_RATIO = pageRatio > 0 ? pageRatio : 1; // height / width

      const navbarHeight = 72;
      const verticalPadding = mobile ? 12 : 16;

      const availableHeight = Math.max(
        320,
        Math.floor((vh - navbarHeight - verticalPadding) * 0.99)
      );

      const availableWidth = mobile
        ? vw - 12
        : Math.min(vw * 0.97, 1820);

      let pageWidth = mobile ? availableWidth : availableWidth / 2;
      let pageHeight = pageWidth * PAGE_RATIO;

      if (pageHeight > availableHeight) {
        pageHeight = availableHeight;
        pageWidth = pageHeight / PAGE_RATIO;
      }

      setViewerSize({
        pageWidth: Math.floor(pageWidth),
        pageHeight: Math.floor(pageHeight),
      });
    }

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [pageRatio]);

  const handleFlip = (e) => {
    const idx = typeof e?.data === "number" ? e.data : 0;
    setPageNumber(idx + 1);
  };

  const goPrev = () => {
    if (flipBookRef.current?.pageFlip) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const goNext = () => {
    if (flipBookRef.current?.pageFlip) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const isFirst = pageNumber <= 1;
  const isLast = numPages ? pageNumber >= numPages : true;

  const counterText = useMemo(() => {
    if (!numPages) return "Loading…";
    if (isMobile || pageNumber + 1 > numPages) {
      return `Page ${pageNumber} of ${numPages}`;
    }
    return `Pages ${pageNumber} – ${pageNumber + 1} of ${numPages}`;
  }, [pageNumber, numPages, isMobile]);

  const renderFlipBook = () => {
    if (!numPages) return null;

    return (
      <HTMLFlipBook
        ref={flipBookRef}
        width={viewerSize.pageWidth}
        height={viewerSize.pageHeight}
        size="fixed"
        minWidth={260}
        maxWidth={1200}
        minHeight={360}
        maxHeight={1700}
        showCover={true}
        flippingTime={650}
        usePortrait={isMobile}
        mobileScrollSupport={true}
        drawShadow={true}
        maxShadowOpacity={0.4}
        className="rps-flipbook"
        onFlip={handleFlip}
      >
        {Array.from({ length: numPages }, (_, idx) => (
          <FlipPage
            key={idx + 1}
            src={pageImages[idx] || null}
            pageWidth={viewerSize.pageWidth}
            pageHeight={viewerSize.pageHeight}
            label={`Corporate profile page ${idx + 1}`}
          />
        ))}
      </HTMLFlipBook>
    );
  };

  const handleReaderTap = () => {
    if (isMobile) {
      setControlsVisible((v) => !v);
    }
  };

  return (
    <section
      className={`corporate-profile-reader${
        controlsVisible ? " controls-visible" : ""
      }`}
      onClick={handleReaderTap}
    >
      <div className="flipbook-shell">
        <button
          type="button"
          className="flip-side-btn flip-side-btn-left"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          disabled={isFirst}
          aria-label="Previous page"
        >
          <LeftArrowIcon />
        </button>

        <div className="flipbook-stage">
          {loadError ? (
            <div className="flipbook-loading">{loadError}</div>
          ) : numPages ? (
            renderFlipBook()
          ) : (
            <div className="flipbook-loading">Loading corporate profile…</div>
          )}
        </div>

        <button
          type="button"
          className="flip-side-btn flip-side-btn-right"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          disabled={isLast}
          aria-label="Next page"
        >
          <RightArrowIcon />
        </button>

        <div
          className="flipbook-control-bar"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="ctrl-btn ctrl-btn-icon"
            onClick={goPrev}
            disabled={isFirst}
            aria-label="Previous page"
            title="Previous page"
          >
            <LeftArrowIcon />
          </button>

          <div className="ctrl-counter">{counterText}</div>

          <button
            type="button"
            className="ctrl-btn ctrl-btn-icon"
            onClick={goNext}
            disabled={isLast}
            aria-label="Next page"
            title="Next page"
          >
            <RightArrowIcon />
          </button>

          <a
            href={pdfUrl}
            download
            title="Download PDF"
            className="ctrl-btn ctrl-btn-primary"
          >
            <DownloadIcon />
            Download
          </a>
        </div>
      </div>
    </section>
  );
};

export default StaticPDFViewer;
