"use client";

import React, { useEffect, useState } from "react";
import { COOKIE_KEY } from "../../lib/cookieConsent";

export const CONSENT_EVENT = "race-cookie-consent-changed";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_KEY);
      if (!saved) {
        const timer = setTimeout(() => setVisible(true), 700);
        return () => clearTimeout(timer);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function saveConsent(status, prefs = preferences) {
    const payload = {
      status,
      preferences: {
        necessary: true,
        analytics: Boolean(prefs.analytics),
        marketing: Boolean(prefs.marketing),
      },
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify(payload));
    } catch {}

    if (typeof window !== "undefined") {
      try {
        window.dispatchEvent(
          new CustomEvent(CONSENT_EVENT, { detail: payload })
        );
      } catch {}
    }

    setVisible(false);
    setShowPrefs(false);
  }

  function acceptAll() {
    saveConsent("accepted", {
      necessary: true,
      analytics: true,
      marketing: true,
    });
  }

  function rejectOptional() {
    saveConsent("rejected", {
      necessary: true,
      analytics: false,
      marketing: false,
    });
  }

  function savePreferences() {
    saveConsent("custom", preferences);
  }

  if (!visible) return null;

  return (
    <div className="race-cookie-consent" role="dialog" aria-live="polite">
      <div className="race-cookie-card">
        <div className="race-cookie-content">
          <div className="race-cookie-icon">🍪</div>

          <div className="race-cookie-text">
            <h3>We use cookies</h3>
            <p>
              RACE Innovations uses cookies to improve website performance,
              understand visitor engagement, and enhance your browsing experience.
              You can accept all cookies, reject optional cookies, or manage your
              preferences.
            </p>

            {showPrefs && (
              <div className="race-cookie-preferences">
                <label>
                  <input type="checkbox" checked disabled />
                  <span>
                    <strong>Necessary cookies</strong>
                    <small>Required for website functionality.</small>
                  </span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                  />
                  <span>
                    <strong>Analytics cookies</strong>
                    <small>Help us understand website usage.</small>
                  </span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        marketing: e.target.checked,
                      }))
                    }
                  />
                  <span>
                    <strong>Marketing cookies</strong>
                    <small>Support personalized communication and campaigns.</small>
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="race-cookie-actions">
          {!showPrefs ? (
            <>
              <button
                type="button"
                className="race-cookie-link-btn"
                onClick={() => setShowPrefs(true)}
              >
                Manage Preferences
              </button>

              <button
                type="button"
                className="race-cookie-outline-btn"
                onClick={rejectOptional}
              >
                Reject
              </button>

              <button
                type="button"
                className="race-cookie-primary-btn"
                onClick={acceptAll}
              >
                Accept Cookies
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="race-cookie-link-btn"
                onClick={() => setShowPrefs(false)}
              >
                Back
              </button>

              <button
                type="button"
                className="race-cookie-outline-btn"
                onClick={rejectOptional}
              >
                Reject Optional
              </button>

              <button
                type="button"
                className="race-cookie-primary-btn"
                onClick={savePreferences}
              >
                Save Preferences
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .race-cookie-consent {
          position: fixed;
          left: 50%;
          bottom: 22px;
          transform: translateX(-50%);
          width: min(920px, calc(100vw - 32px));
          z-index: 9998;
          pointer-events: none;
        }

        .race-cookie-card {
          pointer-events: auto;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(47, 69, 191, 0.16);
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
          backdrop-filter: blur(12px);
        }

        .race-cookie-content {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .race-cookie-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .race-cookie-text h3 {
          margin: 0 0 6px;
          color: #0f172a;
          font-size: 20px;
          font-weight: 900;
        }

        .race-cookie-text p {
          margin: 0;
          color: #536179;
          font-size: 14px;
          line-height: 1.65;
        }

        .race-cookie-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .race-cookie-primary-btn,
        .race-cookie-outline-btn,
        .race-cookie-link-btn {
          height: 42px;
          border-radius: 999px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .race-cookie-primary-btn {
          border: none;
          background: #2f45bf;
          color: #ffffff;
          box-shadow: 0 10px 24px rgba(47, 69, 191, 0.22);
        }

        .race-cookie-primary-btn:hover {
          background: #2435a0;
        }

        .race-cookie-outline-btn {
          border: 1px solid rgba(47, 69, 191, 0.26);
          background: #ffffff;
          color: #2f45bf;
        }

        .race-cookie-outline-btn:hover {
          background: #eef2ff;
        }

        .race-cookie-link-btn {
          border: none;
          background: transparent;
          color: #536179;
          text-decoration: underline;
          padding: 0 8px;
        }

        .race-cookie-preferences {
          margin-top: 14px;
          display: grid;
          gap: 10px;
        }

        .race-cookie-preferences label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: 14px;
          background: #f8faff;
          border: 1px solid #e5ebf7;
          cursor: pointer;
        }

        .race-cookie-preferences input {
          margin-top: 3px;
          accent-color: #2f45bf;
        }

        .race-cookie-preferences span {
          display: grid;
          gap: 2px;
        }

        .race-cookie-preferences strong {
          color: #0f172a;
          font-size: 14px;
        }

        .race-cookie-preferences small {
          color: #64748b;
          font-size: 12px;
        }

        @media (max-width: 767px) {
          .race-cookie-consent {
            bottom: 12px;
            width: calc(100vw - 20px);
          }

          .race-cookie-card {
            padding: 16px;
            border-radius: 20px;
          }

          .race-cookie-content {
            gap: 12px;
          }

          .race-cookie-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
            border-radius: 14px;
          }

          .race-cookie-text h3 {
            font-size: 18px;
          }

          .race-cookie-text p {
            font-size: 13px;
          }

          .race-cookie-actions {
            justify-content: stretch;
          }

          .race-cookie-primary-btn,
          .race-cookie-outline-btn,
          .race-cookie-link-btn {
            flex: 1 1 auto;
          }
        }
      `}</style>
    </div>
  );
}
