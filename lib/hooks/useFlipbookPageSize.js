"use client";

import { useEffect, useState } from "react";

const PAGE_ASPECT = 1.414;

function compute() {
  if (typeof window === "undefined") {
    return {
      pageWidth: 700,
      pageHeight: 495,
      isMobile: false,
      stageHeight: 720,
      toolbarHeight: 78,
      topSafe: 4,
      bottomSafe: 6,
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 768;

  const toolbarHeight = isMobile ? 70 : 78;
  const topSafe = isMobile ? 4 : 4;
  const bottomSafe = isMobile ? 4 : 6;

  const stageHeight = Math.max(
    220,
    vh - toolbarHeight - topSafe - bottomSafe
  );

  const maxSpreadWidth = vw * (isMobile ? 0.98 : 0.98);
  const maxPageHeight = stageHeight;

  let pageWidth;
  let pageHeight;

  if (isMobile) {
    const fromHeightWidth = maxPageHeight * PAGE_ASPECT;
    if (fromHeightWidth <= maxSpreadWidth) {
      pageHeight = maxPageHeight;
      pageWidth = pageHeight * PAGE_ASPECT;
    } else {
      pageWidth = maxSpreadWidth;
      pageHeight = pageWidth / PAGE_ASPECT;
    }
  } else {
    const fromHeightSpread = 2 * maxPageHeight * PAGE_ASPECT;
    if (fromHeightSpread <= maxSpreadWidth) {
      pageHeight = maxPageHeight;
      pageWidth = pageHeight * PAGE_ASPECT;
    } else {
      pageWidth = maxSpreadWidth / 2;
      pageHeight = pageWidth / PAGE_ASPECT;
    }
  }

  return {
    pageWidth: Math.max(260, Math.floor(pageWidth)),
    pageHeight: Math.max(180, Math.floor(pageHeight)),
    isMobile,
    stageHeight: Math.floor(stageHeight),
    toolbarHeight,
    topSafe,
    bottomSafe,
  };
}

export default function useFlipbookPageSize() {
  const [size, setSize] = useState(() => compute());

  useEffect(() => {
    function update() {
      const next = compute();
      setSize(next);
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("flipbook size", {
          viewportW: window.innerWidth,
          viewportH: window.innerHeight,
          stageHeight: next.stageHeight,
          pageWidth: next.pageWidth,
          pageHeight: next.pageHeight,
          spreadWidth: next.pageWidth * (next.isMobile ? 1 : 2),
        });
      }
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return size;
}
