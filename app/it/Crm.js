"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function Crm() {
  return (
    <motion.div
      className="container-fluid"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="row">
        <motion.div
          className="col-lg-6 mt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h3 style={{ color: "#293BB1" }}>
            Customized CRM Solutions & App Development
          </h3>
          <div className="mt-3" style={{ textAlign: "justify" }}>
            Transform customer engagement with our AI-driven CRM, integrating
            Machine Learning (ML) and Large Language Models (LLMs) for smart
            automation and data-driven decision-making.
          </div>
          <div style={{ textAlign: "justify" }}>
            <strong>Key Features:</strong>
            <ul>
              {[
                {
                  title: "Custom AI-Integrated CRM –",
                  desc:
                    "Tailored solutions powered by AI, ML, and LLMs to automate workflows and enhance customer interactions.",
                },
                {
                  title: "Lead & Sales Pipeline Management –",
                  desc:
                    "AI-driven tracking, predictive insights, and automation for seamless lead nurturing and conversions.",
                },
                {
                  title: "Intelligent Follow-Ups & Reporting –",
                  desc:
                    "LLM-powered communication, automated reminders, and real-time analytics for proactive customer engagement.",
                },
                {
                  title: "Seamless Integration –",
                  desc:
                    "Effortlessly connect CRM with marketing, finance, and operations for a unified business ecosystem.",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="mt-2"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <strong>{item.title}</strong> {item.desc}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="col-lg-6 mt-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <Image
              src="/images/crm.webp"
              alt="CRM Illustration"
              fill
              className="img-fluid rounded shadow-sm"
              style={{ objectFit: "cover", borderRadius: "10px" }}
            />
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-button {
          border: 2px solid #293bb1;
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
          background: #293bb1;
          color: white;
        }
      `}</style>
    </motion.div>
  );
}

export default Crm;
