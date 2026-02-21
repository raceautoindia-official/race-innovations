"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeInStagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay },
  },
});

function Mining() {
  return (
    <>
      <motion.div
        className="container-fluid mt-4"
        style={{ marginBottom: "100px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideUp}
      >
       
      </motion.div>

      <style jsx>{`
        .custom-button {
          border: 2px solid #293BB1;
          color: black;
          background: white;
          border-radius: 50px;
          padding: 8px 20px;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s ease;
          background-color: rgba(164, 151, 151, 0.12);
        }

        .custom-button:hover {
          background: #293BB1;
          color: white;
        }
      `}</style>
    </>
  );
}

export default Mining;
