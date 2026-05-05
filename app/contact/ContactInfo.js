"use client";

import React from "react";

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16.04 4.25C9.6 4.25 4.36 9.46 4.36 15.86c0 2.08.55 4.1 1.6 5.88L4.25 27.75l6.17-1.62a11.62 11.62 0 0 0 5.62 1.43h.01c6.44 0 11.68-5.21 11.68-11.61 0-3.1-1.22-6.02-3.43-8.21a11.57 11.57 0 0 0-8.26-3.49Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.38 10.58c-.25-.56-.51-.57-.75-.58h-.64c-.22 0-.58.08-.89.42-.3.33-1.16 1.13-1.16 2.76s1.19 3.2 1.36 3.42c.17.22 2.3 3.68 5.67 5.02 2.8 1.11 3.37.89 3.98.83.61-.06 1.98-.81 2.26-1.59.28-.78.28-1.45.19-1.59-.08-.14-.31-.22-.64-.39-.33-.17-1.98-.98-2.28-1.09-.31-.11-.53-.17-.75.17-.22.33-.86 1.09-1.06 1.31-.19.22-.39.25-.72.08-.33-.17-1.4-.52-2.67-1.65-.99-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.56.11-.22.06-.42-.03-.58-.08-.17-.73-1.8-1.02-2.42Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function ContactInfo() {
  return (
    <section className="contact-info-section">
      <div className="container">
        <div className="contact-info-card">
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <div className="contact-info-iconwrap" aria-hidden="true">
                <MailIcon />
              </div>
              <div>
                <div className="contact-info-label">Mail Us</div>
                <a
                  href="mailto:info@raceinnovations.in"
                  className="contact-info-link"
                >
                  info@raceinnovations.in
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-iconwrap" aria-hidden="true">
                <PhoneIcon />
              </div>
              <div>
                <div className="contact-info-label">Call Us</div>
                <div className="contact-info-line">
                  <a href="tel:+914466108114" className="contact-info-link">
                    +91 44 66108114
                  </a>
                  <span className="contact-info-divider">/</span>
                  <a href="tel:+918072098352" className="contact-info-link">
                    +91 8072098352
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-info-item">
              <div
                className="contact-info-iconwrap contact-info-iconwrap-green"
                aria-hidden="true"
              >
                <WhatsAppIcon />
              </div>
              <div>
                <div className="contact-info-label">WhatsApp</div>
                <a
                  href="https://wa.me/919003031527"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-link"
                >
                  +91 9003031527
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-iconwrap" aria-hidden="true">
                <PinIcon />
              </div>
              <div>
                <div className="contact-info-label">Address</div>
                <p className="contact-info-text">
                  Olympia Platina, Guindy, Chennai 600032, TN
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-info-section {
          padding: 18px 0 28px;
        }

        .contact-info-card {
          background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
          border: 1px solid #e1e8f7;
          border-radius: 22px;
          padding: 26px;
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 28px;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .contact-info-iconwrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #eef2ff;
          color: #2f45bf;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-info-iconwrap-green {
          background: rgba(37, 211, 102, 0.14);
          color: #25d366;
        }

        .contact-info-label {
          color: #6b7790;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .contact-info-link {
          color: #1f2a44;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
        }

        .contact-info-link:hover {
          color: #2f45bf;
          text-decoration: underline;
        }

        .contact-info-line {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .contact-info-divider {
          color: #94a3b8;
        }

        .contact-info-text {
          margin: 0;
          color: #1f2a44;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.55;
        }

        @media (max-width: 767px) {
          .contact-info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .contact-info-card {
            padding: 20px;
            border-radius: 18px;
          }
        }
      `}</style>
    </section>
  );
}
