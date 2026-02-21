'use client';

import React, { useRef, useEffect, useState } from 'react';

function Connected() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div
          ref={containerRef}
          className={`col-md-10 col-12 p-4 fade-up ${visible ? 'visible' : ''}`}
          style={{
            backgroundColor: '#f2f2f2',
            borderRadius: '30px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="row">
            {/* Form Column */}
            <div className="col-md-6 col-12 p-3">
              <h1 className="text-md-start text-center" style={{ color: '#3848b7' }}>
                Stay Connected..!
              </h1>
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ border: '1px solid black', borderRadius: '5px' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    style={{ border: '1px solid black', borderRadius: '5px' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    style={{ border: '1px solid black', borderRadius: '5px' }}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn text-white w-50"
                  style={{ backgroundColor: '#3848b7' }}
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Info Column */}
            <div className="col-md-6 col-12 p-4">
              <h1 className="text-md-start text-center" style={{ color: '#3848b7' }}>
                Let's Work Together
              </h1>
              <p className="mt-1 text-md-start text-center">
                Race Innovationss welcomes collaboration to champion diversity, equity, and inclusion.
                Together, we'll break barriers, challenge biases, and shape a brighter, more inclusive future for all.
              </p>
              <div className="mt-3">
                <p className="fw-bold text-md-start text-center" style={{ color: '#3848b7' }}>
                  Mail Us:
                  <span className="ms-1" style={{ color: 'black' }}> info@raceinnovations.in</span>
                </p>
                <p className="fw-bold text-md-start text-center" style={{ color: '#3848b7' }}>
                  Call Us:
                  <span className="ms-1" style={{ color: 'black' }}>
                    +91 44 66108114 / +91 8072098352
                    <br />
                    +91 9003031527 (Whatsapp)
                  </span>
                </p>
                <p className="fw-bold text-md-start text-center" style={{ color: '#3848b7' }}>
                  Address:
                  <span className="ms-1" style={{ color: 'black' }}>
                    Olympia Platina, Guindy, Chennai 600032, TN
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple CSS animation */}
      <style jsx>{`
        .fade-up {
          opacity: 0;
          transform: translateY(100px);
          transition: all 0.4s ease-in-out;
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default Connected;
