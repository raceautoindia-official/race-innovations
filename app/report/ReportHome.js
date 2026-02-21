"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function ReportHome() {
  const [hasAnimated, setHasAnimated] = useState(false);

  const fastSlideFromBottom = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="container-fluid mt-3">
      {/* Image Animation */}
      <motion.div
        initial="hidden"
        animate={hasAnimated ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fastSlideFromBottom}
        onViewportEnter={() => setHasAnimated(true)}
      >
        <Image
          src="/images/re-1.png"
          width={600}
          height={400}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="Who We Are"
        />
      </motion.div>

      <div className="container mt-5">
        {/* Title Animation */}
        <motion.h4
          className="ms-md-4 text-center"
          style={{ fontSize: "clamp(1rem, 5vw, 3rem)" }}
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fastSlideFromBottom}
          onViewportEnter={() => setHasAnimated(true)}
        >
          <span style={{ color: "black" }}>
            Comprehensive Market Research &
          </span>
          <span style={{ color: "#293BB1", marginLeft: "15px" }}>
            Tailored Industry Studies
          </span>
        </motion.h4>

        {/* Paragraph Animation */}
        <motion.p
          className="mt-4"
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fastSlideFromBottom}
          onViewportEnter={() => setHasAnimated(true)}
          style={{ textAlign: "justify" }}
        >
          At RACE, we provide expert market research solutions across multiple industries,
          helping businesses make data-driven decisions, identify growth opportunities,
          and stay ahead in evolving markets. Our research is customized to meet specific
          business needs, ensuring strategic insights that drive success.
        </motion.p>
      </div>
    </div>
  );
}

export default ReportHome;
