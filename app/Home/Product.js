"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const sections = [
  {
    src: "/images/tech.png",
    title: "Technic",
    desc: "RACE engineering team is fully equipped to support the clients with various applications and interface...",
    link: "/technic"
  },
  {
    src: "/images/intell.png",
    title: "Intellect",
    desc: "Expert solutions from technical minds across industries...",
    link: "/intellect"
  },
  {
    src: "/images/conn.png",
    title: "Connect",
    desc: "Bringing networks and systems into seamless operation...",
    link: "/connect"
  },
  {
    src: "/images/lbi.png",
    title: "LBI",
    desc: "Innovative business intelligence tools tailored for growth...",
    link: "/intellect/lbi"
  },
  {
    src: "/images/legal.png",
    title: "Legal",
    desc: "Trusted legal guidance with robust compliance strategies...",
    link: "/accounting-and-legal"
  },
  {
    src: "/images/acc.png",
    title: "Accounting",
    desc: "Efficient financial solutions for modern enterprises...",
    link: "/accounting-and-legal"
  }
];

function Product() {
  const [selectedIndex, setSelectedIndex] = useState(null);
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

  const handleImageClick = (index) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: "center" });
    }
  };

  return (
    <>
      {isInProductSection && (
        <div
          className="sticky-sidebar"
          style={{
            width: "200px",
            position: "fixed",
            top: "100px",
            right: "20px",
            padding: "20px",
            borderRadius: "8px",

            zIndex: 1000,
          }}
        >
          <ul
            style={{
              fontSize: "18px",
              margin: 0,
              paddingLeft: "20px",
              listStyle: "none",
              color: "white",
            }}
          >
            <li onClick={() => handleScroll('technic')} className="nav-item text-hover-red">Technic</li>
            <li onClick={() => handleScroll('intellect')} className="nav-item text-hover-red">Intellect</li>
            <li onClick={() => handleScroll('legal')} className="nav-item text-hover-red">Legal</li>
            <li onClick={() => handleScroll('accounting')} className="nav-item text-hover-red">Accounting</li>
            <li onClick={() => handleScroll('lbi')} className="nav-item text-hover-red">LBI</li>
            <li onClick={() => handleScroll('connect')} className="nav-item text-hover-red">Connect</li>



          </ul>
        </div>
      )}
      <motion.h1
        className="d-flex justify-content-center text-center "
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <span className="me-2" style={{ color: "black" }}>Our</span>
        <span style={{ color: "#293BB1" }}>Products</span>
      </motion.h1>
      {/* desktop view */}

      <div className="container-fluid desktop-view " style={{ background: "black" }}>
        <div className="container-fluid p-0 position-relative" ref={productRef}>
          <div
            className="position-relative w-100"
            style={{
              backgroundImage: "url('/images/technic-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              padding: "30px 0",
              minHeight: "90vh",
            }}
          >
            <div className="container position-relative z-2" >
              <div className="row">
                <div className="col-lg-6" id="technic">
                  <motion.h1
                    style={{ color: '#293BB1' }}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-white"
                  >
                    Technic
                  </motion.h1>
                  <p className="text-white" style={{textAlign: "justify"}} >
                    RACE engineering team is fully equipped to support the clients with various<br />
                    applications and interface engineering enabling the automotive market...
                    <Link href="/technic" style={{ textDecoration: 'none' }}>
                      <span style={{ color: '#0791b0', fontWeight: '500', cursor: 'pointer' }}>
                        Read More
                      </span>
                    </Link>
                  </p>

                  <motion.button
                    className="btn"
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                    viewport={{ once: true }}
                    style={{
                      width: '140.79px',
                      height: '45.72px',
                      borderRadius: '19.88px',
                      borderWidth: '0.99px',
                      background: 'white',
                      fontSize: "20px",
                      color: 'black',
                    }}
                  >
                    <Link href="/technic" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Learn More
                    </Link>
                  </motion.button>

                </div>

              </div>

            </div>
            <div
              className="position-absolute"
              style={{
                top: '145%',
                left: '60px',
                transform: 'translateY(-50%)',
                zIndex: 1,
                height: "100vh"
              }}
            >
              <Image
                src="/images/hand.png"
                width={600}
                height={300}
                alt="Hand Image"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="row bg-black  m-5" style={{ minHeight: '55vh' }}>

            <div className="col-lg-6">
            </div>
            <div className="col-lg-6" id="intellect">
              <motion.h1
                style={{ color: '#293BB1' }}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                viewport={{ once: true }}
                className="text-white ms-3"
              >
                Intellect
              </motion.h1>
              <p className="text-white ms-3 mt-4 w-75" style={{textAlign: "justify"}}>
                “Intellect” is one of the core solution offerings of RACE. Our strong network of market
                research and consulting team continuously tracks the Indian, global automotive market to
                provide clients with rich, extensive insights on market entry strategies, product launch,
                competitive strategy, mega trends, vehicle/component OEM strategies, regulatory/statutory
                tracking...
                <Link href="/intellect" style={{ textDecoration: 'none' }}>
                  <span style={{ color: '#0791b0', fontWeight: '500', cursor: 'pointer' }}>
                    Read More
                  </span>
                </Link>
              </p>
              <motion.button
                className="btn ms-3"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                viewport={{ once: true }}
                style={{
                  width: '140.79px',
                  height: '45.72px',
                  borderRadius: '19.88px',
                  borderWidth: '0.99px',
                  background: 'white',
                  fontSize: "20px",
                  color: 'black',
                }}
              >
                <Link href="/intellect" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Learn More
                </Link>
              </motion.button>
            </div>
          </div>
          <div className="row" style={{ minHeight: '60vh' }}>
            <div className="col-lg-3 ms-5" id="legal">
              <motion.h1
                style={{ color: '#293BB1' }}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                viewport={{ once: true }}
                className="text-white"
              >
                Legal
              </motion.h1>
              <p className="text-white mt-3" style={{textAlign: "justify"}}>
                Most of the businesses faces many complex legal and commercial pressures when operating internationally that require the guidance of experienced and insightful advisors. Our member ,
                <Link href="/accounting-and-legal" style={{ textDecoration: 'none' }}>
                  <span style={{ color: '#0791b0', fontWeight: '500', cursor: 'pointer' }}>
                    Read More
                  </span>
                </Link>
              </p>
              <motion.button
                className="btn"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                viewport={{ once: true }}
                style={{
                  width: '140.79px',
                  height: '45.72px',
                  borderRadius: '19.88px',
                  borderWidth: '0.99px',
                  background: 'white',
                  fontSize: "20px",
                  color: 'black',
                }}
              >
                <Link href="/accounting-and-legal" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Learn More
                </Link>
              </motion.button>
              <motion.h1
                style={{ color: '#293BB1' }}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                viewport={{ once: true }}
                className="text-white " id="accounting"
              >
                Accounting
              </motion.h1>
              <p className="text-white mt-3" style={{textAlign: "justify"}}>
                Global business comes with complex legal and commercial challenges, but you don’t have to face them alone. Our expert law firm members provide seamless, strategic solutions,,..,
                <Link href="/accounting-and-legal" style={{ textDecoration: 'none' }}>
                  <span style={{ color: '#0791b0', fontWeight: '500', cursor: 'pointer' }}>
                    Read More
                  </span>
                </Link>
              </p>
              <motion.button
                className="btn mb-4"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                viewport={{ once: true }}
                style={{
                  width: '140.79px',
                  height: '45.72px',
                  borderRadius: '19.88px',
                  borderWidth: '0.99px',
                  background: 'white',
                  fontSize: "20px",
                  color: 'black',
                }}
              >
                <Link href="/accounting-and-legal" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Learn More
                </Link>
              </motion.button>
            </div>
            <div className="col-lg-3  mt-5 mb-3">
              <Image
                src="/images/al.png"
                width={400}
                height={100}
                alt="Hand Image"
                className="img-fluid"
                style={{ maxHeight: '500px' }}
              />

            </div>
            <div className="col-lg-3 mb-3 mt-3">
              <Image
                src="/images/accouting.png"
                width={400}
                height={100}
                alt="Hand Image"
                className="img-fluid"
                style={{ maxHeight: '600px' }}
              />
            </div>
          </div>

          <div className="container-fluid p-0">
            <div
              className="position-relative w-100"
              style={{
                backgroundImage: "url('/images/lbi-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: "100px 0",
                minHeight: "79vh",
              }}
            >
              <div className="container text-white ms-5">
                <div className="row">
                  <div className="col-lg-6" id="lbi">
                    <h1 className="fw-bold">LBI-Route Survey For<br />Over Dimensional Cargo (ODC)</h1>
                    <p className="mt-3" style={{textAlign: "justify"}}>
                      Location Based Intelligence emphasis on facilitating hindrance-free movement of goods by conducting route surveys by a team of experts.
                      LBI team expertise in providing reports with recommendations which help the users to move freely without any difficulties. LBI uses...
                      <Link href="/intellect/lbi" style={{ textDecoration: 'none' }}>
                        <span style={{ color: '#0791b0', fontWeight: '500', cursor: 'pointer' }}>
                          Read More
                        </span>
                      </Link>
                    </p>
                    <Link href="/intellect/lbi">
                      <button className="btn btn-light mt-3 px-4 py-2" style={{ borderRadius: "20px" }}>
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row align-items-center">

                <div className="col-lg-6 mb-4  mb-lg-0 position-relative" style={{ top: "-50px" }} id="connect">
                  <Image
                    src="/images/image.png"
                    width={600}
                    height={300}
                    alt="Hand holding globe"
                    className="img-fluid ms-5"
                  />
                </div>

                <div
                  className="col-lg-6 text-white "
                  style={{
                    backgroundColor: 'black',
                    borderRadius: '10px',
                  }}
                >
                  <h2 style={{ fontWeight: 600 }}>Connect</h2>
                  <p className="mt-3 w-75 me-5" style={{textAlign: "justify"}}>
                    RACE Connect is the cost-effective strategy to experience an emerging market and the most efficient method to build relationships in new markets.
                    With Indian Automotive market getting more challenging and competitive, RACE Connect helps global companies enter Indian market in the most
                    productive and cost-effective manner right from the beginning.
                  </p>
                  <p className="w-75" style={{ fontWeight: 500 , textAlign: "justify" }}>
                    RACE begins with a comprehensive market analysis to identify opportunities and assess feasibility.
                    We dive deeper into understanding end customers—considering cultural influences, mapping their needs, and formulating...
                    <Link href="/connect" style={{ textDecoration: 'none' }}>
                      <span style={{ color: '#0791b0', fontWeight: '500', cursor: 'pointer' }}>
                        Read More
                      </span>
                    </Link>
                  </p>

                  <Link href="/connect">
                    <button
                      className="btn btn-light mt-3"
                      style={{
                        borderRadius: '20px',
                        padding: '10px 30px',
                        fontWeight: 500,
                      }}
                    >
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>




        </div>
      </div>

      {/* mobile view */}
      <div className="container-fluid  mobile-view">
        <div className="row">
          {sections.map((section, index) => (
            <div key={index} className="col-sm-12 mt-3 d-flex justify-content-center p-2">
              <div className="position-relative" >
                <Image
                  src={section.src}
                  width={600}
                  height={300}
                  alt={section.title}
                  className="img-fluid cursor-pointer"
                  onClick={() => handleImageClick(index)}
                />

                {selectedIndex === index && (
                  <div className="opening-overlay">
                    <div className=" w-100 px-3 py-2">
                      <h5>{section.title}</h5>
                      <p>{section.desc}</p>
                      <Link href={section.link} className="btn btn-light mt-2">
                        Read More
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media only screen and (max-width: 570px) {
          .desktop-view {
            display: none;
          }
        }
        @media only screen and (min-width: 571px) {
          .mobile-view {
            display: none;
          }
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .opening-overlay {
          position: absolute;
          top: 0;
          left: 0;
          height: 0%;
          width: 100%;
          background-color: black;
          color: white;
          border-radius: 8px;
          overflow-y: auto;
          z-index: 10;
          animation: expandOverlay 0.6s ease-out forwards;
        }

        @keyframes expandOverlay {
          0% {
            height: 0%;
            opacity: 0;
          }
          100% {
            height: 100%;
            opacity: 1;
          }
        }

        .btn-light {
          color: #293BB1;
          background-color: #fff;
          border-color: #293BB1;
        }
      `}</style>
    </>
  );
}

export default Product;
