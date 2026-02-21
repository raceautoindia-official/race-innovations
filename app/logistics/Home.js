  import Navbar from "../components/Navbar";
  import Footer from "../components/Footer";
  import React from 'react';
  import It from "./It";
  import Ttl from "./Ttl";
  import Crm from "./Road";
  import Digital from "./Digital";
  import Mining from "./Mining";
import Why from "../product/Why";






  function Itpage() {
    return (
      <>
        <Navbar />
        <div className="main-content">
        <It />
        <div id="ttl">
          <Ttl />
        </div>
        <div id="crm">
          <Crm />
        </div>
        <div id="digital">
          <Digital />
        </div>
        <div id="mining">
          <Mining />
        </div>
        <div className="mt-5">
      <Why />
      </div>
        </div>
        <Footer />
      </>
    );
  }
  

  export default Itpage;
