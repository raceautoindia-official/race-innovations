import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import Image from "./Image";

import Formats from "./Formats";
import Last from "./Last";
import MarketReportSEO from "./MarketReportSEO";
import Why from "../product/Why";

// initialReportData: report list loaded on the server (see page.js), passed
// to the client listing so the cards are in the first HTML.
function Flash({ initialReportData = null }) {
  return (
    <>
    <Navbar/>
    <div className="main-content">
    <Image initialData={initialReportData}/>

    <Formats/>
    <Last/>
    <MarketReportSEO/>
    <div className="mt-5">
      <Why />
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Flash;
