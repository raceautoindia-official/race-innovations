"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function Corporate() {
  return (
    <>
      <motion.div
        className="container d-flex flex-column align-items-center text-center mt-2"
        style={{ justifyContent: "center" }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h3
          style={{
            fontSize: "clamp(1rem, 5vw, 2rem)",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <span style={{ color: "black" }}>Drive the Future with RACE</span>
          <span style={{ color: "#293BB1" }}> – Partner in Innovation!</span>
        </h3>

        <p style={{ textAlign: "justify" }}>
          At RACE Innovations, we are shaping the future of automotive,
          logistics, and engineering solutions.
        </p>
        <p style={{ textAlign: "justify" }}>
          We invite investors and strategic partners to join us in
          revolutionising industries through cutting-edge technology and
          visionary leadership.
        </p>
      </motion.div>

      <div className="container">
        <div className="row">
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          >
            {/* H2 styled as .h1: the page H1 is "Investors" in the banner. */}
            <h2
              className="h1"
              style={{
                fontSize: "clamp(1rem, 5vw, 2.5rem)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "black" }}>Contact</span>
              <span style={{ color: "#293BB1" }}> Details</span>
            </h2>

            <h4 className="mt-3" style={{ textAlign: "justify" }}>
              <strong>Why Invest in RACE?</strong>
            </h4>
            <p style={{ textAlign: "justify" }}>
              🔹 Industry Disruptor – Pioneering breakthroughs in vehicle
              safety, energy storage, and intelligent mobility.
            </p>
            <p style={{ textAlign: "justify" }}>
              🔹 Expanding Market Presence – Strong footprint across automotive,
              construction, mining, and logistics sectors.
            </p>
            <p style={{ textAlign: "justify" }}>
              🔹 Expert-Led Growth – Backed by a team of industry leaders,
              engineers, and research specialists.
            </p>
            <p style={{ textAlign: "justify" }}>
              🔹 Global Alliances – Collaborating with top international
              innovators to drive next-gen solutions.
            </p>

            <p style={{ textAlign: "justify" }}>
              <strong>Partner with Us & Accelerate Success!</strong>
            </p>

            <p><strong>📌 M.P. Rajesh Khanna</strong></p>
            <p><strong>🧑‍💼 Designation:</strong> Managing Director</p>
            <p><strong>✉️ Email:</strong> kh@raceinnovations.in</p>
            <p><strong>📞 Phone:</strong> +91 98404 90241</p>
          </motion.div>

          <motion.div
            className="col-md-6 mt-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          >
            <Image
              src="/images/image-80.webp"
              width={700}
              height={500}
              alt="Person using a smartphone at a desk to get in touch"
              style={{
                width: "1000px",
                height: "100%",
                maxWidth: "100%",
                objectFit: "cover",
              }}
              className="responsive-img"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Corporate;
