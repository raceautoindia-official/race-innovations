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

// The slide artwork is up to 6000px wide, and with sizes="100vw" Next.js
// would offer (and use as the fallback src) a 3840px variant. Nothing on
// screen needs more than 1920px, so cap every width we ask the optimizer for.
const HERO_MAX_WIDTH = 1920;
const heroLoader = ({ src, width, quality }) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${Math.min(
    width,
    HERO_MAX_WIDTH
  )}&q=${quality || 75}`;

export default function ResponsiveSwiper() {
  // Alt text repeats the words printed on each slide, since that text only
  // exists inside the image.
  const desktopImages = [
    {
      src: "/images/accounting-5.webp",
      alt: "Empowering your business: expert accounting and financial outsourcing for your business success",
    },
    {
      src: "/images/connect.webp",
      alt: "Seamless market entry: connecting global vision with India's opportunities",
    },
    {
      src: "/images/intellect.webp",
      alt: "Insightful research, reliable solutions: empowering decisions, driving growth and enabling business opportunities",
    },
    {
      src: "/images/survey.webp",
      alt: "Precision in every journey: expert route surveys and tailored solutions for seamless cargo transportation",
    },
    {
      src: "/images/ban-1.webp",
      alt: "Secure your business future: trusted corporate legal solutions for companies",
    },
    {
      src: "/images/technic 1.webp",
      alt: "Engineering excellence for every industry: innovating solutions, driving success",
    },
  ];

  const mobileImages = [
    { src: "/images/mo-1.webp", alt: "Seamless market entry" },
    { src: "/images/mo-2.webp", alt: "Insightful research, reliable solutions" },
    { src: "/images/mo-3.webp", alt: "Engineering excellence for every industry" },
    { src: "/images/mo-4.webp", alt: "Secure your business future" },

    { src: "/images/mo-6.webp", alt: "Precision in every journey: route surveys" },
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
      {/* Single SEO H1 for the homepage. Visually hidden so the slider
          design is unchanged, but read by search engines and screen readers. */}
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        RACE Innovations: Automotive Market Intelligence and ODC Route Surveys
      </h1>

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
                loader={heroLoader}
                src={img.src}
                alt={img.alt}
                width={isMobile ? 365 : 1920}
                height={isMobile ? 680 : 644}
                quality={60}
                // Only the first slide is visible on load; the rest lazy-load.
                priority={index === 0}
                // Desktop slides are full width; mobile slides are a fixed
                // 365px card.
                sizes={isMobile ? "365px" : "100vw"}
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