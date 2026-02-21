import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import Contact from "./Contact";
import Office from "./Office";
import Form from "./Form";
import Why from "../product/Why";


function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="main-content">
    <Contact/>
    <Office/>
    <Form/>
    <div className="mt-5">
      <Why />
      </div>
    </div>
      <Footer />
    </>
  );
}

export default ContactPage;
