import Loan from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Apply for a personal, home, car, education or gold loan online: share your personal and employment details and existing loans, and upload your documents.";

export const metadata = pageMetadata({
  path: "/loan",
  title: "Individual Loan Application Form",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Financing Solutions", path: "/partner" },
    { name: "Loan Application", path: "/loan" },
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
