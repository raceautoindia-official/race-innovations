"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const scrollUpVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

function First() {
  return (
    <>
      <div className="container-fluid p-0 d-flex align-items-center pt-5">
        <div className="container-fluid  ">
          <div className="row align-items-center text-center text-md-center m-0 ">
            <motion.div
              className="col-md-4 col-12 mb-md-0 "
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              transition={{ duration: 0.3 }}
            >
              <h1
                className="ms-md-4"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "#293BB1" }}>Intellect</span>
              </h1>
            </motion.div>

            <motion.div
              className="col-md-8 col-12 p-0 m-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div
                style={{
                  position: "relative",
                  paddingTop: "56.25%", // 16:9
                  width: "100%",
                }}
              >
                <ReactPlayer
                  url="https://youtu.be/AZwxqB1Q40I?si=AeOCwIcCD3JW5oHD"
                  controls
                  playing
                  muted
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <motion.div
        className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 text-center mt-3"
        style={{ backgroundColor: "#676A6E", color: "white" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={scrollUpVariants}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {[
          { name: "Technic", link: "/technic" },
          { name: "Intellect", link: "/intellect" },
          { name: "Connect", link: "/connect" },
          { name: "LBI Route Survey", link: "/intellect/lbi" },
          { name: "Accounting & Legal", link: "/accounting-and-legal" },
        ].map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            className="m-2 text-white text-decoration-none"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {item.name}
          </motion.a>
        ))}
      </motion.div>
    </>
  );
}

export default First;
