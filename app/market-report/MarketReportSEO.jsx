import React from "react";

const FAQS = [
  {
    question: "What types of automotive market reports does RACE Innovations publish?",
    answer:
      "RACE Innovations publishes automotive market forecast reports, flash reports, EV intelligence reports, country reports, OEM benchmarking studies, aftermarket reports, and segment-level reports across passenger vehicles, commercial vehicles, two-wheelers, three-wheelers, tractors, and construction equipment.",
  },
  {
    question: "Do you provide country-wise automotive market reports?",
    answer:
      "Yes. We cover country-wise automotive markets including India, South Africa, Australia, Brazil, Germany, Japan, Sweden, Vietnam, Chile, Pakistan, Colombia, Peru, Indonesia, Thailand, Malaysia, Philippines, Mexico, USA, UK, and Canada — with vehicle sales data, segment-level breakdowns, and forward-looking forecasts.",
  },
  {
    question: "Are EV intelligence and electric vehicle reports available?",
    answer:
      "Yes. Our EV intelligence reports cover electric vehicle adoption trends, OEM activity, charging infrastructure, alternative powertrain adoption, and country-wise EV market outlook with rolling forecasts.",
  },
  {
    question: "What is OEM benchmarking and how do your reports help?",
    answer:
      "OEM benchmarking reports compare automotive original equipment manufacturers across product portfolios, market share, segment performance, regional strategy, and forecast positioning — helping investors, suppliers, and strategy teams make informed decisions.",
  },
  {
    question: "Do RACE Innovations market reports include forecast data?",
    answer:
      "Yes. Our automotive forecast reports include forward-looking market sizing, segment outlook, country-wise sales forecast, and rolling projections built on primary research and structured industry data.",
  },
  {
    question: "Can I get a custom automotive research report?",
    answer:
      "Yes. We offer custom automotive research scoped by country, segment, OEM, powertrain, forecast horizon, and business strategy need — please use the Talk To Sales option on this page to share requirements.",
  },
];

export default function MarketReportSEO() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Automotive Market Reports | RACE Innovations",
    description:
      "Country-wise, segment-wise, and OEM-level automotive market reports, forecast insights, EV intelligence, and industry research from RACE Innovations.",
    url: "https://raceinnovations.in/market-report",
    publisher: {
      "@type": "Organization",
      name: "RACE Innovations",
      url: "https://raceinnovations.in",
      logo: {
        "@type": "ImageObject",
        url: "https://raceinnovations.in/images/logo.jpg",
      },
    },
    about: [
      "Automotive market reports",
      "Automotive forecast reports",
      "EV market intelligence",
      "OEM benchmarking",
      "Commercial vehicle market reports",
      "Passenger vehicle market reports",
      "Two wheeler market reports",
      "Three wheeler market reports",
      "Tractor market reports",
      "Construction equipment market reports",
      "Aftermarket reports",
      "Country automotive market reports",
    ],
  };

  return (
    <section
      aria-label="About RACE Innovations automotive market reports"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: "32px",
        paddingBottom: "48px",
      }}
    >
      <div className="container-fluid px-4 px-md-5 px-lg-5">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <h2
              style={{
                fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)",
                fontWeight: 800,
                color: "#0b1220",
                marginBottom: "14px",
                lineHeight: 1.2,
              }}
            >
              Automotive Market Reports, Forecast Reports &amp; Market
              Intelligence
            </h2>

            <p
              style={{
                color: "#475467",
                fontSize: "1.02rem",
                lineHeight: 1.7,
                marginBottom: "26px",
              }}
            >
              RACE Innovations publishes automotive market reports, automotive
              forecast reports, and country-wise vehicle market intelligence for
              OEMs, suppliers, investors, consultants, and strategy teams.
              Explore EV intelligence, OEM benchmarking, commercial vehicle
              reports, passenger vehicle reports, two-wheeler reports,
              three-wheeler reports, tractor reports, and construction
              equipment reports — all backed by structured automotive research
              and rolling forecasts.
            </p>

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1f2f63",
                    marginBottom: "8px",
                  }}
                >
                  Automotive market &amp; forecast reports
                </h3>
                <p style={{ color: "#475467", fontSize: "0.98rem", lineHeight: 1.65 }}>
                  Our automotive market reports combine vehicle sales data,
                  segment-level analysis, and automotive sales forecast models
                  to deliver actionable market intelligence. Forecast reports
                  cover rolling projections by country, segment, and powertrain
                  for short and medium horizons.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1f2f63",
                    marginBottom: "8px",
                  }}
                >
                  Country automotive market reports
                </h3>
                <p style={{ color: "#475467", fontSize: "0.98rem", lineHeight: 1.65 }}>
                  We publish country automotive market reports for India, South
                  Africa, Australia, Brazil, Germany, Japan, Sweden, Vietnam,
                  Chile, Pakistan, Colombia, Peru, Indonesia, Thailand,
                  Malaysia, Philippines, Mexico, USA, UK, and Canada — covering
                  vehicle sales, OEM activity, and forecast outlook.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1f2f63",
                    marginBottom: "8px",
                  }}
                >
                  EV market intelligence
                </h3>
                <p style={{ color: "#475467", fontSize: "0.98rem", lineHeight: 1.65 }}>
                  EV market intelligence and electric vehicle reports cover
                  adoption trends, OEM EV portfolios, alternative powertrain
                  shifts, charging infrastructure, and EV market forecast across
                  global automotive markets.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1f2f63",
                    marginBottom: "8px",
                  }}
                >
                  OEM benchmarking &amp; competitive analysis
                </h3>
                <p style={{ color: "#475467", fontSize: "0.98rem", lineHeight: 1.65 }}>
                  OEM benchmarking reports compare automotive OEMs by
                  segment, region, market share, product strategy, and forecast
                  positioning — supporting investors, OEMs, and Tier-1
                  suppliers in strategic decision-making.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1f2f63",
                    marginBottom: "8px",
                  }}
                >
                  Commercial &amp; passenger vehicle reports
                </h3>
                <p style={{ color: "#475467", fontSize: "0.98rem", lineHeight: 1.65 }}>
                  Commercial vehicle market reports and passenger vehicle market
                  reports include trucks, buses, light commercial vehicles,
                  SUVs, sedans, hatchbacks, and segment-level forecasts with
                  region-specific automotive insights.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1f2f63",
                    marginBottom: "8px",
                  }}
                >
                  Two-wheeler, three-wheeler, tractor &amp; construction
                  equipment reports
                </h3>
                <p style={{ color: "#475467", fontSize: "0.98rem", lineHeight: 1.65 }}>
                  Specialized reports across two-wheeler markets, three-wheeler
                  markets, tractor markets, and construction equipment markets
                  — including aftermarket reports, segment outlook, and
                  country-level vehicle sales analysis.
                </p>
              </div>
            </div>

            <h2
              style={{
                fontSize: "clamp(1.4rem, 2vw, 1.9rem)",
                fontWeight: 800,
                color: "#0b1220",
                marginTop: "36px",
                marginBottom: "16px",
                lineHeight: 1.2,
              }}
            >
              Frequently Asked Questions
            </h2>

            <div className="d-flex flex-column gap-3">
              {FAQS.map((faq, idx) => (
                <article
                  key={idx}
                  style={{
                    border: "1px solid #e5ebf7",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    backgroundColor: "#fafbfe",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.02rem",
                      fontWeight: 800,
                      color: "#1f2f63",
                      marginBottom: "8px",
                      lineHeight: 1.35,
                    }}
                  >
                    {faq.question}
                  </h3>
                  <p
                    style={{
                      color: "#475467",
                      fontSize: "0.96rem",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    </section>
  );
}
