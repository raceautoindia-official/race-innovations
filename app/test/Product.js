"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Mobile section cards
const sections = [
  {
    src: "/images/tech.png",
    title: "Technic",
    desc: "RACE engineering team is fully equipped to support the clients with various applications and interface...",
    link: "/technic",
  },
  {
    src: "/images/intell.png",
    title: "Intellect",
    desc: "Expert solutions from technical minds across industries...",
    link: "/intellect",
  },
  {
    src: "/images/legal.png",
    title: "Legal",
    desc: "Trusted legal guidance with robust compliance strategies...",
    link: "/accounting-and-legal",
  },
  {
    src: "/images/acc.png",
    title: "Accounting",
    desc: "Efficient financial solutions for modern enterprises...",
    link: "/accounting-and-legal",
  },
  {
    src: "/images/lbi.png",
    title: "LBI",
    desc: "Innovative business intelligence tools tailored for growth...",
    link: "/intellect/lbi",
  },
  {
    src: "/images/conn.png",
    title: "Connect",
    desc: "Bringing networks and systems into seamless operation...",
    link: "/connect",
  },
];

function Product() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isInProductSection, setIsInProductSection] = useState(false);
  const productRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const rect = productRef.current?.getBoundingClientRect();
      if (rect) {
        setIsInProductSection(rect.top <= window.innerHeight && rect.bottom >= 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {/* Sticky Navigation */}
      {isInProductSection && (
        <div
          className="sticky-sidebar"
          style={{
            width: "200px",
            position: "fixed",
            top: "100px",
            right: "20px",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <ul style={{ fontSize: "18px", listStyle: "none", padding: 0 }}>
            <li onClick={() => handleScroll("technic")}>Technic</li>
            <li onClick={() => handleScroll("intellect")}>Intellect</li>
            <li onClick={() => handleScroll("legal")}>Legal</li>
            <li onClick={() => handleScroll("accounting")}>Accounting</li>
            <li onClick={() => handleScroll("lbi")}>LBI</li>
            <li onClick={() => handleScroll("connect")}>Connect</li>
          </ul>
        </div>
      )}

      {/* Heading */}
      <h1 className="text-center">
        <span style={{ color: "black" }}>Our </span>
        <span style={{ color: "#293BB1" }}>Products</span>
      </h1>

      {/* Desktop View */}
      <div className="container-fluid desktop-view bg-black" ref={productRef}>
        <div className="container py-5" id="technic">
          <h2 style={{ color: "#293BB1" }}>Technic</h2>
          <p className="text-white">
            RACE engineering team is fully equipped to support the clients with various applications and
            interface engineering enabling the automotive market...
          </p>
        </div>

        <div className="container py-5" id="intellect">
          <h2 style={{ color: "#293BB1" }}>Intellect</h2>
          <p className="text-white">
            “Intellect” is one of the core solution offerings of RACE. Our strong network of market research and consulting team continuously tracks the Indian, global automotive market...
          </p>
        </div>

        <div className="container py-5" id="legal">
          <h2 style={{ color: "#293BB1" }}>Legal</h2>
          <p className="text-white">
            Most of the businesses face many complex legal and commercial pressures when operating internationally that require the guidance of experienced and insightful advisors...
          </p>
        </div>

        <div className="container py-5" id="accounting">
          <h2 style={{ color: "#293BB1" }}>Accounting</h2>
          <p className="text-white">
            Global business comes with complex legal and commercial challenges. Our expert law firm members provide seamless, strategic solutions...
          </p>
        </div>

        <div className="container py-5" id="lbi">
          <h2 style={{ color: "#293BB1" }}>LBI</h2>
          <p className="text-white">
            Location Based Intelligence emphasizes hindrance-free movement of goods by conducting route surveys by a team of experts. Reports with recommendations help users move freely...
          </p>
        </div>

        <div className="container py-5" id="connect">
          <h2 style={{ color: "#293BB1" }}>Connect</h2>
          <p className="text-white">
            RACE Connect is the cost-effective strategy to experience an emerging market and the most efficient method to build relationships in new markets...
          </p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="container-fluid mobile-view">
        <div className="row">
          {sections.map((section, index) => (
            <div key={index} className="col-12 mt-3 d-flex justify-content-center p-2">
              <div className="position-relative">
                <Image
                  src={section.src}
                  width={600}
                  height={300}
                  alt={section.title}
                  className="img-fluid cursor-pointer"
                  onClick={() => setSelectedIndex(index === selectedIndex ? null : index)}
                />
                {selectedIndex === index && (
                  <div className="opening-overlay text-white p-3">
                    <h5>{section.title}</h5>
                    <p>{section.desc}</p>
                    <Link href={section.link} className="btn btn-light mt-2">
                      Read More
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }

        .opening-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          z-index: 10;
          animation: fadeIn 0.3s ease-in-out forwards;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .btn-light {
          color: #293BB1;
          background-color: #fff;
          border: 1px solid #293BB1;
        }

        @media (max-width: 570px) {
          .desktop-view {
            display: none;
          }
        }

        @media (min-width: 571px) {
          .mobile-view {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default Product;
