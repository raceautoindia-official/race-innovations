import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';
import LoanForm from "./Loan";




function Loan() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
     <LoanForm/>
     </div>
      <Footer/>
      
    </>
  );
}

export default Loan;
