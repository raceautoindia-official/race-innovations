import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import First from "./First";
import Int from "./Int";
import Offerings from "./Offerings";
import Why from "../product/Why";





function Intellect() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
     <First/>
     <Int/>
     <Offerings/>
     <div className="mt-5">
      <Why />
      </div>
     </div>
      <Footer/>
      
    </>
  );
}

export default Intellect;
