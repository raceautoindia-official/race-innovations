"use client";

import React from "react";

function Cisme() {
  return (
    <div className="container-fluid pt-4" style={{ backgroundColor: "#EEEEF2" }}>
      <div className="text-center">
        <video
          controls
          autoPlay
          loop
          muted
          style={{
            width: "100%",
            maxWidth: "100%",
            borderRadius: "10px",
          }}
        >
          <source src="/images/cisme.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default Cisme;
