import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import Image from "./Image";

import Formats from "./Formats";
import Last from "./Last";
import MarketReportSEO from "./MarketReportSEO";
import Why from "../product/Why";






function Flash() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
    <Image/>

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
