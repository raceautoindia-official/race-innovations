"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Last() {
  const [hasAnimated, setHasAnimated] = useState(false);

  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }, // Faster duration
    },
  };

  const reasons = [
    {
      title: "Industry-Specific Expertise",
      text: "Proven experience across diverse sectors.",
    },
    {
      title: "Custom Research Solutions",
      text: "Tailored studies designed to meet your unique business needs.",
    },
    {
      title: "Global & Regional Coverage",
      text: "Market intelligence spanning international and local markets.",
    },
    {
      title: "Data-Driven Decision Making",
      text: "Actionable insights backed by advanced analytics.",
    },
  ];

  return (
    <motion.div
      className="container-fluid"
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
      onViewportEnter={() => setHasAnimated(true)}
    >
      {/* Heading */}
      <motion.h5
        className="mt-4 text-center"
        style={{ fontSize: "2.5rem", whiteSpace: "nowrap" }}
        variants={slideFromBottom}
      >
        <span style={{ color: "black" }}>Why</span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>Choose Us?</span>
      </motion.h5>

      <div className="container">
        <div className="row justify-content-center mt-4">
          {/* Text Section */}
          <motion.div
            className="col-md-8"
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideFromBottom}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {reasons.map((item, index) => (
              <motion.p
                key={index}
                className="mb-3"
                initial="hidden"
                animate={hasAnimated ? "visible" : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={slideFromBottom}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }} // Faster stagger
              >
                <strong style={{ color: "#293BB1" }}>{item.title}</strong> – {item.text}
              </motion.p>
            ))}
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="col-md-4 text-center"
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideFromBottom}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Image
              src="/images/notes.png"
              width={250}
              height={250}
              alt="Why Choose Us"
              style={{
                width: "80%",
                height: "auto",
                objectFit: "contain",
                margin: "0 auto",
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Last;
