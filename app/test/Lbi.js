"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

function Lbi() {
  const [visible, setVisible] = useState({
    container: false,
    text: false,
    button: false,
  });

  const refs = {
    container: useRef(null),
    text: useRef(null),
    button: useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.id;
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.entries(refs).forEach(([key, ref]) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(refs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
    <div
      ref={refs.container}
      data-id="container"
      className={`container-fluid fade-up ${visible.container ? "visible" : ""}`}
      style={{
        width: "100%",
        minHeight: "100vh",
        background: `url('/images/gg.webp') no-repeat center center`,
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px",
        borderRadius: "10px",
        alignItems: "center",
      }}
    >
      <div
        className={`d-flex justify-content-center fade-up ${
          visible.text ? "visible" : ""
        }`}
        ref={refs.text}
        data-id="text"
      >
        <div className="col-md-6 text-center">
          <h1 style={{ color: "#293BB1" }}>
            LBI-Route Survey For
            <br /> Over Dimensional Cargo (ODC)
          </h1>
          <p className="mt-3" style={{ color: "#555555" }}>
            Location Based Intelligence emphasizes facilitating hindrance-free
            movement of goods by conducting route surveys by a team of experts.
            The LBI team provides recommendations to help users move freely,
            using advanced technology to increase accuracy and reliability.
            RACE's engineering and civil teams execute surveys, assess road
            feasibility, and calculate logistics like bridge capacity and
            vehicle stability. RACE also supports industries and logistics firms
            with custom trailer design and safe, cost-effective cargo transport.
          </p>
        </div>
      </div>

      <div
        className={`fade-up ${visible.button ? "visible" : ""}`}
        ref={refs.button}
        data-id="button"
      >
        <Link
          href="/intellect/lbi"
          className="btn btn-outline-primary mt-3"
          style={{
            width: "198.79px",
            height: "45.72px",
            borderRadius: "19.88px",
            borderWidth: "0.99px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Learn More
        </Link>
      </div>

      <style jsx>{`
        .fade-up {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default Lbi;
