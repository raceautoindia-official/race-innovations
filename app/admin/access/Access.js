"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Access() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentRole, setCurrentRole] = useState({
    id: null,
    email: "",
    role: "admin",
    menus: "",
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("/api/access");
      setRoles(Array.isArray(res.data.roles) ? res.data.roles : []);
    } catch (err) {
      console.error("Failed to fetch roles", err);
      toast.error("Failed to fetch roles");
    }
  };

  const openAddModal = () => {
    setModalType("add");
    setCurrentRole({ id: null, email: "", role: "admin", menus: "" });
    setShowModal(true);
  };

  const openEditModal = (role) => {
    setModalType("edit");
    setCurrentRole({
      id: role.id,
      email: role.email,
      role: role.role,
      menus: role.menus,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentRole({ id: null, email: "", role: "admin", menus: "" });
  };

  const handleSave = async () => {
    if (!currentRole.email.trim()) {
      toast.warning("Email is required");
      return;
    }

    if (!currentRole.role.trim()) {
      toast.warning("Role is required");
      return;
    }

    try {
      if (modalType === "add") {
        const res = await axios.post("/api/access", {
          email: currentRole.email,
          role: currentRole.role,
          menus: currentRole.menus,
        });
        setRoles((prev) => [...prev, res.data]);
        toast.success("Role added successfully");
      } else {
        const res = await axios.put(`/api/access/${currentRole.id}`, {
          email: currentRole.email,
          role: currentRole.role,
          menus: currentRole.menus,
        });
        setRoles((prev) =>
          prev.map((r) => (r.id === currentRole.id ? res.data : r))
        );
        toast.success("Role updated successfully");
      }
      closeModal();
    } catch (e) {
      console.error("Save failed", e);
      toast.error("Failed to save role");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      await axios.delete(`/api/access/${id}`);
      setRoles((prev) => prev.filter((r) => r.id !== id));
      toast.success("Role deleted");
    } catch (e) {
      console.error("Delete failed", e);
      toast.error("Failed to delete role");
    }
  };

  return (
    <div className="col-12" style={{ padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <button
        onClick={openAddModal}
        style={{
          ...buttonStyle,
          marginBottom: "10px",
          backgroundColor: "#28a745",
        }}
      >
        <FaPlus /> Add Role
      </button>

      <table style={tableStyle} className="mt-3 text-center">
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Menus</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td style={tdStyle}>{role.id}</td>
              <td style={tdStyle}>{role.email}</td>
              <td style={tdStyle}>{role.role}</td>
              <td style={tdStyle}>{role.menus}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => openEditModal(role)}
                  style={buttonStyle}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>{modalType === "add" ? "Add New Role" : "Edit Role"}</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <input
                type="email"
                placeholder="Email"
                value={currentRole.email}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, email: e.target.value })
                }
                style={{ padding: "8px" }}
              />
              <select
                value={currentRole.role}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, role: e.target.value })
                }
                style={{ padding: "8px" }}
              >
                <option value="admin">Admin</option>
                <option value="content_creator">Content Creator</option>
              </select>
              <input
                type="text"
                placeholder="Menus (comma separated)"
                value={currentRole.menus}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, menus: e.target.value })
                }
                style={{ padding: "8px" }}
              />
            </div>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={handleSave}
                style={{ ...buttonStyle, backgroundColor: "#007bff" }}
              >
                <FaSave /> Save
              </button>
              <button
                onClick={closeModal}
                style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};
const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f4f4f4",
  textAlign: "left",
};
const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};
const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  padding: "6px 10px",
  margin: "0 4px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#2C75BD",
  color: "#fff",
  fontSize: "0.9rem",
};
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  maxWidth: "90%",
};

export default Access;
