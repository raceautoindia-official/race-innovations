"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Content() {
  const [hasAnimated, setHasAnimated] = useState(false);

  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }, // ✅ Faster timing
    },
  };

  return (
    <motion.div
      className="container"
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
      onViewportEnter={() => setHasAnimated(true)}
    >
      <div className="row">
        {/* Text Section */}
        <motion.div
          className="col-md-8"
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideFromBottom}
          transition={{ duration: 0.4 }}
        >
          {[
            `RACE associates have worked with various industries, supporting export, import, and business needs. Our expert advisors and consultants possess the knowledge to provide actionable steps to meet the challenges of expanding into new territories or operating across international borders.`,
            `Our advisers assist in strategic planning while helping you achieve your current goals. From management consulting to feasibility studies, and from technology consulting to mergers and acquisitions, we provide tailored solutions that align your people, processes, and products with your business objectives.`,
            `Businesses operating internationally often face complex legal and commercial challenges. Our experienced advisors offer expert guidance, ensuring compliance and mitigating risks. With extensive industry experience, RACE member firms provide customized advice aligned with your organization’s strategic vision.`,
            `Navigating legal issues across borders can be daunting. Our law firm members deliver efficient and seamless solutions, allowing you to focus on core business operations while we handle the legal complexities.`,
            `Having worked across diverse industries, our advisors understand unique business needs and serve as trusted partners. Whether it's employment law, international trade law, or corporate compliance, we provide expert legal counsel for smooth global operations.`,
            `Whatever support your business requires to thrive on the international stage, an RACE member firm is here to help. Our holistic approach ensures that your business remains competitive, compliant, and well-positioned for global success.`,
          ].map((text, index) => (
            <p key={index} style={{ textAlign: "justify" }}>{text}</p>
          ))}
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="col-md-4 d-flex justify-content-center align-items-center"
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideFromBottom}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Image
            src="/images/off.webp"
            width={600}
            height={400}
            className="img-fluid"
            style={{ objectFit: "contain" }}
            alt="Business Consultation"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Content;
