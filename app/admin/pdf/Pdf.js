// "use client";
// import Link from "next/link";
// import React, { useRef, useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function PdfUpload() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [password, setPassword] = useState("");
//   const [page_format, SetPageFormat] = useState("");
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const [editIndex, setEditIndex] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editPassword, setEditPassword] = useState("");
//   const [editPageFormat, SetEditPageFormat] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
//   const [fileToDelete, setFileToDelete] = useState(null);

//   const editFileInputRef = useRef();

//   const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

//   const fetchUploadedFiles = async () => {
//     try {
//       const response = await fetch("/api/flipbook");
//       const data = await response.json();
//       if (response.ok) {
//         setUploadedFiles(data);
//       } else {
//         toast.error("Failed to load uploaded PDFs.");
//       }
//     } catch (error) {
//       toast.error("Error fetching PDFs.");
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile || !title.trim() || !password.trim()) {
//       toast.error("Select a PDF, enter a title, and set a password.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("pdf", selectedFile);
//     formData.append("title", title);
//     formData.append("password", password);
//     formData.append("page_format", page_format);

//     setUploading(true);

//     try {
//       const res = await fetch("/api/flipbook", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success("PDF uploaded!");
//         fetchUploadedFiles();
//         setTitle("");
//         setPassword("");
//         SetPageFormat("");
//         setSelectedFile(null);
//       } else {
//         toast.error(data.error || "Upload failed.");
//       }
//     } catch (e) {
//       toast.error("Upload error.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditTitle(uploadedFiles[index].title || "");

//     setShowModal(true);
//   };

//   const handleEditSubmit = async () => {
//     const fileToEdit = uploadedFiles[editIndex];
//     const formData = new FormData();
//     formData.append("id", fileToEdit.id);
//     formData.append("title", editTitle);
//     formData.append("password", editPassword);
//     formData.append("page_format", editPageFormat);

//     if (editFileInputRef.current.files.length > 0) {
//       const newFile = editFileInputRef.current.files[0];
//       formData.append("pdf", newFile);
//     }

//     setUploading(true);
//     try {
//       const res = await fetch("/api/flipbook", {
//         method: "PUT",
//         body: formData,
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success("PDF updated!");
//         fetchUploadedFiles();
//         setShowModal(false);
//       } else {
//         toast.error(data.error);
//       }
//     } catch (e) {
//       toast.error("Update error.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDeleteClick = (filename) => {
//     setFileToDelete(filename);
//     setShowDeleteConfirmModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!fileToDelete) return;

//     setUploading(true);
//     try {
//       const res = await fetch(`/api/flipbook?filename=${fileToDelete}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success("PDF deleted.");
//         fetchUploadedFiles();
//         setShowDeleteConfirmModal(false);
//       } else {
//         toast.error(data.error);
//       }
//     } catch (e) {
//       toast.error("Delete error.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDeleteCancel = () => {
//     setShowDeleteConfirmModal(false);
//     setFileToDelete(null);
//   };

//   useEffect(() => {
//     fetchUploadedFiles();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <ToastContainer />
//       <h2>Upload PDF</h2>
//       <div className="row">
//         <div className="col-lg-6">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="PDF title"
//             className="form-control mb-3"
//           />
//         </div>
//         <div className="col-lg-6">
//           <input
//             type="text"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Set Password"
//             className="form-control mb-3"
//           />
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-lg-6 mt-2">
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={handleFileChange}
//             className="mb-3"
//           />
//         </div>
//         <div className="col-lg-6">
//           <label htmlFor="pageFormat" className="form-label">Page Format</label>
//           <select
//             className="form-select"
//             id="pageFormat"
//             name="page_format"
//             value={page_format}
//             onChange={(e) => SetPageFormat(e.target.value)}
//           >
//             <option value="">Select</option>
//             <option value="a4-portrait">A4 Portrait</option>
//             <option value="a4-landscape">A4 Landscape</option>
//           </select>
//         </div>


//       </div>

//       <button onClick={handleUpload} disabled={uploading} style={viewSiteButtonStyle} className="mt-5">
//         {uploading ? "Uploading..." : "Upload PDF"}
//       </button>

//       {uploadedFiles.length > 0 && (
//         <div className="mt-4">
//           <table className="table table-striped">
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {uploadedFiles.map((file, index) => (
//                 <tr key={file.id}>
//                   <td>{file.title}</td>
//                   <td>
//                     <Link
//                       href={`/reports/flipbook/${file.title_slug}`}
//                       style={linkStyle}
//                       className="text-light"
//                     >
//                       View
//                     </Link>
//                     <button onClick={() => handleEditClick(index)} style={editButtonStyle}>
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteClick(file.content)}
//                       style={deleteButtonStyle}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {showDeleteConfirmModal && (
//         <div style={modalBackdropStyle}>
//           <div style={modalStyle}>
//             <h4>Are you sure you want to delete this PDF?</h4>
//             <div>
//               <button
//                 onClick={handleDeleteConfirm}
//                 style={{ ...deleteButtonStyle, backgroundColor: "#27ae60" }} className="me-3"
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 onClick={handleDeleteCancel}
//                 style={deleteButtonStyle}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showModal && (
//         <div style={modalBackdropStyle}>
//           <div style={modalStyle}>
//             <h2>Edit PDF</h2>
//             <div className="form-group">
//               <label>Title</label>
//               <input
//                 type="text"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//                 className="form-control mb-3"
//               />
//             </div>
//             <div className="form-group">
//               <label>Password</label>
//               <input
//                 type="text"
//                 value={editPassword}
//                 onChange={(e) => setEditPassword(e.target.value)}
//                 className="form-control mb-3"
//               />
//             </div>
//             <div className="form-group">
//               <label>Choose a new PDF file </label>
//               <input
//                 type="file"
//                 ref={editFileInputRef}
//                 accept="application/pdf"
//                 className="form-control mb-3"
//               />
//             </div>

//             <label htmlFor="pageFormat" className="form-label">Page Format</label>
//             <select
//               className="form-select"
//               id="pageFormat"
//               name="page_format"
//               value={editPageFormat}
//               onChange={(e) => SetEditPageFormat(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="a4-portrait">A4 Portrait</option>
//               <option value="a4-landscape">A4 Landscape</option>
//             </select>


//             <button
//               onClick={handleEditSubmit}
//               style={{ ...editButtonStyle, backgroundColor: "#27ae60" }} className="mt-2"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setShowModal(false)}
//               style={deleteButtonStyle} className="mt-2"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// const modalBackdropStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "110%",
//   height: "110%",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "5px",
//   width: "400px",
// };

// const viewSiteButtonStyle = {
//   backgroundColor: "rgb(1 63 124)",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   marginBottom: "20px",
//   display: "block",
//   marginLeft: "auto",
//   color: "white",
// };

// const editButtonStyle = {
//   backgroundColor: "#3498db",
//   color: "#fff",
//   padding: "5px 10px",
//   borderRadius: "4px",
//   border: "none",
//   cursor: "pointer",
//   marginRight: "10px",
// };

// const deleteButtonStyle = {
//   backgroundColor: "#e74c3c",
//   color: "#fff",
//   padding: "5px 10px",
//   borderRadius: "4px",
//   border: "none",
//   cursor: "pointer",
// };

// const linkStyle = {
//   marginRight: "10px",
//   backgroundColor: "rgb(59, 59, 60)",
//   color: "#fff",
//   padding: "4px 10px",
//   borderRadius: "4px",
//   textDecoration: "none",
//   display: "inline-block",
// };


// export default PdfUpload;

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
