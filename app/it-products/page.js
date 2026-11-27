import ItProducts from "./ItProducts";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Software products from RACE Innovations: video calling, project management, mobile apps, bale management, lead generation, forecasting and e-commerce.";

export const metadata = pageMetadata({
  path: "/it-products",
  title: "IT Products: Business Software & Apps",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "IT Services", path: "/it" },
    { name: "IT Products", path: "/it-products" },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ItProducts />
    </>
  );
}
