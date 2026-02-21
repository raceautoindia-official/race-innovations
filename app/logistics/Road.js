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
            Road Transportation
          </h3>
          <div className="mt-3" style={{ textAlign: "justify" }}>
            Over-Dimensional Road Transportation Services by RACE
            The RACE Transport Team specialises in Over-Dimensional (ODC) Road Transportation Services, ensuring the safe, reliable, and cost-effective movement of heavy-lift and oversized cargo. Safety is our first priority, and every project is executed with strict adherence to engineering and regulatory standards.


            Our expert team conducts comprehensive route surveys, vehicle stability checks, gradient and load distribution analysis to determine the right pullers, trailers, and axle configurations. By deploying appropriate equipment engineered for optimal cost without compromising on safety, the RACE Transport Team ensures risk-free, compliant, and timely transportation, making RACE a trusted partner for industries managing critical equipment and heavy-load consignments across challenging terrains.
          </div>
          {/* <div style={{ textAlign: "justify" }}>
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
          </div> */}
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
              src="/images/ro.png"
              alt="CRM Illustration"
              fill
              className="img-fluid rounded shadow-sm"
              style={{ objectFit: "cover", borderRadius: "10px" }}
            />
          </div>
        </motion.div>
      </div>

      <div className="row">
        <motion.div
          className="col-lg-6 mt-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <Image
              src="/images/consultancy.png"
              alt="CRM Illustration"
              fill
              className="img-fluid rounded shadow-sm"
              style={{ objectFit: "cover", borderRadius: "10px" }}
            />
          </div>
        </motion.div>
        <motion.div
          className="col-lg-6 mt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h3 style={{ color: "#293BB1" }}>
            Transport Logistics Consultancy
          </h3>
          <div className="mt-3" style={{ textAlign: "justify" }}>
            Your Partner for Results-Driven Consulting
            Looking for logistics consultancy that prioritises deadlines, budgets, and measurable results? Trust RACE to deliver the most effective solutions for your project.


            Our experienced consulting team develops innovative, tailor-made strategies covering multimodal transport planning, development of jetties, AI-driven route optimisation, warehouse and supply chain management, and advanced safety planning. We also support the establishment of 5G private networks to ensure seamless, real-time communication between equipment, enhancing operational efficiency and reliability.

            Sustainability Consulting – Shift towards greener, carbon-conscious logistics solutions

            With RACE, you gain a trusted partner committed to achieving safe, efficient, and cost-effective project execution.


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
