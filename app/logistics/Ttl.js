"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function Ttl() {
  return (
    <motion.div
      className="container-fluid mt-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="row">
        <motion.div
          className="col-lg-8"
          variants={slideInLeft}
        >
          <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <Image
              src="/images/omega.png"
              alt="TTL Illustration"
              fill
              className="img-fluid rounded shadow-sm"
              style={{ objectFit: "cover", borderRadius: "10px" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                color: "white",
                padding: "4px 8px",
                fontSize: "10px",
                borderRadius: "5px",
                pointerEvents: "none",
                userSelect: "none"
              }}
            >
              Courtesy: Omega Morgan
            </div>
          </div>

        </motion.div>

        {/* Right text with animation */}
        <motion.div
          className="col-lg-4"
          variants={slideInRight}
        >
          <h3 style={{ color: "#293BB1" }}>
            Transport Engineering
          </h3>
          <p className="mt-3" style={{ textAlign: "justify" }}>
            For the safe and successful transportation of heavy-lift and over-dimensional cargo, technical expertise is crucial. That’s why RACE offers tailor-made transport engineering solutions, feasibility and infrastructure studies, detailed route survey services, and technical project consulting to ensure optimal results.

            Our specialised services include vehicle stability checks, gradient and traction analysis to determine the required pullers and torque at wheels, multimodal movement studies, barge loading and unloading analysis, wharf ground stability assessments, jetty development and stability evaluations, and bridge load calculations.
            By combining engineering precision, data-driven planning, and on-ground expertise, RACE ensures safe, efficient, and compliant ODC movement, reducing operational risks and ensuring reliable delivery across challenging terrains and multimodal routes. <Link href="/intellect/lbi" passHref>
              <button className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow">
                LBI
              </button>
            </Link>

          </p>
          <p style={{ textAlign: "justify" }}>
            <strong>



            </strong>

          </p>
        </motion.div>
      </div>

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
    </motion.div>
  );
}

export default Ttl;
