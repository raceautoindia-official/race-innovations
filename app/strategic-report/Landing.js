"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

function Landing() {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Bottom-to-top animation variant
  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <>
      {/* Background Section */}
      <motion.div
        className="container-fluid  p-5 d-flex align-items-center"
        style={{
          backgroundImage: 'url("/images/bg-s.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "50vh",
        }}
        initial="hidden"
        animate={hasAnimated ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={slideFromBottom}
        onViewportEnter={() => setHasAnimated(true)}
      >
        <div className="container">
          <div className="row align-items-center text-center">
            {/* Title */}
            <motion.h1
              className="ms-md-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", whiteSpace: "nowrap" }}
              initial="hidden"
              animate={hasAnimated ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={slideFromBottom}
              onViewportEnter={() => setHasAnimated(true)}
            >
              <span style={{ color: "black" }}>Strategic</span>
              <span style={{ color: "black", marginLeft: "15px" }}>Reports</span>
            </motion.h1>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="container">
        {/* Subheading Animation */}
        <motion.h4
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
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
          <span style={{ color: "black" }}>Strategic Reports &</span>
          <span style={{ color: "#293BB1", marginLeft: "15px" }}>
            Business Intelligence
          </span>
        </motion.h4>

        {/* Paragraph Animation */}
        <motion.p
          className="mt-4"
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideFromBottom}
          onViewportEnter={() => setHasAnimated(true)}
        >
          At RACE, we specialize in comprehensive product research to help businesses develop, refine, and launch successful products. Whether you're designing a new automotive component, a breakthrough in farm machinery, or industrial equipment, our in-depth research ensures market fit, competitive advantage, and long-term success.
        </motion.p>
      </div>
    </>
  );
}

export default Landing;
