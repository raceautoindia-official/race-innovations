"use client";
import Image from "next/image";
import React from "react";

function Digital() {
  return (
    <div className="container-fluid mt-1" style={{ aspectRatio:2.96/1, position: "relative" }}>
      <Image
        src="/images/digi.webp"
        alt="Digital marketing and AI-powered lead generation: SEO, PPC and social media; AI-driven targeting with predictive analytics; automated lead nurturing with AI chatbots, email automation and conversion optimization"
        fill
        sizes="100vw"
        style={{ objectFit:"fill" }}
      />
    </div>
  );
}

export default Digital;
