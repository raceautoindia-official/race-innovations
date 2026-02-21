"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function Offerings() {
  return (
    <div className="container mt-5 mb-5">
      <div className="row align-items-center">
        {/* Text Section */}
        <motion.div
          className="col-md-6 mb-4 mb-md-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInVariants}
        >
          <h1 className="mb-3">Features</h1>
          <ul
            className="text-start"
            style={{
              listStyleType: "disc",
              paddingLeft: "1.5rem",
              textAlign: "justify",
            }}
          >
            {[
              "Trained engineering resources",
              "Assist to reduce product development cycle",
              "Help to deliver right products to market",
              "Use of latest engineering tools & techniques",
              "Voice of Customer (VOC) & Quality Function Deployment (QFD)",
              "Lesser workload on client internal R&D resources",
            ].map((feature, index) => (
              <motion.li
                key={index}
                className="mt-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInVariants}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <strong>{feature}</strong>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="col-md-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInVariants}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Image
            src="/images/offerings.png"
            width={1100}
            height={500}
            alt="Offerings"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Offerings;
