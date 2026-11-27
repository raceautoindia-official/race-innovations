import Loan from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Apply for a corporate or MSME loan: share promoter and company details, cash profit and loan amount, plus the ITR, GST and bank statement documents needed.";

export const metadata = pageMetadata({
  path: "/corporate",
  title: "Corporate & MSME Loan Application",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Financing Solutions", path: "/partner" },
    { name: "Corporate Loan Application", path: "/corporate" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Loan/>
  </main>
 )
}
