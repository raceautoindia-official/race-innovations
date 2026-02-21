"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Advisory() {
  return (
    <>
      <motion.div
        className="container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideUpVariants}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="text-center"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#293BB1" }}>Advisory</span>
        </h1>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          RACE associates have worked with most industries and have been a part
          of export/import and business needs. Our expert advisors and
          consultants have the knowledge to provide actionable steps to meet the
          challenges of doing business in new territories or across
          international borders.
        </p>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          Our advisers will help you plan while meeting your current goals. With
          services ranging from management consulting to feasibility studies,
          and from technology consulting to mergers and acquisitions, our member
          firms can advise on a wide variety of issues, ensuring that your
          people, processes, and products are aligned with your business goals.
        </p>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          With extensive industry experience, you can be assured that our member
          firms will provide relevant guidance completely tailored to your
          organization’s strategic vision.
        </p>
      </motion.div>

      <motion.div
        className="container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideUpVariants}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h1 className="text-center">
          <span style={{ color: "black", marginRight: "10px" }}>Key</span>
          <span style={{ color: "#293BB1" }}>Accounting Services</span>
        </h1>

        <div className="row">
          {/* List Column 1 */}
          <div
            className="col-md-4"
            style={{ fontSize: "18px", textAlign: "justify" }}
          >
            <ul>
              <li>Business valuation</li>
              <li>Corporate finance</li>
              <li>Feasibility studies</li>
              <li>Human resources & organizational development</li>
              <li>International expansion</li>
              <li>Management consulting</li>
              <li>Mergers & Acquisitions</li>
              <li>Performance efficiency & Profit enhancement</li>
            </ul>
          </div>

          {/* List Column 2 */}
          <div
            className="col-md-4 mt-1"
            style={{ fontSize: "18px", textAlign: "justify" }}
          >
            <ul>
              <li>Private equity</li>
              <li>Product & Operations consulting</li>
              <li>Project finance</li>
              <li>Restructuring</li>
              <li>Risk management</li>
              <li>Strategic planning</li>
              <li>Technology consulting</li>
            </ul>
          </div>

          {/* Image Column */}
          <div className="col-md-4">
            <Image
              src="/images/image-77.webp"
              width={600}
              height={400}
              className="ms-md-5"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              alt="Advisory Services"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Advisory;
