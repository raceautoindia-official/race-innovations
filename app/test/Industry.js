'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import Link from 'next/link';

function Industry() {
  const [isMounted, setIsMounted] = useState(false);
  const [visible, setVisible] = useState({
    container: false,
    video: false,
    heading: false,
    text: false,
    button: false,
  });

  const refs = {
    container: useRef(null),
    video: useRef(null),
    heading: useRef(null),
    text: useRef(null),
    button: useRef(null),
  };

  useEffect(() => {
    setIsMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.id;
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
      className={`container-fluid fade-up ${visible.container ? 'visible' : ''}`}
      ref={refs.container}
      data-id="container"
    >
      <div className="row align-items-center">
        {/* Video Section */}
        <div className="col-12 col-md-6">
          <div className="ratio ratio-16x9">
            <div
              className={`w-100 d-flex justify-content-center fade-up ${
                visible.video ? 'visible' : ''
              }`}
              ref={refs.video}
              data-id="video"
            >
              {isMounted && (
                <ReactPlayer
                  url="https://youtu.be/Zz2KlzvTqFY"
                  controls
                  playing
                  muted
                  width="100%"
                  height="auto"
                />
              )}
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="col-12 col-md-6 text-center text-md-start">
          <h1
            className={`d-flex justify-content-center justify-content-md-start fade-up ${
              visible.heading ? 'visible' : ''
            }`}
            ref={refs.heading}
            data-id="heading"
          >
            <span className="me-2" style={{ color: 'black' }}>Our</span>
            <span style={{ color: '#293BB1' }}>Industry</span>
          </h1>

          <p
            className={`mt-1 px-3 px-md-5 text-start fade-up ${
              visible.text ? 'visible' : ''
            }`}
            ref={refs.text}
            data-id="text"
          >
            RACE has a global presence, spanning Europe, East, West, and North Africa, North and Latin America, Korea, China, the UK, as well as other Asian and SAARC nations, with its headquarters in India. Our international reach, application-focused approach, and deep expertise in the automotive, farm equipment and implements, construction, and mining sectors make us the ideal local partner for OEMs, vehicle aggregate manufacturers, fleet operators, and logistics service providers.
          </p>

          <div
            className={`fade-up ${visible.button ? 'visible' : ''}`}
            ref={refs.button}
            data-id="button"
          >
            <Link href="/about-us/vision-mission" passHref>
              <button
                className="btn mt-2"
                style={{
                  width: '198.79px',
                  height: '45.72px',
                  backgroundColor: '#A497971F',
                  borderRadius: '19.88px',
                  border: '0.99px solid #A497971F',
                  transform: 'rotate(0.79deg)',
                }}
              >
                GET STARTED <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-up {
          opacity: 0;
          transform: translateY(100px);
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

export default Industry;
