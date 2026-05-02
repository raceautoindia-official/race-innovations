"use client";

import React from "react";

export default function FloatingContactButtons() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openWhatsApp() {
    const whatsappNumber = "919003031527";
    const whatsappMessage = encodeURIComponent(
      "Hello RACE Innovations, I would like to know more about your automotive reports."
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function openEmail() {
    const toEmails = encodeURIComponent(
      "projecthead@raceinnovations.in,kh@raceinnovations.in"
    );
    const subject = encodeURIComponent("Automotive Reports Enquiry");
    const body = encodeURIComponent(
      "Hello RACE Innovations Team,\n\nI would like to know more about your automotive market reports.\n\nRegards,"
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEmails}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="floating-contact-buttons">
        <button
          type="button"
          className="floating-circle-btn floating-blue"
          title="Back to top"
          aria-label="Back to top"
          onClick={scrollToTop}
        >
          ↑
        </button>

        <button
          type="button"
          className="floating-circle-btn floating-whatsapp"
          title="WhatsApp: +91 9003031527"
          aria-label="Open WhatsApp"
          onClick={openWhatsApp}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M16.04 4.25C9.6 4.25 4.36 9.46 4.36 15.86c0 2.08.55 4.1 1.6 5.88L4.25 27.75l6.17-1.62a11.62 11.62 0 0 0 5.62 1.43h.01c6.44 0 11.68-5.21 11.68-11.61 0-3.1-1.22-6.02-3.43-8.21a11.57 11.57 0 0 0-8.26-3.49Z"
              stroke="#ffffff"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.38 10.58c-.25-.56-.51-.57-.75-.58h-.64c-.22 0-.58.08-.89.42-.3.33-1.16 1.13-1.16 2.76s1.19 3.2 1.36 3.42c.17.22 2.3 3.68 5.67 5.02 2.8 1.11 3.37.89 3.98.83.61-.06 1.98-.81 2.26-1.59.28-.78.28-1.45.19-1.59-.08-.14-.31-.22-.64-.39-.33-.17-1.98-.98-2.28-1.09-.31-.11-.53-.17-.75.17-.22.33-.86 1.09-1.06 1.31-.19.22-.39.25-.72.08-.33-.17-1.4-.52-2.67-1.65-.99-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.56.11-.22.06-.42-.03-.58-.08-.17-.73-1.8-1.02-2.42Z"
              fill="#ffffff"
            />
          </svg>
        </button>

        <button
          type="button"
          className="floating-circle-btn floating-blue"
          title="Email: projecthead@raceinnovations.in | kh@raceinnovations.in"
          aria-label="Send email"
          onClick={openEmail}
        >
          ✉
        </button>
      </div>

      <style>{`
        .floating-contact-buttons {
          position: fixed;
          right: 24px;
          bottom: 108px;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .floating-circle-btn {
          width: 62px;
          height: 62px;
          border-radius: 999px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          box-shadow: 0 16px 36px rgba(47, 69, 191, 0.26);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .floating-circle-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 42px rgba(47, 69, 191, 0.34);
        }

        .floating-blue {
          background: #2f45bf;
        }

        .floating-whatsapp {
          background: #25d366;
          font-size: 24px;
          box-shadow: 0 16px 36px rgba(37, 211, 102, 0.28);
        }

        @media (max-width: 575px) {
          .floating-contact-buttons {
            right: 18px;
            bottom: 102px;
            gap: 14px;
          }

          .floating-circle-btn {
            width: 56px;
            height: 56px;
            font-size: 25px;
          }
        }
      `}</style>
    </>
  );
}
