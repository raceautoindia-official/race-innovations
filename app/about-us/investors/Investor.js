"use client";
import React from "react";
import { motion } from "framer-motion";

function Investors() {
  return (
    <div
      className="container-fluid d-flex flex-column align-items-center justify-content-center position-relative"
      style={{
        height: "80vh",
        width: "100%",
        backgroundImage: "url('/images/investor.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>

      {/* Animated Heading */}
      <motion.h1
        className="text-white position-relative"
        style={{ fontSize: "5rem", zIndex: 1 }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        Investors
      </motion.h1>
    </div>
  );
}

export default Investors;
