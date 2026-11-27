import React from "react";
import FaqAccordion from "./FaqAccordion";
import JsonLd from "../components/JsonLd";
import { faqJsonLd } from "../../lib/seo";
import { MARKET_REPORT_FAQS } from "./faqs";

const h3Style = {
  fontSize: "1.1rem",
  fontWeight: 800,
  color: "#1f2f63",
  marginBottom: "8px",
};

const pStyle = { color: "#475467", fontSize: "0.98rem", lineHeight: 1.65 };

const countryH3Style = {
  fontSize: "1.05rem",
  fontWeight: 800,
  color: "#1f2f63",
  marginBottom: "8px",
};

const countryPStyle = { color: "#475467", fontSize: "0.95rem", lineHeight: 1.6 };

const COUNTRY_MARKETS = [
  {
    title: "India automotive market",
    text: "Vehicle sales data and market analysis for India across passenger vehicles, commercial vehicles, two-wheelers and tractors, including monthly sales trends, OEM share and the forecast outlook.",
  },
  {
    title: "China automotive & EV market",
    text: "Coverage of China's vehicle market and its OEMs, with a focus on electric vehicle adoption, the EV ecosystem and the vehicle production outlook.",
  },
  {
    title: "US automotive market",
    text: "US vehicle sales, segment forecasts and OEM benchmarking, covering domestic manufacturing and the automotive companies competing in the American market.",
  },
  {
    title: "UK automotive market",
    text: "UK market reports covering automaker activity, passenger and commercial vehicle sales trends and the forecast outlook.",
  },
  {
    title: "Australia vehicle market",
    text: "New vehicle sales and registrations in Australia, with OEM share and segment trends.",
  },
  {
    title: "Japan automotive market",
    text: "Japan market reports covering domestic vehicle sales, export trends and OEM positioning.",
  },
  {
    title: "Germany automotive market",
    text: "Passenger car and commercial vehicle sales in Germany, OEM market share, segment-level sales and EV adoption.",
  },
  {
    title: "Brazil automotive market",
    text: "Brazil market reports covering vehicle sales by brand, OEM activity and the forecast outlook.",
  },
  {
    title: "Indonesia automotive market",
    text: "Indonesia market reports covering passenger vehicles, the motorcycle and two-wheeler market, sales by brand and OEM performance.",
  },
  {
    title: "Thailand automotive market",
    text: "Thailand market reports covering vehicle sales, output from its manufacturing base and OEM activity across ASEAN.",
  },
  {
    title: "South Africa automotive market",
    text: "South Africa market reports covering passenger and commercial vehicle activity, OEM share and export trends.",
  },
  {
    title: "Automotive components & supply chain",
    text: "Research on the automotive components landscape, supply chain and logistics, supporting Tier-1 and Tier-2 suppliers, OEMs and investors with structured market intelligence and forecasts.",
  },
];

export default function MarketReportSEO() {
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
              RACE Innovations publishes automotive market reports, forecasts
              and country-wise market intelligence for OEMs, Tier-1 and Tier-2
              suppliers, investors, consultants and strategy teams. The library
              spans EV intelligence, OEM benchmarking and reports on passenger
              vehicles, commercial vehicles, two- and three-wheelers, tractors
              and construction equipment, built on structured research and
              rolling forecasts.
            </p>

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <h3 style={h3Style}>Automotive market &amp; forecast reports</h3>
                <p style={pStyle}>
                  Market reports combine vehicle sales data, segment-level
                  analysis and sales forecast models to support planning and
                  investment decisions. Forecast reports give rolling
                  projections by country, segment and powertrain over short
                  and medium horizons.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3 style={h3Style}>Country automotive market reports</h3>
                <p style={pStyle}>
                  We publish country automotive market reports for India, South
                  Africa, Australia, Brazil, Germany, Japan, Sweden, Vietnam,
                  Chile, Pakistan, Colombia, Peru, Indonesia, Thailand,
                  Malaysia, Philippines, Mexico, USA, UK, and Canada, covering
                  vehicle sales, OEM activity and the forecast outlook.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3 style={h3Style}>EV market intelligence</h3>
                <p style={pStyle}>
                  EV market intelligence and electric vehicle reports cover
                  adoption trends, OEM EV portfolios, the shift to alternative
                  powertrains, charging infrastructure and EV market forecasts
                  across global automotive markets.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3 style={h3Style}>OEM benchmarking &amp; competitive analysis</h3>
                <p style={pStyle}>
                  OEM benchmarking reports compare automotive manufacturers by
                  segment, region, market share, product strategy and forecast
                  positioning, supporting investors, OEMs and Tier-1 suppliers
                  in strategic decisions.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3 style={h3Style}>Commercial &amp; passenger vehicle reports</h3>
                <p style={pStyle}>
                  Commercial vehicle and passenger vehicle market reports cover
                  trucks, buses, light commercial vehicles, SUVs, sedans and
                  hatchbacks, with segment-level forecasts and region-specific
                  insight.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h3 style={h3Style}>
                  Two-wheeler, three-wheeler, tractor &amp; construction
                  equipment reports
                </h3>
                <p style={pStyle}>
                  Specialised reports on two-wheeler, three-wheeler, tractor and
                  construction equipment markets, with segment outlooks and
                  country-level sales analysis.
                </p>
              </div>
            </div>

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
              Country reports bring together vehicle sales, OEM activity and the
              forecast outlook for each market, so teams can compare demand,
              competition and EV adoption across geographies. Use the Country
              filter in the report library above to see the titles available
              for each market.
            </p>

            <div className="row g-4">
              {COUNTRY_MARKETS.map((market) => (
                <div key={market.title} className="col-12 col-md-6 col-lg-4">
                  <h3 style={countryH3Style}>{market.title}</h3>
                  <p style={countryPStyle}>{market.text}</p>
                </div>
              ))}
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

            <FaqAccordion faqs={MARKET_REPORT_FAQS} />
          </div>
        </div>
      </div>

      {/* Built from the same array as the accordion above. */}
      <JsonLd data={faqJsonLd(MARKET_REPORT_FAQS)} />
    </section>
  );
}
