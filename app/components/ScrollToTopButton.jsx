"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopButton() {
  const pathname = usePathname();
  const path = pathname || "";
  if (
    path.startsWith("/admin") ||
    path.startsWith("/reports/flipbook") ||
    path.startsWith("/sample-flipbook")
  ) {
    return null;
  }

  function scrollToTop() {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      <button
        type="button"
        className="outer-scroll-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>

      <style jsx>{`
        .outer-scroll-top-btn {
          position: fixed;
          left: 24px;
          right: auto;
          bottom: 24px;
          z-index: 9996;
          width: 58px;
          height: 58px;
          border-radius: 999px;
          border: none;
          background: #2f45bf;
          color: #ffffff;
          font-size: 30px;
          font-weight: 700;
          line-height: 1;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 36px rgba(47, 69, 191, 0.30);
          cursor: pointer;
          opacity: 1 !important;
          visibility: visible !important;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .outer-scroll-top-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 44px rgba(47, 69, 191, 0.36);
        }

        @media (max-width: 767px) {
          .outer-scroll-top-btn {
            left: 16px;
            right: auto;
            bottom: 18px;
            width: 52px;
            height: 52px;
            font-size: 26px;
          }
        }
      `}</style>
    </>
  );
}
