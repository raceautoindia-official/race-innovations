"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function Office() {
  const [hasAnimated, setHasAnimated] = useState(false);

  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const images = [
    { src: "/images/group-1.webp", alt: "Office Image 1" },
    { src: "/images/group-2.webp", alt: "Office Image 2" },
    { src: "/images/group-3.webp", alt: "Office Image 3" },
  ];

  return (
    <motion.div
      className="container"
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
      onViewportEnter={() => setHasAnimated(true)}
    >
      <h1 className="text-center" style={{ fontSize: "3rem", whiteSpace: "nowrap" }}>
        <span style={{ color: "black", marginRight: "10px" }}>Our</span>
        <span style={{ color: "#293BB1" }}>Office</span>
      </h1>

      <p style={{ textAlign: "justify" }}>
        RACE Connect is the cost-effective strategy to experience an evolving market and the most
        efficient method to build relationships in new markets. With the Indian automotive market
        becoming more challenging and competitive, the RACE Connect program helps global companies
        enter the Indian market in the most productive and cost-effective manner right from the
        beginning.
      </p>

      <div className="row">
        {images.map((img, idx) => (
          <div key={idx} className="col-md-4 mt-4 text-center">
            <motion.div
              initial="hidden"
              animate={hasAnimated ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={slideFromBottom}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Image
                src={img.src}
                width={300}
                height={300}
                style={{ objectFit: "cover" }}
                alt={img.alt}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Office;
