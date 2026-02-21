"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsMenu = [
  { name: "General Settings", path: "/admin/funding/generalsettings" },
  { name: "Contact Settings", path: "/admin/funding/contactsettings" },
  { name: "Social Media Settings", path: "/admin/funding/mediasettings" },
  { name: "Corporate Video", path: "/admin/funding/videosetting" },
];

function Ban() {
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    applicationName: "",
    footerAbout: "",
    optionURL: "",
    copyright: "",
  });

  const [selectedFile, setSelectedFile] = useState(null); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Store selected file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("applicationName", formData.applicationName);
    formDataToSend.append("footerAbout", formData.footerAbout);
    formDataToSend.append("optionURL", formData.optionURL);
    formDataToSend.append("copyright", formData.copyright);

    if (selectedFile) {
      formDataToSend.append("logo", selectedFile);
    }

    try {
      const response = await fetch("/api/general", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      console.log("Server Response:", data);
      if (!response.ok) throw new Error(data.error || "Failed to save settings");
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(error.message);
    }
  };

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1rem",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <label>Application Name</label>
          <input
            type="text"
            name="applicationName"
            placeholder="Application Name"
            style={inputStyle}
            value={formData.applicationName}
            onChange={handleChange}
          />

          <label>Footer About Section</label>
          <textarea
            name="footerAbout"
            placeholder="Footer About Section"
            style={inputStyle}
            value={formData.footerAbout}
            onChange={handleChange}
          />

          <label>Option URL</label>
          <input
            type="text"
            name="optionURL"
            placeholder="Click Here to see More"
            style={inputStyle}
            value={formData.optionURL}
            onChange={handleChange}
          />

          <label>Logo</label>
          <input
            type="file"
            name="logo"
            placeholder="Change the logo here"
            style={inputStyle}
            onChange={handleFileChange} // Handle file separately
          />

          <label>Copyright</label>
          <input
            type="text"
            name="copyright"
            placeholder=""
            style={inputStyle}
            value={formData.copyright}
            onChange={handleChange}
          />
        </div>

        <button style={saveButtonStyle} onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "16px",
  outline: "none",
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

export default Ban;
