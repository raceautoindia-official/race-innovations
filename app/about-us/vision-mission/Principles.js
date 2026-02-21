"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Principles() {
  return (
    <>
      <motion.h1
        className="mt-4"
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
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>Principles</span>
      </motion.h1>

      <div
        className="container-fluid"
        style={{
          backgroundImage: 'url("/images/rectangle.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "62vh",
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
                  img: "/images/group-89.png",
                  title: "Independent",
                  text: "Inculcate entrepreneurship and freedom of mind to create nuances of creativity innovation in all our crucial project efforts.",
                },
                {
                  img: "/images/group-90.png",
                  title: "Team Spirit",
                  text: "Ability to work within the team and also partner with the client's team for mutual success.",
                },
                {
                  img: "/images/group-91.png",
                  title: "Services",
                  text: "Our motto/philosophy is committed to adding value for every stakeholder at all times.",
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
                  img: "/images/group-92.png",
                  title: "Fun",
                  text: "The perfect blend of fun and responsibility empowers employees, partners, and managers to achieve set goals while building confidence.",
                },
                {
                  img: "/images/group-93.png",
                  title: "Respect",
                  text: "Implies an ownership attitude and respect for everyone irrespective of culture, customs, religion, and nationality.",
                },
                {
                  img: "/images/group-94.png",
                  title: "Integrity",
                  text: "Virtue of success is sustained by our honest and reliable codes of practice in every sphere of our business operations.",
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

export default Principles;
