"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function Legal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className="container-fluid d-md-block"
    >
      {/* Desktop View */}
      <div className="container-fluid desktop-view">
        <div className="row justify-content-center">
          <motion.div
            className="col-sm-12 col-md-12 col-lg-4 text-center text-md-start legal-content"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h1 style={{ color: "#293BB1" }} className="mt-3">Legal</h1>
            <p className="mt-3">
              Most of the businesses face many complex legal and commercial pressures...
            </p>
            <motion.button
              className="btn btn-outline-primary"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
              style={{
                width: "198.79px",
                height: "45.72px",
                borderRadius: "19.88px",
                borderWidth: "0.99px",
              }}
            >
              <Link href="/accounting-and-legal" style={{ textDecoration: "none", color: "inherit" }}>
                Learn More
              </Link>
            </motion.button>

            <motion.h1
              style={{ color: "#293BB1" }}
              className="mt-4"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Accounting
            </motion.h1>
            <p className="mt-3">
              Global business comes with complex legal and commercial challenges...
            </p>
            <motion.button
              className="btn btn-outline-primary mt-3"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              viewport={{ once: true }}
              style={{
                width: "198.79px",
                height: "45.72px",
                borderRadius: "19.88px",
                borderWidth: "0.99px",
              }}
            >
              <Link href="/accounting-and-legal" style={{ textDecoration: "none", color: "inherit" }}>
                Learn More
              </Link>
            </motion.button>
          </motion.div>

          {/* First Image */}
          <motion.div
            className="col-sm-12 col-md-12 col-lg-4 mt-3"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="image-wrapper">
              <Image
                src="/images/accouting-1.webp"
                alt="Accounting"
                width={800}
                height={500}
                className="img-fluid img-responsive"
              />
            </div>
          </motion.div>

          {/* Second Image */}
          <motion.div
            className="col-sm-12 col-md-12 col-lg-4 mt-3"
            style={{ marginTop: "10rem" }}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="image-wrapper">
              <Image
                src="/images/al.webp"
                alt="Artificial Intelligence"
                width={800}
                height={600}
                className="img-fluid img-responsive"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="container-fluid mobile-view">
        <div className="row justify-content-center">
          <motion.div
            className="col-12 text-center text-md-start legal-content"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h1 style={{ color: "#293BB1" }} className="mt-3">Legal</h1>
            <p className="mt-3">Most of the businesses face many complex legal and commercial pressures...</p>
            <motion.button
              className="btn btn-outline-primary"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
              style={{
                width: "198.79px",
                height: "45.72px",
                borderRadius: "19.88px",
                borderWidth: "0.99px",
              }}
            >
              <Link href="/accounting-and-legal" style={{ textDecoration: "none", color: "inherit" }}>
                Learn More
              </Link>
            </motion.button>

            <div className="image-wrapper mt-3">
              <Image
                src="/images/accouting-1.webp"
                width={800}
                height={500}
                alt="Accounting"
                className="img-fluid img-responsive"
              />
            </div>

            <motion.h1
              style={{ color: "#293BB1" }}
              className="mt-4"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Accounting
            </motion.h1>
            <p className="mt-3">Global business comes with complex legal and commercial challenges...</p>
            <motion.button
              className="btn btn-outline-primary mt-3"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              viewport={{ once: true }}
              style={{
                width: "198.79px",
                height: "45.72px",
                borderRadius: "19.88px",
                borderWidth: "0.99px",
              }}
            >
              <Link href="/accounting-and-legal" style={{ textDecoration: "none", color: "inherit" }}>
                Learn More
              </Link>
            </motion.button>

            <motion.div
              className="image-wrapper mt-5"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/al.webp"
                alt="AI Concept"
                width={800}
                height={600}
                className="img-fluid img-responsive"
              />
            </motion.div>
          </motion.div>
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
    </motion.div>
  );
}

export default Legal;
