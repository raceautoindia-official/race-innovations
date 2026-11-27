import Flash from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Flash reports from RACE Innovations: concise, data-driven updates on market trends, competitive shifts and launches, monthly, quarterly or yearly.";

export const metadata = pageMetadata({
  path: "/flash-reports",
  title: "Flash Reports: Quick Market Updates",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Flash Reports", path: "/flash-reports" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Flash/>
  </main>
 )
}
