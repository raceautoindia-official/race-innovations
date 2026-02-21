"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/admin"); 
        }, 1500); 
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 bg-image px-3"
      style={{ backgroundImage: "url('/images/b1.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="bg-white bg-opacity-25 backdrop-blur p-4 p-md-5 rounded-4 shadow-lg text-center w-100"
        style={{ maxWidth: "600px" }}>
        <h2 className="text-white fw-bold mb-4">WELCOME</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3 position-relative">
            <FaEnvelope className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary fs-5" />
            <input
              type="email"
              className="form-control ps-5 rounded-pill"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              style={{ fontSize: "14px", padding: "12px" }}
            />
          </div>
          <div className="mb-3 position-relative">
            <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary fs-5" />
            <input
              type="password"
              className="form-control ps-5 rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              style={{ fontSize: "14px", padding: "12px" }}
            />
          </div>
          <div className="text-end">
            <a href="#" className="text-white small text-decoration-none">Forgot Password?</a>
          </div>
          <button type="submit" className="btn btn-light w-100 mt-3 rounded-pill fw-semibold">
            Login
          </button>
        </form>
      </div>

    </div>
  );
};

export default Login;
