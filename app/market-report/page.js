import Flash from "./Home.js";

export const metadata = {
  title:
    "Automotive Market Reports | Vehicle Sales Forecast, EV Intelligence & OEM Analysis",
  description:
    "Explore automotive market reports, vehicle sales forecast reports, EV intelligence, OEM benchmarking, country-wise automotive industry reports, commercial vehicle reports, passenger vehicle reports, two-wheeler reports, three-wheeler reports, tractor reports and construction equipment market insights from RACE Innovations.",
  keywords: [
    // Core report topics
    "automotive market reports",
    "automotive forecast reports",
    "vehicle sales forecast",
    "automotive market intelligence",
    "automotive industry reports",
    "automotive research reports",
    "automotive sales reports",
    "automotive industry forecast",
    "vehicle market analysis",
    "vehicle market forecast",
    "automotive flash reports",
    "automotive country reports",
    "country automotive market reports",
    "global automotive market reports",

    // EV / powertrain
    "EV market intelligence",
    "EV market reports",
    "electric vehicle market reports",
    "EV adoption forecast",
    "alternative powertrain reports",

    // OEM / benchmarking
    "OEM market analysis",
    "OEM benchmarking reports",
    "automotive OEM benchmarking",
    "OEM strategy reports",

    // Segment-level reports
    "commercial vehicle market reports",
    "passenger vehicle market reports",
    "two wheeler market reports",
    "three wheeler market reports",
    "tractor market reports",
    "construction equipment market reports",
    "aftermarket reports",
    "truck market reports",
    "bus market reports",

    // Country-specific
    "India automotive market report",
    "South Africa automotive market reports",
    "Brazil automotive market reports",
    "Germany automotive market reports",
    "Japan automotive market reports",
    "USA automotive market reports",
    "UK automotive market reports",
    "Australia automotive market reports",
    "Vietnam automotive market reports",
    "Indonesia automotive market reports",
    "Thailand automotive market reports",
    "Malaysia automotive market reports",
    "Mexico automotive market reports",

    // Branded
    "RACE Innovations market reports",
    "RACE Innovations automotive research",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://raceinnovations.in/market-report",
  },
  openGraph: {
    title:
      "Automotive Market Reports | Forecast Reports & Market Intelligence",
    description:
      "Country-wise, segment-wise and OEM-level automotive market reports, vehicle sales forecast insights, EV intelligence and industry research from RACE Innovations.",
    url: "https://raceinnovations.in/market-report",
    siteName: "RACE Innovations",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "RACE Innovations Automotive Market Reports",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@raceinnovation",
    title:
      "Automotive Market Reports | Forecast Reports & Market Intelligence",
    description:
      "Explore automotive market reports, EV intelligence, OEM benchmarking and forecast insights from RACE Innovations.",
    images: ["https://raceinnovation.com/assets/og-image.jpg"],
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Automotive Market Reports",
  url: "https://raceinnovations.in/market-report",
  description:
    "Automotive market reports, forecast reports, EV intelligence, OEM benchmarking and country-wise vehicle market insights from RACE Innovations.",
  inLanguage: "en",
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
    "Vehicle sales forecast",
    "EV market intelligence",
    "OEM benchmarking",
    "Commercial vehicle reports",
    "Passenger vehicle reports",
    "Two-wheeler reports",
    "Three-wheeler reports",
    "Tractor reports",
    "Construction equipment reports",
    "Aftermarket reports",
    "Country automotive market reports",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://raceinnovations.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Market Reports",
      item: "https://raceinnovations.in/market-report",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are automotive market reports?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Automotive market reports provide insights into vehicle sales, market trends, OEM performance, forecast outlook, EV adoption, powertrain shifts and segment-wise automotive industry developments.",
      },
    },
    {
      "@type": "Question",
      name: "Does RACE Innovations provide country-wise automotive market reports?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, RACE Innovations provides country-wise automotive market reports covering key global markets, vehicle segments, OEM performance and forecast insights for India, USA, Germany, Japan, Brazil, South Africa, Vietnam, Indonesia, Thailand, Malaysia, Mexico and more.",
      },
    },
    {
      "@type": "Question",
      name: "Does RACE Innovations provide automotive forecast reports?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, RACE Innovations provides automotive forecast reports with forward-looking market insights, vehicle sales forecasts, segment outlooks and OEM-level trend analysis.",
      },
    },
    {
      "@type": "Question",
      name: "Does RACE Innovations cover EV market intelligence?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. RACE EV intelligence reports cover electric vehicle adoption, OEM EV portfolios, alternative powertrain shifts, charging infrastructure and country-wise EV market forecast.",
      },
    },
    {
      "@type": "Question",
      name: "Are commercial vehicle and passenger vehicle reports available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Commercial vehicle market reports cover trucks, buses and LCVs while passenger vehicle market reports cover SUVs, sedans and hatchbacks with segment-level forecasts and OEM activity.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main>
        <Flash />
      </main>
    </>
  );
}
