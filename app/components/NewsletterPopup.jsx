"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NEWSLETTER_KEY = "race_newsletter_popup_v1";
const COOKIE_KEY = "race_cookie_consent_v1";
const COOKIE_EVENT = "race-cookie-consent-changed";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let newsletterSaved = null;
    try {
      newsletterSaved = window.localStorage.getItem(NEWSLETTER_KEY);
    } catch {
      newsletterSaved = null;
    }

    if (newsletterSaved) return;

    let cookieSaved = null;
    try {
      cookieSaved = window.localStorage.getItem(COOKIE_KEY);
    } catch {
      cookieSaved = null;
    }

    let timer;

    if (cookieSaved) {
      // Cookie consent already handled in a previous session — show
      // newsletter popup after a short delay.
      timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }

    // Cookie banner is showing first. Wait until the user accepts/rejects
    // it (CookieConsent dispatches "race-cookie-consent-changed"), then
    // show the newsletter popup after a comfortable delay so the two
    // never appear at the same time.
    function handleConsentChange() {
      window.removeEventListener(COOKIE_EVENT, handleConsentChange);
      timer = setTimeout(() => setVisible(true), 1500);
    }

    window.addEventListener(COOKIE_EVENT, handleConsentChange);

    return () => {
      window.removeEventListener(COOKIE_EVENT, handleConsentChange);
      if (timer) clearTimeout(timer);
    };
  }, []);

  function persistStatus(value) {
    try {
      window.localStorage.setItem(
        NEWSLETTER_KEY,
        JSON.stringify({ status: value, savedAt: new Date().toISOString() })
      );
    } catch {}
  }

  function close() {
    persistStatus("dismissed");
    setVisible(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      setStatus({ type: "error", message: "Please enter your email." });
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const sourcePage =
        typeof window !== "undefined" ? window.location.pathname : "";

      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName || null,
          email: trimmedEmail,
          source_page: sourcePage,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        setStatus({
          type: "success",
          message: data?.message || "Subscribed successfully.",
        });
        persistStatus("subscribed");
        setTimeout(() => setVisible(false), 1500);
      } else if (data?.alreadySubscribed) {
        setStatus({
          type: "info",
          message:
            data?.message || "This email is already subscribed.",
        });
        persistStatus("already_subscribed");
        setTimeout(() => setVisible(false), 1500);
      } else {
        setStatus({
          type: "error",
          message:
            data?.message || "Subscription failed. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if ((pathname || "").startsWith("/admin")) return null;
  if (!visible) return null;

  return (
    <div
      className="race-newsletter-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe to RACE Innovations newsletter"
      onClick={close}
    >
      <div
        className="race-newsletter-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="race-newsletter-close"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>

        <div className="newsletter-popup-badge">EMAIL INSIGHTS</div>

        <h2 className="race-newsletter-title">
          Get Automotive Market Updates{" "}
          <span className="race-newsletter-title-accent">
            in Your Inbox
          </span>
        </h2>

        <p className="race-newsletter-subtitle">
          Subscribe and we&rsquo;ll send short automotive sales trends, EV
          updates, forecast insights, and market report highlights directly to
          your email.
        </p>

        <div className="newsletter-benefits">
          <div className="newsletter-benefit">
            <span aria-hidden="true">✉️</span>
            <p>Quick monthly insights by email</p>
          </div>

          <div className="newsletter-benefit">
            <span aria-hidden="true">⚡</span>
            <p>EV, OEM and vehicle sales updates</p>
          </div>

          <div className="newsletter-benefit">
            <span aria-hidden="true">📊</span>
            <p>New report alerts from RACE Innovations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="race-newsletter-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            autoComplete="name"
            disabled={submitting}
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email address"
            autoComplete="email"
            required
            disabled={submitting}
          />

          {status.message ? (
            <div
              className={`race-newsletter-status race-newsletter-status-${status.type}`}
              role={status.type === "error" ? "alert" : "status"}
            >
              {status.message}
            </div>
          ) : null}

          <button
            type="submit"
            className="race-newsletter-submit"
            disabled={submitting}
          >
            {submitting ? "Subscribing…" : "Subscribe for Email Updates"}
          </button>

          <p className="race-newsletter-privacy">
            No spam. Only useful automotive market insights.
          </p>

          <button
            type="button"
            className="race-newsletter-skip"
            onClick={close}
            disabled={submitting}
          >
            No thanks
          </button>
        </form>
      </div>

      <style jsx>{`
        .race-newsletter-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          z-index: 9990;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: raceNlFadeIn 220ms ease-out;
        }

        @keyframes raceNlFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes raceNlPop {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .race-newsletter-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background:
            radial-gradient(circle at 14% 0%, rgba(47, 69, 191, 0.10), transparent 38%),
            radial-gradient(circle at 96% 8%, rgba(103, 232, 249, 0.10), transparent 36%),
            linear-gradient(180deg, #ffffff 0%, #f7faff 60%, #eef3ff 100%);
          border-radius: 24px;
          padding: 26px 26px 22px;
          box-shadow:
            0 30px 70px rgba(15, 23, 42, 0.30),
            0 0 0 1px rgba(47, 69, 191, 0.10) inset,
            0 1px 0 rgba(255, 255, 255, 0.95) inset;
          border: 1px solid rgba(47, 69, 191, 0.18);
          animation: raceNlPop 240ms ease-out;
        }

        .race-newsletter-close {
          position: absolute;
          top: 10px;
          right: 12px;
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          font-size: 22px;
          line-height: 1;
          color: #64748b;
          cursor: pointer;
          border-radius: 999px;
        }

        .race-newsletter-close:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .newsletter-popup-badge {
          display: inline-block;
          padding: 6px 12px;
          margin-bottom: 12px;
          border-radius: 999px;
          background: #eef2ff;
          border: 1px solid rgba(47, 69, 191, 0.20);
          color: #2f45bf;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .race-newsletter-title {
          margin: 0 0 8px;
          color: #0b1220;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.22;
          letter-spacing: -0.2px;
        }

        .race-newsletter-title-accent {
          color: #2f45bf;
          background: linear-gradient(90deg, #2f45bf, #1f2a8a);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .race-newsletter-subtitle {
          margin: 0 0 14px;
          color: #475569;
          font-size: 13.5px;
          line-height: 1.6;
        }

        .newsletter-benefits {
          display: grid;
          gap: 8px;
          margin-bottom: 16px;
        }

        .newsletter-benefit {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px 12px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(47, 69, 191, 0.10);
          border-radius: 12px;
        }

        .newsletter-benefit span {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #eef2ff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .newsletter-benefit p {
          margin: 0;
          color: #1f2a44;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.5;
        }

        .race-newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .race-newsletter-form input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border: 1px solid #d8dfeb;
          border-radius: 12px;
          font-size: 14px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .race-newsletter-form input:focus {
          border-color: #2f45bf;
          box-shadow: 0 0 0 3px rgba(47, 69, 191, 0.15);
        }

        .race-newsletter-status {
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
        }

        .race-newsletter-status-success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .race-newsletter-status-info {
          background: #e0f2fe;
          color: #075985;
          border: 1px solid #bae6fd;
        }

        .race-newsletter-status-error {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .race-newsletter-submit {
          height: 46px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #2f45bf 0%, #1f2a8a 100%);
          color: #ffffff;
          font-size: 14.5px;
          font-weight: 900;
          letter-spacing: 0.2px;
          cursor: pointer;
          box-shadow:
            0 14px 32px rgba(47, 69, 191, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          transition: background 0.18s ease, transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .race-newsletter-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 36px rgba(47, 69, 191, 0.36);
        }

        .race-newsletter-privacy {
          margin: -2px 0 0;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }

        .race-newsletter-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .race-newsletter-skip {
          height: 36px;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-top: -2px;
        }

        .race-newsletter-skip:hover:not(:disabled) {
          color: #0f172a;
        }

        @media (max-width: 480px) {
          .race-newsletter-card {
            padding: 22px 18px 18px;
            border-radius: 20px;
          }

          .race-newsletter-title {
            font-size: 19px;
          }

          .race-newsletter-subtitle {
            font-size: 12.5px;
          }

          .newsletter-benefit {
            padding: 8px 10px;
          }

          .newsletter-benefit p {
            font-size: 12.5px;
          }

          .newsletter-popup-badge {
            font-size: 10px;
            letter-spacing: 1.2px;
          }
        }
      `}</style>
    </div>
  );
}
