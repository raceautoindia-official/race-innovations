

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/flipbook");
      setFiles(await res.json());
    } catch {
      toast.error("Could not load files");
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) return toast.error("Select file & enter title");
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
        fetchFiles(); setTitle(""); setPassword(""); setPageFormat(""); setSelectedFile(null);
      } else {
        toast.error(json.error || "Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally { setUploading(false); }
  };

  const startEdit = idx => {
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
    if (editFileRef.current.files[0]) fd.append("pdf", editFileRef.current.files[0]);
    setUploading(true);
    try {
      const res = await fetch("/api/flipbook", { method: "PUT", body: fd });
      const json = await res.json();
      if (res.ok) {
        toast.success("Updated!");
        fetchFiles();
        setShowModal(false); setEditIdx(null);
      } else toast.error(json.error || "Update failed");
    } catch {
      toast.error("Update error");
    } finally { setUploading(false); }
  };

  const handleDelete = async content => {
    if (!confirm("Delete this file?")) return;
    try {
      const res = await fetch(`/api/flipbook?filename=${content}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        toast.success("Deleted!"); fetchFiles();
      } else toast.error(json.error || "Delete failed");
    } catch {
      toast.error("Delete error");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h2>Upload Document</h2>
      <div className="mb-3">
        <input type="text" className="form-control mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="Password (optional)" value={password} onChange={e => setPassword(e.target.value)} />
        <select className="form-select mb-2" value={pageFormat} onChange={e => setPageFormat(e.target.value)}>
          <option value="">Page Format</option>
          <option value="a4-portrait">A4 Portrait</option>
          <option value="a4-landscape">A4 Landscape</option>
        </select>
        <input type="file" accept=".pdf,.ppt,.pptx,.pps,.ppsx" className="form-control mb-2" onChange={e => setSelectedFile(e.target.files[0])} />
        <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</button>
      </div>

      <hr />
      <h3>Your Documents</h3>
      <table className="table">
        <thead><tr><th>Title</th><th>Format</th><th>Actions</th></tr></thead>
        <tbody>
          {files.map((f,i)=>(
            <tr key={f.id}>
              <td>{f.title}</td>
              <td>{f.page_format||"—"}</td>
              <td>
                <Link href={`/reports/flipbook/${f.title_slug}`} className="btn btn-sm btn-success me-2">View</Link>
                <button className="btn btn-sm btn-warning me-2" onClick={()=>startEdit(i)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(f.content)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Document</h5>
                <button type="button" className="btn-close" onClick={()=>setShowModal(false)} />
              </div>
              <div className="modal-body">
                <input type="text" className="form-control mb-2" value={editTitle} onChange={e=>setEditTitle(e.target.value)} placeholder="Title" />
                <input type="password" className="form-control mb-2" placeholder="New password (optional)" onChange={e=>setEditPwd(e.target.value)} />
                <select className="form-select mb-2" value={editFormat} onChange={e=>setEditFormat(e.target.value)}>
                  <option value="">Page Format</option>
                  <option value="a4-portrait">A4 Portrait</option>
                  <option value="a4-landscape">A4 Landscape</option>
                </select>
                <input type="file" ref={editFileRef} accept=".pdf,.ppt,.pptx,.pps,.ppsx" className="form-control mb-2" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleEdit} disabled={uploading}>{uploading?"Saving…":"Save changes"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
