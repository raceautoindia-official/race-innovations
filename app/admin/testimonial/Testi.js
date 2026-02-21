"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
function Testi() {
  const [testimonials, setTestimonials] = useState([]);
  const router = useRouter(); 

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonial");

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/testimonial?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete image");

      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image. Please try again.");
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/edit/${id}`); 
  };

  const handleAdd = () => {
    router.push("/admin/add-testimonial"); 
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ marginLeft: "270px", width: "100%", padding: "20px" }}>
        <button style={viewSiteButtonStyle}>View Site</button>

        <div className="container">
          <div className="container">
            <div className="row justify-content-center">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="col-md-4 col-12 mb-4">
                  <div className="card p-3 text-center" style={cardStyle}>
                    <p>{testimonial.description}</p>
                    <div className="d-flex flex-column align-items-center">
                    <img src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${testimonial.image_url}`} alt={testimonial.name} style={imageStyle} />


                      <h3 style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                        {testimonial.name}
                      </h3>
                      <p style={{ fontWeight: "lighter", fontSize: "0.9rem" }}>
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <button
                      className="btn text-light me-2"
                      style={{ backgroundColor: "#615c9f" }}
                      onClick={() => handleEdit(testimonial.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn text-light"
                      style={{ backgroundColor: "black" }}
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button style={saveButtonStyle} onClick={handleAdd}>
            Add Testimonials
          </button>
        </div>
      </div>
    </div>
  );
}

export default Testi;

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
  float: "right",
};

const cardStyle = {
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
};

const imageStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "10px",
};
