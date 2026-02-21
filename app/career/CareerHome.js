"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function CareerHome() {
  const [hasAnimated, setHasAnimated] = useState(false);

  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }, 
    },
  };

  return (
    <motion.div
      className="container-fluid d-flex align-items-center pt-4"
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
      onViewportEnter={() => setHasAnimated(true)}
    >
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          {/* Text Section */}
          <motion.div
            className="col-md-4 col-12 mb-md-0"
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideFromBottom}
            transition={{ duration: 0.4 }}
          >
            <h1
              className="ms-md-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", whiteSpace: "nowrap" }}
            >
              <span style={{ color: "#293BB1" }}>Careers</span>
            </h1>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="col-md-8 col-12"
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideFromBottom}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Image
              src="/images/career-bg.webp"
              width={600}
              height={400}
              className="ms-md-5"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              alt="Career Background"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default CareerHome;
