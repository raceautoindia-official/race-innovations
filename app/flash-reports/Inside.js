"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Inside() {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Faster bottom-to-top animation
  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const cardContent = [
    {
      img: "/images/4.png",
      title: "Industry Trends & Market Forecasting",
      text: "Growth opportunities to help businesses navigate industry shifts.",
    },
    {
      img: "/images/5.png",
      title: "Competitive Intelligence & Benchmarking",
      text: "Understand strategies, pricing, and market positioning for competitive advantage.",
    },
    {
      img: "/images/3.png",
      title: "Product & Concept Testing",
      text: "Validate new products, services, and technologies before market launch through extensive feasibility studies.",
    },
    {
      img: "/images/1.png",
      title: "Consumer Behaviour & Demand Analysis",
      text: "Uncover customer preferences and brand perception to refine your product and marketing strategies.",
    },
    {
      img: "/images/2.png",
      title: "Supply Chain & Distribution Research",
      text: "Optimize operations with insights into supply chain efficiency, vendor selection, and distribution channel performance.",
    },
  ];

  return (
    <motion.div
      className="container-fluid"
      style={{
        backgroundImage: 'url("/images/liquid-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "120vh",
      }}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
      onViewportEnter={() => setHasAnimated(true)}
    >
      {/* Title */}
      <motion.h4
        className="mt-4 text-center"
        style={{
          fontSize: "clamp(1.5rem, 5vw, 3rem)",
          whiteSpace: "nowrap",
        }}
        variants={slideFromBottom}
      >
        <span style={{ color: "black" }}>What’s Inside a</span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>Flash Report</span>
      </motion.h4>

      {/* Cards */}
      <div className="container mt-4">
        <div className="row justify-content-center">
          {cardContent.map((item, index) => (
            <motion.div
              key={index}
              className="col-md-4 mt-4"
              initial="hidden"
              animate={hasAnimated ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={slideFromBottom}
              transition={{ duration: 0.3, delay: index * 0.05 }} // Faster + slight stagger
              onViewportEnter={() => setHasAnimated(true)}
            >
              <div
                className="card p-3 text-center"
                style={{
                  maxWidth: "350px",
                  height: "100%",
                  margin: "auto",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Image
                  src={item.img}
                  width={250}
                  height={250}
                  alt={item.title}
                  style={{
                    width: "80%",
                    height: "auto",
                    objectFit: "contain",
                    margin: "0 auto",
                  }}
                />
                <h5 className="mt-4">{item.title}</h5>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Inside;
