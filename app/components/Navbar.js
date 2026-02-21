"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import styles from "@/app/page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { FiMenu } from "react-icons/fi";
import { MdAnalytics, MdDisplaySettings } from "react-icons/md";
import { HiPhoneOutgoing } from "react-icons/hi";

const Navbar = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js")
        .then(() => console.log("Bootstrap JS loaded successfully"))
        .catch((err) => console.error("Error loading Bootstrap JS:", err));
    }
  }, []);

  const iconSize = 30;
  const iconColor = "#293BB1";

  const handleOffcanvasHide = () => {
    if (typeof window !== "undefined") {
      const offcanvasEl = document.getElementById("mobileNav");
      if (offcanvasEl) {
        let offcanvasInstance = window.bootstrap?.Offcanvas?.getInstance(offcanvasEl);
        if (!offcanvasInstance && window.bootstrap?.Offcanvas) {
          offcanvasInstance = new window.bootstrap.Offcanvas(offcanvasEl);
        }
        offcanvasInstance?.hide?.();
      }
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-white position-fixed"
        style={{ zIndex: 1000, width: "100%", marginBottom: "40px" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand d_navlogo" href="/">
            <Image src="/images/logo_v2.png" alt="Logo" width={180} height={34} />
          </Link>

          {/* Mobile "Corporate Profile" */}
          <a
            className={`nav-link menus d-lg-none ${styles.navbarCustom}`}
            href="/corporate-profile"
            style={{
              color: "#fff",
              backgroundColor: "#293BB1",
              borderRadius: "20px",
              padding: "7px 6px",
              fontWeight: "600",
              textAlign: "center",
              display: "inline-block",
              border: "2px solid #293BB1",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1F2C8A")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#293BB1")}
          >
            Corporate Profile
          </a>

          {/* Desktop navbar */}
          <div className="collapse navbar-collapse desktop_nav d-none d-lg-flex" id="navbarNav">
            <ul className="navbar-nav me-auto" style={{ fontSize: "18px", fontWeight: "700" }}>
              {/* About */}
              <li className="nav-item dropdown ms-5">
                <Link
                  href="/about_us"
                  className={`nav-link dropdown-toggle menus ${styles.navbarCustom}`}
                  id="aboutDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ color: "#293BB1" }}
                >
                  About Us
                </Link>
                <ul className="dropdown-menu" aria-labelledby="aboutDropdown">
                  <li>
                    <Link className="dropdown-item" href="/about-us/vision-mission">
                      Vision & Mission
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/about-us/management-team">
                      Management Team
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Products */}
              <li className="nav-item dropdown ms-5">
                <Link
                  href="#"
                  className={`nav-link dropdown-toggle menus ${styles.navbarCustom}`}
                  id="productsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ color: "#293BB1" }}
                >
                  Products
                </Link>
                <ul className="dropdown-menu" aria-labelledby="productsDropdown">
                  <li>
                    <Link className="dropdown-item" href="/technic">
                      Technic
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/intellect">
                      Intellect
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/connect">
                      Connect
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/intellect/lbi">
                      LBI Route Survey
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/accounting-and-legal">
                      Accounting & Legal
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Reports */}
              <li className="nav-item dropdown ms-5">
                <Link
                  href="#"
                  className={`nav-link dropdown-toggle menus ${styles.navbarCustom}`}
                  id="reportsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ color: "#293BB1" }}
                >
                  Reports
                </Link>
                <ul className="dropdown-menu" aria-labelledby="reportsDropdown">
                  <li>
                    <Link className="dropdown-item" href="/market-report">
                      Market Report
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/product">
                      Product Report
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/strategic-report">
                      Strategic Report
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/flash-reports">
                      Flash Report
                    </Link>
                  </li>
                </ul>
              </li>

              {/* ✅ Investors + Funding like your screenshot (as dropdown under one menu) */}
              <li className="nav-item dropdown ms-5">
                <Link
                  href="#"
                  className={`nav-link dropdown-toggle menus ${styles.navbarCustom}`}
                  id="investDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ color: "#293BB1" }}
                >
                  Investors
                </Link>
                <ul className="dropdown-menu" aria-labelledby="investDropdown">
                  <li>
                    <Link className="dropdown-item" href="/about-us/investors">
                      Investors
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/partner">
                      Funding
                    </Link>
                  </li>
                </ul>
              </li>

              {/* IT Services */}
              <li className="nav-item ms-5">
                <Link className={`nav-link menus shining ${styles.navbarCustom}`} href="/it" style={{ color: "red" }}>
                  IT Services
                </Link>
              </li>

              {/* ODC Logistics */}
              <li className="nav-item ms-5">
                <Link className={`nav-link menus ${styles.navbarCustom}`} href="/logistics" style={{ color: "#293BB1" }}>
                  ODC Logistics
                </Link>
              </li>
              <li className="nav-item ms-5">
                  <Link className={`nav-link menus ${styles.navbarCustom}`} href="/web-blog" onClick={handleOffcanvasHide} style={{ color: "#293BB1" }}>
                   Blog
                  </Link>
                </li>
            </ul>

            <div className="d-flex">
              <a
                className={`nav-link menus ${styles.navbarCustom}`}
                href="/corporate-profile"
                style={{
                  color: "#fff",
                  backgroundColor: "#293BB1",
                  borderRadius: "20px",
                  padding: "7px 10px",
                  fontWeight: "600",
                  textAlign: "center",
                  display: "inline-block",
                  border: "2px solid #293BB1",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1F2C8A")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#293BB1")}
              >
                Corporate Profile
              </a>

              <Link className="nav-link me-2 ms-3 mt-2 header_icon" href="/contact">
                <Image
                  src="/images/phone.png"
                  alt="Data Icon"
                  width={23}
                  height={23}
                  className="me-2 flex-shrink-0"
                />
              </Link>
            </div>
          </div>

          {/* mobile navbar */}
          <div className="offcanvas offcanvas-start d-lg-none" tabIndex="-1" id="mobileNav" aria-labelledby="mobileNavLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="mobileNavLabel">
                <Image src="/images/l.png" alt="Logo" width={100} height={100} style={{ objectFit: "contain" }} />
              </h5>

              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav me-auto" style={{ fontSize: "18px", fontWeight: "700" }}>
                <li className="nav-item dropdown ms-5">
                  <Link
                    href="/about_us"
                    onClick={handleOffcanvasHide}
                    className={`nav-link dropdown-toggle me-4 menus ${styles.navbarCustom}`}
                    id="aboutDropdownMobile"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ color: "#293BB1" }}
                  >
                    About Us
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="aboutDropdownMobile">
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/about-us/vision-mission">
                        Vision & Mission
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/about-us/management-team">
                        Management Team
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown ms-5">
                  <Link
                    href="#"
                    onClick={handleOffcanvasHide}
                    className={`nav-link dropdown-toggle menus ${styles.navbarCustom}`}
                    id="productsDropdownMobile"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ color: "#293BB1" }}
                  >
                    Products
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="productsDropdownMobile">
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/technic">
                        Technic
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/intellect">
                        Intellect
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/connect">
                        Connect
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/intellect/lbi">
                        LBI Route Survey
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/accounting-and-legal">
                        Accounting & Legal
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown ms-5">
                  <Link
                    href="#"
                    onClick={handleOffcanvasHide}
                    className={`nav-link dropdown-toggle menus ${styles.navbarCustom}`}
                    id="reportsDropdownMobile"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ color: "#293BB1" }}
                  >
                    Reports
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="reportsDropdownMobile">
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/market-report">
                        Market Report
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/product">
                        Product Report
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/strategic-report">
                        Strategic Report
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/flash-reports">
                        Flash Report
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* ✅ Mobile Investors dropdown with Funding inside */}
                <li className="nav-item dropdown ms-5">
                  <Link
                    href="#"
                    onClick={handleOffcanvasHide}
                    className={`nav-link dropdown-toggle menus ${styles.navbarCustom}`}
                    id="investDropdownMobile"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ color: "#293BB1" }}
                  >
                    Investors
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="investDropdownMobile">
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/about-us/investors">
                        Investors
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={handleOffcanvasHide} href="/partner">
                        Funding
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item ms-5">
                  <Link className={`nav-link menus shining ${styles.navbarCustom}`} href="/it" onClick={handleOffcanvasHide} style={{ color: "red" }}>
                    IT Services
                  </Link>
                </li>

                <li className="nav-item ms-5">
                  <Link className={`nav-link menus ${styles.navbarCustom}`} href="/logistics" onClick={handleOffcanvasHide} style={{ color: "#293BB1" }}>
                    ODC Logistics
                  </Link>
                </li>
                <li className="nav-item ms-5">
                  <Link className={`nav-link menus ${styles.navbarCustom}`} href="/web-blog" onClick={handleOffcanvasHide} style={{ color: "#293BB1" }}>
                   Blog
                  </Link>
                </li>

                <li className="nav-item ms-5">
                  <Link className={`nav-link menus ${styles.navbarCustom}`} onClick={handleOffcanvasHide} href="/contact" style={{ color: "#293BB1" }}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="d-flex justify-content-between g-2 px-3 pb-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={35} style={{ color: "#E4405F" }} className="mt-1" />
              </a>
              <a href="https://x.com/yourhandle" target="_blank" rel="noopener noreferrer">
                <SiX size={32} style={{ color: "#000000" }} className="mt-1" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={42} style={{ color: "#1877F2" }} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={42} style={{ color: "#0077B5" }} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube size={44} style={{ color: "#FF0000" }} />
              </a>
            </div>
          </div>

          {/* bottom mobile bar */}
          <div className={styles.mobile_navbar}>
            <div className={styles.navigation}>
              <Link href="https://raceautoanalytics.com/" style={{ textDecoration: "none" }}>
                <div className={styles.navItem}>
                  <MdAnalytics color={iconColor} size={iconSize} title="Forecast" />
                  <span className={styles.caption}>Analytics</span>
                </div>
              </Link>

              <Link href="/it" className={styles.navItem}>
                <MdDisplaySettings color={iconColor} size={iconSize} title="Subscription" />
                <span className={styles.caption}>It Services</span>
              </Link>

              <Link href="/contact" style={{ textDecoration: "none" }}>
                <div className={styles.navItem}>
                  <HiPhoneOutgoing color={iconColor} size={iconSize} title="Events" />
                  <span className={styles.caption}>Contact</span>
                </div>
              </Link>

              <div className={styles.navItem} role="button">
                <FiMenu
                  color={iconColor}
                  size={iconSize}
                  title="Menu"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#mobileNav"
                  aria-controls="mobileNav"
                  aria-label="Toggle navigation"
                />
                <span className={styles.caption}>Menu</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;