"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";

function Certifications() {
  const images = [
    "/images/image-33.webp",
    "/images/image-35.webp",
    "/images/image-38.webp",
    "/images/image-39.webp",
    "/images/iso.webp",
    "/images/egac.webp",
    "/images/cmm.webp",
  ];

  return (
    <div className="container-fluid">
      <div className="row text-center">
        <h1>
          <span style={{ color: "black" }}>Our</span>{" "}
          <span style={{ color: "#293BB1" }}>Certifications</span>
        </h1>
        <p>
          Race Innovationss Pvt. Ltd is ISO27001, ISO9001, and CMMI Level 3
          Certified Company
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
            {images.map((src, index) => (
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
                    src={src}
                    alt={`Certification ${index + 1}`}
                    width={120}
                    height={120}
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
