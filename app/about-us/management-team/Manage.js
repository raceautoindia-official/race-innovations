"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaFacebook, FaLinkedin } from "react-icons/fa";

function Manage() {
  return (
    <motion.div
      className="container"
      style={{ marginBottom: "100px" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="row align-items-center">
        {/* Left Column (Image & Name) */}
        <motion.div
          className="col-lg-4 col-md-5 text-center mt-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        >
          <Image
            src="/images/image (2).webp"
            width={400}
            height={400}
            className="img-fluid rounded-circle"
            style={{
              maxWidth: "80%",
              height: "auto",
              objectFit: "cover",
            }}
            alt="M.P. Rajesh Khanna"
          />

          <h1 className="mt-3">M.P. Rajesh Khanna</h1>
          <h4>Managing Director</h4>

          {/* Social Media Icons */}
          <div>
            <a
              href="https://www.facebook.com/kh.rajesh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={30} className="ms-3 text-primary" />
            </a>
            <a
              href="https://www.linkedin.com/in/rajesh-kh-96086411/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={30} className="ms-3 text-primary" />
            </a>
          </div>
        </motion.div>

        {/* Right Column (Text) */}
        <motion.div
          className="col-lg-8 col-md-7 px-md-4"
          style={{ fontSize: "18px" }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        >
          <h1>
            <span style={{ color: "black", marginRight: "10px" }}>Message</span>
            <span style={{ color: "#293BB1" }}>from the MD</span>
          </h1>
          <p>
            RACE is driven by the ambition to unlock the full potential of the automotive
            industry. Today, the Indian automotive, agricultural, construction, and mining
            sectors face numerous challenges—some seemingly minor but with a significant
            impact...
          </p>
          <p>
            RACE aspires to create a holistic and meaningful impact for all key stakeholders
            in this ecosystem. We recognise that, while the sector faces various hurdles,
            each challenge presents an opportunity for innovation and progress...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Manage;
