"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

function EditBlog() {
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

  const params = useParams();
  const router = useRouter();
  const blogId = params?.id;

  useEffect(() => {
    if (!blogId) {
      toast.error("No blog ID provided");
      return;
    }

    fetchBlog(blogId);
  }, [blogId]);

  const fetchBlog = async (id) => {
    try {
      const res = await axios.get(`/api/blog/${id}`);
      const blog = res.data;

      setFormData((prev) => ({
        ...prev,
        title: blog.title || "",
        author: blog.author || "",
        date: blog.date || "",
        description: blog.description || "",
        content: blog.content || "",
        key_words: blog.key_words || "",
        title_slug: blog.title_slug || "",
      }));
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      toast.error("Failed to load blog data");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    if (!blogId) {
      toast.error("Missing blog ID");
      return;
    }

    try {
      const data = new FormData();

      for (const key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      await axios.put(`/api/blog/${blogId}`, data);
      toast.success("Blog updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update blog.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Blog</h2>

      {["title", "author", "description", "key_words", "title_slug"].map((field) => (
        <div className="mb-3" key={field}>
          <input
            name={field}
            placeholder={field.replace("_", " ")}
            className="form-control"
            value={formData[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="mb-3">
        <input
          type="date"
          name="date"
          className="form-control"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <textarea
          name="content"
          placeholder="Content"
          className="form-control"
          value={formData.content}
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

      <button
        onClick={handleSubmit}
        className="p-2 rounded"
        style={{ background: "#013F7C", color: "white" }}
      >
        Update Blog
      </button>

      <ToastContainer />
    </div>
  );
}

export default EditBlog;
