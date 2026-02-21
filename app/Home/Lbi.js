"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

function Lbi() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{
        width: "100%",
        minHeight: "100vh",
        background: `url('/images/gg.webp') no-repeat center center`,
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px",
        borderRadius: "10px",
        alignItems: "center",
      }}
      className="container-fluid"
    >
      <motion.div
        className="d-flex justify-content-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <div className="col-md-6 text-center">
          <h1 style={{ color: "#293BB1" }}>
            LBI-Route Survey For
            <br /> Over Dimensional Cargo (ODC)
          </h1>
          <p className="mt-3" style={{ color: "#555555" }}>
            Location Based Intelligence emphasizes facilitating hindrance-free
            movement of goods by conducting route surveys by a team of experts.
            The LBI team provides recommendations to help users move freely,
            using advanced technology to increase accuracy and reliability.
            RACE's engineering and civil teams execute surveys, assess road
            feasibility, and calculate logistics like bridge capacity and
            vehicle stability. RACE also supports industries and logistics firms
            with custom trailer design and safe, cost-effective cargo transport.
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
        className="btn btn-outline-primary mt-3"
        style={{
          width: "198.79px",
          height: "45.72px",
          borderRadius: "19.88px",
          borderWidth: "0.99px",
        }}
      >
        <Link
          href="/intellect/lbi"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Learn More
        </Link>
      </motion.button>
    </motion.div>
  );
}

export default Lbi;
