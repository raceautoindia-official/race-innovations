"use client";

import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaVideo,
  FaTasks,
  FaMobileAlt,
  FaWarehouse,
  FaFunnelDollar,
  FaChartLine,
  FaShoppingCart,
  FaPhotoVideo,
  FaUserClock,
  FaMagic,
  FaNewspaper,
  FaEnvelopeOpenText,
  FaBriefcase,
  FaHeadset,
  FaCheckCircle,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";
import {
  isValidIndianMobile,
  normalizeIndianMobile,
  INVALID_MOBILE_MESSAGE,
} from "../../lib/validation/phone";

const PRODUCTS = [
  {
    key: "Video Calling App",
    icon: FaVideo,
    accent: "#2f45bf",
    tagline: "Secure, high-quality video communication",
    description:
      "A reliable video calling and conferencing solution with crystal-clear audio/video, screen sharing, and group calls — built for teams, support, and remote collaboration.",
    features: ["HD group video calls", "Screen sharing", "Secure & encrypted"],
  },
  {
    key: "Project Management App",
    icon: FaTasks,
    accent: "#0ea5e9",
    tagline: "Plan, track and deliver projects",
    description:
      "Organize tasks, assign owners, track progress and hit deadlines from a single dashboard — with boards, timelines and team collaboration in one place.",
    features: ["Task boards & timelines", "Team collaboration", "Progress tracking"],
  },
  {
    key: "Mobile App",
    icon: FaMobileAlt,
    accent: "#8b5cf6",
    tagline: "Custom cross-platform mobile apps",
    description:
      "End-to-end mobile app development for Android and iOS — from concept and UI/UX to launch and support, tailored to your business workflows.",
    features: ["Android & iOS", "Custom UI/UX", "Launch & support"],
  },
  {
    key: "Bale Management App",
    icon: FaWarehouse,
    accent: "#16a34a",
    tagline: "Smart bale inventory & logistics",
    description:
      "Track bales end-to-end — weight, grade, storage location, dispatch and stock levels — with real-time visibility and reporting for efficient operations.",
    features: ["Inventory & weight tracking", "Dispatch & logistics", "Real-time reports"],
  },
  {
    key: "Lead Generation Tool",
    icon: FaFunnelDollar,
    accent: "#f59e0b",
    tagline: "Capture, qualify & convert leads",
    description:
      "A smart lead generation platform that captures prospects, scores and qualifies them, and moves them through your sales funnel with automated follow-ups.",
    features: ["Lead capture & scoring", "Sales funnel automation", "Conversion analytics"],
  },
  {
    key: "Forecasting Tool",
    icon: FaChartLine,
    accent: "#ec4899",
    tagline: "Data-driven forecasts & insights",
    description:
      "Turn historical data into accurate forecasts — demand, sales and market trends — with interactive dashboards and scenario planning to guide better decisions.",
    features: ["Demand & sales forecasts", "Interactive dashboards", "Scenario planning"],
  },
  {
    key: "Ecommerce Websites",
    icon: FaShoppingCart,
    accent: "#ef4444",
    tagline: "Online stores that convert",
    description:
      "Full-featured e-commerce websites with product catalogs, secure checkout, payment gateways and order management — built to scale and drive sales.",
    features: ["Product catalog & cart", "Secure payments", "Order management"],
  },
  {
    key: "Media Platform",
    icon: FaPhotoVideo,
    accent: "#06b6d4",
    tagline: "Stream, publish & engage",
    description:
      "A media platform to host, stream and publish video, audio and articles — with user accounts, playlists and a full content management system.",
    features: ["Video & audio streaming", "Content management", "User engagement"],
  },
  {
    key: "Attendance App",
    icon: FaUserClock,
    accent: "#14b8a6",
    tagline: "Track attendance effortlessly",
    description:
      "Digital attendance and workforce tracking with check-in/out, geo and biometric options, leave and shift management, and automated reports.",
    features: ["Check-in / check-out", "Leave & shift management", "Automated reports"],
  },
  {
    key: "Skin & Hair Analyzer App",
    icon: FaMagic,
    accent: "#d946ef",
    tagline: "AI skin & hair analysis",
    description:
      "An AI-powered app that analyzes skin and hair conditions from photos and recommends personalized care, products and routines — with progress tracking over time.",
    features: ["AI photo analysis", "Personalized recommendations", "Progress tracking"],
  },
  {
    key: "Newsletter App",
    icon: FaNewspaper,
    accent: "#f97316",
    tagline: "Create & send newsletters",
    description:
      "Design, schedule and send beautiful newsletters to your subscribers — with drag-and-drop templates, subscriber lists and open/click tracking.",
    features: ["Drag-and-drop templates", "Subscriber management", "Open & click tracking"],
  },
  {
    key: "Email Marketing Tool",
    icon: FaEnvelopeOpenText,
    accent: "#3b82f6",
    tagline: "Campaigns that reach inboxes",
    description:
      "Plan and run email marketing campaigns with automation, audience segmentation, A/B testing and detailed performance analytics.",
    features: ["Automation & drip campaigns", "Audience segmentation", "Performance analytics"],
  },
  {
    key: "Client Portfolio Websites",
    icon: FaBriefcase,
    accent: "#10b981",
    tagline: "Showcase your work beautifully",
    description:
      "Elegant portfolio and business websites that showcase your work, services and brand — responsive, fast and SEO-friendly.",
    features: ["Responsive design", "SEO-friendly", "Fast & modern"],
  },
  {
    key: "IT Support Platform",
    icon: FaHeadset,
    accent: "#6366f1",
    tagline: "Helpdesk & ticketing made simple",
    description:
      "A complete IT support and helpdesk platform with ticketing, SLA tracking, a knowledge base and multi-channel support to resolve issues faster.",
    features: ["Ticketing & SLA tracking", "Knowledge base", "Multi-channel support"],
  },
];

const IT_FAQS = [
  {
    question: "What IT products and software solutions does RACE Innovations offer?",
    answer:
      "RACE Innovations offers a range of business software products including a Video Calling App, Project Management App, Mobile App Development, Bale Management App, Lead Generation Tool, Forecasting Tool, E-commerce Websites, Media Platform, Attendance App, Skin & Hair Analyzer App, Newsletter App, Email Marketing Tool, Client Portfolio Websites and IT Support Platform.",
  },
  {
    question: "What is the RACE Innovations Project Management App?",
    answer:
      "The Project Management App helps businesses plan, organize and monitor projects from one platform. Teams can create tasks, assign responsibilities, manage timelines, collaborate with team members and track project progress to improve on-time delivery.",
  },
  {
    question: "How can a project management tool improve team productivity?",
    answer:
      "A project management tool provides better visibility over tasks, owners, deadlines and project progress. It helps teams coordinate work, reduce missed deadlines, improve collaboration and manage multiple projects through centralized dashboards, task boards and timelines.",
  },
  {
    question:
      "What is the Attendance App and how does it help businesses manage employees?",
    answer:
      "The Attendance App is a digital attendance and workforce management solution that supports employee check-in and check-out, location-based attendance, biometric options, leave management, shift management and automated attendance reporting.",
  },
  {
    question:
      "Can the Attendance App support field employees and multiple work locations?",
    answer:
      "Yes. The Attendance App can support businesses managing employees across offices, project sites and field locations through digital attendance and location-based workforce tracking. This helps organizations improve attendance visibility and reduce manual attendance processes.",
  },
  {
    question: "What features are available in the Video Calling App?",
    answer:
      "The Video Calling App provides secure online video communication for teams and businesses. It supports HD group video calls, screen sharing and secure communication, making it suitable for remote meetings, customer support, internal collaboration and online discussions.",
  },
  {
    question: "Does RACE Innovations develop custom Android and iOS mobile apps?",
    answer:
      "Yes. RACE Innovations provides custom mobile app development for Android and iOS. The service can cover application planning, UI/UX design, development, launch and ongoing support, with applications tailored to specific business processes and requirements.",
  },
  {
    question: "What is the Lead Generation Tool and how does it help sales teams?",
    answer:
      "The Lead Generation Tool helps businesses capture, qualify and manage potential customers through the sales funnel. It supports lead capture, lead scoring, automated follow-ups, sales funnel automation and conversion analytics to help sales teams identify and convert better opportunities.",
  },
  {
    question: "Can the Lead Generation Tool automate sales follow-ups?",
    answer:
      "Yes. The Lead Generation Tool supports automated follow-ups and sales funnel automation. This can help businesses maintain consistent communication with prospects, manage larger lead volumes and reduce the risk of potential opportunities being missed.",
  },
  {
    question: "What does the Forecasting Tool do?",
    answer:
      "The Forecasting Tool uses historical business data to generate demand, sales and market forecasts. It includes interactive dashboards and scenario-planning capabilities that can help businesses evaluate possible future outcomes and make more informed planning decisions.",
  },
  {
    question: "Can the Forecasting Tool be used for sales and demand forecasting?",
    answer:
      "Yes. The Forecasting Tool is designed to support sales forecasting, demand forecasting and market trend analysis. Businesses can use historical information, dashboards and scenario planning to support budgeting, inventory planning, capacity planning and strategic decision-making.",
  },
  {
    question: "What is the Bale Management App?",
    answer:
      "The Bale Management App is an inventory and logistics management solution designed to track bales from storage through dispatch. It can monitor weight, grade, storage location, stock levels and logistics activity while providing real-time operational reports.",
  },
  {
    question: "Does RACE Innovations develop e-commerce websites?",
    answer:
      "Yes. RACE Innovations develops full-featured e-commerce websites with product catalogues, shopping carts, secure checkout, payment gateway integration and order management. The websites can be designed to support scalable online sales operations.",
  },
  {
    question: "What is the Media Platform offered by RACE Innovations?",
    answer:
      "The Media Platform enables organizations to host, publish and manage video, audio and article content. It can include content management, user accounts, playlists, streaming capabilities and features designed to improve audience engagement.",
  },
  {
    question: "What is the AI-powered Skin & Hair Analyzer App?",
    answer:
      "The Skin & Hair Analyzer App uses AI-powered photo analysis to assess skin and hair conditions. It can provide personalized care, product and routine recommendations while allowing users to monitor progress over time.",
  },
  {
    question: "What is the Newsletter App and what features does it provide?",
    answer:
      "The Newsletter App helps businesses create, schedule and distribute newsletters to subscriber lists. It includes drag-and-drop newsletter templates, subscriber management and open-and-click tracking to help organizations manage and measure newsletter communication.",
  },
  {
    question:
      "What is the Email Marketing Tool and how does it support marketing campaigns?",
    answer:
      "The Email Marketing Tool helps businesses plan, automate and monitor email campaigns. It supports audience segmentation, automated and drip campaigns, A/B testing and campaign performance analytics to help improve customer communication and marketing effectiveness.",
  },
  {
    question: "Does RACE Innovations build SEO-friendly business and portfolio websites?",
    answer:
      "Yes. RACE Innovations develops responsive, fast and SEO-friendly portfolio and business websites designed to showcase company services, projects, capabilities and brand information while improving the organization's professional online presence.",
  },
  {
    question:
      "What is the IT Support Platform and how does it improve helpdesk management?",
    answer:
      "The IT Support Platform is a helpdesk and ticket-management solution designed to help organizations manage technical and customer-support requests. It includes ticketing, SLA tracking, a knowledge base and multi-channel support to help teams resolve issues more efficiently.",
  },
  {
    question:
      "Can RACE Innovations customize software products according to our business requirements?",
    answer:
      "Yes. RACE Innovations develops software solutions tailored to how businesses operate. Depending on the requirement, solutions can be customized around workflows, users, dashboards, integrations, reporting and operational processes. Businesses can also request a demo or submit an enquiry to discuss their specific software requirements.",
  },
];

const itFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: IT_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const CONTACT_MODES = ["Email", "Phone", "WhatsApp"];

const EMPTY_FORM = {
  name: "",
  company_name: "",
  email: "",
  phone: "",
  area_of_interest: "",
  preferred_contact: "Email",
  message: "",
};

export default function ItProducts() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [openFaq, setOpenFaq] = useState(0);
  const formRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function enquireAbout(productKey) {
    setForm((prev) => ({
      ...prev,
      area_of_interest: productKey,
      message: prev.message?.trim()
        ? prev.message
        : `I'm interested in the ${productKey}. Please share more details.`,
    }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const required = ["name", "company_name", "email", "phone", "area_of_interest", "message"];
    for (const f of required) {
      if (!String(form[f] || "").trim()) {
        setStatus({ type: "error", message: "Please fill all required fields." });
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    if (!isValidIndianMobile(form.phone)) {
      setStatus({ type: "error", message: INVALID_MOBILE_MESSAGE });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          company_name: form.company_name.trim(),
          email: form.email.trim(),
          phone: normalizeIndianMobile(form.phone),
          area_of_interest: form.area_of_interest.trim(),
          preferred_contact: form.preferred_contact || "Email",
          message: form.message.trim(),
          report_title: `IT Services Enquiry — ${form.area_of_interest.trim()}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to submit enquiry.");
      }
      setStatus({
        type: "success",
        message: "Thank you! Your enquiry has been submitted. Our team will reach out shortly.",
      });
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus({ type: "error", message: err?.message || "Failed to submit enquiry." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itFaqJsonLd) }}
      />
      <Navbar />

      <div className="main-content itp-page">
        <main className="itp-main">
        {/* Hero */}
        <section className="itp-hero">
          <div className="itp-hero-glow" aria-hidden="true" />
          <span className="itp-eyebrow">IT Services &amp; Software Products</span>
          <h1 className="itp-title">
            Powerful Apps, <span className="itp-grad">Built for Your Business</span>
          </h1>
          <p className="itp-subtitle">
            From real-time communication to lead generation and forecasting — we
            design and develop production-ready software tailored to how you work.
          </p>
          <button
            type="button"
            className="itp-hero-btn"
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Request a Demo <FaArrowRight />
          </button>
        </section>

        {/* Section heading */}
        <div className="itp-section-head">
          <span className="itp-kicker">Our Software Products</span>
          <h2 className="itp-section-title">
            Solutions crafted for every part of your business
          </h2>
          <span className="itp-section-rule" aria-hidden="true" />
        </div>

        {/* Product cards */}
        <section className="itp-grid">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            return (
              <article
                className="itp-card"
                key={p.key}
                style={{ "--accent": p.accent }}
              >
                <span className="itp-card-bar" aria-hidden="true" />
                <div className="itp-card-icon">
                  <Icon />
                </div>
                <h2 className="itp-card-title">{p.key}</h2>
                <div className="itp-card-tag">{p.tagline}</div>
                <p className="itp-card-desc">{p.description}</p>
                <ul className="itp-card-features">
                  {p.features.map((f) => (
                    <li key={f}>
                      <FaCheckCircle className="itp-feat-icon" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="itp-card-btn"
                  onClick={() => enquireAbout(p.key)}
                >
                  Enquire about this <FaArrowRight />
                </button>
              </article>
            );
          })}
        </section>

        {/* FAQ */}
        <section className="itp-faq" aria-label="IT products frequently asked questions">
          <div className="itp-section-head">
            <span className="itp-kicker">FAQs</span>
            <h2 className="itp-section-title">Frequently Asked Questions</h2>
            <span className="itp-section-rule" aria-hidden="true" />
          </div>

          <div className="itp-faq-list">
            {IT_FAQS.map((faq, idx) => {
              const open = openFaq === idx;
              return (
                <div className={`itp-faq-item${open ? " open" : ""}`} key={idx}>
                  <button
                    type="button"
                    className="itp-faq-q"
                    onClick={() => setOpenFaq(open ? -1 : idx)}
                    aria-expanded={open}
                  >
                    <span>{faq.question}</span>
                    <FaChevronDown className="itp-faq-chev" aria-hidden="true" />
                  </button>
                  <div className="itp-faq-a">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Enquiry form */}
        <section className="itp-enquiry" ref={formRef}>
          <div className="itp-enquiry-inner">
            <div className="itp-enquiry-head">
              <span className="itp-eyebrow light">Get in touch</span>
              <h2>Request a Demo / Enquiry</h2>
              <p>Tell us what you need and our team will get back to you.</p>
            </div>

            {status.message ? (
              <div className={`itp-alert ${status.type === "success" ? "ok" : "err"}`}>
                {status.message}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="itp-form">
              <div className="itp-field">
                <label>Name *</label>
                <input name="name" value={form.name} onChange={handleChange} disabled={submitting} />
              </div>
              <div className="itp-field">
                <label>Company Name *</label>
                <input name="company_name" value={form.company_name} onChange={handleChange} disabled={submitting} />
              </div>
              <div className="itp-field">
                <label>Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} disabled={submitting} />
              </div>
              <div className="itp-field">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={submitting}
                  inputMode="tel"
                  placeholder="10-digit mobile"
                />
              </div>
              <div className="itp-field">
                <label>Interested In *</label>
                <select name="area_of_interest" value={form.area_of_interest} onChange={handleChange} disabled={submitting}>
                  <option value="">Select a product</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.key} value={p.key}>{p.key}</option>
                  ))}
                  <option value="Other / General">Other / General</option>
                </select>
              </div>
              <div className="itp-field">
                <label>Preferred Mode of Contact *</label>
                <select name="preferred_contact" value={form.preferred_contact} onChange={handleChange} disabled={submitting}>
                  {CONTACT_MODES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="itp-field itp-field-full">
                <label>Message *</label>
                <textarea name="message" rows={4} value={form.message} onChange={handleChange} disabled={submitting} />
              </div>
              <div className="itp-field-full itp-submit-row">
                <button type="submit" className="itp-submit" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </section>
        </main>
      </div>

      <Footer />

      {/* This page renders the shared footer in normal flow so it is always
          visible. The site default makes .footer position:fixed; z-index:-1
          (a scroll-reveal footer that can stay hidden behind tall content).
          This global override is scoped to this page — it is removed when the
          user navigates away. */}
      <style jsx global>{`
        .footer {
          position: static !important;
          z-index: auto !important;
        }
        .main-content {
          margin-bottom: 0 !important;
        }
      `}</style>

      <style jsx>{`
        .itp-page {
          background: #f5f7fc;
        }
        .itp-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 36px 16px 72px;
        }

        /* Hero */
        .itp-hero {
          position: relative;
          overflow: hidden;
          text-align: center;
          padding: 56px 24px 60px;
          border-radius: 28px;
          background: linear-gradient(135deg, #0e1b3d 0%, #243aa6 55%, #2f45bf 100%);
          color: #fff;
          box-shadow: 0 24px 60px rgba(20, 30, 80, 0.25);
        }
        .itp-hero-glow {
          position: absolute;
          top: -120px;
          right: -80px;
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.32) 0%, rgba(139, 92, 246, 0) 70%);
          filter: blur(14px);
          pointer-events: none;
        }
        .itp-eyebrow {
          position: relative;
          display: inline-block;
          background: rgba(255, 255, 255, 0.14);
          color: #dbe2ff;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .itp-eyebrow.light {
          background: #e7ebfb;
          color: #2f45bf;
          border-color: transparent;
        }
        .itp-title {
          position: relative;
          margin: 18px 0 12px;
          font-size: clamp(28px, 5vw, 46px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .itp-grad {
          background: linear-gradient(90deg, #ffd166 0%, #ec4899 50%, #8b5cf6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .itp-subtitle {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          color: #c7d0ee;
          font-size: 16.5px;
          line-height: 1.65;
        }
        .itp-hero-btn {
          position: relative;
          margin-top: 26px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          color: #1b2a64;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          font-size: 15px;
          padding: 13px 26px;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
        }
        .itp-hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
        }

        /* Section heading */
        .itp-section-head {
          text-align: center;
          margin-top: 56px;
        }
        .itp-kicker {
          display: inline-block;
          color: #2f45bf;
          font-weight: 800;
          font-size: 12.5px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }
        .itp-section-title {
          margin: 10px auto 0;
          max-width: 660px;
          font-size: clamp(22px, 3vw, 31px);
          font-weight: 800;
          color: #0e1b3d;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .itp-section-rule {
          display: block;
          width: 64px;
          height: 3px;
          margin: 18px auto 0;
          border-radius: 999px;
          background: linear-gradient(90deg, #2f45bf, #8b5cf6);
        }

        /* Cards */
        .itp-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
          margin-top: 36px;
        }
        .itp-card {
          position: relative;
          overflow: hidden;
          background: #fff;
          border: 1px solid #eef1f8;
          border-radius: 22px;
          padding: 32px 30px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 6px 22px rgba(20, 30, 70, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .itp-card-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .itp-card:hover .itp-card-bar {
          transform: scaleX(1);
        }
        .itp-card:hover {
          transform: translateY(-6px);
          border-color: color-mix(in srgb, var(--accent) 32%, #eef1f8);
          box-shadow: 0 22px 46px color-mix(in srgb, var(--accent) 15%, rgba(20, 30, 70, 0.06));
        }
        .itp-card-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: color-mix(in srgb, var(--accent) 14%, #fff);
          color: var(--accent);
          font-size: 27px;
          margin-bottom: 18px;
        }
        .itp-card-title {
          font-size: 20px;
          font-weight: 800;
          color: #0e1b3d;
          margin: 0 0 4px;
          line-height: 1.25;
        }
        .itp-card-tag {
          color: var(--accent);
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .itp-card-desc {
          color: #56607a;
          font-size: 14.5px;
          line-height: 1.65;
          margin-bottom: 16px;
        }
        .itp-card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 22px;
          display: grid;
          gap: 9px;
        }
        .itp-card-features li {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #243454;
          font-size: 14px;
          font-weight: 600;
        }
        .itp-feat-icon {
          color: var(--accent);
          flex-shrink: 0;
        }
        .itp-card-btn {
          margin-top: auto;
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--accent);
          border: none;
          padding: 0;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.2px;
          cursor: pointer;
          transition: gap 0.2s ease;
        }
        .itp-card-btn:hover {
          gap: 13px;
        }

        /* Enquiry */
        .itp-enquiry {
          margin-top: 56px;
        }
        .itp-enquiry-inner {
          background: #fff;
          border: 1px solid #e6ebf5;
          border-radius: 26px;
          padding: 38px;
          box-shadow: 0 18px 40px rgba(20, 30, 70, 0.07);
        }
        .itp-enquiry-head {
          text-align: center;
          margin-bottom: 24px;
        }
        .itp-enquiry-head h2 {
          font-size: 28px;
          font-weight: 900;
          color: #0e1b3d;
          margin: 14px 0 6px;
        }
        .itp-enquiry-head p {
          color: #56607a;
          margin: 0;
        }
        .itp-alert {
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 18px;
        }
        .itp-alert.ok {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .itp-alert.err {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        .itp-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .itp-field {
          display: flex;
          flex-direction: column;
        }
        .itp-field-full {
          grid-column: 1 / -1;
        }
        .itp-field label {
          font-weight: 700;
          font-size: 13.5px;
          color: #243454;
          margin-bottom: 6px;
        }
        .itp-field input,
        .itp-field select,
        .itp-field textarea {
          border: 1px solid #d3dbeb;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14.5px;
          color: #0e1b3d;
          background: #fbfcff;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .itp-field input:focus,
        .itp-field select:focus,
        .itp-field textarea:focus {
          border-color: #2f45bf;
          box-shadow: 0 0 0 3px rgba(47, 69, 191, 0.12);
        }
        .itp-submit-row {
          display: flex;
          justify-content: flex-end;
        }
        .itp-submit {
          background: linear-gradient(135deg, #2f45bf 0%, #4a5fe0 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          padding: 14px 34px;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 10px 24px rgba(47, 69, 191, 0.28);
        }
        .itp-submit:hover {
          transform: translateY(-2px);
        }
        .itp-submit:disabled {
          opacity: 0.7;
          cursor: default;
          transform: none;
        }

        /* FAQ */
        .itp-faq {
          margin-top: 56px;
        }
        .itp-faq-list {
          max-width: 860px;
          margin: 34px auto 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .itp-faq-item {
          background: #fff;
          border: 1px solid #e6ebf5;
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .itp-faq-item.open {
          border-color: #c2ccf3;
          box-shadow: 0 10px 26px rgba(20, 30, 70, 0.06);
        }
        .itp-faq-q {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          text-align: left;
          background: transparent;
          border: none;
          padding: 18px 22px;
          cursor: pointer;
          font-size: 15.5px;
          font-weight: 700;
          color: #0e1b3d;
          line-height: 1.4;
        }
        .itp-faq-chev {
          flex-shrink: 0;
          color: #2f45bf;
          font-size: 14px;
          transition: transform 0.25s ease;
        }
        .itp-faq-item.open .itp-faq-chev {
          transform: rotate(180deg);
        }
        .itp-faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .itp-faq-item.open .itp-faq-a {
          max-height: 520px;
        }
        .itp-faq-a p {
          margin: 0;
          padding: 0 22px 20px;
          color: #56607a;
          font-size: 14.5px;
          line-height: 1.7;
        }

        @media (max-width: 992px) {
          .itp-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          .itp-grid {
            grid-template-columns: 1fr;
          }
          .itp-form {
            grid-template-columns: 1fr;
          }
          .itp-enquiry-inner {
            padding: 24px;
          }
          .itp-hero {
            padding: 44px 18px 46px;
          }
        }
      `}</style>
    </>
  );
}
