"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [deleteId, setDeleteId] = useState(null); // Track selected blog to delete
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/getblog");
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/blog?id=${deleteId}`);
      toast.success("Blog deleted successfully!");
      fetchBlogs(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete blog.");
      console.error(error);
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <ToastContainer />
      <div style={{ width: "100%", padding: "20px" }}>
        <div style={buttonContainerStyle}>
          <button style={{ ...viewSiteButtonStyle, alignSelf: "flex-start" }}>
            View Site
          </button>
          <Link href="/blog/add">
            <button style={{ ...addBlogButtonStyle, alignSelf: "flex-end" }}>
              Add Blog
            </button>
          </Link>
        </div>

        <div className="container">
          {blogs.map((blog) => (
            <div className="card" style={cardStyle} key={blog.id}>
              <div className="row align-items-center">
                <div className="col-md-3 d-flex justify-content-center">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${blog.thumbnail_image}`}
                    alt="Thumbnail"
                    width={120}
                    height={120}
                  />
                </div>
                <div className="col-md-6">
                  <h4 style={{ fontWeight: "bold", color: "#333" }}>{blog.title}</h4>
                  <h5 style={{ color: "#666" }}>{blog.author}</h5>
                  <h6 style={{ color: "#888" }}>{blog.key_words}</h6>
                </div>
                <div className="col-md-3 text-end">
                  <p>{blog.date}</p>
                  <Link href={`/admin/blog-edit/${blog.id}`}>
                    <button className="btn text-light mt-2 me-2" style={editButtonStyle}>
                      Edit
                    </button>
                  </Link>
                  <button
                    className="btn text-light mt-2"
                    style={deleteButtonStyle}
                    onClick={() => openDeleteModal(blog.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <h5>Are you sure you want to delete this blog?</h5>
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button
                  onClick={closeModal}
                  style={{ marginRight: "10px", padding: "8px 16px", border: "none" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles ---
const cardStyle = {
  backgroundColor: "#f5f5f5",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
};

const editButtonStyle = {
  backgroundColor: "#615c9f",
  padding: "8px 12px",
  borderRadius: "5px",
};

const deleteButtonStyle = {
  backgroundColor: "black",
  padding: "8px 12px",
  borderRadius: "5px",
};

const buttonContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "10px",
  marginBottom: "20px",
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
};

const addBlogButtonStyle = {
  backgroundColor: "#013f7c",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "400px",
  maxWidth: "90%",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};

export default Blog;
