'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

function Connect() {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const [visible, setVisible] = useState({ image: false, text: false });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [entry.target.dataset.id]: true,
            }));
          }
        });
      },
      { threshold: 0.3 }
    );

    if (imageRef.current) observer.observe(imageRef.current);
    if (textRef.current) observer.observe(textRef.current);

    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
      if (textRef.current) observer.unobserve(textRef.current);
    };
  }, []);

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Image Section */}
        <div
          className={`col-md-6 col-12 text-center text-md-start transition-element ${
            visible.image ? 'visible' : ''
          }`}
          ref={imageRef}
          data-id="image"
        >
          <Image
            src="/images/world.webp"
            alt="Globe showing world map"
            width={800}
            height={600}
            className="img-fluid rounded shadow-sm"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Text Section */}
        <div
          className={`col-md-6 col-12 mt-4 mt-md-0 text-center text-md-start transition-element ${
            visible.text ? 'visible' : ''
          }`}
          ref={textRef}
          data-id="text"
        >
          <h1 className="text-primary fw-bold">Connect</h1>
          <h4 className="mt-2 fw-semibold">RACE has a global presence</h4>
          <p className="mt-3">
            RACE Application Engineering capability helps companies develop the
            right product for Indian application requirements.
          </p>
          <button className="btn btn-outline-primary rounded-pill px-4 py-2">
            Learn More
          </button>
        </div>
      </div>

      <style jsx>{`
        .transition-element {
          opacity: 0;
          transform: translateY(100px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .transition-element.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default Connect;
