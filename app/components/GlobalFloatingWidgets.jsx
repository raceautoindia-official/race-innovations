"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ReportChatbot from "./ReportChatbot";

const BRAND = "#2f45bf";
const WHATSAPP_GREEN = "#25d366";

export default function GlobalFloatingWidgets() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = (pathname || "").startsWith("/admin");

  const [expanded, setExpanded] = useState(false);
  const CHAT_OPEN_KEY = "race_report_assistant_open_v2";
  const [chatbotOpen, setChatbotOpenState] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(CHAT_OPEN_KEY) === "true";
    } catch {
      return false;
    }
  });
  const setChatbotOpen = (next) => {
    setChatbotOpenState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            CHAT_OPEN_KEY,
            value ? "true" : "false"
          );
        } catch {}
      }
      return value;
    });
  };
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    if (mql.addEventListener) mql.addEventListener("change", update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", update);
      else mql.removeListener(update);
    };
  }, []);

  useEffect(() => {
    if (!isMobile || !expanded) return;
    function onDocClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, [isMobile, expanded]);

  function scrollToTop() {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (isMobile) setExpanded(false);
  }

  function openWhatsApp() {
    const number = "919003031527";
    const message = encodeURIComponent(
      "Hello RACE Innovations, I would like to know more about your automotive reports."
    );
    window.open(
      `https://wa.me/${number}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
    if (isMobile) setExpanded(false);
  }

  function openEmail() {
    const toEmails = encodeURIComponent(
      "projecthead@raceinnovations.in,kh@raceinnovations.in"
    );
    const subject = encodeURIComponent("Automotive Reports Enquiry");
    const body = encodeURIComponent(
      "Hello RACE Innovations Team,\n\nI would like to know more about your automotive market reports.\n\nRegards,"
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEmails}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
    if (isMobile) setExpanded(false);
  }

  function openChatbot() {
    setChatbotOpen(true);
    setExpanded(false);
  }

  function handleMainClick() {
    if (isMobile) {
      setExpanded((v) => !v);
    } else {
      setExpanded(true);
    }
  }

  function handleMouseEnter() {
    if (!isMobile) setExpanded(true);
  }

  function handleMouseLeave() {
    if (!isMobile) setExpanded(false);
  }

  const items = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      bg: WHATSAPP_GREEN,
      onClick: openWhatsApp,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M16.04 4.25C9.6 4.25 4.36 9.46 4.36 15.86c0 2.08.55 4.1 1.6 5.88L4.25 27.75l6.17-1.62a11.62 11.62 0 0 0 5.62 1.43h.01c6.44 0 11.68-5.21 11.68-11.61 0-3.1-1.22-6.02-3.43-8.21a11.57 11.57 0 0 0-8.26-3.49Z"
            stroke="#ffffff"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.38 10.58c-.25-.56-.51-.57-.75-.58h-.64c-.22 0-.58.08-.89.42-.3.33-1.16 1.13-1.16 2.76s1.19 3.2 1.36 3.42c.17.22 2.3 3.68 5.67 5.02 2.8 1.11 3.37.89 3.98.83.61-.06 1.98-.81 2.26-1.59.28-.78.28-1.45.19-1.59-.08-.14-.31-.22-.64-.39-.33-.17-1.98-.98-2.28-1.09-.31-.11-.53-.17-.75.17-.22.33-.86 1.09-1.06 1.31-.19.22-.39.25-.72.08-.33-.17-1.4-.52-2.67-1.65-.99-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.56.11-.22.06-.42-.03-.58-.08-.17-.73-1.8-1.02-2.42Z"
            fill="#ffffff"
          />
        </svg>
      ),
    },
    {
      key: "email",
      label: "Email us",
      bg: BRAND,
      onClick: openEmail,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      key: "chat",
      label: "Open chat",
      bg: BRAND,
      onClick: openChatbot,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  // Hide all floating widgets on admin routes — they are only meant for
  // the public website and clutter the admin panel.
  if (isAdminRoute) return null;

  return (
    <>
      <div
        ref={wrapperRef}
        className="gfw-wrapper"
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`gfw-stack ${expanded ? "gfw-expanded" : ""}`}
          aria-hidden={!expanded}
        >
          {items.map((it, idx) => (
            <button
              key={it.key}
              type="button"
              onClick={it.onClick}
              title={it.label}
              aria-label={it.label}
              tabIndex={expanded ? 0 : -1}
              className="gfw-btn"
              style={{
                backgroundColor: it.bg,
                transitionDelay: expanded
                  ? `${idx * 40}ms`
                  : `${(items.length - idx - 1) * 25}ms`,
                boxShadow:
                  it.key === "whatsapp"
                    ? "0 14px 28px rgba(37,211,102,0.32)"
                    : "0 14px 28px rgba(47,69,191,0.28)",
              }}
            >
              {it.icon}
            </button>
          ))}
        </div>

        <div className="gfw-main-row">
          {!expanded && !chatbotOpen ? (
            <button
              type="button"
              className="gfw-talk-label"
              onClick={() => router.push("/contact")}
              aria-label="Talk to expert"
            >
              Talk to Expert
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleMainClick}
            onMouseEnter={handleMouseEnter}
            aria-label={
              expanded ? "Close quick actions" : "Open quick actions"
            }
            aria-expanded={expanded}
            className={`gfw-main ${expanded ? "gfw-main-active" : ""}`}
          >
          <span className={`gfw-main-icon ${expanded ? "gfw-rotate" : ""}`}>
            {expanded ? (
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            )}
          </span>
        </button>
        </div>
      </div>

      <ReportChatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        hideLauncher
      />

      <style>{`
        .gfw-wrapper {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding-top: 12px;
        }

        .gfw-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .gfw-btn {
          width: 52px;
          height: 52px;
          border-radius: 999px;
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: translateY(14px) scale(0.6);
          pointer-events: none;
          transition:
            opacity 220ms ease,
            transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .gfw-expanded .gfw-btn {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .gfw-btn:hover {
          filter: brightness(1.05);
        }

        .gfw-main-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .gfw-talk-label {
          background: #ffffff;
          color: ${BRAND};
          border: 1px solid rgba(47, 69, 191, 0.18);
          border-radius: 999px;
          padding: 16px 28px;
          min-height: 56px;
          min-width: 190px;
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.18);
          transition: transform 180ms ease, background-color 180ms ease,
            color 180ms ease, box-shadow 180ms ease;
        }

        .gfw-talk-label:hover {
          background: ${BRAND};
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-1px);
          box-shadow: 0 20px 40px rgba(47, 69, 191, 0.32);
        }

        .gfw-main {
          width: 60px;
          height: 60px;
          border-radius: 999px;
          border: none;
          background-color: ${BRAND};
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 18px 36px rgba(47,69,191,0.35);
          transition: transform 180ms ease, background-color 180ms ease;
        }

        .gfw-main:hover {
          transform: translateY(-2px);
        }

        .gfw-main-active {
          background-color: #1f2a8a;
        }

        .gfw-main-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 240ms ease;
        }

        .gfw-rotate {
          transform: rotate(90deg);
        }

        @media (max-width: 768px) {
          .gfw-wrapper {
            right: 14px;
            bottom: calc(96px + env(safe-area-inset-bottom, 0px));
            gap: 10px;
          }
          .gfw-main {
            width: 50px;
            height: 50px;
          }
          .gfw-btn {
            width: 42px;
            height: 42px;
          }
          .gfw-talk-label {
            font-size: 17px;
            padding: 12px 20px;
            min-height: 48px;
            min-width: 160px;
          }
        }

        @media (max-width: 420px) {
          .gfw-talk-label {
            display: none;
          }
        }

        @media (max-width: 575px) {
          .gfw-wrapper {
            right: 12px;
            bottom: calc(100px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </>
  );
}
