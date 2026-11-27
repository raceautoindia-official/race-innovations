"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
// Bootstrap CSS comes from the global import in app/layout.js.

function Certifications() {
  // Names are taken from the badge artwork.
  const images = [
    { src: "/images/image-33.webp", alt: "Scotland Accredited Services Limited accredited management system certification" },
    { src: "/images/image-35.webp", alt: "ISO 27001:2022 certified" },
    { src: "/images/image-38.webp", alt: "MMS certification body logo" },
    { src: "/images/image-39.webp", alt: "IAF (International Accreditation Forum) Multilateral Recognition Arrangement member mark" },
    { src: "/images/iso.webp", alt: "ISO 9001:2015 certified" },
    { src: "/images/egac.webp", alt: "EGAC (Egyptian Accreditation Council) accredited" },
    { src: "/images/cmm.webp", alt: "CMMI Level 3" },
  ];

  return (
    <div className="container-fluid">
      <div className="row text-center">
        <h2>
          <span style={{ color: "black" }}>Our</span>{" "}
          <span style={{ color: "#293BB1" }}>Certifications</span>
        </h2>
        <p>
          RACE Innovations Pvt. Ltd. is an ISO 27001, ISO 9001 and CMMI Level 3
          certified company.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12">
          <Swiper
            spaceBetween={20}
            loop={true}
            speed={600} // Faster slide transition
            autoplay={{
              delay: 1000, // Faster switch between slides
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              576: { slidesPerView: 3, spaceBetween: 15 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              992: { slidesPerView: 5, spaceBetween: 30 },
            }}
          >
            {images.map((badge, index) => (
              <SwiperSlide key={index} className="d-flex justify-content-center">
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={120}
                    height={120}
                    loading="lazy"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default Certifications;
