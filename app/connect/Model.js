"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  BarChart,
  Car,
  ClipboardList,
  FileText,
  Users,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Model() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "0px 0px -100px 0px",
    threshold: 0.2,
  });

  const features = [
    {
      icon: <BarChart size={40} color="#007bff" />,
      title: "Strategic Resource Deployment",
      text: "Skilled professionals positioned to enhance your organisation’s operations.",
    },
    {
      icon: <Car size={40} color="#ff9800" />,
      title: "Exclusive Knowledge Access",
      text: "Privileged entry to RACE’s proprietary research, insights, and industry reports.",
    },
    {
      icon: <ClipboardList size={40} color="#4caf50" />,
      title: "Versatile Support Services",
      text: "Resources aligned to serve multiple functions across client organisations.",
    },
    {
      icon: <FileText size={40} color="#293BB1" />,
      title: "Commitment to Excellence",
      text: "Long-term partnerships focused on sustained performance and innovation.",
    },
    {
      icon: <Users size={40} color="#e65100" />,
      title: "Fast & Impactful Results",
      text: "Efficient execution ensures quicker turnaround times and measurable outcomes.",
    },
    {
      icon: <Lightbulb size={40} color="#ffeb3b" />,
      title: "Cost-Effective Solutions",
      text: "Maximised benefits with optimised costs for better ROI.",
    },
    {
      icon: <TrendingUp size={40} color="#8e44ad" />,
      title: "Business Agility & Adaptability",
      text: "Seamlessly adjust to evolving market conditions and new challenges.",
    },
  ];

  const operatingModel = [
    {
      number: "01",
      color: "linear-gradient(to right, #007bff, #0056b3)",
      text: "Engineering resource to support in development, testing, validating new products for different applications.",
    },
    {
      number: "02",
      color: "linear-gradient(to right, #ff9800, #e65100)",
      text: "Program manager with marketing skill supported by a team of dedicated resources to run the operation.",
    },
    {
      number: "03",
      color: "linear-gradient(to right, #4caf50, #2e7d32)",
      text: "Additional resources covering other functional requirements like manufacturing & operations, logistics, strategic sourcing, accounts.",
    },
  ];

  return (
    <div ref={ref} className="container" style={{ marginBottom: "100px" }}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={slideUpVariants}
      >
        <h1 className="text-center">Features</h1>
        <div className="row">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="col-md-4 d-flex align-items-start mb-4"
              variants={slideUpVariants}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div
                className="p-3"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "10px",
                  flex: 1,
                  height: "100%",
                }}
              >
                <div className="mb-3">{item.icon}</div>
                <h5>{item.title}</h5>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="row mt-4">
        <motion.div
          className="col-md-6 mt-3"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={slideUpVariants}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-center">
            <span style={{ color: "black" }}>Operating</span>{" "}
            <span style={{ color: "#293BB1" }}>Model</span>
          </h1>
          {operatingModel.map((item, index) => (
            <motion.div
              key={index}
              className="card d-flex align-items-center"
              style={{
                background: "#fff",
                padding: "20px",
                boxShadow: "4px 6px 12px rgba(0, 0, 0, 0.15)",
                marginBottom: "20px",
                border: "none",
                borderTopLeftRadius: "50px",
                borderBottomLeftRadius: "50px",
              }}
              variants={slideUpVariants}
              transition={{ delay: 0.6 + index * 0.2 }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100%",
                  background: item.color,
                  clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: "bold",
                  borderTopLeftRadius: "50px",
                  borderBottomLeftRadius: "50px",
                }}
              >
                {item.number}
              </div>
              <p style={{ marginLeft: "15px", flex: 1 }}>{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="col-md-6 mt-4 mt-md-0"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={slideUpVariants}
          transition={{ delay: 1 }}
        >
          <Image
            src="/images/image-68.webp"
            width={600}
            height={400}
            alt="RACE Connect"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Model;
