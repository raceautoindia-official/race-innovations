"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  FreeMode,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ResponsiveSwiper() {
  const desktopImages = [
    { src: "/images/accounting-5.webp", alt: "Accounting and finance team analyzing reports" },
    { src: "/images/connect.webp", alt: "Business professionals connecting and networking" },
    { src: "/images/intellect.webp", alt: "Artificial intelligence and machine learning concept" },
    { src: "/images/survey.webp", alt: "Surveyor using equipment for land measurement" },
    { src: "/images/ban-1.webp", alt: "Legal and law professionals discussing case files" },
    { src: "/images/technic 1.webp", alt: "Technician working on advanced technical solutions" },
  ];

  const mobileImages = [
    { src: "/images/mo-1.webp", alt: "Accounting mobile" },
    { src: "/images/mo-2.webp", alt: "Connect mobile" },
    { src: "/images/mo-3.webp", alt: "Intellect mobile" },
    { src: "/images/mo-4.webp", alt: "Survey mobile" },

    { src: "/images/mo-6.webp", alt: "Technic mobile" },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedImages = isMobile ? mobileImages : desktopImages;

  return (
    <div className="flex justify-center items-center min-h-screen mb-5">
      <Swiper
        speed={1200}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        modules={[Navigation, Pagination, Autoplay, FreeMode]}
        className="mySwiper"
      >
        {selectedImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className={`relative mx-auto overflow-hidden rounded-md ${isMobile ? "mobile-container" : ""
                }`}
              style={{
                width: isMobile ? "365px" : "100%",
                height: isMobile ? "680px" : "auto",
                aspectRatio: isMobile ? undefined : "2.98/1",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={isMobile ? 365 : 1920}
                height={isMobile ? 680 : 644}
                quality={60}
                priority={index === 0}
                sizes={isMobile ? "365px" : "(min-width: 768px) 100vw"}
                style={{
                  objectFit: "cover",
                  borderRadius: "8px",
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
                className={isMobile ? "mobile-image" : ""}
              />


            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .mobile-container {
          background-color: #000; /* Add a background for blend mode effect */
        }
        
        .mobile-image {
          animation: flipInY 1s ease forwards;
          opacity: 0;
          transform: perspective(800px) rotateY(90deg);
          mix-blend-mode: overlay;
          transition: mix-blend-mode 0.5s ease, opacity 0.5s ease;
        }

        .mobile-image:hover {
          mix-blend-mode: screen;
          opacity: 0.9;
        }

        @keyframes flipInY {
          0% {
            opacity: 0;
            transform: perspective(800px) rotateY(90deg);
          }
          50% {
            opacity: 0.5;
            transform: perspective(800px) rotateY(-10deg);
          }
          100% {
            opacity: 1;
            transform: perspective(800px) rotateY(0deg);
          }
        }
      `}</style>
    </div>
  );
}