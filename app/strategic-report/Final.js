"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Final() {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Bottom-to-top animation variant
  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="container-fluid">
      {/* Title Animation */}
      <motion.h5
        className="mt-4 text-center"
        style={{ fontSize: "2.5rem", whiteSpace: "nowrap" }}
        initial="hidden"
        animate={hasAnimated ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={slideFromBottom}
        onViewportEnter={() => setHasAnimated(true)}
      >
        <span style={{ color: "black" }}>Why</span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>Choose Us?</span>
      </motion.h5>

      <div className="container">
        <div className="row justify-content-center mt-4">
          {/* Text Animation */}
          <motion.div
            className="col-md-8"
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideFromBottom}
            onViewportEnter={() => setHasAnimated(true)}
          >
            <p>
              <strong style={{ color: "#293BB1" }}>
                Industry-Specific Expertise
              </strong>{" "}
              – Proven experience across diverse sectors.
            </p>
            <p>
              <strong style={{ color: "#293BB1" }}>
                Custom Research Solutions
              </strong>{" "}
              – Tailored studies designed to meet your unique business needs.
            </p>
            <p>
              <strong style={{ color: "#293BB1" }}>
                Global & Regional Coverage
              </strong>{" "}
              – Market intelligence spanning international and local markets.
            </p>
            <p>
              <strong style={{ color: "#293BB1" }}>
                Data-Driven Decision Making
              </strong>{" "}
              – Actionable insights backed by advanced analytics.
            </p>
          </motion.div>

          {/* Image Animation */}
          <motion.div
            className="col-md-4"
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideFromBottom}
            onViewportEnter={() => setHasAnimated(true)}
          >
            <Image
              src="/images/notes.png"
              width={250}
              height={250}
              className="card-img-top"
              style={{
                width: "80%",
                height: "auto",
                margin: "0 auto",
                objectFit: "contain",
              }}
              alt="Who We Are"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Final;
