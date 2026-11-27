import Vision from "./Home.js";
import JsonLd from "../../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../../lib/seo";

const description =
  "RACE Innovations, incorporated in 2011, is a commercial vehicle consulting firm that pairs market research with engineering. Read our vision and values.";

export const metadata = pageMetadata({
  path: "/about-us/vision-mission",
  title: "About Us: Vision, Mission & Values",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Vision & Mission", path: "/about-us/vision-mission" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <Vision/>
  </main>
 )
}
