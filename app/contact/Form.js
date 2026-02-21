"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

function Form() {
  const [hasAnimated, setHasAnimated] = useState(false);

  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="container-fluid d-flex flex-column justify-content-center align-items-center text-center"
      style={{ marginBottom: "100px" }}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
      onViewportEnter={() => setHasAnimated(true)}
    >
      <h1
        className="mt-2"
        style={{ fontSize: "clamp(1rem, 5vw, 3rem)", whiteSpace: "nowrap" }}
      >
        <span style={{ color: "black" }}>You can connect with</span>
        <br />
        <span style={{ color: "#293BB1" }}>us when you need help!</span>
      </h1>

      <div className="container bg-white p-3 rounded shadow">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="First Name" />
            </div>
            <div className="mb-3">
              <input type="email" className="form-control" placeholder="Email" />
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Organization" />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Last Name" />
            </div>
            <div className="mb-3">
              <input type="tel" className="form-control" placeholder="Phone Number" />
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Location" />
            </div>
          </div>

          {/* Message */}
          <div className="col-12">
            <div className="mb-3">
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter your message"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button className="btn btn-primary px-4">Submit</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Form;
