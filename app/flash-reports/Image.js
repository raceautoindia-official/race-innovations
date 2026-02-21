"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

function ImageSection() {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Fast animation from bottom
  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }, // 🔧 FAST animation
    },
  };

  return (
    <>
      {/* Background Image Section */}
      <motion.div
        className="container-fluid p-5 d-flex align-items-center"
        style={{
          backgroundImage: 'url("/images/flash.png")',
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
            <motion.h1
              className="ms-md-4"
              style={{
                fontSize: "clamp(3rem, 5vw, 3rem)",
                whiteSpace: "nowrap",
              }}
              variants={slideFromBottom}
            >
              <span style={{ color: "black" }}>Flash</span>
              <span style={{ color: "black", marginLeft: "15px" }}>
                Reports
              </span>
            </motion.h1>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="container"
        initial="hidden"
        animate={hasAnimated ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={slideFromBottom}
      >
        <motion.p className="mt-4" variants={slideFromBottom}>
          In today's fast-moving business environment, timely intelligence is
          the key to staying ahead.{" "}
          <strong>Race Innovationss Flash Reports</strong> provide quick,
          actionable insights to help businesses make informed decisions—faster.
          Designed for executives, investors, and decision-makers, our concise,
          data-driven reports deliver the latest market trends, competitive
          shifts, financial movements, and emerging innovations in your
          industry.
        </motion.p>
      </motion.div>
    </>
  );
}

export default ImageSection;
