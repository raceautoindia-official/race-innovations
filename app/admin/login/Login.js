"use client";

import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) {
        const text = await res.text(); 
        console.error("Login failed response:", text);
        toast.error("Login failed");
        return;
      }
  
      const data = await res.json();
      console.log("Login success:", data);
  
    } catch (e) {
      console.error("Login error:", e);
      toast.error("Unexpected error during login");
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
