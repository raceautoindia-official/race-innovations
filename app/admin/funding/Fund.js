"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaDownload } from "react-icons/fa";
import {
  MdDashboard,
  MdArticle,
  MdImage,
  MdAttachMoney,
  MdHome,
  MdSettings,
  MdAssessment,
} from "react-icons/md";

const Fund = () => {
  return (
    <div style={{ display: "" }} className="col-12">
    
      <div style={contentStyle}>
        {/* View Site Button */}
        <button style={viewSiteButtonStyle} className="text-end">View Site</button>

        <h2>Funding</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>S/NO</th>
              <th style={thStyle}>Application Candidate Name</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Product Type</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>1</td>
              <td style={tdStyle}>John Doe</td>
              <td style={tdStyle}>$1000</td>
              <td style={tdStyle}>Approved</td>
              <td style={tdStyle}>
                <button style={buttonContainerStyle}>
                  <FaEye style={iconActionStyle} /> View
                </button>
                <button style={buttonContainerStyle}>
                  <FaDownload style={iconActionStyle} /> Download
                </button>
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>2</td>
              <td style={tdStyle}>Jane Smith</td>
              <td style={tdStyle}>$500</td>
              <td style={tdStyle}>Pending</td>
              <td style={tdStyle}>
                <button style={buttonContainerStyle}>
                  <FaEye style={iconActionStyle} /> View
                </button>
                <button style={buttonContainerStyle}>
                  <FaDownload style={iconActionStyle} /> Download
                </button>
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>3</td>
              <td style={tdStyle}>Michael Johnson</td>
              <td style={tdStyle}>$750</td>
              <td style={tdStyle}>Rejected</td>
              <td style={tdStyle}>
                <button style={buttonContainerStyle}>
                  <FaEye style={iconActionStyle} /> View
                </button>
                <button style={buttonContainerStyle}>
                  <FaDownload style={iconActionStyle} /> Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const viewSiteButtonStyle = {
  backgroundColor: "#f0b249",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  color: "black",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: "20px",
  display: "block",
  position: "absolute",
  right: "20px",  
  top: "20px",     
};


const buttonContainerStyle = {
  margin: "5px",
  padding: "5px 10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#013f7c",
  color: "white",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
};

const NavItem = ({ href, icon, text }) => (
  <li style={navItemStyle}>
    <Link href={href} style={linkStyle}>
      <span style={iconStyle}>{icon}</span>
      <span style={{ color: "black", fontWeight: "500" }}>{text}</span>
    </Link>
  </li>
);

const sidebarStyle = {
  width: "250px",
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

const contentStyle = {

  padding: "20px",
  width: "100%",
  position: "relative", // This helps in positioning the button
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  border: "2px solid black",
};

const thStyle = {
  border: "1px solid black",
  padding: "10px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid black",
  padding: "10px",
  textAlign: "left",
};

const iconActionStyle = {
  fontSize: "18px",
  cursor: "pointer",
};

const navItemStyle = {
  textAlign: "center",
  transition: "0.3s",
  cursor: "pointer",
};

const linkStyle = {
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "10px",
  padding: "10px",
  borderRadius: "10px",
  width: "100%",
};

const iconStyle = {
  fontSize: "20px",
  color: "black",
};

export default Fund;
