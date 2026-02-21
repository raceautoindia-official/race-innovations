"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Animation Variants
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Last() {
  return (
    <motion.div
      className="container-fluid"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInVariants}
      transition={{ duration: 0.4 }} // faster fade
    >
      {/* Section Title */}
      <motion.h5
        className="mt-4 text-center"
        style={{ fontSize: "2.5rem", whiteSpace: "nowrap" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideUpVariants}
        transition={{ duration: 0.4, delay: 0.1 }} // faster + light delay
      >
        <span style={{ color: "black" }}>Why</span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>
          Choose Us?
        </span>
      </motion.h5>

      {/* Content Section */}
      <div className="container" style={{ marginBottom: "100px" }}>
        <div className="row justify-content-center mt-4">
          {/* Text Content */}
          <motion.div
            className="col-md-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUpVariants}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {[
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
            ].map((item, index) => (
              <p key={index}>
                <strong style={{ color: "#293BB1" }}>{item.title}</strong> –{" "}
                {item.text}
              </p>
            ))}
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="col-md-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUpVariants}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Image
              src="/images/notes.png"
              width={250}
              height={250}
              className="card-img-top"
              style={{
                width: "100%",
                height: "100%",
                margin: "0 auto",
                objectFit: "contain",
              }}
              alt="Why Choose Us"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Last;
