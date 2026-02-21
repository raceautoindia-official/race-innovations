import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import React from "react";
import Banner from "./Banner";
import Video from "./Video";
import Features from "./Features";
import Why from "@/app/product/Why";

function Lbi() {
  return (
    <>
      <Navbar />
      <div className="main-content">
      <Banner />
      <Video />
      <Features />
      <div className="mt-5">
      <Why />
      </div>
      </div>
      <Footer />
    </>
  );
}

export default Lbi;
