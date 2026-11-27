import PartnerShip from "./Home..js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "RACE financing solutions: personal, home, car, education and gold loans for individuals, plus MSME loans, overdraft, bank guarantees and bill discounting.";

export const metadata = pageMetadata({
  path: "/partner",
  title: "Financing: Personal & Business Loans",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Financing Solutions", path: "/partner" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <PartnerShip/>
  </main>
 )
}
