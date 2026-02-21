"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Cover() {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Bottom-to-top animation variant
  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <>
      {/* Title Animation */}
      <motion.h5
        style={{
          fontSize: "clamp(2rem, 5vw, 2.5rem)",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
        className="mt-4"
        initial="hidden"
        animate={hasAnimated ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={slideFromBottom}
        onViewportEnter={() => setHasAnimated(true)}
      >
        <span style={{ color: "black" }}>Industries</span>
        <span style={{ color: "#293BB1", marginLeft: "9px" }}>We Cover</span>
      </motion.h5>

      <div
        className="container-fluid"
        style={{
          backgroundImage: 'url("/images/silver-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "70vh",
        }}
      >
        <div className="container mt-5">
          {/* Industry Rows */}
          {[ 
            [
              {
                img: "/images/group-11.png",
                title: "Automotive",
                desc: "Industry outlook, vehicle technology trends, sales forecasting, and dealership insights.",
              },
              {
                img: "/images/group-15.png",
                title: "Manufacturing & Industrial Equipment",
                desc: "Supply chain optimization, product feasibility studies, and market penetration strategies.",
              },
            ],
            [
              {
                img: "/images/group-14.png",
                title: "Farm Machinery & Equipment",
                desc: "Market trends, innovation analysis, and competitive benchmarking.",
              },
              {
                img: "/images/group-13.png",
                title: "Technology & Innovation",
                desc: "Digital transformation trends, adoption studies, and emerging tech research.",
              },
            ],
            [
              {
                img: "/images/group-11.png",
                title: "Construction Machinery",
                desc: "Demand assessment, fleet management insights, and regulatory analysis.",
              },
              {
                img: "/images/group-12.png",
                title: "Consumer Goods & Retail",
                desc: "Market entry strategies, pricing analysis, and brand perception studies.",
              },
            ],
          ].map((row, rowIndex) => (
            <div className="row mt-5" key={rowIndex}>
              {row.map((industry, index) => (
                <motion.div
                  className="col-md-6"
                  key={index}
                  initial="hidden"
                  animate={hasAnimated ? "visible" : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  variants={slideFromBottom}
                  onViewportEnter={() => setHasAnimated(true)}
                >
                  <div className="row align-items-center">
                    <div className="col-md-6 text-center">
                      <Image
                        src={industry.img}
                        width={150}
                        height={150}
                        className="card-img-top"
                        style={{
                          width: "40%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                        alt={industry.title}
                      />
                    </div>
                    <div className="col-md-6">
                      <h5 className="mt-4" style={{ color: "#293BB1" }}>
                        {industry.title}
                      </h5>
                      <p>{industry.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Cover;
