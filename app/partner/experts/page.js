import Experts from "./Home.js";
import JsonLd from "../../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../../lib/seo";

const description =
  "Request a call from RACE's loan experts: share your name, city, mobile number and email, and our team will contact you about the financing you need.";

export const metadata = pageMetadata({
  path: "/partner/experts",
  title: "Talk to a Loan Expert: Request a Call",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Financing Solutions", path: "/partner" },
    { name: "Loan Experts", path: "/partner/experts" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Experts/>
  </main>
 )
}
