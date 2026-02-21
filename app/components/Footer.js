import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import "./footer.css";
import Link from "next/link";
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
          <div className="col-12 col-md-3 d-flex justify-content-center justify-content-md-end gap-2">
            <a
              href="https://www.instagram.com/raceinnovations/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={24} style={{ color: "#E4405F" }} />
            </a>
            <a
              href="https://www.facebook.com/raceinnovationspvtltd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={24} style={{ color: "#1877F2" }} />
            </a>
            <a
              href="https://x.com/raceinnovations"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter size={24} style={{ color: "#000" }} />
            </a>
            <a
              href="https://www.linkedin.com/company/race-innovations-private-limited/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={24} style={{ color: "#0077B5" }} />
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
