"use client";

import React from "react";
import { motion } from "framer-motion";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Message() {
  return (
    <div className="container mt-1">
      <motion.h1
        className="ms-4 d-flex justify-content-center"
        style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          whiteSpace: "nowrap",
          width: "100%",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
        transition={{ duration: 1 }}
      >

      </motion.h1>
      <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
        <span style={{ color: "black", marginRight: "10px" }}>Message</span>
        <span style={{ color: "#293BB1" }}>from the MD</span>
      </h1>

      {/* Animated Paragraphs */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <p><strong>Dear Stakeholders,</strong></p>
        <p><strong>Greetings!</strong></p>

        <p>
          Thank you for visiting our website. It is a privilege to share our
          vision, innovation, and industry expertise with you. In today’s
          rapidly evolving digital landscape, the automotive, agricultural,
          construction, and mining sectors are undergoing transformative changes
          driven by technological advancements, automation, and sustainability
          goals. Businesses must adapt to shifting market trends, competitive
          pressures, and economic uncertainties, making engineering excellence,
          research-driven insights, and strategic planning more critical than
          ever.
        </p>

        <p>
          Race Innovationss was founded with a bold vision—to unlock the full
          potential of India’s automotive, agricultural, construction, and
          mining industries. These sectors face numerous challenges, from supply
          chain complexities and regulatory compliance to the need for advanced
          vehicle safety, emission control, and fuel efficiency solutions. Our
          expertise in engineering design, market research, and project
          management enables us to develop cutting-edge solutions that help
          businesses stay ahead in an ever-changing market.
        </p>

        <p>
          As a trusted partner in the industry, we take pride in delivering
          high-quality, innovative, and reliable solutions tailored to our
          clients’ needs. Over a decade of growth, Race Innovationss has
          established itself as a recognised leader in automotive and industrial
          consulting. Today, we collaborate with 50+ companies, ranging from
          emerging businesses to global automotive manufacturers, OEMs, fleet
          operators, and logistics firms. By 2030, our vision is to expand our
          network to 2,000 companies and achieve a turnover of USD 1 billion.
        </p>

        <p>
          Our data-driven research, strategic market insights, and expert
          consulting services empower our clients to make informed business
          decisions and enhance their operational efficiency,
          cost-effectiveness, and sustainability initiatives. Whether it is
          vehicle electrification, alternative fuel technologies, advanced
          braking systems, or heavy-duty fleet management, RACE provides
          innovative, market-ready solutions that drive success.
        </p>

        <p>
          At the core of RACE is our dynamic team of engineers, analysts, and
          industry specialists, each bringing a wealth of experience and passion
          to our mission. We foster a collaborative, entrepreneurial work
          culture that encourages innovation, problem-solving, and excellence in
          engineering solutions.
        </p>

        <p>
          As we move forward, our commitment remains strong—to deliver top-tier
          industry solutions, embrace emerging technologies, and help our
          clients achieve sustainable growth and competitive advantage. We
          invite our employees, customers, and business partners to join us on
          this journey of innovation, transformation, and success.
        </p>

        <p>
          Together, let’s shape the future of mobility, infrastructure, and
          industrial excellence!
        </p>

        <p>
          <strong>M.P. Rajesh Khanna</strong>
        </p>
        <p><strong>Managing Director</strong></p>
      </motion.div>
    </div>
  );
}

export default Message;
