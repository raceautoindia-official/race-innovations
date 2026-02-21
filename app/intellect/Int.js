"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Int() {
  return (
    <div className="container">
      <div className="row align-items-center text-center text-md-start">
        <motion.div
          className="col-md-4 col-12 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
        >
          <Image
            src="/images/int.jpg"
            width={600}
            height={400}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              transition: "transform 0.3s ease-in-out",
            }}
            alt="Intelligence Image"
          />
        </motion.div>

        <motion.div
          className="col-md-7 col-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p style={{ textAlign: "justify" }}>
            “Intellect” is one of the core solution offerings of RACE. Our
            strong network of market research and consulting team continuously
            tracks the Indian, global automotive market to provide clients with
            rich, extensive insights on market entry strategies, product launch,
            competitive strategy, mega trends, vehicle/component OEM strategies,
            regulatory/statutory tracking, customer behavior analysis, and
            manufacturing feasibility.
          </p>
        </motion.div>
      </div>

      <h1 className="text-center">
        <span style={{ color: "black" }}>Unlock Actionable </span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>Insights with RACE</span>
      </h1>

      <p style={{ textAlign: "justify" }}>
        At RACE, we go beyond data—we decode your business challenges to deliver
        powerful insights that drive growth and success...
      </p>

      <motion.h1
        className="text-center"
        style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: "bold",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Features
      </motion.h1>

      <motion.div
        className="row text-start"
        style={{ textAlign: "justify" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {[
          "Comprehensive Data Sources – Insights from OEMs, dealerships, application builders, and Vahan dashboard.",
          "Advanced Analytics – Statistical models ensure high accuracy and minimal errors.",
          "Real-Time Market Tracking – Monitor trends, registrations, and regulatory changes.",
          "Industry-Specific Intelligence – Tailored insights for automotive, logistics, construction, and mining sectors.",
          "High-Quality Compliance – Reports meet international standards and client requirements.",
          "Expert-Led Research – Backed by experienced analysts and industry consultants.",
          "Customisable Dashboards – Interactive reports tailored to business needs.",
          "Competitive Benchmarking – Market comparisons, competitor analysis, and forecasting.",
          "Scalable Solutions – Suitable for startups, OEMs, fleet operators, and policymakers.",
          "Actionable Insights – Strategic recommendations for growth and efficiency.",
          "Clear recommendation guidelines for execution",
          "In-Depth Analysis and use of latest tools & techniques",
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="col-12 col-md-4"
            variants={fadeInUp}
            transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
          >
            <ul className="ps-3">
              <motion.li whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                {feature}
              </motion.li>
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Int;
