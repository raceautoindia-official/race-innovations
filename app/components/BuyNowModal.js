"use client";

import { useMemo, useState } from "react";

const initialForm = {
  name: "",
  company_name: "",
  email: "",
  designation: "",
  phone: "",
  location: "",
  area_of_interest: "",
  preferred_contact: "Email",
  message: "",
};

export default function BuyNowModal({ report }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState(() => ({
    ...initialForm,
    area_of_interest: report?.title || "",
    message: report?.title
      ? `I am interested in purchasing the report: ${report.title}`
      : "",
  }));

  const modalTitle = useMemo(
    () => `Buy Report${report?.title ? ` - ${report.title}` : ""}`,
    [report]
  );

  const handleOpen = () => {
    setSuccessMsg("");
    setErrorMsg("");
    setOpen(true);
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.company_name.trim()) return "Company name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Enter a valid email address";
    }
    if (!form.phone.trim()) return "Phone number is required";
    if (!form.area_of_interest.trim()) return "Area of interest is required";
    if (!form.preferred_contact.trim()) return "Preferred contact is required";
    if (!form.message.trim()) return "Message is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          area_of_interest:
            form.area_of_interest || report?.title || "Buy Report Enquiry",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit enquiry");
      }

      setSuccessMsg("Enquiry submitted successfully");

      setForm({
        ...initialForm,
        area_of_interest: report?.title || "",
        message: report?.title
          ? `I am interested in purchasing the report: ${report.title}`
          : "",
      });

      setTimeout(() => {
        setOpen(false);
        setSuccessMsg("");
      }, 1500);
    } catch (error) {
      setErrorMsg(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={handleOpen}
        style={{
          backgroundColor: "#3346c7",
          color: "#fff",
          fontWeight: 600,
          borderRadius: "10px",
          padding: "12px 16px",
          border: "none",
          width: "100%",
        }}
      >
        Buy Now
      </button>

      {open && (
        <>
          <div
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(8, 15, 35, 0.55)",
              zIndex: 9998,
            }}
          />

          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "110px 20px 30px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "940px",
                maxHeight: "calc(100vh - 140px)",
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: "18px",
                boxShadow: "0 24px 70px rgba(12, 27, 62, 0.22)",
                border: "1px solid #d9deea",
                margin: "0 auto",
              }}
            >
              <div
                className="d-flex justify-content-between align-items-center"
                style={{
                  padding: "22px 24px",
                  borderBottom: "1px solid #e7ebf3",
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                  borderTopLeftRadius: "18px",
                  borderTopRightRadius: "18px",
                }}
              >
                <div>
                  <h3
                    className="mb-1 fw-bold"
                    style={{
                      color: "#1f2f63",
                      fontSize: "1.45rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {modalTitle}
                  </h3>
                  <div style={{ color: "#6b7890", fontSize: "0.98rem" }}>
                    Fill in your details and we will contact you shortly.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "1.8rem",
                    lineHeight: 1,
                    color: "#6b7890",
                    cursor: "pointer",
                    padding: 0,
                    marginLeft: "12px",
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      className="form-control"
                      value={form.company_name}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                      style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Phone *</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      className="form-control"
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="Enter your designation"
                      style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Enter your location"
                      style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      Area of Interest *
                    </label>
                    <input
                      type="text"
                      name="area_of_interest"
                      className="form-control"
                      value={form.area_of_interest}
                      onChange={handleChange}
                      placeholder="Area of interest"
                      style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      Preferred Contact *
                    </label>
                    <select
                      name="preferred_contact"
                      className="form-select"
                      value={form.preferred_contact}
                      onChange={handleChange}
                      style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                      }}
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Message *</label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your requirement"
                      style={{
                        borderRadius: "10px",
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: "#fff1f1",
                      color: "#b42318",
                      border: "1px solid #f5c2c7",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: "#eefbf3",
                      color: "#067647",
                      border: "1px solid #b7ebc6",
                    }}
                  >
                    {successMsg}
                  </div>
                )}

                <div className="d-flex gap-2 justify-content-end mt-4 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClose}
                    disabled={submitting}
                    style={{
                      minWidth: "120px",
                      borderRadius: "10px",
                      padding: "10px 16px",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn"
                    disabled={submitting}
                    style={{
                      backgroundColor: "#3346c7",
                      color: "#fff",
                      minWidth: "170px",
                      fontWeight: 600,
                      borderRadius: "10px",
                      padding: "10px 16px",
                      border: "none",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}