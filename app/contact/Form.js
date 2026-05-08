"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  phone: "",
  location: "",
  message: "",
};

function Form() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const slideFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const organization = formData.organization.trim();
    const location = formData.location.trim();
    const message = formData.message.trim();

    if (!firstName) {
      setStatus({ type: "error", message: "Please enter your first name." });
      return;
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!phone || !PHONE_REGEX.test(phone)) {
      setStatus({
        type: "error",
        message: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }
    if (!message) {
      setStatus({ type: "error", message: "Please enter your message." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = {
        name: fullName,
        company_name: organization || "Not provided",
        email,
        designation: "",
        phone,
        location,
        area_of_interest: "General Enquiry",
        preferred_contact: "Email",
        message,
      };

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        setStatus({
          type: "success",
          message:
            data?.message ||
            "Thanks! Your enquiry has been submitted. Our team will reach out shortly.",
        });
        setFormData(INITIAL_FORM);
      } else {
        setStatus({
          type: "error",
          message:
            data?.message || "Could not submit enquiry. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      className="container-fluid d-flex flex-column justify-content-center align-items-center text-center"
      style={{ marginBottom: "100px" }}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={slideFromBottom}
      onViewportEnter={() => setHasAnimated(true)}
    >
      <h1
        className="mt-2"
        style={{ fontSize: "clamp(1rem, 5vw, 3rem)", whiteSpace: "nowrap" }}
      >
        <span style={{ color: "black" }}>You can connect with</span>
        <br />
        <span style={{ color: "#293BB1" }}>us when you need help!</span>
      </h1>

      <form
        className="container bg-white p-3 rounded shadow"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="organization"
                className="form-control"
                placeholder="Organization"
                value={formData.organization}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="mb-3">
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="Phone Number *"
                pattern="^(\+?91[\s-]?)?[6-9]\d{9}$"
                title="Please enter a valid 10-digit mobile number."
                inputMode="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Message */}
          <div className="col-12">
            <div className="mb-3">
              <textarea
                name="message"
                className="form-control"
                rows={4}
                placeholder="Enter your message *"
                value={formData.message}
                onChange={handleChange}
                disabled={submitting}
                required
              ></textarea>
            </div>
          </div>

          {status.message ? (
            <div className="col-12">
              <div
                className={`alert ${
                  status.type === "success"
                    ? "alert-success"
                    : "alert-danger"
                } py-2`}
                role={status.type === "error" ? "alert" : "status"}
              >
                {status.message}
              </div>
            </div>
          ) : null}

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={submitting}
              style={{ minWidth: "160px" }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

export default Form;
