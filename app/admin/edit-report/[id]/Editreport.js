"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditReport() {
  const { id } = useParams(); // Get the report ID from the URL params
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    pdf_file: null,
    image_file: null,
  });

  const [existingFiles, setExistingFiles] = useState({
    pdf: "",
    image: "",
  });

  useEffect(() => {
    if (id) fetchReport(id);
  }, [id]);

  const fetchReport = async (reportId) => {
    try {
      const res = await axios.get(`/api/create-report/${reportId}`); 
      const data = res.data;
      setForm({
        company_name: data.company_name || "",
        project_name: data.project_name || "",
        date_of_survey: data.date_of_survey?.split("T")[0] || "", 
        end_clients: data.end_clients || "",
        width: data.width || "",
        height: data.height || "",
        weight: data.weight || "",
        length: data.length || "",
        from_location: data.from_location || "",
        to_location: data.to_location || "",
        pdf_file: null,
        image_file: null,
      });
      setExistingFiles({
        pdf: data.pdf || "",
        image: data.image || "",
      });
    } catch (err) {
      toast.error("Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id", id);
      Object.entries(form).forEach(([key, value]) => {
        if (value) {
          const realKey = key === "pdf_file" ? "pdf" : key === "image_file" ? "image" : key;
          formData.append(realKey, value);
        }
      });

      await axios.put(`/api/create-report/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Report updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h3 className="mb-4">Edit Report</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              type="date"
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
          {["width", "height", "weight", "length"].map((dim) => (
            <div className="col-md-3" key={dim}>
              <label className="form-label">{dim.charAt(0).toUpperCase() + dim.slice(1)}</label>
              <input
                type="text"
                name={dim}
                value={form[dim]}
                onChange={handleChange}
                className="form-control bg-light"
              />
            </div>
          ))}
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">From Location</label>
            <input
              type="text"
              name="from_location"
              value={form.from_location}
              onChange={handleChange}
              className="form-control bg-light"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">To Location</label>
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
            <label className="form-label">PDF File</label>
         
            <input
              type="file"
              name="pdf_file"
              onChange={handleFileChange}
              className="form-control bg-light"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Image File</label>
            {existingFiles.image && (
              <img
                key={existingFiles.image}
                src={`https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${existingFiles.image}`}
                alt="Existing"
                className="img-fluid mb-2"
              />
            )}
            <input
              type="file"
              name="image_file"
              onChange={handleFileChange}
              className="form-control bg-light"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-dark" disabled={submitting}>
          {submitting ? "Updating..." : "Update Report"}
        </button>
      </form>
    </div>
  );
}
