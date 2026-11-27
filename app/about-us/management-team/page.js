import About from "./Home.js";
import JsonLd from "../../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../../lib/seo";

const description =
  "Meet the management of RACE Innovations and read Managing Director M.P. Rajesh Khanna's message on India's automotive, construction and mining sectors.";

export const metadata = pageMetadata({
  path: "/about-us/management-team",
  title: "Management Team & Message from the MD",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Management Team", path: "/about-us/management-team" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <About/>
  </main>
 )
}
