"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

const ClientSection = () => {
  const images = [
    "/images/tata.webp",
    "/images/image 53.webp",
    "/images/image 47.webp",
    "/images/image 49.webp",
    "/images/image 43.webp",
    "/images/rsb.webp",
    "/images/pentar.webp",
    "/images/jsw-logo.webp",
    "/images/renew-bg.webp",
    "/images/eil.webp",
    "/images/lo.webp",
    "/images/road.webp",
    "/images/asho.webp",
    "/images/db.webp",
    "/images/so.webp",
    "/images/yusen.webp",
    "/images/mahi.webp",
    "/images/frost.webp",
    "/images/bc.webp",
    "/images/toshiba.webp",
    "/images/t.webp",
    "/images/image 45.webp",
    "/images/bus.webp",
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
          {images.map((src, index) => (
            <SwiperSlide key={index} className="text-center">
              <Image
                src={src}
                width={220}
                height={190}
                alt={`Partner ${index + 1}`}
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
      <h1 className="text-center mt-4 mb-3">
        <span style={{ color: "black" }}>Our</span>{" "}
        <span style={{ color: "#293BB1" }}>Clients</span>
      </h1>
      <ClientSection />
    </div>
  );
}

export default Client;
