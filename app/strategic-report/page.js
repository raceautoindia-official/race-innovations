import Strategies from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Strategic reports and business intelligence to help develop, refine and launch products in automotive components, farm machinery and industrial equipment.";

export const metadata = pageMetadata({
  path: "/strategic-report",
  title: "Strategic Reports & Business Intelligence",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Strategic Reports", path: "/strategic-report" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Strategies/>
  </main>
 )
}
