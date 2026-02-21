"use client";
import React, { useState, useEffect, useRef } from "react";
import Slider from "./slider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Industry from "./Indust";
import Partner from "./Partner";
import Product from "./Product";
import Certifications from "./Certifications";
import Cisme from "./Cisme";
import Testimonial_v2 from "./Testimonial-v2";
import Client from "./Client";
import Connected from "./Connected";


const Home = () => {
  const [isInProductSection, setIsInProductSection] = useState(false);
  const productRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const productSection = productRef.current;
      if (!productSection) return;

      const rect = productSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        setIsInProductSection(true);
      } else {
        setIsInProductSection(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-content ">
      <Slider />
      <Industry />
      <Partner />
      <div
        ref={productRef}
        style={{
          minHeight: "600px",
          padding: "40px 0",
          position: "relative",
           cursor:"pointer"
           
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            position: "relative",
            cursor:"pointer"
          }}
        >
          <div style={{ flex: 1 }}>
            <Product />
          </div>        
        </div>
      </div>
      <Certifications />
      <Cisme />
      <Testimonial_v2 />
      <Client />
      <Connected />
      </div>
      <Footer />
    </>
  );
};

export default Home;
