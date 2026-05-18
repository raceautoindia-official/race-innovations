import Home from "./Home/home.js";

export const metadata = {
  title:
    "RACE Innovations | Automotive Market Intelligence, ODC Logistics & Strategic Reports",
  description:
    "RACE Innovations delivers automotive market intelligence, ODC route survey, LBI reports, EV intelligence, OEM benchmarking, vehicle sales forecasts and custom research for OEMs, investors and strategy teams.",
  keywords: [
    "RACE Innovations",
    "automotive market intelligence",
    "automotive market reports",
    "automotive forecast reports",
    "EV intelligence",
    "OEM benchmarking",
    "vehicle sales forecast",
    "ODC route survey",
    "ODC route feasibility study",
    "LBI reports",
    "Location Based Intelligence",
    "logistics intelligence",
    "Chennai automotive consulting",
    "automotive research India",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://raceinnovations.in/",
  },
  openGraph: {
    title:
      "RACE Innovations | Automotive Market Intelligence & ODC Logistics",
    description:
      "Automotive market intelligence, ODC route survey, LBI reports, EV intelligence, OEM benchmarking and forecast insights from RACE Innovations.",
    url: "https://raceinnovations.in/",
    siteName: "RACE Innovations",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "RACE Innovations",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@raceinnovation",
    title: "RACE Innovations",
    description:
      "Automotive market intelligence, ODC route survey, LBI reports and forecast insights.",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RACE Innovations",
  url: "https://raceinnovations.in",
  logo: "https://raceinnovations.in/images/logo.jpg",
  sameAs: [
    "https://www.linkedin.com/company/race-innovations-private-limited/",
    "https://www.facebook.com/raceinnovationspvtltd/",
    "https://www.instagram.com/raceinnovations/",
    "https://x.com/raceinnovations",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-44-66108114",
      contactType: "customer service",
      email: "info@raceinnovations.in",
      areaServed: "IN",
      availableLanguage: ["en"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Olympia Platina, Guindy",
    addressLocality: "Chennai",
    postalCode: "600032",
    addressRegion: "TN",
    addressCountry: "IN",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <main>
        <Home />
      </main>
    </>
  );
}
