"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Last() {
  return (
    <>
      {/* Intro Section */}
      <motion.div
        className="container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideUpVariants}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-center" style={{ fontSize: "3rem", whiteSpace: "nowrap" }}>
          <span style={{ color: "#293BB1" }}>Tax</span>
        </h1>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          With the experienced account and audit team, we have handled taxation
          activities for major industries and individuals. Currently, tax
          regulations are constantly updated, making it challenging for clients
          to adhere to and operate. RACE has a dedicated team to advise
          individuals and businesses on tax reduction strategies while ensuring
          compliance with regulations.
        </p>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          We work closely with clients to understand their inflows and outflows,
          providing tailored solutions to improve tax savings while following
          government tax rules.
        </p>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          When you work with one of our member firms, you have access to experts
          who will handle your tax matters efficiently and with the utmost care,
          so you can focus on other vital aspects of your business.
        </p>
      </motion.div>

      {/* Services + Image */}
      <motion.div
        className="container"
        style={{ marginBottom: "100px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideUpVariants}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="text-center">
          <span style={{ color: "black", marginRight: "10px" }}>Key</span>
          <span style={{ color: "#293BB1" }}>Accounting Services</span>
        </h1>

        <div className="row">
          {/* Services List Column 1 */}
          <div className="col-md-4" style={{ fontSize: "18px", textAlign: "justify" }}>
            <ul>
              <li>Corporate tax</li>
              <li>Customs duties</li>
              <li>Employee incentives</li>
              <li>Employment tax</li>
              <li>Deportee tax & Employee advice</li>
              <li>International tax planning</li>
            </ul>
          </div>

          {/* Services List Column 2 */}
          <div className="col-md-4 mt-1" style={{ fontSize: "18px", textAlign: "justify" }}>
            <ul>
              <li>Personal tax, asset protection & trust planning</li>
              <li>Property tax</li>
              <li>Tax preparation & Compliance</li>
              <li>Transaction support</li>
              <li>Transfer pricing</li>
              <li>VAT & Indirect Taxes</li>
            </ul>
          </div>

          {/* Right-side Image */}
          <div className="col-md-4">
            <Image
              src="/images/image-79.webp"
              width={600}
              height={400}
              className="ms-md-5"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              alt="Tax & Compliance Illustration"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Last;
