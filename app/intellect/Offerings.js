"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Car,
  ClipboardList,
  FileText,
  Users,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Grid,
  Activity,
} from "lucide-react";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const offeringsData = [
  {
    icon: BarChart,
    title: "Market Intelligence",
    text: "In-depth industry insights, trends, and competitor analysis.",
  },
  {
    icon: Car,
    title: "Vehicle & Fleet Data",
    text: "Comprehensive tracking of vehicle registrations, fleet performance, and adoption trends.",
  },
  {
    icon: ClipboardList,
    title: "Custom Research & Reports",
    text: "Tailored studies addressing specific business challenges.",
  },
  {
    icon: FileText,
    title: "Regulatory & Policy Analysis",
    text: "Updates on government policies, compliance, and industry regulations.",
  },
  {
    icon: Users,
    title: "Consumer & Dealer Insights",
    text: "Data-driven analysis of buying behaviour and dealer performance.",
  },
  {
    icon: Lightbulb,
    title: "Technology & Innovation Tracking",
    text: "Insights on emerging trends, EV adoption, and future mobility solutions.",
  },
  {
    icon: TrendingUp,
    title: "ReForecasting & Business Strategy",
    text: "Data-backed projections to guide investment and expansion plans.",
  },
  {
    icon: Briefcase,
    title: "Competitive Benchmarking",
    text: "Compare market positioning and business performance against industry leaders.",
  },
  {
    icon: Grid,
    title: "Interactive Dashboards",
    text: "Customisable data visualisation for real-time decision-making.",
  },
  {
    icon: Activity,
    title: "Consulting & Advisory",
    text: "Expert-led guidance to optimise operations and maximise growth.",
  },
];

function Offerings() {
  return (
    <>
      <motion.h1
        className="text-center"
        style={{ fontSize: "clamp(2rem, 5vw, 3rem)", whiteSpace: "nowrap" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
        transition={{ duration: 0.3 }}
      >
        <span style={{ color: "black" }}>Race</span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>Offerings</span>
      </motion.h1>

      <div
        className="container-fluid"
        style={{
          backgroundImage: 'url("/images/rectangle.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "72vh",
        }}
      >
        <div className="container" style={{ marginBottom: "100px" }}>
          <div className="row">
            {offeringsData.map((item, index) => (
              <motion.div
                className="col-md-6"
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUpVariants}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <div className="row align-items-center mt-4">
                  <div className="col-md-4 text-center">
                    <item.icon size={80} color="#3647b5" />
                  </div>
                  <div className="col-md-8 d-flex flex-column">
                    <h5 style={{ color: "#3647b5", marginBottom: "5px" }}>
                      {item.title}
                    </h5>
                    <p style={{ margin: 0 }}>{item.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Offerings;
