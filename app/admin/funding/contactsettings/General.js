"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const General = () => {
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    address: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json(); // Get response from server
        console.log("Server Response:", data); // Debugging response

        if (!response.ok) throw new Error(data.error || "Failed to save settings");

        alert("Settings saved successfully!");
    } catch (error) {
        console.error("Error saving settings:", error);
        alert("Failed to save settings. Please check the console.");
    }
};



  const settingsMenu = [
    { name: "General Settings", path: "/admin/funding/generalsettings" },
    { name: "Contact Settings", path: "/admin/funding/contactsettings" },
    { name: "Social Media Settings", path: "/admin/funding/mediasettings" },
    { name: "Corporate Video", path: "/admin/funding/videosetting" },
  ];

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ marginLeft: "270px", width: "100%", padding: "20px" }}>
        <button style={viewSiteButtonStyle}>View Site</button>

        <ul style={settingsMenuStyle}>
          {settingsMenu.map((item) => (
            <li key={item.path} style={listItemStyle}>
              <Link
                href={item.path}
                style={pathname === item.path ? activeLinkStyle : linkStyle}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div style={formContainerStyle}>
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            style={inputStyle}
            value={formData.address}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            style={inputStyle}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <button style={saveButtonStyle} onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "16px",
  outline: "none",
};

const formContainerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "1rem",
  width: "100%",
  marginTop: "20px",
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
  marginLeft: "auto",
};

const saveButtonStyle = {
  backgroundColor: "#013f7c",
  color: "white",
  padding: "8px",
  marginTop: "20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
};

const settingsMenuStyle = {
  display: "flex",
  flexWrap: "wrap",
  listStyle: "none",
  padding: "0",
  margin: "0",
};

const listItemStyle = {
  textAlign: "center",
  padding: "10px",
  color: "black",
};

const linkStyle = {
  textDecoration: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  color: "black",
  fontWeight: "500",
};

const activeLinkStyle = {
  textDecoration: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  backgroundColor: "#615c9f",
  fontWeight: "bold",
  color: "white",
};

export default General;
