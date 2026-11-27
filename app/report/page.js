import Report from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Custom market research and industry studies: forecasting, competitive benchmarking, concept testing, demand and supply chain research across sectors.";

export const metadata = pageMetadata({
  path: "/report",
  title: "Market Research & Industry Studies",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Market Research", path: "/report" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Report/>
  </main>
 )
}
