import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';


import Video from "./Video";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";

const description =
  "Read the RACE Innovations corporate profile online in a page-flip viewer or download it as a PDF, for an overview of the company and what it offers.";

export const metadata = pageMetadata({
  path: "/corporate-profile",
  title: "Corporate Profile: Flipbook & PDF",
  description,
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Corporate Profile", path: "/corporate-profile" },
  ]),
];

function ContactPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <div className="main-content">
   <Video/>
    </div>
      <Footer />
    </>
  );
}

export default ContactPage;
