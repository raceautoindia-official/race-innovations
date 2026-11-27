import Product from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Product research reports for automotive, farm machinery and construction equipment OEMs: concept and prototype evaluation, benchmarking, customer feedback.";

export const metadata = pageMetadata({
  path: "/product",
  title: "Product Research Reports for OEMs",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Product Report", path: "/product" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Product/>
  </main>
 )
}
