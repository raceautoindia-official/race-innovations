"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle,
  FileText
} from "lucide-react";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Gem() {
  const [openItem, setOpenItem] = useState("collapseOne");

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
        <span style={{ color: "black" }}>GEM</span>
        <span style={{ color: "#293BB1", marginLeft: "15px" }}>Model</span>
      </motion.h1>

      <motion.div
        className="container mt-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <p>
          In today’s competitive landscape, automotive and transportation companies must
          transform operations through smarter technology adoption, cost optimization, and
          strategic innovation. RACE delivers cutting-edge business intelligence, automotive
          consulting, and transportation solutions to drive sustainable growth. Powered by our
          GEM philosophy, we ensure smarter decision-making, effective execution, and continuous
          value creation for our clients.
        </p>
      </motion.div>

      <motion.div
        className="container mt-1"
        style={{ marginBottom: "100px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariants}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="accordion" id="myAccordion">
          {[
            {
              id: "collapseOne",
              title: "Generate",
              style: { fontSize: "45px" },
              icon: <Briefcase />,
              content: (
                <>
                  <p style={{ fontSize: "15px" }}>
                    RACE team is driven by consultants, design engineers, and managers with
                    extensive experience in the automotive & transportation industry. Our
                    experts capture futuristic market trends by deeply understanding the industry
                    through collaborative involvement.
                  </p>
                  <p style={{ fontSize: "15px" }}>
                    Our industry-specific knowledge enables us to build winning business
                    strategies and deliver tailored automotive applications to OEMs, component
                    manufacturers, fleet operators, and regulatory bodies.
                  </p>
                </>
              ),
            },
            {
              id: "collapseTwo",
              title: "Execute",
              style: { fontSize: "45px" },
              icon: <CheckCircle />,
              content: (
                <>
                  <p style={{ fontSize: "15px" }}>
                    RACE’s extensive project management and technical expertise enable us to
                    execute complex automotive & transportation projects successfully.
                  </p>
                  <p style={{ fontSize: "15px" }}>
                    Our execution strategy ensures effective planning, proactive issue resolution,
                    and seamless project delivery.
                  </p>
                  <ul
                    style={{
                      fontSize: "15px",
                      listStyle: "none",
                      paddingLeft: 0,
                    }}
                  >
                    <li>
                      <strong>📌 Project Scoping:</strong> Defines project scope and feasibility.
                    </li>
                    <li>
                      <strong>💰 Cost Control:</strong> Optimized financial analysis.
                    </li>
                    <li>
                      <strong>📄 Business Case:</strong> Validates investments and ROI.
                    </li>
                    <li>
                      <strong>🔍 Vendor Evaluation:</strong> Uses a robust supplier assessment system.
                    </li>
                    <li>
                      <strong>🛡 Risk Management:</strong> Ensures compliance and mitigation.
                    </li>
                    <li>
                      <strong>🤝 Post-Project Support:</strong> Seamless transition and support.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              id: "collapseThree",
              title: "Measure",
              style: { fontSize: "45px" },
              icon: <FileText />,
              content: (
                <>
                  <p style={{ fontSize: "15px" }}>
                    RACE's innovative delivery model helps clients leverage our resources,
                    expertise, and technology globally.
                  </p>
                  <p style={{ fontSize: "15px" }}>
                    Our value-driven approach ensures clear ROI, real-time monitoring, and
                    measurable business outcomes.
                  </p>
                </>
              ),
            },
          ].map((item) => (
            <div className="accordion-item" key={item.id}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button custom-accordion-button ${
                    openItem === item.id ? "" : "collapsed"
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${item.id}`}
                  aria-expanded={openItem === item.id ? "true" : "false"}
                  aria-controls={item.id}
                  onClick={() => setOpenItem(openItem === item.id ? "" : item.id)}
                >
                  <span className="title-container">
                    {item.title} <span className="icon">{openItem === item.id ? "−" : "+"}</span>
                  </span>
                </button>
              </h2>
              <div
                id={item.id}
                className={`accordion-collapse collapse ${openItem === item.id ? "show" : ""}`}
                data-bs-parent="#myAccordion"
              >
                <div className="accordion-body">{item.content}</div>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .custom-accordion-button {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            display: flex;
            align-items: center;
            font-weight: bold;
            padding: 10px 15px;
          }

          .custom-accordion-button:focus {
            box-shadow: none;
          }

          .title-container {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .icon {
            font-size: 1.2rem;
            font-weight: bold;
          }

          .custom-accordion-button::after {
            display: none !important;
          }

          .custom-accordion-button span {
            font-size: 25px !important;
          }
        `}</style>
      </motion.div>
    </>
  );
}

export default Gem;
