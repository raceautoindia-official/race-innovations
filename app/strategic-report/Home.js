import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import Landing from "./Landing";
import Center from "./Center";
import Cover from "./Cover";
import Final from "./Final";
import Why from "../product/Why";





function Strategies() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
    <Landing/>
    <Center/>
    <Cover/>
    <Final/>
    <div className="mt-5">
      <Why />
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Strategies;
