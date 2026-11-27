"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function Cisme() {
  const videoRef = useRef(null);

  // The video used to carry the autoPlay attribute, which makes the browser
  // download the whole ~5 MB file as soon as the homepage loads, even though
  // it sits far below the fold. It still plays by itself (muted, looping),
  // but only once it is about to scroll into view.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const play = () => {
      video.muted = true;
      const result = video.play();
      if (result && typeof result.catch === "function") result.catch(() => {});
    };

    if (typeof IntersectionObserver === "undefined") {
      play();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container-fluid pt-4" style={{ backgroundColor: "#EEEEF2" }}>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* preload="metadata": there is no poster frame for this video in
            public/images, so only the size/duration is fetched up front.
            aspectRatio matches the 1920x1080 file so nothing shifts. */}
        <video
          ref={videoRef}
          controls
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="RACE Innovations company video"
          style={{
            width: "100%",
            maxWidth: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "10px",
          }}
        >
          <source src="/images/cisme.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </div>
  );
}

export default Cisme;
