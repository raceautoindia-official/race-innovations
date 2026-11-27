import Lbi from "./Home.js";
import JsonLd from "../../components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "../../../lib/seo";

const description =
  "ODC route surveys for over-dimensional cargo: shortest feasible route, turning-circle simulation, bridge and gradient checks, and civil cost estimates.";

export const metadata = pageMetadata({
  path: "/intellect/lbi",
  title: "ODC Route Survey & LBI Services, India",
  description,
});

const jsonLd = [
  serviceJsonLd({
    name: "ODC Route Survey (Location Based Intelligence)",
    serviceType: "Route survey for over-dimensional cargo",
    description,
    path: "/intellect/lbi",
  }),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Intellect", path: "/intellect" },
    { name: "LBI Route Survey", path: "/intellect/lbi" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Lbi/>
  </main>
 )
}
