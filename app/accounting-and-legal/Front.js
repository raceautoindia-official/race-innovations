"use client";
import React from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";

const slideUpOnce = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const scrollUpVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

function Front() {
  return (
    <>
      <motion.div
        className="container-fluid p-4 d-flex align-items-center"
        initial="hidden"
        animate="visible"
        variants={slideUpOnce}
        transition={{ duration: 0.3 }}
      >
        <div className="container-fluid p-0">
          <div className="row align-items-center text-center text-md-start">
            <div className="col-md-5 col-12 mb-md-0">
              <h1
                className="ms-md-4 position-relative"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  whiteSpace: "nowrap",
                  zIndex: 2,
                }}
              >
                <span style={{ color: "#293BB1" }}>Accounting & Legal</span>
              </h1>
            </div>
            <div className="col-md-7 col-12 p-0 m-0">
              <motion.div
                className="w-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scrollUpVariants}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    borderRadius: "10px",
                  }}
                >
                  <div style={{ position: "relative", paddingTop: "56.25%", width: "100%" }}>
                    <ReactPlayer
                      url="https://youtu.be/p0I7nn9Ye_s?feature"
                      controls
                      playing
                      muted
                      width="100%"
                      height="100%"
                      style={{ position: "absolute", top: 0, left: 0 }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 text-center"
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
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            {item.name}
          </motion.a>
        ))}
      </motion.div>
    </>
  );
}

export default Front;
