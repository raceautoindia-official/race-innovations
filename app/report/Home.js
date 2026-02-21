import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import ReportHome from "./ReportHome";
import Research from "./Research";
import Industries from "./Industries";
import Choose from "./Choose";
import Why from "../product/Why";












function Report() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
    <ReportHome/>
    <Research/>
    <Industries/>
    <Choose/>
    <div className="mt-5">
      <Why />
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Report;
