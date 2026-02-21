"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";


function Social() {
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    telegram: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/mediasetting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save settings");

      toast.success("Social media settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(error.message);
    }
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ marginLeft: "270px", width: "100%", padding: "20px" }}>
        <button style={viewSiteButtonStyle}>View Site</button>

        <ul style={settingsMenuStyle}>
          {settingsMenu.map((item) => (
            <li key={item.path} style={listItemStyle}>
              <Link href={item.path} style={pathname === item.path ? activeLinkStyle : linkStyle}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", width: "100%", marginTop: "20px" }}>
            <label>Facebook URL</label>
            <input type="text" name="facebook" placeholder="Facebook URL" style={inputStyle} value={formData.facebook} onChange={handleChange} />

            <label>Twitter URL</label>
            <input type="text" name="twitter" placeholder="Twitter URL" style={inputStyle} value={formData.twitter} onChange={handleChange} />

            <label>Instagram URL</label>
            <input type="text" name="instagram" placeholder="Instagram URL" style={inputStyle} value={formData.instagram} onChange={handleChange} />

            <label>LinkedIn URL</label>
            <input type="text" name="linkedin" placeholder="LinkedIn URL" style={inputStyle} value={formData.linkedin} onChange={handleChange} />

            <label>YouTube URL</label>
            <input type="text" name="youtube" placeholder="YouTube URL" style={inputStyle} value={formData.youtube} onChange={handleChange} />

            <label>Telegram URL</label>
            <input type="text" name="telegram" placeholder="Telegram URL" style={inputStyle} value={formData.telegram} onChange={handleChange} />
          </div>

          <button type="submit" style={saveButtonStyle}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}

const settingsMenu = [
  { name: "General Settings", path: "/admin/funding/generalsettings" },
  { name: "Contact Settings", path: "/admin/funding/contactsettings" },
  { name: "Social Media Settings", path: "/admin/funding/mediasettings" },
  { name: "Corporate Video", path: "/admin/funding/videosetting" },
];

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "16px",
  outline: "none",
};

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

const activeLinkStyle = {
  textDecoration: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  backgroundColor: "#615c9f",
  fontWeight: "bold",
  color: "white",
};

export default Social;
