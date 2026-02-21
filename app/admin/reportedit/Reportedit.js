"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";


const NavItem = ({ href, icon, text, isCollapsed }) => (
  <li style={navItemStyle}>
    <Link href={href} style={linkStyle}>
      <span style={iconStyle}>{icon}</span>
      {!isCollapsed && <span style={textStyle}>{text}</span>}
    </Link>
  </li>
);

function Reportedit() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      
      <div style={{ ...mainContent, marginLeft: isMobile ? "90px" : "270px" }}>
      <div style={{ ...mainContent, marginLeft: isMobile ? "90px" : "270px", position: "relative" }}>
  <button style={viewSiteButtonStyle}>View Site</button>
  </div>
        <h2 style={pageTitle}>Edit Report</h2>
        <div style={formContainer}>
          <div style={formRow}>
            <div style={formGroup}>
              <label>Company Name</label>
              <input type="text" style={inputStyle} />
            </div>
            <div style={formGroup}>
              <label>Project Name</label>
              <input type="text" style={inputStyle} />
            </div>
          </div>

          <div style={formRow}>
            <div style={formGroup}>
              <label>Date of Survey</label>
              <input type="date" style={inputStyle} />
            </div>
            <div style={formGroup}>
              <label>End Clients</label>
              <input type="text" style={inputStyle} />
            </div>
          </div>

          <div style={dimensionContainer}>
            <p>
              <strong>Dimension:</strong>
            </p>
            {["Width", "Height", "Weight", "Length"].map((dim, index) => (
              <div key={index} style={dimensionInputContainer}>
                <label>{dim}</label>
                <input type="text" style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={formRow}>
            {["From", "To"].map((field, index) => (
              <div key={index} style={formGroup}>
                <label>
                  <strong>{field}:</strong>
                </label>
                <input type="text" style={inputStyle} />
              </div>
            ))}
          </div>
          <label style={{ width: "100%", marginTop: "10px" }}>
            PDF File
            <input type="file" accept="application/pdf" style={inputStyle} />
          </label>

          <div style={buttonContainer}>
            <button style={buttonStyle}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}
const sidebarStyle = {
  height: "100vh",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "15px",
  boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  position: "fixed",
  left: "0",
  top: "0",
};

const viewSiteButtonStyle = {
  backgroundColor: "#f0b249",
  padding: "10px 20px",
  borderRadius: "5px",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer",
  position: "absolute",
  right: "20px",
  top: "20px",
  border:"none",
};


const logoContainer = {
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
};
const logoStyle = { objectFit: "contain", marginRight: "10px" };
const logoText = { margin: 0, fontSize: "14px", fontWeight: "bold" };

const profileContainer = { textAlign: "center", marginBottom: "20px" };
const profileImage = { borderRadius: "50%", objectFit: "cover" };
const profileName = { fontWeight: "bold", color: "black" };
const profileRole = { color: "gray" };

const navList = { listStyle: "none", padding: "0", width: "100%" };
const navItemStyle = { textAlign: "center", cursor: "pointer" };
const iconStyle = { fontSize: "20px", color: "black" };
const textStyle = { color: "black", fontWeight: "500" };
const linkStyle = {
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
};

const mainContent = { padding: "20px" };
const pageTitle = {
  fontSize: "22px",
  marginBottom: "20px",
  fontWeight: "bold",
};

const formContainer = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "10px",
};
const formRow = { display: "flex", gap: "20px", marginBottom: "15px" };
const formGroup = { flex: 1 };

const dimensionContainer = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};
const dimensionInputContainer = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonContainer = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "20px",
};
const buttonStyle = {
  backgroundColor: "#013f7c",
  color: "white",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  border: "none",
};

export default Reportedit;
