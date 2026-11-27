import Investors from "./Home.js";
import JsonLd from "../../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../../lib/seo";

const description =
  "Investor and strategic partner enquiries for RACE Innovations: our automotive, logistics and engineering work, why invest, and how to reach our MD.";

export const metadata = pageMetadata({
  path: "/about-us/investors",
  title: "Investor Relations & Strategic Partners",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Investors", path: "/about-us/investors" },
  ]),
];

export default function Page() {
 return(
    
  <main>
   <JsonLd data={jsonLd} />
   <Investors/>
  </main>
 )
}
