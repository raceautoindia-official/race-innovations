"use client";

import React from "react";
import { FaGlobe, FaUsers, FaBullhorn, FaDatabase } from "react-icons/fa";

function It() {
  return (
    <>
      <div className="container-fluid">
        <div className="row g-0 p-0 m-0 align-items-stretch" style={{ minHeight: "401px" }}>
          {/* Left Column (Video) */}
          <div className="col-md-7 col-lg-7 col-12 d-flex align-items-stretch">
            <video
              src="/images/vi.mp4"
              controls
              autoPlay
              muted
              loop
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Right Column (Text on Background) */}
          <div
            className="col-md-5 col-lg-5 col-12 d-flex align-items-center"
            style={{
              backgroundImage: "url('/images/bg.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              padding: "25px",
            }}
          >
            <div className="d-flex flex-column text-start w-100">
              <h3 className="text-white">CUSTOMIZED TRANSPORT SERVICES</h3>

              {[
                { label: "Transport Engineering ", icon: <FaGlobe size={24} />, id: "ttl" },
                { label: " Transport Transportation", icon: <FaUsers size={23} />, id: "crm" },
                { label: "Transport Logistics Consultancy", icon: <FaBullhorn size={23} />, id: "digital" },
                { label: "Equipment Rentals", icon: <FaDatabase size={23} />, id: "mining" },
              ].map((item, i) => (
                <p
                  key={i}
                  className="d-flex align-items-center justify-content-start text-white gap-3 mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                >
                  <span style={{ minWidth: "30px", textAlign: "center" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </p>
              ))}

              {/* Button with Hover Animation */}
              <a
                href="https://odcfreightrates.raceinnovations.in"
                className="btn btn-warning mt-2 fw-semibold hover-btn"
                aria-label="Get your estimate for ODC dimensional large transport"
              >
                Get your estimate for ODC dimensional large transport
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .hover-btn {
          align-self: flex-start;
          border-radius: 999px;
          padding-inline: 16px;
          transition: all 0.3s ease-in-out;
        }

        .hover-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }

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
