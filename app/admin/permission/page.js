"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminAccessPage() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("/api/roles"); // Adjust your API path if needed
      setRoles(res.data);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  };

  const handleEdit = (roleId) => {
    console.log("Edit clicked for Role ID:", roleId);
    // You can navigate or open a modal here
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Role Permissions</h1>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
          >
            <div>
              <h2 className="text-xl font-semibold">{role.role_name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(role.menus)
                  ? role.menus.map((menu, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                      >
                        {menu}
                      </span>
                    ))
                  : role.menus.split(",").map((menu, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                      >
                        {menu.trim()}
                      </span>
                    ))}
              </div>
            </div>

            <button
              onClick={() => handleEdit(role.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAccessPage;
