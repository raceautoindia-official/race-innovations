"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeInStagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay },
  },
});

function Mining() {
  return (
    <>
      <motion.div
        className="container-fluid mt-4"
        style={{ marginBottom: "100px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideUp}
      >
        <div className="row">
          <motion.div
            className="col-lg-6"
            variants={slideUp}
            transition={{ duration: 0.5 }}
          >
            <div style={{ position: "relative", width: "100%", height: "400px" }}>
              <Image
                src="/images/mining.webp"
                alt="Globe showing world map"
                fill
                className="img-fluid rounded shadow-sm"
                style={{ objectFit: "cover", borderRadius: "10px" }}
              />
            </div>
          </motion.div>

          <motion.div
            className="col-lg-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp}
          >
            <motion.h3
              style={{ color: "#293BB1" }}
              variants={fadeInStagger(0.1)}
            >
              Data Mining & Business Intelligence
            </motion.h3>

            <motion.p
              className="mt-3"
              style={{ textAlign: "justify" }}
              variants={fadeInStagger(0.2)}
            >
              Leverage AI-powered insights for smarter decision-making and
              competitive advantage.
            </motion.p>

            <ul>
              {[
                "Custom AI-Integrated CRM – Tailored solutions powered by AI, ML, and LLMs to automate workflows and enhance customer interactions.",
                "Market Research & Competitor Analysis – Data-driven strategies to uncover trends and opportunities.",
                "Automated Data Mining – AI-driven extraction, analysis, and trend prediction.",
                "Web Scraping – Real-time data collection for actionable business intelligence.",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="mt-2"
                  style={{ textAlign: "justify" }}
                  variants={fadeInStagger(0.3 + index * 0.1)}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        .custom-button {
          border: 2px solid #293BB1;
          color: black;
          background: white;
          border-radius: 50px;
          padding: 8px 20px;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s ease;
          background-color: rgba(164, 151, 151, 0.12);
        }

        .custom-button:hover {
          background: #293BB1;
          color: white;
        }
      `}</style>
    </>
  );
}

export default Mining;
