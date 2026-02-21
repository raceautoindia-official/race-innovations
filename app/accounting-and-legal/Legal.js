"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Fast animation variant
const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Legal() {
  return (
    <>
      {/* Legal Heading + Description */}
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
          <span style={{ color: "#293BB1" }}>Legal</span>
        </h1>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          Most businesses face many complex legal and commercial pressures when
          operating internationally that require the guidance of experienced and
          insightful advisors. Our members will guide you through the countless
          legal issues you may encounter while conducting business overseas.
        </p>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          Our law firm members provide solutions in an efficient and seamless
          manner, giving you more time to focus on other facets of your
          business.
        </p>

        <p style={{ fontSize: "18px", textAlign: "justify" }}>
          Having worked across a wide range of industries, our member firms have
          the experience to understand your specific needs and become a trusted
          advisor to your business. With services ranging from employment law to
          international trade law, whatever support your business requires to be
          successful on the international stage, an RACE member firm can help.
        </p>
      </motion.div>

      {/* Key Legal Services + Image */}
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
          <span style={{ color: "#293BB1" }}>Legal Services</span>
        </h1>

        <div className="row">
          {/* Services Column 1 */}
          <div
            className="col-md-4"
            style={{ fontSize: "18px", textAlign: "justify" }}
          >
            <ul>
              <li>Anti-trust & Competition</li>
              <li>Arbitration & Dispute resolution</li>
              <li>Banking & Finance, Bankruptcy & Creditor rights</li>
              <li>Business & Corporate</li>
              <li>Commercial & Contract</li>
              <li>Data protection & Privacy</li>
              <li>Employment</li>
              <li>Estate planning & Trusts</li>
              <li>Environmental</li>
              <li>Family & Matrimonial</li>
            </ul>
          </div>

          {/* Services Column 2 */}
          <div
            className="col-md-4 mt-1"
            style={{ fontSize: "18px", textAlign: "justify" }}
          >
            <ul>
              <li>Immigration</li>
              <li>Intellectual property rights</li>
              <li>International trade</li>
              <li>Licensing and Litigation</li>
              <li>Mergers, Acquisitions & Disposals</li>
              <li>Product liability</li>
              <li>Real estate</li>
              <li>Shipping & Maritime</li>
              <li>Tax</li>
              <li>Technology & E-commerce</li>
            </ul>
          </div>

          {/* Image Column */}
          <div className="col-md-4">
            <Image
              src="/images/image-78.webp"
              width={600}
              height={400}
              className="ms-md-5"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              alt="Legal Advisory Illustration"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Legal;
