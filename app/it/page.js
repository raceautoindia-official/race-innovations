import Itpage from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "IT services from RACE Innovations: custom SEO-ready websites, TTL and mass communication, CRM and app development, digital marketing, data mining and BI.";

export const metadata = pageMetadata({
  path: "/it",
  title: "IT Services: Websites, CRM & Apps",
  description,
});

const jsonLd = [
  serviceJsonLd({
    name: "IT Services",
    serviceType: "Website, CRM and app development",
    description,
    path: "/it",
  }),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "IT Services", path: "/it" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Itpage/>
  </main>
 )
}
