"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Service() {
  const [animatedIndices, setAnimatedIndices] = useState({});

  useEffect(() => {
    console.log("Framer Motion animations are active...");
  }, []);

  // Faster slide-up variant
  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="container-fluid mt-5">
      {/* Title */}
      <motion.h4
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideFromBottom}
        style={{
          fontSize: "clamp(1rem, 5vw, 3rem)",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
        className="mt-5"
      >
        <span style={{ color: "black" }}>Our Product Research</span>
        <span style={{ color: "#293BB1", marginLeft: "9px" }}>Reports Cover </span>
      </motion.h4>

      {/* Content */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <motion.div
            className="col-md-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideFromBottom}
          >
            <Image
              src="/images/change-1.webp"
              alt="Prototype"
              width={800}
              height={600}
              className="img-fluid rounded shadow-sm"
              style={{ objectFit: "cover" }}
            />
            <h6
              style={{
                fontSize: "clamp(1rem, 4vw, 2rem)",
                whiteSpace: "nowrap",
              }}
              className="mt-3"
            >
              <span style={{ color: "black" }}>Prototype &</span>
              <span style={{ color: "#293BB1", marginLeft: "9px" }}>
                Concept Evaluation
              </span>
            </h6>
            <p className="mt-3" style={{ textAlign: "justify" }}>
              Collecting early-stage feedback from target users and field experts is a crucial step in the product development process. It involves sharing early prototypes or concepts to gather insights on the design, functionality, and overall appeal of the product...
            </p>
          </motion.div>

          <motion.div
            className="col-md-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideFromBottom}
          >
            <h6
              style={{
                fontSize: "clamp(1rem, 4vw, 2rem)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "black" }}>Product Feature</span>
              <span style={{ color: "#293BB1", marginLeft: "9px" }}>
                Benchmarking
              </span>
            </h6>
            <p className="mt-3" style={{ textAlign: "justify" }}>
              Compare technical specifications, performance metrics, and value-added features with industry leaders across categories—cars, tractors, CVs, EVs, and construction machinery.
            </p>
            <Image
              src="/images/cha-3.webp"
              alt="Benchmarking"
              width={800}
              height={400}
              className="img-fluid rounded shadow-sm mt-4"
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Service;
