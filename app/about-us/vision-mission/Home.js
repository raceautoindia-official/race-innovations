import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import React from 'react';
import Mission from "./Mission";
import Who from "./Who";
import Value from "./Value";
import Principles from "./Principles";
import Philosophy from "./Philosophy";
import Approch from "./Approch";
import Gem from "./Gem";
import Why from "@/app/product/Why";











function Vision() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
    <Mission/>
    <Who/>
    <Value/>
    <Principles/>
    <Philosophy/>
    <Approch/>
    <Gem/>
    <div className="mt-5">
      <Why />
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Vision;
