"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Client() {
  const pathname = usePathname();
  const [images, setImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // For delete confirmation modal

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/client");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast.error("Error fetching images.");
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setNewImageFile(null);
  };

  const handleFileChange = (event) => {
    setNewImageFile(event.target.files[0]);
  };

  const handleSaveEdit = async () => {
    if (!editingImage || !newImageFile) {
      toast.warn("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", newImageFile);

    try {
      const uploadRes = await fetch("/api/client", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const uploadData = await uploadRes.json();
      if (!uploadData.imageUrl) throw new Error("Missing imageUrl");

      const updateRes = await fetch("/api/client", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingImage.id,
          image_url: uploadData.imageUrl,
        }),
      });

      if (!updateRes.ok) throw new Error("Update failed");

      setImages(
        images.map((img) =>
          img.id === editingImage.id
            ? { ...img, image_url: uploadData.imageUrl }
            : img
        )
      );

      setEditingImage(null);
      toast.success("Image updated!");
    } catch (error) {
      toast.error("Error updating image.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/client?id=${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete image");

      toast.success("Image deleted!");
      fetchImages();
      setDeleteId(null);
    } catch (error) {
      toast.error("Error deleting image.");
    }
  };

  const handleAddClient = async (event) => {
    event.preventDefault();

    if (!newImageFile) {
      toast.warn("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", newImageFile);

    try {
      const uploadRes = await fetch("/api/client", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const uploadData = await uploadRes.json();
      if (!uploadData.imageUrl) throw new Error("Missing imageUrl");

      toast.success("Client added!");
      fetchImages();
      setNewImageFile(null);
      setIsAdding(false);
    } catch (error) {
      toast.error("Error adding client.");
    }
  };

  const settingsMenu = [
    { name: "Slider", path: "/admin/slider/Testimonials" },
    { name: "Partnership", path: "/admin/partner" },
    { name: "Clients", path: "/admin/clients" },
    { name: "Testimonial", path: "/admin/funding/settings/corporate-video" },
    { name: "Certification", path: "/admin/funding/settings/" },
  ];

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <ToastContainer />
      <div style={{ width: "100%", padding: "20px" }}>
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

        <button style={saveButtonStyle} onClick={() => setIsAdding(true)} className="float-end">
          Add Clients
        </button>

        <div className="row mt-4">
          {images.map((image) => (
            <div className="col-md-4 text-center mb-4" key={image.id}>
              <div
                style={{
                  backgroundColor: "#6c757d",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${image.image_url}`}
                  alt="Client"
                  width={400}
                  height={400}
                  className="img-fluid"
                />
              </div>
              <div>
                <button
                  className="btn text-light mt-2 me-2"
                  style={{ backgroundColor: "#615c9f" }}
                  onClick={() => handleEdit(image)}
                >
                  Edit
                </button>
                <button
                  className="btn text-light mt-2"
                  style={{ backgroundColor: "black" }}
                  onClick={() => confirmDelete(image.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {(isAdding || editingImage) && (
          <div
            style={modalStyle}
            onClick={() => {
              setIsAdding(false);
              setEditingImage(null);
            }}
          >
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <h3>{editingImage ? "Edit Image" : "Add Client Image"}</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={fileInputStyle}
              />
              <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  style={saveButtonStyle}
                  onClick={editingImage ? handleSaveEdit : handleAddClient}
                >
                  {editingImage ? "Save" : "Upload"}
                </button>
                <button
                  style={deleteButtonStyle}
                  onClick={() => {
                    setIsAdding(false);
                    setEditingImage(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div style={modalStyle} onClick={() => setDeleteId(null)}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <h4>Are you sure you want to delete this image?</h4>
              <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button style={deleteButtonStyle} onClick={handleDelete}>
                  Yes, Delete
                </button>
                <button
                  style={saveButtonStyle}
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const viewSiteButtonStyle = {
  backgroundColor: "#f0b249",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "20px",
  display: "block",
  marginLeft: "auto",
};
const saveButtonStyle = {
  backgroundColor: "#013f7c",
  color: "white",
  padding: "8px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
};
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};
const modalContentStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "15px",
  textAlign: "center",
  width: "500px",
  maxWidth: "90%",
};
const fileInputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ddd",
};
const deleteButtonStyle = {
  backgroundColor: "red",
  color: "white",
  padding: "8px 20px",
  borderRadius: "5px",
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
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "10px",
  padding: "10px",
  borderRadius: "10px",
  width: "100%",
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

export default Client;
