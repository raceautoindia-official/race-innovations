"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

function Edittest() {
  const { id } = useParams();
  const router = useRouter();

  const [testimonial, setTestimonial] = useState({
    name: "",
    designation: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    if (id) {
      fetchTestimonial();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/testimonial/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = await response.json();
      console.log("Fetched Testimonial:", data);
      setTestimonial(data); 
    } catch (error) {
      console.error("Error fetching testimonial:", error);
    }
  };

  const handleChange = (e) => {
    setTestimonial({ ...testimonial, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setTestimonial({ ...testimonial, image_url: URL.createObjectURL(file) });
  };

  const handleSubmit = async () => {
    if (!id) {
      console.error("No ID found for updating testimonial.");
      return;
    }

    try {
      const response = await fetch(`/api/testimonial/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonial),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      alert("Testimonial updated successfully!");
      router.push("/admin/testimonial");
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        <button style={viewSiteButtonStyle}>View Site</button>

        <div style={formContainerStyle}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={testimonial.name}
            onChange={handleChange}
            placeholder="Name"
            style={inputStyle}
          />

          <label>Role</label>
          <input
            type="text"
            name="designation"
            value={testimonial.designation}
            onChange={handleChange}
            placeholder="Role"
            style={inputStyle}
          />

          <label>Content</label>
          <textarea
            name="description"
            value={testimonial.description}
            onChange={handleChange}
            placeholder="Content"
            style={inputStyle}
          />

          <label>Upload Image</label>
          <input type="file" onChange={handleImageUpload} style={inputStyle} />

          {testimonial.image_url && (
            <img src={testimonial.image_url} alt="Preview" style={imageStyle} />
          )}
        </div>

        <button style={saveButtonStyle} onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Edittest;

const containerStyle = {
  display: "flex",
  width: "100%",
  minHeight: "100vh",
};

const mainContentStyle = {
  flex: 1,
  marginLeft: "270px",
  width: "100%",
  padding: "20px",
};

const formContainerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "1rem",
  width: "100%",
  marginTop: "20px",
};

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

const imageStyle = {
  width: "100px",
  height: "100px",
  borderRadius: "10px",
  objectFit: "cover",
  marginTop: "10px",
};
