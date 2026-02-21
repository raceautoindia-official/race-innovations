import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import React from 'react';
import Mission from './Mission';
import Manage from './Manage';
import Message from "./Message";
import Why from "@/app/product/Why";


function About() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
      <Mission />
      <Manage/>
      <div className="mt-5">
      <Why />
      </div>
      </div>
      {/* <Message/> */}
      <Footer/>
      
    </>
  );
}

export default About;
