"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const scrollUpVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

function Ban() {
  return (
    <>
      <div
        className="container-fluid  p-0 d-flex align-items-center"        
      >
        <div className="container p-0 pt-5"> 
          <div className="row align-items-center text-center text-md-start m-0">
            <motion.div
              className="col-md-4 col-12 mb-md-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scrollUpVariants}
              transition={{ duration: 1 }}
            >
              <h1
                className="ms-md-4"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  whiteSpace: "nowrap",
                  wordBreak: "break-word",
                }}
              >
                <span style={{ color: "#293BB1" }}>Technic</span>
              </h1>
            </motion.div>
            <motion.div
              className="col-md-8 col-12 p-0 m-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scrollUpVariants}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ display: "flex", justifyContent: "center" }} 
            >
              <Image
                src="/images/tech.jpeg"
                width={900}
                height={500}
                className="img-fluid" 
                style={{
                  objectFit: "cover",
                  maxWidth: "100%", 
                  height: "auto", 
                }}
                alt="Technic Image"
              />
            </motion.div>
          </div>
        </div>
      </div>
        <motion.div
              className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 text-center mt-3"
              style={{ backgroundColor: "#676A6E", color: "white" }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollUpVariants}
              transition={{ duration: 1, delay: 0.5 }}
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
      <style jsx>{`
        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem;
            text-align: center;
          }
          .nav-container {
            overflow-x: auto;
            white-space: nowrap;
            display: flex;
          }
          .nav-container a {
            display: inline-block;
            padding: 10px 15px;
          }
        }
      `}</style>
    </>
  );
}

export default Ban;
