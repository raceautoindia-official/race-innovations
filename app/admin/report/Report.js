"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    MdDashboard,
    MdArticle,
    MdAssessment,
    MdImage,
    MdAttachMoney,
    MdHome,
    MdSettings,
} from "react-icons/md";

const NavItem = ({ href, icon, text, isCollapsed }) => (
    <li style={navItemStyle}>
        <Link href={href} style={linkStyle}>
            <span style={iconStyle}>{icon}</span>
            {!isCollapsed && <span style={{ color: "black", fontWeight: "500" }}>{text}</span>}
        </Link>
    </li>
);

export default function Report() {
    const [isMobile, setIsMobile] = useState(false);
    const [reports, setReports] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [toDeleteId, setToDeleteId] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get("/api/create-report");
            setReports(res.data);
        } catch (err) {
            console.error("Failed to fetch reports", err);
            toast.error("Failed to load reports");
        }
    };

    const openDeleteModal = (id) => {
        setToDeleteId(id);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setToDeleteId(null);
        setShowModal(false);
       
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/create-report?id=${toDeleteId}`);
            setReports(prev => prev.filter(r => r.id !== toDeleteId));
            toast.success("Report deleted successfully");
        } catch (err) {
            console.error("Failed to delete report", err);
            toast.error("Failed to delete report");
        } finally {
            closeDeleteModal();
        }
    };

    return (
        <>
            <div style={{ display: "flex", width: "100%" }}>
                <div style={{ width: "100%", padding: "20px" }}>
                    <div style={buttonContainerStyle}>
                        <button style={viewSiteButtonStyle}>View Site</button>
                        <Link href="/admin/create-report">
                            <button style={addBlogButtonStyle}>Add Report</button>
                        </Link>
                    </div>

                    {reports.map(report => (
                        <div key={report.id} className="col-12">
                            <div className="card" style={cardStyle}>
                                <div className="row align-items-center">
                                    <div className="col-md-6 d-flex flex-column justify-content-center">
                                        {[
                                            { label: "Company Name", value: report.company_name },
                                            { label: "Project Name", value: report.project_name },
                                            { label: "Date Of Survey", value: report.date_of_survey },
                                            { label: "End Clients", value: report.end_clients },
                                        ].map((item, idx) => (
                                            <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                                <p><strong>{item.label}:</strong></p>
                                                <p>{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-md-6 text-end">
                                        <div style={dimensionContainerStyle}>
                                            <p><strong>Dimension:</strong></p>
                                            {[
                                                { label: "Width", value: report.width },
                                                { label: "Height", value: report.height },
                                                { label: "Weight", value: report.weight },
                                                { label: "Length", value: report.length },
                                            ].map((dim, idx) => (
                                                <div key={idx} style={dimensionInputStyle}>
                                                    <label>{dim.label}</label>
                                                    <input type="text" value={dim.value} style={inputStyle} readOnly />
                                                </div>
                                            ))}
                                        </div>
                                        <div style={actionContainerStyle}>
                                            {[
                                                { label: "From", value: report.from_location },
                                                { label: "To", value: report.to_location },
                                            ].map((fld, idx) => (
                                                <div key={idx} style={dimensionInputStyle}>
                                                    <label><strong>{fld.label}:</strong></label>
                                                    <input type="text" value={fld.value} style={inputStyle} readOnly />
                                                </div>
                                            ))}
                                            <Link href={`/admin/edit-report/${report.id}`}>  
                                                <button style={editButtonStyle}>Edit</button>
                                            </Link>
                                            <button onClick={() => openDeleteModal(report.id)} style={deleteButtonStyle}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Delete Confirmation Modal */}
                {showModal && (
                    <div style={modalOverlayStyle}>
                        <div style={modalStyle}>
                            <p>Are you sure you want to delete this report?</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button onClick={confirmDelete} style={confirmButtonStyle}>
                                    Yes, Delete
                                </button>
                                <button onClick={closeDeleteModal} style={cancelButtonStyle}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </>
    );
}

// Styles
const navItemStyle = { textAlign: 'center', transition: '0.3s', cursor: 'pointer' };
const iconStyle = { fontSize: 20, color: 'black' };
const linkStyle = { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, width: '100%' };
const buttonContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 20 };
const viewSiteButtonStyle = { backgroundColor: '#f0b249', padding: '10px 20px', borderRadius: 5, color: 'black', fontWeight: 'bold', cursor: 'pointer' };
const addBlogButtonStyle = { backgroundColor: '#013f7c', color: 'white', padding: '10px 20px', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' };
const cardStyle = { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, boxShadow: '2px 2px 10px rgba(0,0,0,0.1)', marginBottom: 20 };
const dimensionContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 };
const dimensionInputStyle = { display: 'flex', alignItems: 'center', gap: 5 };
const inputStyle = { width: 60, padding: 5 };
const actionContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 15, marginTop: 10 };
const editButtonStyle = { backgroundColor: '#615c9f', padding: '8px 12px', borderRadius: 5, color: 'white', border: 'none', cursor: 'pointer' };
const deleteButtonStyle = { backgroundColor: 'black', padding: '8px 12px', borderRadius: 5, color: 'white', border: 'none', cursor: 'pointer' };

// Modal styles
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
};
const modalStyle = {
    backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '300px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
};
const confirmButtonStyle = { backgroundColor: '#e74c3c', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 5, cursor: 'pointer' };
const cancelButtonStyle = { backgroundColor: '#bdc3c7', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 5, cursor: 'pointer' };
