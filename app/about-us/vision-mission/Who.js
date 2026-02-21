"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Who() {
  return (
    <>
      <motion.h1
        className="mt-1"
        style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
        transition={{ duration: 0.3 }}
      >
        <span style={{ color: "black" }}>Race</span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>
          Accomplishment
        </span>
      </motion.h1>

      {/* Background Section */}
      <div
        className="container-fluid"
        style={{
          backgroundImage: 'url("/images/rectangle.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "65vh",
          padding: "0.5rem",
        }}
      >
        <div className="container">
          {/* First Row */}
          <motion.div
            className="row justify-content-center mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {[
              { img: "chair.webp", text: "Incorporated in the year 2011" },
              {
                img: "award.webp",
                text:
                  "Recognized, professionally acclaimed and admired player in the CV industry",
              },
              {
                img: "administrator.webp",
                text:
                  "Unique in the industry for our adept knowledge in truck/bus/trailer applications",
              },
              {
                img: "data-analytics.webp",
                text:
                  "Delivered more than 50 customized strategic reports and 100 market research reports",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUpVariants}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              >
                <div className="card p-3 text-center d-flex flex-column align-items-center w-100">
                  <Image
                    src={`/images/${item.img}`}
                    width={50}
                    height={50}
                    alt={item.text}
                    className="mb-3"
                  />
                  <p>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second Row */}
          <motion.div
            className="row justify-content-center mt-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {[
              {
                img: "delivery-truck.webp",
                text:
                  "Designed and developed various truck, bus, trailer application designs",
              },
              {
                img: "team-leader.webp",
                text:
                  "Executed more than 10 strategic green field innovative projects",
              },
              {
                img: "engineer.webp",
                text:
                  "Employee strength of 35 members including engineers and marketing specialists",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUpVariants}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                <div className="card p-3 text-center d-flex flex-column align-items-center w-100">
                  <Image
                    src={`/images/${item.img}`}
                    width={50}
                    height={50}
                    alt={item.text}
                    className="mb-3"
                  />
                  <p>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Who;
