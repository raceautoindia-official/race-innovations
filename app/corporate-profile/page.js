import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';


import Video from "./Video";

function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="main-content">
   <Video/>
    </div>
      <Footer />
    </>
  );
}

export default ContactPage;
