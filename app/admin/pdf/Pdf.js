"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FILES_PER_PAGE = 6;

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 1) return [];

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  });

  return result;
}

export default function PdfUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [pageFormat, setPageFormat] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPwd, setEditPwd] = useState("");
  const [editFormat, setEditFormat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const editFileRef = useRef();

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/flipbook");
      setFiles(await res.json());
    } catch {
      toast.error("Could not load files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const handleUpload = async () => {
    if (!selectedFile || !title.trim())
      return toast.error("Select file & enter title");
    setUploading(true);
    const fd = new FormData();
    fd.append("pdf", selectedFile);
    fd.append("title", title);
    fd.append("password", password);
    fd.append("page_format", pageFormat);
    try {
      const res = await fetch("/api/flipbook", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        toast.success("Uploaded!");
        fetchFiles();
        setTitle("");
        setPassword("");
        setPageFormat("");
        setSelectedFile(null);
      } else {
        toast.error(json.error || "Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (idx) => {
    const f = files[idx];
    setEditIdx(idx);
    setEditTitle(f.title);
    setEditPwd("");
    setEditFormat(f.page_format || "");
    setShowModal(true);
  };

  const handleEdit = async () => {
    const f = files[editIdx];
    const fd = new FormData();
    fd.append("id", f.id);
    fd.append("title", editTitle);
    fd.append("password", editPwd);
    fd.append("page_format", editFormat);
    if (editFileRef.current.files[0])
      fd.append("pdf", editFileRef.current.files[0]);
    setUploading(true);
    try {
      const res = await fetch("/api/flipbook", { method: "PUT", body: fd });
      const json = await res.json();
      if (res.ok) {
        toast.success("Updated!");
        fetchFiles();
        setShowModal(false);
        setEditIdx(null);
      } else toast.error(json.error || "Update failed");
    } catch {
      toast.error("Update error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (content) => {
    if (!confirm("Delete this file?")) return;
    try {
      const res = await fetch(`/api/flipbook?filename=${content}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Deleted!");
        fetchFiles();
      } else toast.error(json.error || "Delete failed");
    } catch {
      toast.error("Delete error");
    }
  };

  const filteredFiles = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => {
      const title = String(f?.title || "").toLowerCase();
      const fmt = String(f?.page_format || "").toLowerCase();
      const slug = String(f?.title_slug || "").toLowerCase();
      return title.includes(q) || fmt.includes(q) || slug.includes(q);
    });
  }, [files, searchText]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFiles.length / FILES_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * FILES_PER_PAGE;
    return filteredFiles.slice(start, start + FILES_PER_PAGE);
  }, [filteredFiles, currentPage]);

  const showingFrom =
    filteredFiles.length === 0 ? 0 : (currentPage - 1) * FILES_PER_PAGE + 1;
  const showingTo = Math.min(
    currentPage * FILES_PER_PAGE,
    filteredFiles.length
  );

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <ToastContainer />

      <div className="row g-4">
        <div className="col-12 col-lg-5 col-xl-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-1">Upload Document</h2>
              <p className="text-muted small mb-3">
                Add a new flipbook PDF or PowerPoint document.
              </p>

              <label className="form-label small fw-semibold">Title</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="form-label small fw-semibold">
                Password (optional)
              </label>
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Set a viewer password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className="form-label small fw-semibold">
                Page Format
              </label>
              <select
                className="form-select mb-2"
                value={pageFormat}
                onChange={(e) => setPageFormat(e.target.value)}
              >
                <option value="">Select format</option>
                <option value="a4-portrait">A4 Portrait</option>
                <option value="a4-landscape">A4 Landscape</option>
              </select>

              <label className="form-label small fw-semibold">File</label>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.pps,.ppsx"
                className="form-control mb-3"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              <button
                className="btn btn-primary w-100"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Upload Document"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7 col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div>
                  <h3 className="h5 mb-1">Your Documents</h3>
                  <div className="text-muted small">
                    {filteredFiles.length} document
                    {filteredFiles.length === 1 ? "" : "s"}
                  </div>
                </div>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title or format…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ maxWidth: "320px" }}
                />
              </div>

              {filteredFiles.length === 0 ? (
                <div className="text-center text-muted py-5 border rounded">
                  No documents found.
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr>
                          <th style={{ minWidth: "220px" }}>Title</th>
                          <th>Format</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedFiles.map((f) => {
                          const realIdx = files.findIndex(
                            (item) => item?.id === f?.id
                          );
                          return (
                            <tr key={f.id}>
                              <td>
                                <div className="fw-semibold">{f.title}</div>
                                {f.title_slug ? (
                                  <div className="text-muted small">
                                    {f.title_slug}
                                  </div>
                                ) : null}
                              </td>
                              <td>
                                <span className="badge bg-light text-dark border">
                                  {f.page_format || "—"}
                                </span>
                              </td>
                              <td className="text-end">
                                <div className="d-inline-flex flex-wrap gap-2 justify-content-end">
                                  <Link
                                    href={`/reports/flipbook/${f.title_slug}`}
                                    className="btn btn-sm btn-success"
                                  >
                                    View
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => startEdit(realIdx)}
                                    disabled={realIdx < 0}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(f.content)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
                    <div className="text-muted small">
                      Showing {showingFrom} to {showingTo} of{" "}
                      {filteredFiles.length} document
                      {filteredFiles.length === 1 ? "" : "s"}
                    </div>

                    {totalPages > 1 && (
                      <div className="d-flex flex-wrap align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage <= 1}
                          aria-label="Previous page"
                        >
                          ‹
                        </button>

                        {getPaginationItems(currentPage, totalPages).map(
                          (item, idx) => {
                            if (typeof item === "string") {
                              return (
                                <span
                                  key={`${item}-${idx}`}
                                  className="px-2 text-muted"
                                >
                                  …
                                </span>
                              );
                            }
                            return (
                              <button
                                key={item}
                                type="button"
                                className={`btn btn-sm ${
                                  currentPage === item
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                                }`}
                                onClick={() => setCurrentPage(item)}
                                aria-current={
                                  currentPage === item ? "page" : undefined
                                }
                              >
                                {item}
                              </button>
                            );
                          }
                        )}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage >= totalPages}
                          aria-label="Next page"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Edit Document</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <label className="form-label small fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                />

                <label className="form-label small fw-semibold">
                  New password (optional)
                </label>
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Leave blank to keep existing"
                  onChange={(e) => setEditPwd(e.target.value)}
                />

                <label className="form-label small fw-semibold">
                  Page Format
                </label>
                <select
                  className="form-select mb-2"
                  value={editFormat}
                  onChange={(e) => setEditFormat(e.target.value)}
                >
                  <option value="">Select format</option>
                  <option value="a4-portrait">A4 Portrait</option>
                  <option value="a4-landscape">A4 Landscape</option>
                </select>

                <label className="form-label small fw-semibold">
                  Replace file (optional)
                </label>
                <input
                  type="file"
                  ref={editFileRef}
                  accept=".pdf,.ppt,.pptx,.pps,.ppsx"
                  className="form-control mb-2"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEdit}
                  disabled={uploading}
                >
                  {uploading ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
