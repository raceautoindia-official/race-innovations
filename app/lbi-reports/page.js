import LbiReportsClient from "./LbiReportsClient";
import JsonLd from "../components/JsonLd";
import { getAllLbiReports } from "../../lib/report-service";
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
} from "../../lib/seo";
import { buildLbiListing } from "./lbiListData";

// Rebuild the page (and its report list) at most every 5 minutes.
export const revalidate = 300;

const PATH = "/lbi-reports";
const TITLE = "LBI Reports: ODC Route Survey Studies";
const DESCRIPTION =
  "Location Based Intelligence reports: ODC route surveys, route feasibility, port connectivity, corridor and heavy cargo movement studies. Request a sample.";

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
});

async function loadLbiReports() {
  try {
    return buildLbiListing(await getAllLbiReports());
  } catch (error) {
    // No database (e.g. at build time): render without the list; the
    // client then fetches it in the browser.
    console.error("LBI listing: could not load reports", error);
    return null;
  }
}

export default async function LbiReportsPage() {
  const reports = await loadLbiReports();
  const listedReports = (reports || []).filter((r) => r.slug);
  const pageUrl = absoluteUrl(PATH);

  // Organization and WebSite come from the root layout (referenced by @id).
  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    name: TITLE,
    description: DESCRIPTION,
    url: pageUrl,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: [
      "Location Based Intelligence",
      "ODC route survey",
      "Route feasibility",
      "Port connectivity",
      "Corridor feasibility",
      "Heavy cargo movement",
    ],
    ...(listedReports.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            name: "LBI reports",
            numberOfItems: listedReports.length,
            itemListElement: listedReports.map((report, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/reports/${encodeURIComponent(report.slug)}`),
              name: report.title,
            })),
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "LBI Reports", path: PATH },
          ]),
        ]}
      />
      <LbiReportsClient initialReports={reports} />
    </>
  );
}
