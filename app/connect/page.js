import Connect from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "RACE Connect helps global companies enter the Indian automotive market: market analysis, application engineering, JV due diligence and dedicated teams.";

export const metadata = pageMetadata({
  path: "/connect",
  title: "RACE Connect: India Market Entry Support",
  description,
});

const jsonLd = [
  serviceJsonLd({
    name: "RACE Connect: India Market Entry Support",
    serviceType: "Market entry consulting",
    description,
    path: "/connect",
  }),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Connect", path: "/connect" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Connect/>
  </main>
 )
}
