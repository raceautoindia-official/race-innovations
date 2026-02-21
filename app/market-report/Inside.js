"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Inside() {
  return (
    <>
      <motion.div
        className="container-fluid mt-5"
        style={{
          backgroundImage: 'url("/images/liquid-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "130vh",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
        transition={{ duration: 0.4 }} // Faster fade
      >
        <motion.h4
          style={{
            fontSize: "clamp(1.5rem, 5vw, 3rem)",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
          className="mt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUpVariants}
          transition={{ duration: 0.4, delay: 0.1 }} // Faster and slight delay
        >
          <span style={{ color: "black" }}>What’s Inside a</span>
          <span style={{ color: "#293BB1", marginLeft: "15px" }}>
            Market Report
          </span>
        </motion.h4>

        <div className="container mt-4">
          <div className="row justify-content-center g-1">
            {[
              {
                img: "/images/4.png",
                title: "Industry Trends & Market Forecasting",
                text: "Growth opportunities to help businesses navigate industry shifts.",
              },
              {
                img: "/images/5.png",
                title: "Competitive Intelligence & Benchmarking",
                text: "Understand strategies, pricing, and market positioning for competitive advantage.",
              },
              {
                img: "/images/3.png",
                title: "Product & Concept Testing",
                text: "Validate new products, services, and technologies before market launch through feasibility studies.",
              },
            ].map((item, index) => (
              <motion.div
                className="col-md-4"
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUpVariants}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div
                  className="card p-3"
                  style={{
                    maxWidth: "350px",
                    maxHeight: "500px",
                    margin: "auto",
                  }}
                >
                  <Image
                    src={item.img}
                    width={250}
                    height={250}
                    className="card-img-top"
                    style={{
                      width: "100%",
                      height: "100%",
                      margin: "0 auto",
                      objectFit: "contain",
                    }}
                    alt={item.title}
                  />
                  <h5 className="mt-4">{item.title}</h5>
                  <p>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="row justify-content-center mt-5">
            {[
              {
                img: "/images/1.png",
                title: "Consumer Behaviour & Demand Analysis",
                text: "Uncover customer preferences and brand perception to refine your product and marketing strategies.",
              },
              {
                img: "/images/2.png",
                title: "Supply Chain & Distribution Research",
                text: "Optimize operations with insights into supply chain efficiency, vendor selection, and distribution performance.",
              },
            ].map((item, index) => (
              <motion.div
                className="col-md-4"
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUpVariants}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div
                  className="card p-3 text-center"
                  style={{
                    maxWidth: "350px",
                    maxHeight: "500px",
                    margin: "auto",
                  }}
                >
                  <Image
                    src={item.img}
                    width={250}
                    height={250}
                    className="card-img-top"
                    style={{
                      width: "100%",
                      height: "100%",
                      margin: "0 auto",
                      objectFit: "contain",
                    }}
                    alt={item.title}
                  />
                  <h5 className="mt-4">{item.title}</h5>
                  <p>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Inside;
