import Flash from "./Home.js";
import JsonLd from "../components/JsonLd";
import { getAllReports } from "../../lib/report-service";
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
} from "../../lib/seo";
import { buildMarketListing } from "./reportListData";

// Rebuild the page (and its report list) at most every 5 minutes.
export const revalidate = 300;

const PATH = "/market-report";
const TITLE = "Automotive Market Reports & Forecasts";
const DESCRIPTION =
  "Automotive market reports for OEMs, suppliers and investors: country-wise vehicle sales, EV and segment forecasts, and OEM benchmarking. Request a sample.";

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
});

async function loadReportListing() {
  try {
    // Same data the listing used to fetch from /api/admin/reports (no type
    // filter): every report; buildMarketListing keeps the active ones.
    const rows = await getAllReports();
    return buildMarketListing(rows);
  } catch (error) {
    // No database (e.g. at build time): render without the list; the
    // client listing then fetches it in the browser.
    console.error("Market report listing: could not load reports", error);
    return null;
  }
}

export default async function Page() {
  const listing = await loadReportListing();
  const listedReports = (listing?.reports || []).filter((r) => r.slug);

  const pageUrl = absoluteUrl(PATH);

  // One node for this page. Organization and WebSite come from the root
  // layout and are referenced by @id.
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
    ...(listedReports.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            name: "RACE Innovations report library",
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
            { name: "Market Reports", path: PATH },
          ]),
        ]}
      />
      <main>
        <Flash initialReportData={listing} />
      </main>
    </>
  );
}
