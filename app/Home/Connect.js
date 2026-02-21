"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";

function Connect() {
  const { scrollY } = useScroll();

  // Faster spring for quicker response
  const smoothScroll = useSpring(scrollY, { damping: 8, stiffness: 600 });

  // Reduce scroll range for faster trigger
  const imageOpacity = useTransform(smoothScroll, [0, 300], [0, 1]);
  const imageTranslateY = useTransform(smoothScroll, [0, 300], [100, 0]);

  const textOpacity = useTransform(smoothScroll, [0, 300], [0, 1]);
  const textTranslateY = useTransform(smoothScroll, [0, 300], [100, 0]);

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Image Section */}
        <motion.div
          className="col-md-6 col-12 text-center text-md-start"
          style={{
            opacity: imageOpacity,
            transform: imageTranslateY.to((y) => `translateY(${y}px)`),
          }}
        >
          <Image
            src="/images/world.webp"
            alt="Globe showing world map"
            width={800}
            height={600}
            className="img-fluid rounded shadow-sm"
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="col-md-6 col-12 mt-4 mt-md-0 text-center text-md-start"
          style={{
            opacity: textOpacity,
            transform: textTranslateY.to((y) => `translateY(${y}px)`),
          }}
        >
          <h1 className="text-primary fw-bold">Connect</h1>
          <h4 className="mt-2 fw-semibold">RACE has a global presence</h4>
          <p className="mt-3">
            RACE Application Engineering capability helps companies develop the
            right product for Indian application requirements.
          </p>
          <button className="btn btn-outline-primary rounded-pill px-4 py-2">
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Connect;
