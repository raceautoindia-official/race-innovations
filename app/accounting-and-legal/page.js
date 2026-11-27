import AccountPage from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Accounting, tax and legal support through RACE member firms: business valuation, feasibility studies, M&A, corporate and international tax, and trade law.";

export const metadata = pageMetadata({
  path: "/accounting-and-legal",
  title: "Accounting, Tax & Legal Advisory",
  description,
});

const jsonLd = [
  serviceJsonLd({
    name: "Accounting, Tax and Legal Advisory",
    serviceType: "Accounting, tax and legal advisory",
    description,
    path: "/accounting-and-legal",
  }),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Accounting & Legal", path: "/accounting-and-legal" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <AccountPage/>
  </main>
 )
}
