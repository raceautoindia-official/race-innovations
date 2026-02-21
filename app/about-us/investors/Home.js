import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import React from 'react';
import Investors from "./Investor";
import Corporate from "./Corporate";
import Why from "@/app/product/Why";

function InvestorsPage() {
  return (
    <>
      <Navbar />
      <div className="main-content">
      <Investors />
      <Corporate/>
      <div className="mt-5">
      <Why />
      </div>
      </div>
      <Footer />
    </>
  );
}

export default InvestorsPage;
