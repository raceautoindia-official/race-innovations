import CareersPage from "./Home.js";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Careers at RACE Innovations, Chennai: work with our automotive market research, consulting and engineering team. Sign up to receive occasional updates.";

export const metadata = pageMetadata({
  path: "/career",
  title: "Careers: Work With Us in Chennai",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/career" },
  ]),
];

export default function Page() {
 return(
  <main>
   <JsonLd data={jsonLd} />
   <CareersPage/>
  </main>
 )
}
