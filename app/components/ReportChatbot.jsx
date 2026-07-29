"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const BRAND = "#2f45bf";
const BRAND_DARK = "#2434a8";

const CHAT_STORAGE_KEY = "race_report_assistant_messages_v3";
const CHAT_OPEN_KEY = "race_report_assistant_open_v3";
const CHAT_DRAFT_KEY = "race_report_assistant_draft_v3";
const CHAT_FLOW_KEY = "race_report_assistant_flow_v3";

// ---- Guided assistant flow -------------------------------------------------
const CATEGORIES = [
  { key: "automotive", label: "Automotive Market Intelligence" },
  { key: "engineering", label: "Engineering, Transport & Logistics Consultancy" },
  { key: "ai", label: "AI Digital Solutions" },
  { key: "marketEntry", label: "Market Entry & Business Consultation" },
];

// Contact details collected at the end of every flow.
const CONTACT_STEPS = [
  { key: "name", q: "Please share your name.", type: "text" },
  { key: "email", q: "Your email address?", type: "text", validate: "email" },
  { key: "phone", q: "Your phone / mobile number?", type: "text", validate: "phone" },
];

const FLOWS = {
  automotive: {
    title: "Automotive Market Intelligence",
    cta: "Talk to an Automotive Expert",
    intro: "Great choice! A few quick questions so we can help precisely.",
    steps: [
      { key: "need", q: "1) What do you need?", type: "choice", options: ["Market Report", "Sales Data", "Production Data", "Market Forecast", "Competitor Analysis", "Custom Research"] },
      { key: "segment", q: "2) Which vehicle segment?", type: "choice", options: ["Passenger Vehicles", "Commercial Vehicles", "EVs", "2W / 3W", "Buses & Trucks", "Construction & Agri"] },
      { key: "market", q: "3) Which market? (country / region)", type: "text" },
      { key: "objective", q: "4) What is your objective?", type: "choice", options: ["Market Entry", "Investment", "Product Launch", "Business Expansion", "Competitor Benchmarking"] },
      { key: "consultation", q: "5) Do you need expert consultation?", type: "choice", options: ["Yes", "No"] },
      { key: "requirement", q: "6) Tell us about your requirement (brief description).", type: "text" },
    ],
  },
  marketEntry: {
    title: "Market Entry & Business Consultancy",
    cta: "Talk to a Market Entry Expert",
    intro:
      "We help businesses expand into new markets with confidence — Market Entry Strategy, Go-to-Market Planning, Market Research & Feasibility, Distributor & Partner Search, Competitor Analysis and Regulatory Guidance.",
    steps: [
      { key: "need", q: "What do you need?", type: "choice", options: ["Market Entry", "Distributor Search", "Market Research", "Business Partner", "Go-to-Market Strategy"] },
      { key: "market", q: "Target market? (country / region)", type: "text" },
      { key: "requirement", q: "Tell us about your requirement (brief description).", type: "text" },
    ],
  },
  engineering: {
    title: "Engineering, Transport & Logistics Consultancy",
    cta: "Connect with an Expert",
    intro:
      "Our experts help with engineering, transport and logistics consultancy. Let's connect you with the right expert — just a few contact details.",
    steps: [],
  },
  ai: {
    title: "AI Digital Solutions",
    cta: "Connect with an Expert",
    intro: "We build AI-powered digital solutions. Which one are you interested in?",
    steps: [
      { key: "solution", q: "Which solution?", type: "choice", options: ["AI-powered Website", "AI-powered CRM Tool", "Lead Generation Tool", "Salesforce CRM", "Payment Gateway Integration", "E-commerce Site Development", "Inventory & Asset Management", "Accounting & Finance Tool"] },
      { key: "requirement", q: "Tell us briefly about your requirement.", type: "text" },
    ],
  },
};

function getFlowSteps(categoryKey) {
  const f = FLOWS[categoryKey];
  if (!f) return [];
  return [...f.steps, ...CONTACT_STEPS];
}

const EMPTY_FLOW = { category: null, stepIndex: 0, answers: {} };

function loadInitialFlow() {
  if (typeof window === "undefined") return EMPTY_FLOW;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CHAT_FLOW_KEY) || "null");
    return parsed && typeof parsed === "object" ? parsed : EMPTY_FLOW;
  } catch {
    return EMPTY_FLOW;
  }
}

const DEFAULT_MESSAGES = [
  {
    id: 1,
    from: "bot",
    text:
      "Hi! Welcome to RACE Innovations 👋 What can we help you with today?",
    actions: CATEGORIES.map((c) => ({
      label: c.label,
      type: "flowStart",
      value: c.key,
    })),
  },
];

function safeParseMessages(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_MESSAGES;
  } catch {
    return DEFAULT_MESSAGES;
  }
}

function loadInitialMessages() {
  if (typeof window === "undefined") return DEFAULT_MESSAGES;
  const saved = window.localStorage.getItem(CHAT_STORAGE_KEY);
  if (!saved) return DEFAULT_MESSAGES;
  return safeParseMessages(saved);
}

function loadInitialOpen() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CHAT_OPEN_KEY) === "true";
}

function loadInitialDraft() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(CHAT_DRAFT_KEY) || "";
}

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

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function makeBotReply(userText, context = {}) {
  const q = normalizeText(userText);

  const reportCount = context?.reportCount || 0;
  const countryCount = context?.countryCount || 0;
  const categoryCount = context?.categoryCount || 0;

  if (!q) {
    return {
      text:
        "Please type your question. I can help with reports, samples, pricing, subscriptions, countries, categories, and custom research.",
      actions: [
        { label: "Explore Reports", href: "/market-report" },
        { label: "Contact Sales", href: "/contact" },
      ],
    };
  }

  if (
    includesAny(q, [
      "customize",
      "customise",
      "customized",
      "customised",
      "custom report",
      "tailor",
      "tailored",
      "specific requirement",
      "own report",
      "custom research",
      "special report",
    ])
  ) {
    return {
      text:
        "Yes, RACE Innovations can customize reports based on your business requirement. We can support country-specific research, segment-level analysis, OEM benchmarking, EV intelligence, sales forecasts, competitor tracking, and custom automotive market studies.",
      actions: [
        { label: "Request Custom Report", href: "/contact" },
        { label: "Explore Reports", href: "/market-report" },
      ],
    };
  }

  if (
    includesAny(q, ["sample", "preview", "demo", "sample pdf", "request sample"])
  ) {
    return {
      text:
        "Yes, sample reports are available for selected reports. Open any report page and use the Request Sample option, or contact our sales team to get the most suitable sample for your requirement.",
      actions: [
        { label: "Explore Reports", href: "/market-report" },
        { label: "Contact Sales", href: "/contact" },
      ],
    };
  }

  if (
    includesAny(q, [
      "price",
      "pricing",
      "cost",
      "how much",
      "buy",
      "purchase",
      "payment",
      "quote",
    ])
  ) {
    return {
      text:
        "Report pricing depends on the report type, country coverage, license type, data depth, and customization requirement. Please contact our sales team for the latest price, sample access, and purchase support.",
      actions: [
        { label: "Contact Sales", href: "/contact" },
        { label: "View Reports", href: "/market-report" },
      ],
    };
  }

  if (
    includesAny(q, [
      "subscription",
      "subscribe",
      "plan",
      "membership",
      "access",
    ])
  ) {
    return {
      text:
        "RACE Innovations offers report access and subscription options for automotive market intelligence, forecast reports, flash reports, EV intelligence, and country-wise insights. You can explore reports or contact sales for the right access plan.",
      actions: [
        { label: "Explore Reports", href: "/market-report" },
        { label: "Contact Sales", href: "/contact" },
      ],
    };
  }

  if (
    includesAny(q, [
      "how many reports",
      "number of reports",
      "total reports",
      "reports are there",
      "available reports",
    ])
  ) {
    return {
      text:
        reportCount > 0
          ? `There are currently ${reportCount} active reports available in the RACE Innovations report library. You can filter them by category, region, country, or search keyword.`
          : "You can view all available reports in the RACE Innovations report library and filter them by category, region, country, or search keyword.",
      actions: [{ label: "View All Reports", href: "/market-report" }],
    };
  }

  if (
    includesAny(q, [
      "country",
      "countries",
      "country reports",
      "india report",
      "global reports",
    ])
  ) {
    return {
      text:
        countryCount > 0
          ? `RACE Innovations provides country-wise automotive market reports across ${countryCount}+ markets, covering vehicle sales, forecast outlook, segment trends, OEM performance, and market intelligence.`
          : "RACE Innovations provides country-wise automotive market reports covering vehicle sales, forecast outlook, segment trends, OEM performance, and market intelligence.",
      actions: [{ label: "Explore Country Reports", href: "/market-report" }],
    };
  }

  if (
    includesAny(q, [
      "category",
      "categories",
      "segment",
      "segments",
      "available categories",
    ])
  ) {
    return {
      text:
        categoryCount > 0
          ? `The report library includes ${categoryCount}+ report categories such as market forecast reports, flash reports, EV intelligence, country reports, OEM benchmarking, commercial vehicle reports, passenger vehicle reports, two-wheeler reports, three-wheeler reports, tractor reports, and construction equipment reports.`
          : "The report library includes market forecast reports, flash reports, EV intelligence, country reports, OEM benchmarking, commercial vehicle reports, passenger vehicle reports, two-wheeler reports, three-wheeler reports, tractor reports, and construction equipment reports.",
      actions: [{ label: "Browse Categories", href: "/market-report" }],
    };
  }

  if (
    includesAny(q, [
      "ev",
      "electric vehicle",
      "electric vehicles",
      "alternative fuel",
      "hybrid",
    ])
  ) {
    return {
      text:
        "RACE Innovations provides EV intelligence reports covering electric vehicle adoption, alternative fuel trends, OEM movement, segment-wise EV penetration, policy impact, and forecast outlook.",
      actions: [
        { label: "Explore EV Reports", href: "/market-report" },
        { label: "Contact Sales", href: "/contact" },
      ],
    };
  }

  if (
    includesAny(q, [
      "forecast",
      "projection",
      "outlook",
      "future market",
      "market forecast",
    ])
  ) {
    return {
      text:
        "RACE Innovations provides automotive forecast reports with forward-looking insights on vehicle sales, segment outlook, OEM trends, EV adoption, market growth, and country-wise automotive demand.",
      actions: [{ label: "Explore Forecast Reports", href: "/market-report" }],
    };
  }

  if (
    includesAny(q, [
      "oem",
      "benchmark",
      "benchmarking",
      "brand",
      "manufacturer",
      "competition",
      "competitor",
    ])
  ) {
    return {
      text:
        "RACE Innovations supports OEM benchmarking and brand-level analysis, including market share, competitive positioning, segment performance, product trends, and strategic opportunities.",
      actions: [
        { label: "Explore OEM Reports", href: "/market-report" },
        { label: "Contact Sales", href: "/contact" },
      ],
    };
  }

  if (
    includesAny(q, [
      "commercial vehicle",
      "commercial vehicles",
      "truck",
      "trucks",
      "bus",
      "buses",
      "cv",
      "lcv",
      "mcv",
      "hcv",
    ])
  ) {
    return {
      text:
        "RACE Innovations provides commercial vehicle reports covering trucks, buses, LCV, MCV, HCV, fleet demand, OEM performance, logistics-linked demand, and market forecast insights.",
      actions: [{ label: "Explore CV Reports", href: "/market-report" }],
    };
  }

  if (
    includesAny(q, [
      "passenger vehicle",
      "passenger vehicles",
      "car",
      "cars",
      "suv",
      "pv",
    ])
  ) {
    return {
      text:
        "RACE Innovations provides passenger vehicle market reports covering cars, SUVs, OEM performance, sales trends, powertrain shifts, premiumization, EV adoption, and market outlook.",
      actions: [{ label: "Explore PV Reports", href: "/market-report" }],
    };
  }

  if (includesAny(q, ["two wheeler", "2w", "motorcycle", "scooter"])) {
    return {
      text:
        "RACE Innovations provides two-wheeler reports covering motorcycles, scooters, OEM performance, EV two-wheeler adoption, demand trends, and forecast outlook.",
      actions: [{ label: "Explore 2W Reports", href: "/market-report" }],
    };
  }

  if (
    includesAny(q, ["three wheeler", "3w", "auto rickshaw", "rickshaw"])
  ) {
    return {
      text:
        "RACE Innovations provides three-wheeler reports covering passenger and cargo three-wheelers, electric three-wheelers, OEM trends, regional demand, and market forecast insights.",
      actions: [{ label: "Explore 3W Reports", href: "/market-report" }],
    };
  }

  if (includesAny(q, ["tractor", "tractors", "agri", "agriculture", "farm"])) {
    return {
      text:
        "RACE Innovations provides tractor and agri-equipment market reports covering rural demand, OEM performance, sales trends, farm mechanization, and forecast outlook.",
      actions: [{ label: "Explore Tractor Reports", href: "/market-report" }],
    };
  }

  if (
    includesAny(q, [
      "construction equipment",
      "excavator",
      "loader",
      "ce market",
    ])
  ) {
    return {
      text:
        "RACE Innovations provides construction equipment market reports covering infrastructure-linked demand, equipment categories, OEM performance, sales trends, and market outlook.",
      actions: [{ label: "Explore Equipment Reports", href: "/market-report" }],
    };
  }

  if (includesAny(q, ["download", "pdf", "brochure"])) {
    return {
      text:
        "For downloadable samples or full PDF reports, open the specific report page and use the available report actions. For full report access, contact the sales team.",
      actions: [
        { label: "Explore Reports", href: "/market-report" },
        { label: "Contact Sales", href: "/contact" },
      ],
    };
  }

  if (
    includesAny(q, [
      "contact",
      "sales",
      "call",
      "email",
      "phone",
      "support",
      "talk to sales",
    ])
  ) {
    return {
      text:
        "You can contact the RACE Innovations sales team for report pricing, samples, custom research, subscription access, and enterprise requirements.",
      actions: [{ label: "Contact Sales", href: "/contact" }],
    };
  }

  if (includesAny(q, ["login", "sign in", "signin", "account"])) {
    return {
      text:
        "If you already have access, please use the login or subscription access option available on the website. For access issues, contact the RACE Innovations team.",
      actions: [{ label: "Contact Support", href: "/contact" }],
    };
  }

  if (includesAny(q, ["free", "free report", "trial"])) {
    return {
      text:
        "Some report previews or samples may be available based on the report. For full reports, custom access, or trial-related questions, please contact the sales team.",
      actions: [
        { label: "Explore Reports", href: "/market-report" },
        { label: "Contact Sales", href: "/contact" },
      ],
    };
  }

  if (
    includesAny(q, [
      "race",
      "race innovations",
      "about",
      "company",
      "who are you",
    ])
  ) {
    return {
      text:
        "RACE Innovations provides automotive market intelligence, forecast reports, EV intelligence, OEM benchmarking, country-wise vehicle sales analysis, custom research, and strategic consulting support for the automotive industry.",
      actions: [
        { label: "About RACE", href: "/about-us/vision-mission" },
        { label: "Explore Reports", href: "/market-report" },
      ],
    };
  }

  if (/^(hi|hello|hey|hola|good (morning|afternoon|evening))\b/.test(q)) {
    return {
      text:
        "Hello! I can help you find automotive market reports by country, category, segment, or forecast need. Pick a quick question or type your requirement.",
      actions: [
        { label: "Explore Reports", href: "/market-report" },
        { label: "Contact Sales", href: "/contact" },
      ],
    };
  }

  return {
    text:
      "I can help with automotive market reports, forecast reports, EV intelligence, OEM benchmarking, country reports, sample requests, pricing, subscriptions, and custom research. Please ask your question in a little more detail, or choose one of the options below.",
    actions: [
      { label: "Explore Reports", href: "/market-report" },
      { label: "Contact Sales", href: "/contact" },
    ],
  };
}

function buildBotReply(rawText, ctx) {
  return makeBotReply(rawText, ctx);
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
  const [internalOpen, setInternalOpen] = useState(() => loadInitialOpen());
  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalOpen;
  const setIsOpen = (v) => {
    if (isControlled) {
      if (!v && typeof onClose === "function") onClose();
    } else {
      setInternalOpen(v);
    }
  };
  const [inputValue, setInputValue] = useState(() => loadInitialDraft());
  const [messages, setMessages] = useState(() => loadInitialMessages());
  const [showQuick, setShowQuick] = useState(false);
  const [flow, setFlow] = useState(() => loadInitialFlow());

  const messagesEndRef = useRef(null);
  const nextIdRef = useRef(
    Math.max(0, ...loadInitialMessages().map((m) => Number(m?.id) || 0)) + 1
  );
  const hydratedRef = useRef(false);

  const isMobile = useMobile();

  const ctx = useMemo(
    () => ({
      reportCount,
      countryCount:
        countryCount ??
        (Array.isArray(countries) ? countries.length : undefined),
      categoryCount: Array.isArray(categories)
        ? categories.length
        : DEFAULT_CATEGORIES.length,
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

  // Mark hydration complete after the first client render. Persistence
  // writes only happen after this — so the lazy initial state can never be
  // overwritten by the very first render's "default" values.
  useEffect(() => {
    hydratedRef.current = true;
  }, []);

  // Persist messages whenever they change (post-hydration).
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Persist input draft.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CHAT_DRAFT_KEY, inputValue);
    } catch {}
  }, [inputValue]);

  // Persist open state (uncontrolled mode only — when controlled, the
  // parent owns the open state and is responsible for its own persistence).
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (isControlled) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        CHAT_OPEN_KEY,
        internalOpen ? "true" : "false"
      );
    } catch {}
  }, [internalOpen, isControlled]);

  function appendMessage(msg) {
    const id = nextIdRef.current++;
    setMessages((prev) => [...prev, { id, ...msg }]);
  }

  // Persist the guided-flow state so a reload resumes where the user left off.
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(CHAT_FLOW_KEY, JSON.stringify(flow));
    } catch {}
  }, [flow]);

  function postStepQuestion(steps, index) {
    const step = steps[index];
    if (!step) return;
    const actions =
      step.type === "choice"
        ? step.options.map((o) => ({ label: o, type: "flowChoice", value: o }))
        : undefined;
    appendMessage({ from: "bot", text: step.q, actions });
  }

  function startFlow(categoryKey) {
    const f = FLOWS[categoryKey];
    if (!f) return;
    const cat = CATEGORIES.find((c) => c.key === categoryKey);
    appendMessage({ from: "user", text: cat?.label || f.title });
    const steps = getFlowSteps(categoryKey);
    setFlow({ category: categoryKey, stepIndex: 0, answers: {} });
    setTimeout(() => {
      if (f.intro) appendMessage({ from: "bot", text: f.intro });
      postStepQuestion(steps, 0);
    }, 320);
  }

  function recordAnswer(value) {
    const category = flow.category;
    if (!category) return;
    const steps = getFlowSteps(category);
    const step = steps[flow.stepIndex];
    if (!step) return;

    if (step.type === "text" && step.validate === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        appendMessage({ from: "user", text: value });
        setTimeout(
          () =>
            appendMessage({
              from: "bot",
              text: "That doesn't look like a valid email. Please enter a valid email address.",
            }),
          250
        );
        return;
      }
    }
    if (step.type === "text" && step.validate === "phone") {
      if (!/^[+\d][\d\s\-()]{6,}$/.test(value)) {
        appendMessage({ from: "user", text: value });
        setTimeout(
          () =>
            appendMessage({
              from: "bot",
              text: "Please enter a valid phone / mobile number.",
            }),
          250
        );
        return;
      }
    }

    appendMessage({ from: "user", text: value });
    const answers = { ...flow.answers, [step.key]: value };
    const nextIndex = flow.stepIndex + 1;

    if (nextIndex < steps.length) {
      setFlow({ ...flow, answers, stepIndex: nextIndex });
      setTimeout(() => postStepQuestion(steps, nextIndex), 320);
    } else {
      const finalFlow = { ...flow, answers, stepIndex: nextIndex };
      setFlow(finalFlow);
      setTimeout(() => submitFlow(finalFlow), 320);
    }
  }

  async function submitFlow(finalFlow) {
    const f = FLOWS[finalFlow.category];
    const answers = finalFlow.answers || {};
    try {
      await fetch("/api/chatbot-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: finalFlow.category,
          categoryTitle: f?.title || finalFlow.category,
          answers,
        }),
      });
    } catch {
      /* best-effort — still confirm to the user */
    }
    appendMessage({
      from: "bot",
      text: `Thank you${answers.name ? ", " + answers.name : ""}! Your request has been received. Our team will reach out shortly.`,
      actions: [
        {
          label: f?.cta || "Talk to an Expert",
          href: "https://meetings.raceinnovations.in/login",
        },
        { label: "Start over", type: "flowReset" },
      ],
    });
    setFlow(EMPTY_FLOW);
  }

  function sendCategories(prefix) {
    appendMessage({
      from: "bot",
      text: prefix || "What can we help you with?",
      actions: CATEGORIES.map((c) => ({
        label: c.label,
        type: "flowStart",
        value: c.key,
      })),
    });
  }

  function resetFlowToStart() {
    setFlow(EMPTY_FLOW);
    sendCategories("What else can we help you with?");
  }

  function handleAction(action) {
    if (!action) return;

    if (action.type === "flowStart") {
      startFlow(action.value);
      return;
    }
    if (action.type === "flowChoice") {
      recordAnswer(action.value);
      return;
    }
    if (action.type === "flowReset") {
      resetFlowToStart();
      return;
    }

    if (action.href) {
      if (typeof window !== "undefined") {
        window.location.href = action.href;
      }
      return;
    }

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
    setInputValue("");

    // If a guided flow is active and this step expects free text, capture it.
    if (flow.category) {
      const steps = getFlowSteps(flow.category);
      const step = steps[flow.stepIndex];
      if (step && step.type === "text") {
        recordAnswer(text);
        return;
      }
      appendMessage({ from: "user", text });
      setTimeout(
        () =>
          appendMessage({
            from: "bot",
            text: "Please tap one of the options above to continue.",
          }),
        250
      );
      return;
    }

    // No active flow — answer report FAQs if we can, else guide to the menu.
    appendMessage({ from: "user", text });
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
                RACE Assistant
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
                Online • Reports, Consulting & IT Solutions
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

