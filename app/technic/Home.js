import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import Ban from "./Ban";
import Ref from "./Ref";
import Offerings from "./Offerings";
import Deliverable from "./Deliverable";
import Why from "../product/Why";










function Technic() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
    <Ban/>
    <Ref/>
    <Offerings/>
    <Deliverable/>
    <div className="mt-5">
      <Why />
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Technic;
