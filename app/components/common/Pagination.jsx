"use client";

import React from "react";

function getPaginationRange(currentPage, totalPages, siblingCount = 1) {
  const totalPageNumbers = siblingCount + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, "...", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );

  return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}) {
  if (!totalPages || totalPages < 1) return null;

  const safeCurrent = Math.min(Math.max(1, Number(currentPage) || 1), totalPages);
  const range = getPaginationRange(safeCurrent, totalPages, siblingCount);

  const goTo = (page) => {
    if (typeof onPageChange !== "function") return;
    if (page < 1 || page > totalPages || page === safeCurrent) return;
    onPageChange(page);
  };

  return (
    <nav
      className={`pagination-wrap ${className}`.trim()}
      role="navigation"
      aria-label="Pagination"
    >
      <ul className="pagination-list">
        <li>
          <button
            type="button"
            className="pagination-btn nav"
            onClick={() => goTo(safeCurrent - 1)}
            disabled={safeCurrent <= 1}
            aria-label="Previous page"
          >
            Prev
          </button>
        </li>

        {range.map((item, idx) => {
          if (item === "...") {
            return (
              <li key={`dots-${idx}`} aria-hidden="true">
                <span className="pagination-ellipsis">…</span>
              </li>
            );
          }

          const isActive = item === safeCurrent;
          return (
            <li key={item}>
              <button
                type="button"
                className={`pagination-btn${isActive ? " active" : ""}`}
                onClick={() => goTo(item)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            className="pagination-btn nav"
            onClick={() => goTo(safeCurrent + 1)}
            disabled={safeCurrent >= totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
