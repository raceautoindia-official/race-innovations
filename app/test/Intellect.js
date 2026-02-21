/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

function Intellect() {
  const [visible, setVisible] = useState({
    container: false,
    text: false,
    image: false,
  });

  const refs = {
    container: useRef(null),
    text: useRef(null),
    image: useRef(null),
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

    Object.values(refs).forEach((ref) => {
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
      className={`container-fluid fade-up ${visible.container ? 'visible' : ''}`}
      ref={refs.container}
      data-id="container"
    >
      <div className="row mt-1">
        {/* Left Text Column */}
        <div
          className={`col-md-6 col-12 fade-up ${visible.text ? 'visible' : ''}`}
          ref={refs.text}
          data-id="text"
        >
          <h1 className="mt-5" style={{ color: '#293BB1' }}>
            Intellect
          </h1>
          <h4 className="mt-3">RACE has a global presence</h4>
          <p className="mt-5">
            “Intellect” is one of the core solution offerings of RACE. Our strong
            network of market research and consulting team continuously tracks the
            Indian, global automotive market to provide clients with rich, extensive
            insights on market entry strategies, product launch, competitive strategy,
            mega trends, vehicle/component OEM strategies, regulatory/statutory
            tracking, customer behaviour analysis and manufacturing feasibility.
          </p>
          <button
            className="btn btn-outline-primary"
            style={{
              width: '198.79px',
              height: '45.72px',
              borderRadius: '19.88px',
              borderWidth: '0.99px',
            }}
          >
            Learn More
          </button>
        </div>

        {/* Right Image Column */}
        <div
          className={`col-md-5 col-12 fade-up ${visible.image ? 'visible' : ''}`}
          ref={refs.image}
          data-id="image"
        >
          <Image
            src="/images/g-1.webp"
            alt="A scenic landscape view"
            width={1000}
            height={800}
            className="mt-5"
            style={{ width: '100%', height: '80%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <style jsx>{`
        .fade-up {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default Intellect;
