"use client";
import Image from "next/image";
import React from "react";

function Digital() {
  return (
    <div className="container-fluid mt-1" style={{ aspectRatio:2.96/1, position: "relative" }}>
      <Image
        src="/images/transport-eng.png"
        alt="Digital Banner"
        fill
        style={{ objectFit:"cover" }}
      />
    </div>
  );
}

export default Digital;
