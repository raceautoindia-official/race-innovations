"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Create() {
  const [form, setForm] = useState({
    company_name: "",
    project_name: "",
    date_of_survey: "",
    end_clients: "",
    width: "",
    height: "",
    weight: "",
    length: "",
    from_location: "",
    to_location: "",
  });

  const [pdf, setPdf] = useState(null);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "pdf") setPdf(files[0]);
    if (name === "image") setImage(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (pdf) formData.append("pdf", pdf);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post("/api/create-report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success("Report Created Successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while creating the report.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* <button style={{ background: "#F0B249" }} className="float-end p-2 rounded">
        View Site
      </button> */}

      <div className="container mt-5">
        <div className="col-12">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  className="form-control bg-light"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  className="form-control bg-light"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Date of Survey</label>
                <input
                  type="text"
                  name="date_of_survey"
                  value={form.date_of_survey}
                  onChange={handleChange}
                  className="form-control bg-light"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">End Clients</label>
                <input
                  type="text"
                  name="end_clients"
                  value={form.end_clients}
                  onChange={handleChange}
                  className="form-control bg-light"
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="form-label">Dimension</label>
              <div className="col-3">
                <input
                  placeholder="Width"
                  name="width"
                  value={form.width}
                  onChange={handleChange}
                  type="text"
                  className="form-control bg-light"
                />
              </div>
              <div className="col-3">
                <input
                  placeholder="Height"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  type="text"
                  className="form-control bg-light"
                />
              </div>
              <div className="col-3">
                <input
                  placeholder="Weight"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  type="text"
                  className="form-control bg-light"
                />
              </div>
              <div className="col-3">
                <input
                  placeholder="Length"
                  name="length"
                  value={form.length}
                  onChange={handleChange}
                  type="text"
                  className="form-control bg-light"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">From</label>
                <input
                  type="text"
                  name="from_location"
                  value={form.from_location}
                  onChange={handleChange}
                  className="form-control bg-light"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">To</label>
                <input
                  type="text"
                  name="to_location"
                  value={form.to_location}
                  onChange={handleChange}
                  className="form-control bg-light"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Upload PDF</label>
                <input
                  type="file"
                  name="pdf"
                  onChange={handleFileChange}
                  className="form-control bg-light"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="form-control bg-light"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-dark">
              Create
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Create;
