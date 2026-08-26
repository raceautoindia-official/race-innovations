"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

/**
 * Expand/collapse FAQ list for the Market Reports page.
 * Answers stay in the DOM (collapsed via CSS max-height) so they remain
 * crawlable for SEO — the FAQPage JSON-LD is rendered separately server-side.
 */
export default function FaqAccordion({ faqs = [] }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="mr-faq-list">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div className={`mr-faq-item${isOpen ? " open" : ""}`} key={idx}>
            <button
              type="button"
              className="mr-faq-q"
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
            >
              <h3 className="mr-faq-q-text">{faq.question}</h3>
              <FaChevronDown className="mr-faq-chev" aria-hidden="true" />
            </button>
            <div className="mr-faq-a">
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .mr-faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mr-faq-item {
          border: 1px solid #e5ebf7;
          border-radius: 14px;
          background: #fafbfe;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease,
            background 0.2s ease;
        }
        .mr-faq-item.open {
          background: #ffffff;
          border-color: #c9d5f2;
          box-shadow: 0 10px 26px rgba(20, 30, 70, 0.06);
        }
        .mr-faq-q {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          text-align: left;
          background: transparent;
          border: none;
          padding: 16px 18px;
          cursor: pointer;
        }
        .mr-faq-q-text {
          margin: 0;
          font-size: 1.02rem;
          font-weight: 800;
          color: #1f2f63;
          line-height: 1.35;
        }
        .mr-faq-chev {
          flex-shrink: 0;
          color: #2f45bf;
          font-size: 0.85rem;
          transition: transform 0.25s ease;
        }
        .mr-faq-item.open .mr-faq-chev {
          transform: rotate(180deg);
        }
        .mr-faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .mr-faq-item.open .mr-faq-a {
          max-height: 600px;
        }
        .mr-faq-a p {
          margin: 0;
          padding: 0 18px 16px;
          color: #475467;
          font-size: 0.96rem;
          line-height: 1.65;
        }
      `}</style>
    </div>
  );
}
