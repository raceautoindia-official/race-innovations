"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

// Faster animation variants
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

function Pro() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <>
      <motion.div
        className="container-fluid mt-3 p-5 d-flex align-items-center"
        style={{
          backgroundImage: 'url("/images/product.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "50vh",
        }}
        initial="hidden"
        animate={controls}
        variants={fadeInVariants}
        transition={{ duration: 0.4 }} // faster fade
      >
        <div className="container">
          <div className="row align-items-center text-center">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={slideUpVariants}
              transition={{ duration: 0.4, delay: 0.2 }} // faster slide
            >
              <h1
                className="ms-md-4"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "black" }}>Product</span>
                <span style={{ color: "black", marginLeft: "15px" }}>
                  Report
                </span>
              </h1>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="container"
        initial="hidden"
        animate={controls}
        variants={slideUpVariants}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <p className="mt-4" style={{ textAlign: "justify" }}>
          At Race Innovations, we specialize in product research services that
          help OEMs and component manufacturers in the automotive, agriculture
          machinery, and construction equipment sectors build better, smarter,
          and more competitive products.
        </p>
        <p style={{ textAlign: "justify" }}>
          Our product research reports provide actionable insights to guide new
          product development, prototype testing, and product improvement
          decisions—backed by real customer feedback and competitor
          benchmarking.
        </p>
      </motion.div>
    </>
  );
}

export default Pro;
