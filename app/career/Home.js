import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import CareerHome from "./CareerHome";
import Content from "./Content";
import Notify from "./Notify";
import Why from "../product/Why";




function CareersPage() {
  return (
    <>
      <Navbar />
      <div className="main-content">
    <CareerHome/>
    <Content/>
    <Notify/>
    <div className="mt-5">
      <Why />
      </div>
    </div>
      <Footer />
    </>
  );
}

export default CareersPage;
