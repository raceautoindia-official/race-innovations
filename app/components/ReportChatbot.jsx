"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const BRAND = "#2f45bf";
const BRAND_DARK = "#2434a8";

const DEFAULT_COUNTRIES = [
  "India",
  "South Africa",
  "Australia",
  "Brazil",
  "Germany",
  "Japan",
  "Sweden",
  "Vietnam",
  "Chile",
  "Pakistan",
  "Colombia",
  "Peru",
  "Indonesia",
  "Thailand",
  "Malaysia",
  "Philippines",
  "Mexico",
  "USA",
  "UK",
  "Canada",
];

const DEFAULT_CATEGORIES = [
  "Market Forecast Reports",
  "Flash Reports",
  "EV Intelligence",
  "Country Reports",
  "OEM Benchmarking",
  "Custom Research",
  "Aftermarket Reports",
  "Commercial Vehicle Reports",
  "Passenger Vehicle Reports",
  "Two Wheeler Reports",
  "Three Wheeler Reports",
  "Tractor Reports",
  "Construction Equipment Reports",
];

const CUSTOM_FAQS = [
  {
    id: "total-reports",
    keywords: [
      "how many reports",
      "total reports",
      "number of reports",
      "reports count",
      "how many reports are there",
    ],
    question: "How many reports are there?",
    answer: ({ reportCount }) =>
      `Currently, ${reportCount || "multiple"} reports are available in the report library. You can search by report title, country, segment, or category.`,
    actions: ["exploreReports"],
  },
  {
    id: "country-reports-count",
    keywords: [
      "how many country reports",
      "country reports count",
      "number of country reports",
      "countries reports",
      "how many countries",
    ],
    question: "How many country reports are there?",
    answer: ({ countryCount, countries }) =>
      `We currently cover ${countryCount || "multiple"} countries. Key markets include ${countries?.slice(0, 8).join(", ") || "India, Brazil, Germany, Japan, South Africa, Vietnam, Chile, and Sweden"}.`,
    actions: ["exploreReports"],
  },
  {
    id: "available-countries",
    keywords: [
      "countries",
      "country list",
      "what countries",
      "countries covered",
      "which countries do you cover",
    ],
    question: "What countries do you cover?",
    answer: ({ countries }) =>
      `We cover automotive markets including ${countries?.join(", ") || "India, South Africa, Australia, Brazil, Germany, Japan, Sweden, Vietnam, Chile, Pakistan, Colombia, Peru, Indonesia, Thailand, Malaysia, Philippines, Mexico, USA, UK, and Canada"}.`,
    actions: ["exploreReports"],
  },
  {
    id: "available-categories",
    keywords: [
      "categories",
      "report categories",
      "types of reports",
      "which reports",
      "available reports",
    ],
    question: "Which report categories are available?",
    answer: ({ categories }) =>
      `Available report categories include ${categories?.join(", ") || "Market Forecast Reports, Flash Reports, EV Intelligence, Country Reports, OEM Benchmarking, Aftermarket Reports, Commercial Vehicle Reports, Passenger Vehicle Reports, Two Wheeler Reports, Three Wheeler Reports, Tractor Reports, and Construction Equipment Reports"}.`,
    actions: ["exploreReports"],
  },
  {
    id: "india-reports",
    keywords: ["india", "india reports", "indian market", "india automotive"],
    question: "Do you have India reports?",
    answer: () =>
      "Yes, India automotive reports are available. You can select India in the Country filter or search India in the report search box.",
    actions: ["indiaReports"],
  },
  {
    id: "ev-reports",
    keywords: [
      "ev",
      "electric vehicle",
      "electric vehicles",
      "battery",
      "alternative fuel",
      "powertrain",
    ],
    question: "Do you offer EV reports?",
    answer: () =>
      "Yes, we offer EV intelligence and alternative powertrain reports covering adoption trends, OEM activity, market outlook, and forecast insights.",
    actions: ["evReports"],
  },
  {
    id: "forecast-reports",
    keywords: [
      "forecast",
      "forecast report",
      "future outlook",
      "prediction",
      "projection",
      "market outlook",
    ],
    question: "Do you provide forecast reports?",
    answer: () =>
      "Yes, we provide automotive forecast reports with forward-looking insights, country-wise trends, segment outlook, and rolling projections.",
    actions: ["forecastReports"],
  },
  {
    id: "sample-report",
    keywords: [
      "sample",
      "sample report",
      "preview",
      "demo report",
      "request sample",
    ],
    question: "Can I get a sample report?",
    answer: () =>
      "Yes. Open any report page and use the Request Sample option. You can also contact our sales team for a suitable sample.",
    actions: ["contactSales", "exploreReports"],
  },
  {
    id: "pricing",
    keywords: [
      "price",
      "pricing",
      "cost",
      "subscription",
      "subscribe",
      "purchase",
      "buy",
    ],
    question: "How do I subscribe?",
    answer: () =>
      "You can open the relevant report and proceed with the subscription or purchase option. For enterprise or custom access, please contact our sales team.",
    actions: ["contactSales"],
  },
  {
    id: "custom-research",
    keywords: [
      "custom research",
      "custom report",
      "customized report",
      "specific requirement",
      "tailored",
    ],
    question: "Do you provide custom research?",
    answer: () =>
      "Yes, we provide custom automotive research based on country, segment, OEM, powertrain, forecast, and business strategy requirements.",
    actions: ["contactSales"],
  },
  {
    id: "segments",
    keywords: [
      "segments",
      "vehicle segments",
      "passenger vehicle",
      "commercial vehicle",
      "truck",
      "bus",
      "two wheeler",
      "three wheeler",
      "tractor",
    ],
    question: "What segments are covered?",
    answer: () =>
      "We cover passenger vehicles, commercial vehicles, trucks, buses, two-wheelers, three-wheelers, tractors, construction equipment, EVs, and other key automotive segments.",
    actions: ["exploreReports"],
  },
  {
    id: "contact-sales",
    keywords: [
      "contact",
      "sales",
      "talk to sales",
      "enquiry",
      "support",
      "call me",
    ],
    question: "How can I contact sales?",
    answer: () =>
      "You can click Contact Sales and submit your enquiry. Our team will get back to you with the right report or solution.",
    actions: ["contactSales"],
  },
];

const ACTION_MAP = {
  exploreReports: { label: "Explore Reports", type: "explore" },
  contactSales: { label: "Contact Sales", type: "sales" },
  resetFilters: { label: "Reset Filters", type: "reset" },
  indiaReports: { label: "View India Reports", type: "country", value: "India" },
  evReports: {
    label: "View EV Reports",
    type: "category",
    value: "EV Intelligence",
  },
  forecastReports: {
    label: "View Forecast Reports",
    type: "category",
    value: "Market Forecast Reports",
  },
};

function scrollToReports() {
  if (typeof window === "undefined") return;
  const section = document.getElementById("reports");
  if (section) {
    const y = section.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

function matchFaq(rawText) {
  const lower = String(rawText || "").toLowerCase().trim();
  if (!lower) return null;

  let best = null;
  let bestScore = 0;

  for (const faq of CUSTOM_FAQS) {
    let score = 0;
    let longestMatch = 0;
    for (const kw of faq.keywords) {
      const k = String(kw).toLowerCase();
      if (!k) continue;
      if (lower.includes(k)) {
        score += 1 + k.length / 50;
        if (k.length > longestMatch) longestMatch = k.length;
      }
    }
    if (faq.question && lower === faq.question.toLowerCase()) {
      score += 5;
    }
    if (score > bestScore) {
      bestScore = score + longestMatch / 1000;
      best = faq;
    }
  }
  return best;
}

function buildBotReply(rawText, ctx) {
  const text = String(rawText || "").trim();
  if (!text) {
    return {
      text: "Please type a question or pick one of the quick suggestions below.",
    };
  }

  const lower = text.toLowerCase();

  if (/^(hi|hello|hey|hola|good (morning|afternoon|evening))\b/.test(lower)) {
    return {
      text:
        "Hello! I can help you find automotive market reports by country, category, segment, or forecast need. Pick a quick question or type your requirement.",
    };
  }

  const faq = matchFaq(text);
  if (faq) {
    const answer =
      typeof faq.answer === "function"
        ? faq.answer(ctx || {})
        : String(faq.answer || "");
    const actions = Array.isArray(faq.actions)
      ? faq.actions.map((a) => ACTION_MAP[a]).filter(Boolean)
      : [];
    return { text: answer, actions };
  }

  const matchedCountry = (ctx?.countries || DEFAULT_COUNTRIES).find((c) =>
    lower.includes(String(c).toLowerCase())
  );
  if (matchedCountry) {
    return {
      text: `Yes, we have ${matchedCountry} reports. You can use the Country filter or search '${matchedCountry}' in the report search bar.`,
      actions: [
        {
          label: `View ${matchedCountry} Reports`,
          type: "country",
          value: matchedCountry,
        },
      ],
    };
  }

  return {
    text:
      "I can help with report availability, countries, categories, samples, subscriptions, and custom research. Please choose one of the quick questions or type your requirement.",
  };
}

export default function ReportChatbot({
  openEnquiryModal,
  setSearchText,
  setSelectedCountry,
  setSelectedCategory,
  reportCount,
  countryCount,
  countries,
  categories,
  isOpen: controlledIsOpen,
  onClose,
  hideLauncher = false,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalOpen;
  const setIsOpen = (v) => {
    if (isControlled) {
      if (!v && typeof onClose === "function") onClose();
    } else {
      setInternalOpen(v);
    }
  };
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      from: "bot",
      text:
        "Hi! I'm the RACE Report Assistant. I can help you find automotive market reports by country, category, segment, or forecast need.",
    },
  ]);
  const [showQuick, setShowQuick] = useState(true);

  const messagesEndRef = useRef(null);
  const nextIdRef = useRef(2);

  const isMobile = useMobile();

  const ctx = useMemo(
    () => ({
      reportCount,
      countryCount:
        countryCount ??
        (Array.isArray(countries) ? countries.length : undefined),
      countries:
        Array.isArray(countries) && countries.length > 0
          ? countries
          : DEFAULT_COUNTRIES,
      categories:
        Array.isArray(categories) && categories.length > 0
          ? categories
          : DEFAULT_CATEGORIES,
    }),
    [reportCount, countryCount, countries, categories]
  );

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  function appendMessage(msg) {
    const id = nextIdRef.current++;
    setMessages((prev) => [...prev, { id, ...msg }]);
  }

  function handleAction(action) {
    if (!action) return;
    if (action.type === "explore") {
      scrollToReports();
    } else if (action.type === "sales") {
      if (typeof openEnquiryModal === "function") openEnquiryModal();
    } else if (action.type === "country") {
      if (typeof setSelectedCountry === "function")
        setSelectedCountry(action.value);
      scrollToReports();
    } else if (action.type === "category") {
      if (typeof setSelectedCategory === "function")
        setSelectedCategory(action.value);
      scrollToReports();
    } else if (action.type === "reset") {
      if (typeof setSelectedCountry === "function") setSelectedCountry("All");
      if (typeof setSelectedCategory === "function") setSelectedCategory("All");
      if (typeof setSearchText === "function") setSearchText("");
    }
  }

  function sendMessage(rawText) {
    const text = String(rawText || "").trim();
    if (!text) return;
    appendMessage({ from: "user", text });
    setShowQuick(false);
    setInputValue("");

    const reply = buildBotReply(text, ctx);
    setTimeout(() => {
      appendMessage({ from: "bot", text: reply.text, actions: reply.actions });
    }, 320);
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(inputValue);
  }

  function handleQuickClick(q) {
    sendMessage(q);
  }

  const quickQuestions = useMemo(
    () => CUSTOM_FAQS.map((f) => f.question).filter(Boolean),
    []
  );

  const windowStyle = useMemo(() => {
    if (isMobile) {
      return {
        position: "fixed",
        right: "12px",
        left: "12px",
        bottom: "12px",
        width: "auto",
        height: "min(78vh, 560px)",
        borderRadius: "20px",
        backgroundColor: "#ffffff",
        boxShadow: "0 30px 70px rgba(15, 23, 42, 0.28)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 99999,
        border: "1px solid #e5ebf7",
        transformOrigin: "bottom right",
        animation: "raceChatPop 180ms ease-out",
      };
    }
    return {
      position: "fixed",
      right: "24px",
      bottom: "96px",
      width: "380px",
      height: "560px",
      maxHeight: "calc(100vh - 120px)",
      borderRadius: "20px",
      backgroundColor: "#ffffff",
      boxShadow: "0 30px 70px rgba(15, 23, 42, 0.25)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: 99999,
      border: "1px solid #e5ebf7",
      transformOrigin: "bottom right",
      animation: "raceChatPop 180ms ease-out",
    };
  }, [isMobile]);

  return (
    <>
      <style>{`
        @keyframes raceChatPop {
          0% { opacity: 0; transform: translateY(10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .race-chat-scroll::-webkit-scrollbar { width: 6px; }
        .race-chat-scroll::-webkit-scrollbar-thumb {
          background: #cfd6e6; border-radius: 6px;
        }
        .race-chat-launcher:hover { transform: translateY(-2px); }
      `}</style>

      {!isOpen && !hideLauncher && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          className="race-chat-launcher"
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            width: "60px",
            height: "60px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: BRAND,
            color: "#ffffff",
            boxShadow: "0 18px 36px rgba(47,69,191,0.35)",
            cursor: "pointer",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 180ms ease",
          }}
        >
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
        </button>
      )}

      {isOpen && (
        <div style={windowStyle} role="dialog" aria-label="RACE Report Assistant">
          <div
            style={{
              background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
              color: "#ffffff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "14px",
                letterSpacing: "0.5px",
              }}
            >
              RA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                RACE Report Assistant
              </div>
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.9,
                  marginTop: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    backgroundColor: "#22c55e",
                    display: "inline-block",
                    boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
                  }}
                />
                Online • Automotive Market Reports
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chat"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "22px",
                lineHeight: 1,
                cursor: "pointer",
                padding: "4px 6px",
                opacity: 0.9,
              }}
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "20px",
                lineHeight: 1,
                cursor: "pointer",
                padding: "4px 6px",
                opacity: 0.9,
              }}
            >
              ×
            </button>
          </div>

          <div
            className="race-chat-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              backgroundColor: "#f7f9ff",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    backgroundColor: m.from === "user" ? BRAND : "#ffffff",
                    color: m.from === "user" ? "#ffffff" : "#1f2a44",
                    border:
                      m.from === "user" ? "none" : "1px solid #e5ebf7",
                    borderRadius:
                      m.from === "user"
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                    padding: "10px 12px",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    boxShadow:
                      m.from === "user"
                        ? "0 6px 16px rgba(47,69,191,0.20)"
                        : "0 4px 12px rgba(20,30,70,0.05)",
                    wordBreak: "break-word",
                  }}
                >
                  <div>{m.text}</div>

                  {Array.isArray(m.actions) && m.actions.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginTop: "10px",
                      }}
                    >
                      {m.actions.map((a, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAction(a)}
                          style={{
                            backgroundColor: "#eef2ff",
                            color: BRAND,
                            border: "1px solid rgba(47,69,191,0.18)",
                            borderRadius: "999px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {showQuick && (
              <div style={{ marginTop: "6px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#647089",
                    letterSpacing: "0.6px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  Quick Questions
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleQuickClick(q)}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2434a8",
                        border: "1px solid rgba(47,69,191,0.22)",
                        borderRadius: "999px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: 650,
                        cursor: "pointer",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              borderTop: "1px solid #e5ebf7",
              backgroundColor: "#ffffff",
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              style={{
                flex: 1,
                minWidth: 0,
                height: "40px",
                borderRadius: "999px",
                border: "1px solid #d7dfef",
                padding: "0 14px",
                fontSize: "14px",
                outline: "none",
                color: "#1f2a44",
                backgroundColor: "#f7f9ff",
              }}
            />
            <button
              type="submit"
              aria-label="Send message"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "999px",
                backgroundColor: BRAND,
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(47,69,191,0.25)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 575px)");
    const update = () => setIsMobile(mql.matches);
    update();
    if (mql.addEventListener) mql.addEventListener("change", update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", update);
      else mql.removeListener(update);
    };
  }, []);
  return isMobile;
}

