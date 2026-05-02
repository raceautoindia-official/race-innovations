import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import "./footer.css";
import Link from "next/link";

function FooterWhatsAppIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16.04 4.25C9.6 4.25 4.36 9.46 4.36 15.86c0 2.08.55 4.1 1.6 5.88L4.25 27.75l6.17-1.62a11.62 11.62 0 0 0 5.62 1.43h.01c6.44 0 11.68-5.21 11.68-11.61 0-3.1-1.22-6.02-3.43-8.21a11.57 11.57 0 0 0-8.26-3.49Z"
        stroke="#25D366"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.38 10.58c-.25-.56-.51-.57-.75-.58h-.64c-.22 0-.58.08-.89.42-.3.33-1.16 1.13-1.16 2.76s1.19 3.2 1.36 3.42c.17.22 2.3 3.68 5.67 5.02 2.8 1.11 3.37.89 3.98.83.61-.06 1.98-.81 2.26-1.59.28-.78.28-1.45.19-1.59-.08-.14-.31-.22-.64-.39-.33-.17-1.98-.98-2.28-1.09-.31-.11-.53-.17-.75.17-.22.33-.86 1.09-1.06 1.31-.19.22-.39.25-.72.08-.33-.17-1.4-.52-2.67-1.65-.99-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.56.11-.22.06-.42-.03-.58-.08-.17-.73-1.8-1.02-2.42Z"
        fill="#25D366"
      />
    </svg>
  );
}

function FooterMailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2f45bf"
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

const Footer = () => {
  return (
    <div
      className="footer-hidden-mobile footer container-fluid  "
      style={{
        backgroundImage: 'url("/images/footer-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "20vh",
        padding: "20px 0",
      }}
    >
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          <div className="col-12 col-md-3 d-flex justify-content-center">
            <Image
              src="/images/rrr.png"
              width={160} 
              height={200}
              alt="logo"
              style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
            />
          </div>

          <div className="col-12 col-md-6">
            <p className="mb-0" style={{ fontSize: "16px" , textAlign: "justify" }}>
              At Race Innovations, we are passionate about transforming ideas
              into impactful solutions. As trusted consultants, we partner with
              businesses to navigate complex challenges and deliver innovative
              strategies that drive success. Our team excels at designing and
              implementing custom solutions tailored to your unique needs,
              helping you stay ahead in a fast-paced world. With a focus on
              collaboration, creativity, and sustainability, we are dedicated to
              delivering results that empower growth and create lasting value
              for our clients.
            </p>
          </div>
          <div className="col-12 col-md-3 d-flex flex-wrap justify-content-center justify-content-md-end align-items-center gap-2">
            <a
              href="https://www.instagram.com/raceinnovations/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={24} style={{ color: "#E4405F" }} />
            </a>
            <a
              href="https://www.facebook.com/raceinnovationspvtltd/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook size={24} style={{ color: "#1877F2" }} />
            </a>
            <a
              href="https://x.com/raceinnovations"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
            >
              <FaXTwitter size={24} style={{ color: "#000" }} />
            </a>
            <a
              href="https://www.linkedin.com/company/race-innovations-private-limited/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={24} style={{ color: "#0077B5" }} />
            </a>

            <a
              href="https://wa.me/919003031527?text=Hello%20RACE%20Innovations%2C%20I%20would%20like%20to%20know%20more%20about%20your%20automotive%20reports."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              title="WhatsApp: +91 9003031527"
            >
              <FooterWhatsAppIcon />
            </a>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=projecthead%40raceinnovations.in%2Ckh%40raceinnovations.in&su=Automotive%20Reports%20Enquiry&body=Hello%20RACE%20Innovations%20Team%2C%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20automotive%20market%20reports.%0A%0ARegards%2C"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email RACE Innovations"
              title="Email: projecthead@raceinnovations.in | kh@raceinnovations.in"
            >
              <FooterMailIcon />
            </a>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12 d-flex flex-column flex-md-row justify-content-between">
            <p
              className="mb-1 text-center text-md-start"
              style={{ fontSize: "12px" }}
            >
              © 2025 Race Innovationss - All Rights Reserved
            </p>

            {/* Links Section */}
            <div className="row text-center text-md-start justify-content-between">
              <div className="col-6 col-md-auto mb-2">
                <Link
                  href="/about-us/vision-mission"
                  className="text-decoration-none text-dark d-block"
                  style={{ fontSize: "12px" }}
                >
                  About Us
                </Link>
              </div>
              <div className="col-6 col-md-auto mb-2">
                <Link
                  href="/career"
                  className="text-decoration-none text-dark d-block"
                  style={{ fontSize: "12px" }}
                >
                  Careers
                </Link>
              </div>
              <div className="col-6 col-md-auto">
                <Link
                  href="/contact"
                  className="text-decoration-none text-dark d-block"
                  style={{ fontSize: "12px" }}
                >
                  Contact
                </Link>
              </div>
              <div className="col-6 col-md-auto">
                <Link
                  href="/about-us/investors"
                  className="text-decoration-none text-dark d-block"
                  style={{ fontSize: "12px" }}
                >
                  Investor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
