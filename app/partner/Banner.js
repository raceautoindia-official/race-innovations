"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

function Banner() {
  const [productType, setProductType] = useState("");
  const [product, setProduct] = useState("");
  const router = useRouter();

  const productOptions = {
    individual: {
      "Personal Loan": "/loan",
      "Home Loan": "/loan",
      "Car Loan": "/loan",
      "Two Wheeler Loan": "/loan",
      "Education Loan": "/loan",
      "Gold Loan": "/loan",
      "Loans Against Securities": "/loan",
      "Loans Against Shares": "/loan",
      "Loans Against Mutual Funds": "/loan",
      "Loans Against Property": "/loan",
      "Agri & Rural Loans": "/loan",
      "Smart Loans": "/loan",
    },
    corporate: {
      "MSME Loan": "/corporate",
      "Bank Guarantee": "/corporate",
      "Bill Discounting": "/corporate",
      "Overdraft": "/corporate",
      "Loan Against property(LAP)": "/corporate",
      "Supply chain finance": "/corporate",
      "Solutions for Importer": "/corporate",
      "Solutions for Exporter": "/corporate",
    },
  };

  const handleApplyNow = () => {
    if (!productType || !product) {
      alert("Please select a product type and product before applying.");
      return;
    }

    const selectedProductLink = productOptions[productType][product];
    if (selectedProductLink) {
      router.push(selectedProductLink); 
    } else {
      alert("Application link not available for this product.");
    }
  };

  return (
    <div className="container pt-5" style={{ marginBottom: "100px" }}>
      <div className="row">
        {/* Swiper Section */}
        <div className="col-md-8">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay, FreeMode]}
            className="mySwiper mt-3"
          >
            {[
              { src: "/images/b-1.png", alt: "RACE Innovations financing solutions" },
              { src: "/images/b-2.png", alt: "Individual home loan funding" },
              { src: "/images/b-3.png", alt: "Corporate funding offerings" },
              { src: "/images/b-4.png", alt: "Individual home loan funding for families" },
              { src: "/images/b-5.png", alt: "Corporate funding offerings for businesses" },
            ].map((slide, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={slide.src}
                  width={800}
                  height={400}
                  style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover" }}
                  alt={slide.alt}
                  priority={index === 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Sidebar Section */}
        <div
          className="col-md-4 mt-3 p-4 d-flex flex-column align-items-center justify-content-between"
          style={{ backgroundColor: "#d8dbea", borderRadius: "15px", height: "64vh" }}
        >
          <Image src="/images/calendar.png" width={250} height={200} className="mt-3" style={{ width: "85%", height: "auto", objectFit: "contain" }} alt="" />
          {/* The page's H1, styled exactly like the previous h4. */}
          <h1 className="h4 text-center mt-3" style={{ color: "#4a78d4" }}>RACE Financing Solutions</h1>
          <div className="w-75">
            <select
              value={productType}
              onChange={(e) => {
                setProductType(e.target.value);
                setProduct("");
              }}
              className="form-select mt-3"
            >
              <option value="">Select Product Type</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
            </select>

            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="form-select mt-3"
              disabled={!productType}
            >
              <option value="">Select Product</option>
              {productType &&
                Object.keys(productOptions[productType]).map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
            </select>
          </div>
          <button
            className="btn mt-3"
            onClick={handleApplyNow}
            disabled={!product}
            style={{ borderRadius: "20px", border: "2px solid #4a78d4", color: "white", backgroundColor: "#4a78d4", padding: "12px 24px", fontSize: "1rem", fontWeight: "bold" }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
