/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Intellect() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="container-fluid"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
    >
      <div className="row mt-1">
        {/* Left Text Column */}
        <motion.div
          className="col-md-6 col-12"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <motion.h1
            className="mt-5"
            style={{ color: "#293BB1" }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Intellect
          </motion.h1>
          <motion.h4 className="mt-3" variants={fadeInUp} transition={{ delay: 0.2 }}>
            RACE has a global presence
          </motion.h4>
          <motion.p className="mt-5" variants={fadeInUp} transition={{ delay: 0.3 }}>
            “Intellect” is one of the core solution offerings of RACE. Our strong
            network of market research and consulting team continuously tracks the
            Indian, global automotive market to provide clients with rich, extensive
            insights on market entry strategies, product launch, competitive strategy,
            mega trends, vehicle/component OEM strategies, regulatory/statutory
            tracking, customer behaviour analysis and manufacturing feasibility.
          </motion.p>
          <motion.button
            className="btn btn-outline-primary"
            style={{
              width: "198.79px",
              height: "45.72px",
              borderRadius: "19.88px",
              borderWidth: "0.99px",
            }}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Right Image Column */}
        <motion.div
          className="col-md-5 col-12"
          variants={fadeInUp}
          transition={{ delay: 0.5 }}
        >
          <Image
            src="/images/g-1.webp"
            alt="A scenic landscape view"
            width={1000}
            height={800}
            className="mt-5"
            style={{ width: "100%", height: "80%", objectFit: "cover" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Intellect;
