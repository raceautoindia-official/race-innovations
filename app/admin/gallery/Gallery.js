"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Gallery() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!content || !image) {
      toast.error("Please provide content and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", image); // ✅ Matches the backend field

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Gallery item uploaded successfully!");
        setContent("");
        setImage(null);
      } else {
        toast.error(data.error || "Failed to upload.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ width: "100%", padding: "20px" }}>
        <button style={viewSiteButtonStyle}>View Site</button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1rem",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <label>Content</label>
          <input
            type="text"
            placeholder="Content"
            style={inputStyle}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <label>Content Images</label>
          <input type="file" style={inputStyle} onChange={handleFileChange} />
        </div>

        <button style={saveButtonStyle} onClick={handleUpload}>
          Upload
        </button>
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

export default Gallery;
