"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function Ref() {
  return (
    <div className="container my-5">
      <div className="row align-items-center text-center text-md-start">
        {/* Image Column */}
        <motion.div
          className="col-md-4 col-12 mb-4 mb-md-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src="/images/image-65.png"
            width={600}
            height={200}
            alt="Interface Engineering Support"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </motion.div>

        {/* Text Column */}
        <motion.div
          className="col-md-7 col-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <p style={{ textAlign: "justify" }}>
            RACE’s engineering team is fully equipped to support clients with a wide range
            of application and interface engineering services—enabling the automotive
            market to unlock the full potential of their products and services.
            This includes a deep understanding of technical requirements, operating
            environments (terrain, location, usage patterns), and collaborative packaging
            needs across the value chain.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Ref;
