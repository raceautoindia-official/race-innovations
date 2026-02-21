import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import World from "./World";
import Model from "./Model";
import Why from "../product/Why";








function Connect() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
    <World/>
    <Model/>
    <div className="mt-5">
      <Why />
      </div>
    </div>
      <Footer/>
      
    </>
  );
}

export default Connect;
