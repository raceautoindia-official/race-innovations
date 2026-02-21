"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

// Fast animation slide-up for container
const slideFromBottom = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Fast staggered paragraph fade-ins
const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", delay: i * 0.1 },
  }),
};

function Video() {
  const paragraphs = [
    "Location-Based Intelligence emphasizes facilitating hindrance-free movement of goods by conducting route surveys by a team of experts. The LBI team specializes in providing reports with recommendations that help users move freely without any difficulties. LBI uses advanced technology and applications to increase accuracy and reliability.",
    "RACE has a team of professional engineering & civil experts to execute route surveys, identify the shortest feasible routes, ensure load securing, perform vehicle stability calculations, and determine bridge capacity and road filling requirements with associated civil costs for safe & economical cargo transportation.",
    "Additionally, the RACE Team is well-equipped to support various industries, logistics, and transportation companies in designing specialized trailers tailored to their specific cargo and applications.",
  ];

  return (
    <motion.div
      className="container mt-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
    >
      <div className="row align-items-center">
        <div className="col-12 col-md-6 d-flex justify-content-center mb-3 mb-md-0">
          <ReactPlayer
            url="https://youtu.be/5bL0P3xsPGQ?feature"
            controls
            playing
            muted
            loop
            width="100%"
            height="350px"
          />
        </div>

        <div className="col-12 col-md-6" style={{ textAlign: "justify" }}>
          {paragraphs.map((text, i) => (
            <motion.p
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={textVariant}
              className="mb-3"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Video;
