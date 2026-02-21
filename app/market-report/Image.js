"use client";
import "./market.css";
import React from "react";
import { motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Image() {
  return (
    <>
      <motion.div
        className="container-fluid p-5 d-flex align-items-center desktop"
        style={{
          backgroundImage: 'url("/images/flash.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "50vh",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
        transition={{ duration: 0.4 }} // Faster fade
      >
        <div className="container">
          <div className="row align-items-center text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUpVariants}
              transition={{ duration: 0.4, delay: 0.1 }} // Fast + light delay
            >
              <h1
                className="ms-md-4"
                style={{
                  fontSize: "clamp(1rem, 5vw, 3rem)",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "black" }}>Market</span>
                <span style={{ color: "black" }} className="ms-3">
                  Reports
                </span>
              </h1>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideUpVariants}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.h4
          style={{
            fontSize: "3rem",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
          className="mt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUpVariants}
          transition={{ duration: 0.3, delay: 0.3 }}
        ></motion.h4>

        <motion.p
          className="mt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUpVariants}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ textAlign: "justify" }}
        >
          In today's fast-moving business environment, timely intelligence is
          the key to staying ahead. Race Innovationss Flash Reports provide
          quick, actionable insights to help businesses make informed
          decisions—faster. Designed for executives, investors, and
          decision-makers, our concise, data-driven reports deliver the latest
          market trends, competitive shifts, financial movements, and emerging
          innovations in your industry.
        </motion.p>
      </motion.div>
    </>
  );
}

export default Image;
