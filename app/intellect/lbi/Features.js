"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Features() {
  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const listItemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
        delay: i * 0.05,
      },
    }),
  };

  const features = [
    "Turning circle diagrams with vehicle simulation along with load",
    "Railway crossing related obstruction details",
    "LT/HT cable, tree branches, signboards, overhead bridge height constraints",
    "Other observations like petrol pump, toll plaza, parking points, SOS- Emergency services, dhaba, traffic congestion locations, pothole details, NH/SH identification, major city entry/exit",
    "Critical bridge calculations*",
    "Vehicle stability calculation when loaded*",
    "Load securing guidelines, suggestion for vehicle modification to suit loads, new vehicle design for specific cargo movement*",
    "Gradient calculations*",
  ];

  return (
    <motion.div
      className="container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={slideFromBottom}
    >
      <div className="row">
        <motion.div
          className="col-md-6"
          variants={slideFromBottom}
        >
          <h1
            className="text-center"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", whiteSpace: "nowrap" }}
          >
            <span style={{ color: "black" }}>Key</span>
            <span style={{ color: "#293BB1" }}> Features</span>
          </h1>

          <ul style={{ textAlign: "justify" }}>
            {features.map((feature, index) => (
              <motion.li
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={listItemVariant}
                style={{ marginBottom: "15px" }}
              >
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="col-md-6 mb-0"
          variants={slideFromBottom}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Image
            src="/images/survey.png"
            width={500}
            height={400}
            className="ms-md-5"
            style={{
              width: "100%",
              height: "80%",
              objectFit: "contain",
            }}
            alt="Survey Image"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Features;
