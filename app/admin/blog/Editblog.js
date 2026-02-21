"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Blog() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    date: "",
    description: "",
    content: "",
    key_words: "",
    title_slug: "",
    thumbnail_image: null,
    content_image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      await axios.post("/api/blog", data); 
      toast.success("Blog posted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post blog.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Blog</h2>
      <div className="mb-3">
        <input
          name="title"
          placeholder="Title"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <input
          name="author"
          placeholder="Author"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <input
          type="date"
          name="date"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <input
          name="description"
          placeholder="Description"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <textarea
          name="content"
          placeholder="Content"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <input
          name="key_words"
          placeholder="Keywords"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <input
          name="title_slug"
          placeholder="Slug"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label>Thumbnail Image:</label>
        <input
          type="file"
          name="thumbnail_image"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label>Content Image:</label>
        <input
          type="file"
          name="content_image"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <button onClick={handleSubmit} className="p-2 rounded" style={{background:"#013F7C",color:"white"}}>
        Submit Blog
      </button>

      <ToastContainer />
    </div>
  );
}

export default Blog;
