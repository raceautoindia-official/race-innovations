"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const fastSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

function Serve() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { triggerOnce: true, threshold: 0.3 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <div className="container" ref={sectionRef}>
      <div className="row">
        {[{
          img: "/images/change-3.webp",
          title1: "Customer Needs &",
          title2: "Usage Insights",
          text: "Understand customer pain points, feature preferences, and use-case behavior to align your product with actual demand."
        },
        {
          img: "/images/change-4.webp",
          title1: "Technology",
          title2: "Adoption Analysis",
          text: "Assess readiness and relevance of emerging technologies like electric powertrains, ADAS, telematics, and automation in your product design."
        },
        {
          img: "/images/change-5.webp",
          title1: "Price–Value",
          title2: "Perception Mapping",
          text: "Evaluate how your product is perceived on pricing, utility, and brand promise against competitive offerings."
        }].map((item, index) => (
          <motion.div
            className="col-lg-4"
            key={index}
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            variants={fastSlideUp}
          >
            <Image
              src={item.img}
              alt={item.title2}
              width={800}
              height={400}
              className="img-fluid rounded shadow-sm mt-4"
              style={{ objectFit: "contain" }}
            />
            <motion.h6
              style={{
                fontSize: "clamp(1rem, 4vw, 1.2rem)",
                whiteSpace: "nowrap",
              }}
              className="mt-2"
            >
              <span style={{ color: "black" }}>{item.title1}</span>
              <span style={{ color: "#293BB1", marginLeft: "9px" }}>{item.title2}</span>
            </motion.h6>
            <p className="mt-2" style={{ textAlign: "justify" }}>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Serve;
