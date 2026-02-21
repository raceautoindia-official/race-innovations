"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const scrollUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const scrollUpVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

function World() {
  return (
    <>
      {/* Hero Section */}
      <motion.div
        className="p-3 d-flex align-items-center p-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={scrollUpVariant}
        transition={{ duration: 0.4 }}
      >
        <div className="container-fluid pt-4">
          <div className="row align-items-center text-center text-md-start m-0">
            <motion.div
              className="col-md-4 col-12 mb-md-0 p-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scrollUpVariant}
              transition={{ duration: 0.4 }}
            >
              <h1
                className="ms-md-4"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)", whiteSpace: "nowrap" }}
              >
                <span style={{ color: "#293BB1" }}>Connect</span>
              </h1>
            </motion.div>

            <motion.div
              className="col-md-8 col-12 p-0 m-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scrollUpVariants}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div style={{ position: "relative", paddingTop: "56.25%", width: "100%" }}>
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
      </motion.div>

      {/* Navigation Bar */}
      <motion.div
        className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 text-center"
        style={{ backgroundColor: "#676A6E", color: "white" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={scrollUpVariants}
        transition={{ duration: 0.4, delay: 0.2 }}
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

      {/* Content Section */}
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          <motion.div
            className="col-md-4 col-12 p-0 m-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scrollUpVariant}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
          >
            <Image
              src="/images/image-connect.png"
              width={400}
              height={400}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "auto",
                transition: "transform 0.3s ease-in-out",
              }}
              alt="Connect Image"
            />
          </motion.div>

          <motion.div
            className="col-md-7 col-12 text-start mt-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scrollUpVariant}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <p style={{ textAlign: "justify" }}>
              RACE begins with a comprehensive market analysis to identify
              opportunities and assess feasibility. We then dive deeper into
              understanding end customers—considering cultural influences,
              mapping their needs, and formulating targeted marketing strategies
              to engage a diverse audience effectively. Our approach also
              ensures businesses connect with the right stakeholders for
              success.
            </p>

            <p style={{ textAlign: "justify" }}>
              With strong Application Engineering expertise, RACE helps
              companies develop products tailored to Indian market requirements.
            </p>

            <p style={{ textAlign: "justify" }}>
              For international firms seeking joint ventures, RACE facilitates
              partnerships by conducting unbiased technical and commercial due
              diligence—enabling informed, strategic decision-making when
              collaborating with domestic counterparts.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default World;
