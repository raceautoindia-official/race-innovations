"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

const ClientSection = () => {
  // Client names are taken from the logo artwork.
  const images = [
    { src: "/images/tata.webp", alt: "Tata Steel logo" },
    { src: "/images/image 53.webp", alt: "Gamesa logo" },
    { src: "/images/image 47.webp", alt: "Schmitz Cargobull logo" },
    { src: "/images/image 49.webp", alt: "Parveen Travels logo" },
    { src: "/images/image 43.webp", alt: "Vedanta logo" },
    { src: "/images/rsb.webp", alt: "RSB logo" },
    { src: "/images/pentar.webp", alt: "Pentar Kloft Retarder logo" },
    { src: "/images/jsw-logo.webp", alt: "JSW Steel logo" },
    { src: "/images/renew-bg.webp", alt: "ReNew Power logo" },
    { src: "/images/eil.webp", alt: "Engineers India Limited (EIL) logo" },
    { src: "/images/lo.webp", alt: "VE Commercial Vehicles logo" },
    { src: "/images/road.webp", alt: "Premier Roadlines logo" },
    { src: "/images/asho.webp", alt: "Ashok Leyland logo" },
    { src: "/images/db.webp", alt: "DB Schenker logo" },
    { src: "/images/so.webp", alt: "Allison Transmission logo" },
    { src: "/images/yusen.webp", alt: "Yusen Logistics logo" },
    { src: "/images/mahi.webp", alt: "Mahindra logo" },
    { src: "/images/frost.webp", alt: "Frost & Sullivan logo" },
    { src: "/images/bc.webp", alt: "Boston Consulting Group (BCG) logo" },
    { src: "/images/toshiba.webp", alt: "Toshiba logo" },
    { src: "/images/t.webp", alt: "NTC Group logo" },
    { src: "/images/image 45.webp", alt: "Telma logo" },
    { src: "/images/bus.webp", alt: "MG Bus & Coach logo" },
  ];

  return (
    <div className="container-fluid">
      <div className="partner-ship py-4">
        <Swiper
          spaceBetween={20}
          loop={true}
          speed={800} // Optional: increase speed of each transition
          autoplay={{
            delay: 1000, // Faster transition (was 2000ms)
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            576: { slidesPerView: 2, slidesPerGroup: 1 },
            768: { slidesPerView: 3, slidesPerGroup: 1 },
            992: { slidesPerView: 5, slidesPerGroup: 1 },
          }}
        >
          {images.map((logo, index) => (
            <SwiperSlide key={index} className="text-center">
              {/* Fixed 220px logo: without a sizes prop Next.js offers just a
                  1x (256px) and 2x (640px) file, and next/image lazy-loads it. */}
              <Image
                src={logo.src}
                width={220}
                height={190}
                loading="lazy"
                alt={logo.alt}
                style={{
                  borderRadius: "20px",
                  objectFit: "contain",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

function Client() {
  return (
    <div>
      <h2 className="text-center mt-4 mb-3">
        <span style={{ color: "black" }}>Our</span>{" "}
        <span style={{ color: "#293BB1" }}>Clients</span>
      </h2>
      <ClientSection />
    </div>
  );
}

export default Client;
