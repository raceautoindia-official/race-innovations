"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const CERTIFICATION_IMAGES = [
  { src: "/images/image-33.webp", label: "Certification 1" },
  { src: "/images/image-35.webp", label: "Certification 2" },
  { src: "/images/image-38.webp", label: "Certification 3" },
  { src: "/images/image-39.webp", label: "Certification 4" },
  { src: "/images/iso.webp", label: "ISO" },
  { src: "/images/egac.webp", label: "EGAC" },
  { src: "/images/cmm.webp", label: "CMMI" },
];

export default function ReportsCertifications() {
  return (
    <section
      style={{
        position: "relative",
        paddingTop: "56px",
        paddingBottom: "64px",
        background:
          "radial-gradient(circle at 12% 0%, rgba(47,69,191,0.06), transparent 40%), linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%)",
        borderTop: "1px solid #e8edf8",
      }}
    >
      <div className="container-fluid px-4 px-md-5 px-lg-5">
        <div className="row justify-content-center text-center mb-4">
          <div className="col-12 col-xl-9">
            <span
              className="d-inline-block px-3 py-1 mb-3 rounded-pill"
              style={{
                border: "1px solid rgba(47, 69, 191, 0.18)",
                color: "#2f45bf",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "1.6px",
                backgroundColor: "#eef2ff",
              }}
            >
              TRUSTED &amp; CERTIFIED
            </span>

            <h2
              className="fw-bold mb-2"
              style={{
                color: "#0b1220",
                fontSize: "clamp(1.7rem, 2.6vw, 2.5rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
              }}
            >
              Globally Recognized{" "}
              <span style={{ color: "#2f45bf" }}>Certifications</span>
            </h2>

            <p
              style={{
                maxWidth: "720px",
                margin: "0 auto",
                color: "#5f6b85",
                fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
                lineHeight: 1.65,
                fontWeight: 500,
              }}
            >
              RACE Innovations Pvt. Ltd is ISO 27001, ISO 9001, and CMMI Level 3
              certified — backing every report with audited research processes
              and global compliance standards.
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12">
            <div
              style={{
                position: "relative",
                padding: "10px 4px",
              }}
            >
              <Swiper
                spaceBetween={24}
                loop
                speed={700}
                autoplay={{
                  delay: 1600,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                modules={[Autoplay]}
                breakpoints={{
                  320: { slidesPerView: 2, spaceBetween: 12 },
                  576: { slidesPerView: 3, spaceBetween: 16 },
                  768: { slidesPerView: 4, spaceBetween: 20 },
                  992: { slidesPerView: 5, spaceBetween: 24 },
                  1200: { slidesPerView: 6, spaceBetween: 28 },
                }}
              >
                {CERTIFICATION_IMAGES.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    className="d-flex justify-content-center"
                  >
                    <div className="reports-cert-card">
                      <Image
                        src={item.src}
                        alt={item.label}
                        width={140}
                        height={100}
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
      </div>

      <style>{`
        .reports-cert-card {
          width: 100%;
          max-width: 170px;
          height: 110px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border: 1px solid #e5ebf7;
          border-radius: 16px;
          box-shadow: 0 8px 22px rgba(20, 30, 70, 0.05);
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease;
        }
        .reports-cert-card:hover {
          transform: translateY(-3px);
          border-color: rgba(47, 69, 191, 0.28);
          box-shadow: 0 16px 32px rgba(47, 69, 191, 0.12);
        }
      `}</style>
    </section>
  );
}
