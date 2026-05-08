import LbiReportsClient from "./LbiReportsClient";

export const metadata = {
  title:
    "LBI Reports | Location Based Intelligence, ODC Route Survey & Logistics Reports",
  description:
    "Explore RACE Innovations Location Based Intelligence (LBI) reports including Over Dimensional Cargo (ODC) route survey, port connectivity, corridor feasibility, heavy cargo movement, and logistics intelligence reports.",
  keywords: [
    // Core LBI / brand
    "LBI reports",
    "Location Based Intelligence",
    "RACE Innovations LBI",
    "LBI logistics reports",

    // Over Dimensional Cargo (ODC)
    "Over dimensional cargo route feasibility",
    "Over Dimensional Cargo",
    "Over Dimensional Cargo logistics",
    "Over Dimensional Cargo transport",
    "Over Dimensional Cargo transportation",
    "Over Dimensional Cargo movement",
    "Over Dimensional Cargo route survey",
    "Over Dimensional Cargo feasibility study",
    "Over Dimensional Cargo route planning",
    "Over Dimensional Cargo route mapping",
    "Over Dimensional Cargo India",
    "Over Dimensional Cargo transport India",
    "Over Dimensional Cargo logistics India",
    "Over Dimensional Cargo handling",
    "Over Dimensional Cargo permit",
    "Over Dimensional Cargo clearance",
    "Over Dimensional Cargo escort",
    "Over Dimensional Cargo highway movement",
    "ODC logistics",
    "ODC cargo transportation",
    "ODC transport in India",
    "ODC transportation in India",
    "ODC route survey",
    "ODC route feasibility study",
    "ODC feasibility study",
    "ODC cargo route survey",
    "ODC cargo movement",
    "ODC cargo logistics",
    "ODC route planning",
    "ODC logistics India",

    // Heavy / project / oversized cargo
    "Heavy cargo transportation",
    "Heavy haulage logistics",
    "Project cargo logistics",
    "Oversized cargo transportation",
    "Oversize load transport",
    "Heavy equipment transportation",
    "Heavy lift cargo logistics",

    // Chennai Port
    "Chennai Port heavy cargo route",
    "Chennai Port project cargo logistics",
    "Chennai Port over dimensional cargo",
    "Chennai Port heavy equipment transport",
    "Chennai Port cargo evacuation route",
    "Port connectivity Chennai",
    "Chennai Port Road connectivity",

    // Route intelligence / GIS / GPS
    "Route intelligence reports",
    "Logistics route intelligence",
    "GIS route survey",
    "GPS route survey",
    "Digital route survey",
    "Route mapping for logistics",
    "Cargo route mapping",
    "Heavy cargo route mapping",
    "ODC route mapping",
    "ODC GPS route survey",
    "ODC GIS route analysis",
    "Geo intelligence for logistics",
    "Location intelligence for cargo movement",
    "Smart logistics route planning",
    "Transport corridor intelligence",
    "Road corridor analysis",
    "Infrastructure route intelligence",

    // Route feasibility / survey reports
    "Route feasibility study report",
    "Route feasibility report",
    "Route survey report",
    "Route assessment report",
    "Route analysis report",
    "Route planning report",
    "Route inspection report",
    "Route clearance report",
    "Route mapping report",
    "Route risk assessment report",
    "Road route feasibility study",
    "Transport route feasibility study",
    "Cargo route feasibility study",
    "Heavy cargo route feasibility study",

    // Over Weight / Overweight Cargo
    "Over Weight Cargo",
    "Overweight Cargo",
    "Over Weight Cargo logistics",
    "Overweight Cargo logistics",
    "Over Weight Cargo transport",
    "Overweight Cargo transport",
    "Over Weight Cargo transportation",
    "Overweight Cargo transportation",
    "Over Weight Cargo route survey",
    "Overweight Cargo route survey",
    "Over Weight Cargo feasibility study",
    "Overweight Cargo feasibility study",
    "Over Weight Cargo movement",
    "Overweight Cargo movement",
    "Over Weight Cargo India",
    "Overweight Cargo India",
    "Over Weight Cargo heavy haulage",
    "Overweight Cargo heavy haulage",
    "Over Weight Cargo bridge assessment",
    "Overweight Cargo axle load study",
    "Over Weight Cargo load distribution",
    "Overweight Cargo route clearance",

    // Bridge analysis / assessment
    "Bridge analysis",
    "Bridge assessment",
    "Bridge feasibility analysis",
    "Bridge condition assessment",
    "Bridge inspection report",
    "Bridge survey report",
    "Bridge load analysis",
    "Bridge load assessment",
    "Bridge structural analysis",
    "Bridge strength analysis",
    "Bridge capacity analysis",
    "Bridge clearance analysis",
    "Bridge height clearance",
    "Bridge width clearance",
    "Bridge load capacity",
    "Bridge load-bearing capacity",
    "Bridge safety assessment",
    "Bridge risk assessment",
    "Bridge stability analysis",
    "Bridge route assessment",
    "Bridge crossing feasibility",
    "Bridge crossing analysis",
    "Bridge movement feasibility",
    "Bridge movement assessment",
    "Bridge engineering assessment",
    "Bridge infrastructure assessment",
    "Bridge structural feasibility",
    "Bridge transport feasibility",
    "Bridge route feasibility study",
    "Bridge clearance survey",
    "Bridge clearance report",
    "Bridge obstruction analysis",
    "Bridge obstacle assessment",
    "Bridge approach road analysis",
    "Bridge turning radius analysis",
    "Bridge deck assessment",
    "Bridge span assessment",
    "Bridge girder clearance",
    "Bridge axle load assessment",
    "Bridge load distribution analysis",
    "Bridge heavy vehicle assessment",
    "Bridge heavy cargo assessment",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://raceinnovations.in/lbi-reports",
  },
  openGraph: {
    title:
      "LBI Reports | Location Based Intelligence & ODC Route Survey",
    description:
      "Location Based Intelligence (LBI) reports — ODC route survey, port connectivity, corridor feasibility and logistics intelligence from RACE Innovations.",
    url: "https://raceinnovations.in/lbi-reports",
    siteName: "RACE Innovations",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "RACE Innovations LBI Reports",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@raceinnovation",
    title: "LBI Reports | Location Based Intelligence",
    description:
      "ODC route survey, port connectivity, corridor feasibility and logistics intelligence reports from RACE Innovations.",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "LBI Reports",
  url: "https://raceinnovations.in/lbi-reports",
  description:
    "Location Based Intelligence (LBI) reports — ODC route survey, port connectivity, corridor feasibility, heavy cargo movement and logistics intelligence from RACE Innovations.",
  publisher: {
    "@type": "Organization",
    name: "RACE Innovations",
    url: "https://raceinnovations.in",
  },
  about: [
    "Location Based Intelligence",
    "ODC route survey",
    "Logistics intelligence",
    "Corridor feasibility",
    "Port connectivity",
    "Heavy cargo movement",
  ],
};

export default function LbiReportsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <LbiReportsClient />
    </>
  );
}
