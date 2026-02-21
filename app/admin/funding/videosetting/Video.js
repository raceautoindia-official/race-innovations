"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Video() {
  const pathname = usePathname();
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Function to handle input change
  const handleChange = (e) => {
    setYoutubeUrl(e.target.value);
  };

  // Function to handle video upload
  const handleAddVideo = async () => {
    if (!youtubeUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtube_url: youtubeUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Video added successfully!");
        setYoutubeUrl(""); // Clear input field
      } else {
        toast.error(data.error || "Failed to add video");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
              <Link href={item.path} style={pathname === item.path ? activeLinkStyle : linkStyle}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "20px" }}>
          <label>YouTube URL</label>
          <input type="text" placeholder="YouTube URL" style={inputStyle} value={youtubeUrl} onChange={handleChange} />
        </div>

        <button style={saveButtonStyle} onClick={handleAddVideo}>Upload</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "16px",
  outline: "none",
  marginBottom: "10px",
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
  padding: "10px",
  marginTop: "10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  width: "100px",
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

export default Video;
