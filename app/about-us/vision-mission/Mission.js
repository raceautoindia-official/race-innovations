"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Mission() {
  return (
    <>
      <motion.div
        className="container-fluid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
        transition={{ duration: 0.3 }}
      ></motion.div>

      <div className="container pt-5">
        <div className="row align-items-center text-center text-md-start">
          <motion.div
            className="col-md-4 col-12 mb-2 mb-md-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <h1
              className="ms-md-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", whiteSpace: "nowrap" }}
            >
              <span style={{ color: "black" }}>Who we</span>
              <span style={{ color: "#293BB1", marginLeft: "15px" }}>Are</span>
            </h1>
          </motion.div>

          <motion.div
            className="col-md-8 col-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Image
              src="/images/who-we-are.webp"
              width={600}
              height={400}
              className="ms-md-5"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              alt="Who We Are"
            />
          </motion.div>

          <motion.p
            className="mt-1 px-3 px-md-5 text-start text-md-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            RACE, leaders in the space of Commercial Vehicle Consulting thrives
            on Business Intelligence and ideas through its unique Research with
            direct access to Market backed by executable engineering skills and
            framework clearly focused to create unparalleled value to our
            customers with a strong emphasis on innovation and value-add
            services.
          </motion.p>

          <motion.p
            className="mt-1 px-3 px-md-5 text-start text-md-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            RACE has a global presence in 6 countries and is headquartered in
            India. Our global reach, application-centric approach, and deep
            domain expertise in the commercial vehicle industry vertical make us
            an ideal local business partner for OEMs, vehicle aggregate
            manufacturers, fleet operators, and logistics service providers.
          </motion.p>
        </div>
      </div>
    </>
  );
}

export default Mission;
