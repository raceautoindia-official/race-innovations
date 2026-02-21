"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Research() {
  const [hasAnimated, setHasAnimated] = useState(false);

  const fastSlideFromBottom = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <>
      <div
        className="container-fluid mt-5"
        style={{
          backgroundImage: 'url("/images/liquid-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "130vh",
        }}
      >
        {/* Title Animation */}
        <motion.h4
          style={{
            fontSize: "clamp(1.5rem, 5vw, 3rem)",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
          className="mt-4"
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fastSlideFromBottom}
          onViewportEnter={() => setHasAnimated(true)}
        >
          <span style={{ color: "black" }}>Our Core</span>
          <span style={{ color: "#293BB1", marginLeft: "15px" }}>
            Research Services
          </span>
        </motion.h4>

        <div className="container mt-4">
          {/* Card Rows */}
          {[
            [
              {
                img: "/images/4.png",
                title: "Industry Trends & Market Forecasting",
                desc: "Growth opportunities to help businesses navigate industry shifts.",
              },
              {
                img: "/images/5.png",
                title: "Competitive Intelligence & Benchmarking",
                desc: "Understand strategies, pricing, and market positioning for competitive advantage.",
              },
              {
                img: "/images/3.png",
                title: "Product & Concept Testing",
                desc: "Validate new products, services, and technologies before market launch through extensive feasibility studies.",
              },
            ],
            [
              {
                img: "/images/1.png",
                title: "Consumer Behaviour & Demand Analysis",
                desc: "Uncover customer preferences and brand perception to refine your product and marketing strategies.",
              },
              {
                img: "/images/2.png",
                title: "Supply Chain & Distribution Research",
                desc: "Optimize operations with insights into supply chain efficiency, vendor selection, and distribution channel performance.",
              },
            ],
          ].map((row, rowIndex) => (
            <div className="row justify-content-center mt-5" key={rowIndex}>
              {row.map((card, index) => (
                <motion.div
                  className="col-md-4"
                  key={index}
                  initial="hidden"
                  animate={hasAnimated ? "visible" : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={fastSlideFromBottom}
                  onViewportEnter={() => setHasAnimated(true)}
                >
                  <div
                    className="card p-3 text-center"
                    style={{
                      maxWidth: "350px",
                      maxHeight: "500px",
                      margin: "auto",
                    }}
                  >
                    <Image
                      src={card.img}
                      width={250}
                      height={250}
                      className="card-img-top"
                      style={{
                        width: "80%",
                        height: "auto",
                        margin: "0 auto",
                        objectFit: "contain",
                      }}
                      alt={card.title}
                    />
                    <h5 className="mt-4">{card.title}</h5>
                    <p>{card.desc}</p>
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

export default Research;
