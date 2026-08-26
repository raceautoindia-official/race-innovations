import React from "react";
import FaqAccordion from "./FaqAccordion";

const FAQS = [
  {
    question:
      "What is an automotive market report and what information does it include?",
    answer:
      "An automotive market report provides detailed analysis of vehicle sales, market size, OEM performance, market share, vehicle segments, production trends, electric vehicle adoption, regulatory developments and future automotive industry forecasts. RACE Innovations provides automotive market intelligence for OEMs, suppliers, investors, consultants and business strategy teams.",
  },
  {
    question:
      "Where can I get global automotive market data and vehicle sales forecasts?",
    answer:
      "RACE Innovations provides global automotive market data and vehicle sales forecasts covering major automotive markets across Asia-Pacific, Europe, North America, Latin America, the Middle East and Africa. Research includes passenger vehicles, commercial vehicles, trucks, buses, two-wheelers, EVs, vehicle production and OEM trends.",
  },
  {
    question: "Do you provide country-wise automotive market reports?",
    answer:
      "Yes. RACE Innovations provides country-wise automotive market reports covering 50+ automotive markets, including India, USA, China, Germany, Japan, Brazil, Australia, South Africa, Indonesia, Thailand and other major global vehicle markets. Reports can include vehicle sales, OEM performance, market share, segment trends and future forecasts.",
  },
  {
    question: "Where can I find monthly vehicle sales data by country?",
    answer:
      "RACE Innovations provides automotive market intelligence covering monthly vehicle sales data, market trends and high-frequency market updates across selected countries and vehicle segments. Flash reports help track recent changes in vehicle demand, OEM performance and market direction.",
  },
  {
    question:
      "Do your automotive reports include OEM-wise vehicle sales and market share?",
    answer:
      "Yes. Automotive reports can include OEM-wise vehicle sales, manufacturer performance, brand positioning and automotive market share analysis. This enables OEMs, suppliers and investors to compare competitors and understand changes in manufacturer performance.",
  },
  {
    question: "Do you provide model-wise vehicle sales data?",
    answer:
      "Yes. Selected RACE Innovations automotive reports provide model-wise vehicle sales data together with OEM-wise analysis, segment performance and historical sales trends. Model-level intelligence supports competitor benchmarking, product planning, portfolio strategy and demand forecasting.",
  },
  {
    question: "Do you provide passenger vehicle and car market reports?",
    answer:
      "Yes. RACE Innovations provides passenger vehicle market reports and passenger car sales analysis covering SUVs, sedans, hatchbacks, electric cars and other passenger vehicle categories. Research can include sales trends, OEM market share, consumer demand, powertrain changes and future passenger vehicle forecasts.",
  },
  {
    question: "Do you provide commercial vehicle market reports?",
    answer:
      "Yes. RACE Innovations provides commercial vehicle market reports covering light commercial vehicles, medium commercial vehicles, heavy commercial vehicles, trucks, buses and other commercial mobility segments. Reports examine sales, OEM competition, application demand, fleet trends, electrification and future market forecasts.",
  },
  {
    question: "Are truck and bus market reports with model-wise sales available?",
    answer:
      "Yes. RACE Innovations provides truck and bus market reports covering model-wise sales, OEM-wise market share, historical sales, application demand and future forecasts. Analysis can cover freight, logistics, construction, mining, municipal, school, staff and passenger transportation applications.",
  },
  {
    question: "Do you provide two-wheeler and motorcycle market reports?",
    answer:
      "Yes. RACE Innovations provides two-wheeler market reports covering motorcycles, scooters, commuter vehicles, premium motorcycles and electric two-wheelers. Reports analyze sales trends, consumer demand, OEM competition, urban mobility, replacement demand and future two-wheeler market forecasts.",
  },
  {
    question: "Do you provide three-wheeler market reports and sales data?",
    answer:
      "Yes. RACE Innovations provides three-wheeler market research covering passenger and cargo three-wheelers, electric three-wheelers, OEM activity, sales performance, last-mile mobility demand and future market opportunities.",
  },
  {
    question: "Do you provide tractor market reports and tractor sales forecasts?",
    answer:
      "Yes. RACE Innovations provides tractor market intelligence covering tractor sales trends, OEM performance, agricultural demand, product segments and future market outlook. Customized tractor research can also support manufacturers, component suppliers, distributors and investors.",
  },
  {
    question: "Do you provide construction equipment market reports?",
    answer:
      "Yes. RACE Innovations provides construction equipment market research covering equipment demand, manufacturers, product segments, applications, infrastructure trends and market outlook. Research can be customized for specific equipment categories, countries and business requirements.",
  },
  {
    question: "Do you provide electric vehicle market reports and EV sales data?",
    answer:
      "Yes. RACE Innovations provides electric vehicle market reports covering EV adoption, electric vehicle sales, OEM activity, market trends, charging infrastructure, alternative powertrains and future EV market forecasts across global markets.",
  },
  {
    question: "Can I get EV sales data by country, OEM and vehicle segment?",
    answer:
      "Yes. RACE Innovations can provide EV market intelligence by country, OEM and vehicle segment, depending on the market and research scope. Coverage can include passenger EVs, electric two-wheelers, electric commercial vehicles, electric trucks and buses, along with adoption trends and forecast outlook.",
  },
  {
    question: "Do your reports cover hybrid vehicles and alternative powertrains?",
    answer:
      "Yes. Automotive research can cover battery electric vehicles, plug-in hybrid vehicles, hybrid vehicles and other alternative powertrain trends. Analysis helps companies understand changes in powertrain adoption, regulation, customer demand and future vehicle technologies.",
  },
  {
    question: "Do you provide EV charging infrastructure market reports?",
    answer:
      "Yes. RACE Innovations provides EV charging infrastructure research covering public charging stations, fast charging, highway charging corridors, city charging hubs, fleet depot charging, workplace charging and charging business models.",
  },
  {
    question:
      "Do automotive market reports include vehicle production data and production forecasts?",
    answer:
      "Yes. Selected reports include vehicle production data, manufacturing trends, capacity analysis and automotive production forecasts. This intelligence can support capacity planning, sourcing strategy, manufacturing investment and supplier business planning.",
  },
  {
    question:
      "Do your reports cover vehicle exports and the global automotive export market?",
    answer:
      "Yes. Selected automotive market reports analyze vehicle exports, regional automotive trade, manufacturing competitiveness and export opportunities. Research can help OEMs, suppliers and investors identify important production bases, export markets and international growth opportunities.",
  },
  {
    question: "How many years of historical automotive sales data are available?",
    answer:
      "Historical coverage depends on the country, vehicle segment and report. Selected RACE Innovations studies combine multi-year historical vehicle sales data with forward-looking forecasts, helping customers evaluate market cycles, OEM performance, demand changes and long-term automotive trends.",
  },
  {
    question:
      "Do your automotive reports include market share and competitor analysis?",
    answer:
      "Yes. RACE Innovations provides automotive market share analysis and competitive benchmarking across OEMs, vehicle segments, products and regions. This helps companies evaluate competitor positioning, market leadership, portfolio strength and future business opportunities.",
  },
  {
    question: "Do you provide automotive industry forecasts through 2030 and beyond?",
    answer:
      "Yes. RACE Innovations publishes automotive industry forecast reports with short-, medium- and long-term market outlooks depending on the report. Selected studies provide forecasts through 2030 and beyond across vehicle sales, production, EV adoption and specific vehicle segments.",
  },
  {
    question:
      "Do you provide automotive components, aftermarket and supply chain market research?",
    answer:
      "Yes. RACE Innovations provides research covering the automotive components market, automotive aftermarket, supply chain, localization, suppliers and related industry opportunities. Customized studies can support component manufacturers, Tier-1 and Tier-2 suppliers, investors and companies evaluating new markets.",
  },
  {
    question: "Can I request a custom automotive market research report?",
    answer:
      "Yes. RACE Innovations provides custom automotive market research based on country, vehicle segment, OEM, product, powertrain, competitor, forecast period and business objective. Customized studies can support market entry, product planning, benchmarking, investment decisions and business strategy.",
  },
  {
    question:
      "What do I receive when I purchase an automotive market report from RACE Innovations?",
    answer:
      "Deliverables vary by report. Depending on the selected study, customers may receive a detailed market research report, structured automotive data, forecast analysis and supporting data tables. Selected reports may also include Excel data packs, analyst access, update access and customized research options.",
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
      "Automotive market",
      "Automotive industry",
      "Automotive industry reports",
      "Automotive industry trends",
      "Automotive industry growth",
      "Automotive sector report",
      "Automotive supply chain",
      "Automotive logistics",
      "Automotive components",
      "Automobile report",
      "Passenger vehicle",
      "Future of automotive industry",
      "Automotive forecast reports",
      "Vehicle sales forecast",
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
      "India vehicle market",
      "India automotive market",
      "Automotive industry India",
      "Car sales data in India",
      "Monthly sales of cars in India",
      "China auto market",
      "China automotive",
      "Chinese automobile",
      "China electric car",
      "EV market in China",
      "Chinese auto company",
      "China car manufacturing industry",
      "US auto industry",
      "US auto market",
      "Automotive industry United States",
      "American car manufacturing",
      "UK automakers",
      "UK car dealers",
      "Used cars in England",
      "Australia vehicle sales",
      "Cars for sale Australia",
      "Second hand cars in Australia",
      "Japan car dealers",
      "Used car price in Japan",
      "Germany car sales data",
      "Brazil automotive industry",
      "Brazil automotive market",
      "Indonesia two wheeler market",
      "Motorcycle market in Indonesia",
      "Automotive in Thailand",
      "South Africa automotive",
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

            {/* Country-wise markets we cover — visible content that ranks for
                the country-specific automotive search queries (India vehicle,
                US auto industry, China automotive, UK car dealers, Australia
                vehicle sales, Brazil automotive market, Indonesia two-wheeler
                market, etc.). */}
            <h2
              style={{
                fontSize: "clamp(1.4rem, 2vw, 1.9rem)",
                fontWeight: 800,
                color: "#0b1220",
                marginTop: "36px",
                marginBottom: "8px",
                lineHeight: 1.2,
              }}
            >
              Country-wise Automotive Market Reports We Cover
            </h2>
            <p
              style={{
                color: "#475467",
                fontSize: "1rem",
                lineHeight: 1.65,
                marginBottom: "20px",
              }}
            >
              RACE Innovations publishes country-wise automotive industry
              reports, vehicle sales data, OEM activity and forecast outlook
              across major global automotive markets. Pick a region to explore
              the automotive industry trends, automotive components landscape
              and EV market developments unique to that geography.
            </p>

            <div className="row g-4">
              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  India automotive market
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  India vehicle market data, automotive industry India trends,
                  automobile sales data India, car sales data in India, monthly
                  sales of cars in India and India automotive market reports
                  covering passenger vehicles, commercial vehicles, two-wheelers
                  and tractors.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  China automotive &amp; EV market
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  China auto market, China automotive, Chinese automobile,
                  Chinese auto company and China car manufacturing industry
                  coverage — plus dedicated EV market in China reports on China
                  electric car adoption, China&rsquo;s EV and China&rsquo;s
                  electric vehicles ecosystem and car production China outlook.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  US auto industry &amp; market
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  US auto industry, US auto market, US car sales, automotive in
                  USA, automotive industry United States, automotive industry in
                  America, American car manufacturing, car manufacturing in the
                  US and automotive companies in the US — segment forecasts and
                  OEM benchmarking.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  UK automakers &amp; car dealers
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  UK automakers, UK car dealers, car dealerships UK, used cars
                  in England and UK commercial vehicle sales — UK automotive
                  market reports covering OEM activity, vehicle sales trends and
                  forecast outlook.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  Australia vehicle market
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Australia vehicle sales, Aus car sales, cars for sale
                  Australia, second hand cars in Australia and second hand cars
                  Sydney — Australia automotive market reports with new vehicle
                  registrations and OEM share insights.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  Japan automotive market
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Japan car dealers, used car price in Japan and cars for sale
                  in Japan for export — Japan automotive market reports with
                  domestic sales, export trends and OEM positioning.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  Germany car sales &amp; OEM data
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Germany car sales data, OEM market share, segment-level
                  vehicle sales and Germany automotive market reports for
                  passenger cars, commercial vehicles and EV adoption.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  Brazil automotive industry
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Brazil automotive industry, Brazil automotive market and
                  Brazil car sales by brand — Brazil automotive market reports
                  covering OEM activity, vehicle sales and forecast outlook.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  Indonesia automotive market
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Indonesia two wheeler market, motorcycle market in Indonesia
                  and Indonesia car sales by brand — Indonesia automotive market
                  reports covering passenger vehicles, two-wheelers and OEM
                  performance.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  Thailand automotive market
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Automotive in Thailand and Thailand auto — Thailand automotive
                  market reports covering vehicle sales, manufacturing hub
                  output and OEM activity across ASEAN.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  South Africa automotive market
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  South Africa automotive, South Africa auto and automobile
                  South Africa — South Africa automotive market reports covering
                  passenger vehicle and commercial vehicle activity, OEM share
                  and export trends.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1f2f63", marginBottom: "8px" }}>
                  Automotive components &amp; supply chain
                </h3>
                <p style={{ color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Automotive components landscape, automotive supply chain
                  research and automotive logistics insights — supporting
                  Tier-1, Tier-2 suppliers, OEMs and investors with structured
                  market intelligence and forecast.
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

            <FaqAccordion faqs={FAQS} />
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
