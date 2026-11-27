import Intellect from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Intellect, RACE's automotive market research and consulting: Indian and global market tracking, vehicle and fleet data, EV trends, forecasts, benchmarking.";

export const metadata = pageMetadata({
  path: "/intellect",
  title: "Intellect: Automotive Market Research",
  description,
});

const jsonLd = [
  serviceJsonLd({
    name: "Intellect: Automotive Market Research and Consulting",
    serviceType: "Automotive market research",
    description,
    path: "/intellect",
  }),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Intellect", path: "/intellect" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Intellect/>
  </main>
 )
}
