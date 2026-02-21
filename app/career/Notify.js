"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Notify() {
  const [hasAnimated, setHasAnimated] = useState(false);

  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }, // ⚡ Faster animation
    },
  };

  return (
    <motion.div
      className="container-fluid d-flex align-items-center"
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
      onViewportEnter={() => setHasAnimated(true)}
    >
      <div className="container" style={{ marginBottom: "100px" }}>
        <div className="row align-items-center text-center text-md-start">
          <div className="col-md-3" /> {/* Spacer column */}

          {/* Form Section */}
          <motion.div
            className="col-md-5 col-12"
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideFromBottom}
            transition={{ duration: 0.4 }}
          >
            <h1 className="fw-bold">Get Notified</h1>
            <p>Signup to receive occasional updates.</p>

            <div className="mb-3 d-flex flex-column flex-sm-row align-items-stretch">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                style={{
                  borderRadius: "30px",
                  flex: "1 1 auto",
                  padding: "0.75rem 1.25rem",
                }}
              />
              <button
                className="ms-sm-3 mt-3 mt-sm-0 text-white fw-semibold"
                style={{
                  backgroundColor: "#72b4c4",
                  borderRadius: "30px",
                  padding: "10px 24px",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                JOIN
              </button>
            </div>

            <small className="text-muted">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates by email.
            </small>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="col-md-4 col-12 mt-4 mt-md-0 d-flex justify-content-center"
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideFromBottom}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Image
              src="/images/mail.webp"
              width={300}
              height={300}
              alt="Mail Icon"
              style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Notify;
