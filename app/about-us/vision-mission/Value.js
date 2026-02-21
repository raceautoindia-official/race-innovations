"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Value() {
  return (
    <>
      <motion.h1
        className=""
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
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>Values</span>
      </motion.h1>

      <div
        className="container-fluid"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "60vh",
        }}
      >
        <div className="container">
          <div className="row">
            <motion.div
              className="col-md-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {[
                {
                  img: "/images/195.webp",
                  title: "Pursuit of Excellence",
                  text: "Continually strive to exceed the expectations of our people and our clients.",
                },
                {
                  img: "/images/196.webp",
                  title: "Confidentiality",
                  text: "We take utmost responsibility in protecting customers' confidential information, strategy, futuristic plans, and values.",
                },
                {
                  img: "/images/197.webp",
                  title: "Integrity",
                  text: "Our energy and enthusiasm are contagious. We are inspired to make a lasting impact.",
                },
              ].map((item, index) => (
                <motion.div
                  className="row align-items-center mt-1"
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <div className="col-md-4 text-center">
                    <Image
                      src={item.img}
                      width={120}
                      height={120}
                      className="img-fluid"
                      alt={item.title}
                    />
                  </div>
                  <div className="col-md-8 d-flex flex-column">
                    <h5 style={{ color: "#3647b5", marginBottom: "5px" }}>
                      {item.title}
                    </h5>
                    <p style={{ margin: 0 }}>{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="col-md-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {[
                {
                  img: "/images/198.webp",
                  title: "Passion",
                  text: "Our energy and enthusiasm are contagious. We are inspired to make a lasting impact.",
                },
                {
                  img: "/images/199.webp",
                  title: "Collaboration",
                  text: "Ability to work within the team, partner with clients' team for mutual success.",
                },
                {
                  img: "/images/200.webp",
                  title: "Accountability",
                  text: "Continually strive to exceed the expectations of our people and our clients.",
                },
              ].map((item, index) => (
                <motion.div
                  className="row align-items-center mt-4"
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInUpVariants}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <div className="col-md-4 text-center">
                    <Image
                      src={item.img}
                      width={120}
                      height={120}
                      className="img-fluid"
                      alt={item.title}
                    />
                  </div>
                  <div className="col-md-8 d-flex flex-column">
                    <h5 style={{ color: "#3647b5", marginBottom: "5px" }}>
                      {item.title}
                    </h5>
                    <p style={{ margin: 0 }}>{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Value;
