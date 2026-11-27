import Technic from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Technic, RACE's vehicle engineering service: application and interface engineering, bus and truck body packaging, chassis, prototypes and validation.";

export const metadata = pageMetadata({
  path: "/technic",
  title: "Technic: Vehicle Engineering Services",
  description,
});

const jsonLd = [
  serviceJsonLd({
    name: "Technic: Vehicle Engineering Services",
    serviceType: "Automotive application engineering",
    description,
    path: "/technic",
  }),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Technic", path: "/technic" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Technic/>
  </main>
 )
}
