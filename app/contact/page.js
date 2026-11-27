import Contact from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, localBusinessJsonLd, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Contact RACE Innovations at Olympia Platina, Guindy, Chennai 600032. Email info@raceinnovations.in, call or WhatsApp us, or send an enquiry online.";

export const metadata = pageMetadata({
  path: "/contact",
  title: "Contact Us: Chennai Office & Enquiries",
  description,
});

const jsonLd = [
  localBusinessJsonLd(),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Contact/>
  </main>
 )
}
