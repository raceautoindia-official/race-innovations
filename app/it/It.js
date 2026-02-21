"use client";

import React from "react";
import { FaGlobe, FaUsers, FaBullhorn, FaDatabase } from "react-icons/fa";
import { FiDownload, FiFileText } from "react-icons/fi";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

function It() {
  const images = [
    "/images/react.png",
    "/images/next.png",
    "/images/ai.png",
    "/images/figma.png",
    "/images/pr.png",
    "/images/xd.png",
    "/images/wordpress.png",
    "/images/apple.png",
    "/images/android.png",
    "/images/au.png",
    "/images/laravel.png",
    "/images/ae.png",
    "/images/shopify.png",
    "/images/ps.png",
  ];

  const Rightimages = [
    "/images/node.png",
    "/images/spring.png",
    "/images/php.png",
    "/images/python.png",
    "/images/mysql.png",
    "/images/postgresql.png",
    "/images/mongo.png",
    "/images/oracle.png",
    "/images/aws.png",
    "/images/azure.png",
    "/images/google.png",
    "/images/github.png",
    "/images/ubuntu.png",
  ];

  const image = [
    "/images/gts.png",
    "/images/lightstorm.png",
    "/images/meridien.png",
    "/images/haptik.png",
    "/images/united.png",
    "/images/papaya.png",
    "/images/redhat.png",
    "/images/jio.png",
  ];

  
  const itPdfUrl = "/pdf/it-profile.pdf";

  return (
    <>
      <div className="container-fluid">
        <div className="row g-0 p-0 m-0" style={{ height: "100%" }}>
          {/* Video Column */}
          <div
            className="col-md-7 col-lg-7 col-12 p-0 position-relative"
            style={{ height: "100%" }}
          >
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
              <ReactPlayer
                url="https://youtu.be/dbbfw3Oz44M"
                playing
                muted
                controls
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Text Column */}
          <div
            className="col-md-5 col-lg-5 col-12 d-flex align-items-center position-relative"
            style={{
              backgroundImage: "url('/images/bg.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              padding: "25px",
              minHeight: "100%",
            }}
          >
            {/* Content */}
            <div
              className="d-flex flex-column align-items-end text-end w-100"
              style={{ paddingBottom: "110px" }}
            >
              <h3 className="text-white">CUSTOMIZED IT SOLUTIONS</h3>

              {[
                {
                  label: "Website, TTL & Mass Communication Solutions",
                  icon: <FaGlobe size={24} />,
                  id: "ttl",
                },
                {
                  label: "Customized CRM Solutions & App Development",
                  icon: <FaUsers size={23} />,
                  id: "crm",
                },
                {
                  label: "Digital Marketing & AI-Powered Lead Generation",
                  icon: <FaBullhorn size={23} />,
                  id: "digital",
                },
                {
                  label: "Data Mining & Business Intelligence Data Mining",
                  icon: <FaDatabase size={23} />,
                  id: "mining",
                },
              ].map((item, i) => (
                <p
                  key={i}
                  className="d-flex align-items-center justify-content-end text-white gap-3 mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    })
                  }
                >
                  <span style={{ minWidth: "30px", textAlign: "center" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </p>
              ))}
            </div>

            {/* ✅ White PDF Download button INSIDE bottom-right area */}
            <div
              style={{
                position: "absolute",
                left: "25px",
                right: "25px",
                bottom: "22px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <a
                href={itPdfUrl}
                download="/pdf/it-profile.pdf"
                className="text-decoration-none"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.9)",
                  background: "#ffffff",
                  color: "#0B1220",
                  fontWeight: 800,
                  letterSpacing: "0.2px",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(41,59,177,0.10)",
                    color: "#293BB1",
                  }}
                >
                  <FiFileText size={20} />
                </span>

                <span style={{ lineHeight: 1.1 }}>
                   IT Profile
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      opacity: 0.75,
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    PDF
                  </span>
                </span>

                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(41,59,177,0.10)",
                    color: "#293BB1",
                  }}
                >
                  <FiDownload size={18} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tools & Tech Section */}
      <div className="container mt-4 text-center">
        <h2
          className="ms-md-4"
          style={{ fontSize: "clamp(1rem, 5vw, 2.7rem)", whiteSpace: "nowrap" }}
        >
          <span style={{ color: "black" }}>Tools &</span>
          <span style={{ color: "#293BB1" }} className="ms-3">
            Technology
          </span>
        </h2>
      </div>

      <div className="scroll-container mt-4">
        <div className="scroll-content scroll-left">
          {images.concat(images).map((img, index) => (
            <img key={`left-${index}`} src={img} alt="Tech Logo" className="scroll-img" />
          ))}
        </div>
      </div>

      <div className="scroll-container">
        <div className="scroll-content scroll-right">
          {Rightimages.concat(Rightimages).map((img, index) => (
            <img key={`right-${index}`} src={img} alt="Tech Logo" className="scroll-img" />
          ))}
        </div>
      </div>

      {/* Infrastructure Section */}
      <div className="container mt-5 text-center">
        <h2
          className="ms-md-4"
          style={{ fontSize: "clamp(1rem, 5vw, 2.7rem)", whiteSpace: "nowrap" }}
        >
          <span style={{ color: "black" }}>Infrastructure &</span>
          <span style={{ color: "#293BB1" }} className="ms-3">
            Collaboration
          </span>
        </h2>
      </div>

      <div className="scroll-container">
        <div className="scroll-content scroll-left">
          {image.concat(image).map((img, index) => (
            <img key={`infra-${index}`} src={img} alt="Infra Logo" className="h-30 w-40" />
          ))}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .scroll-container {
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          width: 100%;
          background: white;
          padding: 10px 0;
          margin-bottom: 10px;
        }

        .scroll-content {
          display: flex;
          align-items: center;
          gap: 30px;
          width: fit-content;
        }

        .scroll-left {
          animation: scroll-left 10s linear infinite;
        }

        .scroll-right {
          animation: scroll-right 10s linear infinite;
        }

        .scroll-img {
          height: 50px;
          width: auto;
          object-fit: contain;
        }

        @keyframes scroll-left {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes scroll-right {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .scroll-content {
            gap: 15px;
          }
          .scroll-img {
            height: 40px;
          }
          .scroll-left {
            animation: scroll-left 7s linear infinite;
          }
          .scroll-right {
            animation: scroll-right 7s linear infinite;
          }
          .responsive-video {
            height: 300px !important;
          }
        }
      `}</style>
    </>
  );
}

export default It;
