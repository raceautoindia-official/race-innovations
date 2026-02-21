"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Mission() {
  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="container-fluid pt-5">
      <div className="row align-items-center">
        {/* Heading */}
        <motion.div
          className="col-12 col-md-4 text-center text-md-end d-flex flex-column justify-content-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideFromBottom}
        >
          <h1
            className="ms-md-4"
            style={{
              fontSize: "clamp(2rem, 2.5vw, 3rem)",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              textAlign: "center",
            }}
          >
            <span style={{ color: "black" }}>Management</span>
            <span style={{ color: "#293BB1" }}> Team</span>
          </h1>
        </motion.div>

        {/* Image */}
        <motion.div
          className="col-12 col-md-8 d-flex justify-content-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideFromBottom}
        >
          <Image
            src="/images/team.webp"
            width={300}
            height={150}
            className="w-100 img-fluid"
            style={{
              objectFit: "cover",
              minHeight: "150px",
            }}
            alt="Management Team"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Mission;
