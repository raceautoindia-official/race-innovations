"use client";

import React from "react";
import { motion } from "framer-motion";

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Formats() {
  return (
    <motion.div
      className="container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={slideUpVariants}
      transition={{ duration: 0.4 }} // Faster entry
    >
      <motion.h4
        style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
        className="mt-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideUpVariants}
        transition={{ duration: 0.4, delay: 0.1 }} // Fast with slight delay
      >
        <span style={{ color: "black" }}>Market</span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>
          Report Formats
        </span>
      </motion.h4>

      <motion.p
        className="mt-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideUpVariants}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ textAlign: "justify" }}
      >
        At Race Innovationss, we offer Flash Reports in quarterly, monthly,
        half-yearly, and yearly formats to keep you updated on the latest market
        intelligence at the frequency that best suits your needs.
      </motion.p>

      <motion.div
        className="d-flex flex-column align-items-center justify-content-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideUpVariants}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <ul>
          <li className="mt-3">
            <strong style={{ color: "#293BB1" }}>Quarterly Report:</strong> In-depth updates on market shifts, financial trends, and competitive strategies.
          </li>
          <li className="mt-3">
            <strong style={{ color: "#293BB1" }}>Monthly Reports:</strong> A concise snapshot of critical industry movements, product launches, and investment activities.
          </li>
          <li className="mt-3">
            <strong style={{ color: "#293BB1" }}>Half-Yearly Reports:</strong> Strategic analysis and mid-year performance reviews to help optimize your business strategies.
          </li>
          <li className="mt-3">
            <strong style={{ color: "#293BB1" }}>Yearly Reports:</strong> Comprehensive yearly reviews with actionable insights, market forecasts, and financial outlooks.
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default Formats;
