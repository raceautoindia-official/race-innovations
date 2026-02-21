"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

function Legal() {
  return (
    <div className="container-fluid d-md-block">
      {/* Desktop View */}
      <div className="container-fluid desktop-view">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-12 col-lg-4 text-center text-md-start legal-content">
            <h1 style={{ color: "#293BB1" }} className="mt-3">Legal</h1>
            <p className="mt-3">
              Most of the businesses face many complex legal and commercial pressures...
            </p>
            <Link href="/accounting-and-legal" passHref legacyBehavior>
              <a className="btn btn-outline-primary"
                style={{
                  width: "198.79px",
                  height: "45.72px",
                  borderRadius: "19.88px",
                  borderWidth: "0.99px",
                }}
              >
                Learn More
              </a>
            </Link>

            <h1 style={{ color: "#293BB1" }} className="mt-4">Accounting</h1>
            <p className="mt-3">
              Global business comes with complex legal and commercial challenges...
            </p>
            <Link href="/accounting-and-legal" passHref legacyBehavior>
              <a className="btn btn-outline-primary mt-3"
                style={{
                  width: "198.79px",
                  height: "45.72px",
                  borderRadius: "19.88px",
                  borderWidth: "0.99px",
                }}
              >
                Learn More
              </a>
            </Link>
          </div>

          {/* First Image */}
          <div className="col-sm-12 col-md-12 col-lg-4 mt-3">
            <div className="image-wrapper">
              <Image
                src="/images/accouting-1.webp"
                alt="Accounting"
                width={800}
                height={500}
                className="img-fluid img-responsive"
              />
            </div>
          </div>

          {/* Second Image */}
          <div className="col-sm-12 col-md-12 col-lg-4 mt-3" style={{ marginTop: "10rem" }}>
            <div className="image-wrapper">
              <Image
                src="/images/al.webp"
                alt="Artificial Intelligence"
                width={800}
                height={600}
                className="img-fluid img-responsive"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="container-fluid mobile-view">
        <div className="row justify-content-center">
          <div className="col-12 text-center text-md-start legal-content">
            <h1 style={{ color: "#293BB1" }} className="mt-3">Legal</h1>
            <p className="mt-3">
              Most of the businesses face many complex legal and commercial pressures...
            </p>
            <Link href="/accounting-and-legal" passHref legacyBehavior>
              <a className="btn btn-outline-primary"
                style={{
                  width: "198.79px",
                  height: "45.72px",
                  borderRadius: "19.88px",
                  borderWidth: "0.99px",
                }}
              >
                Learn More
              </a>
            </Link>

            <div className="image-wrapper mt-3">
              <Image
                src="/images/accouting-1.webp"
                width={800}
                height={500}
                alt="Accounting"
                className="img-fluid img-responsive"
              />
            </div>

            <h1 style={{ color: "#293BB1" }} className="mt-4">Accounting</h1>
            <p className="mt-3">
              Global business comes with complex legal and commercial challenges...
            </p>
            <Link href="/accounting-and-legal" passHref legacyBehavior>
              <a className="btn btn-outline-primary mt-3"
                style={{
                  width: "198.79px",
                  height: "45.72px",
                  borderRadius: "19.88px",
                  borderWidth: "0.99px",
                }}
              >
                Learn More
              </a>
            </Link>

            <div className="image-wrapper mt-5">
              <Image
                src="/images/al.webp"
                alt="AI Concept"
                width={800}
                height={600}
                className="img-fluid img-responsive"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .image-wrapper {
          width: 100%;
          height: auto;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .img-responsive {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .image-wrapper {
            height: 150px;
          }
          .image-wrapper img {
            height: 150px;
          }
        }

        @media only screen and (max-width: 570px) {
          .desktop-view {
            display: none;
          }
        }

        @media only screen and (min-width: 571px) {
          .mobile-view {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Legal;
