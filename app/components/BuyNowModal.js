"use client";

import React, { useMemo, useState } from "react";
import Script from "next/script";

function getReportPrice(report) {
  const raw =
    report?.price ??
    report?.amount ??
    report?.sale_price ??
    report?.report_price ??
    0;

  const numeric = Number(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export default function BuyNowModal({ report, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_company: "",
  });

  const amount = useMemo(() => getReportPrice(report), [report]);
  const displayCurrency = "USD";

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function closeModal() {
    if (loading) return;
    setStatus({ type: "", message: "" });
    onClose?.();
  }

  async function markFailed(orderId, statusValue = "failed") {
    try {
      await fetch("/api/payment/fail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          status: statusValue,
        }),
      });
    } catch (error) {
      console.error("Mark failed error:", error);
    }
  }

  async function handlePayment() {
    try {
      setStatus({ type: "", message: "" });

      if (!scriptLoaded || typeof window === "undefined" || !window.Razorpay) {
        setStatus({
          type: "error",
          message: "Payment gateway failed to load. Please refresh and try again.",
        });
        return;
      }

      if (!amount || amount <= 0) {
        setStatus({
          type: "error",
          message: "Invalid report price.",
        });
        return;
      }

      if (!form.customer_name || !form.customer_email || !form.customer_phone) {
        setStatus({
          type: "error",
          message: "Name, email, and phone are required.",
        });
        return;
      }

      setLoading(true);

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_id: report?.id || report?.title || "",
          report_title: report?.title || "Report Purchase",
          amount,
          currency: "USD",
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          customer_company: form.customer_company,
        }),
      });

      const orderData = await orderRes.json().catch(() => ({}));

      if (!orderRes.ok || !orderData?.success || !orderData?.order?.id) {
        throw new Error(orderData?.message || "Unable to create payment order.");
      }

      const order = orderData.order;
      const key = orderData.key;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency || "USD",
        name: "Race Auto India",
        description: report?.title || "Report Purchase",
        order_id: order.id,
        prefill: {
          name: form.customer_name,
          email: form.customer_email,
          contact: form.customer_phone,
        },
        notes: {
          report_id: String(report?.id || ""),
          report_title: String(report?.title || ""),
          company: String(form.customer_company || ""),
        },
        theme: {
          color: "#3b4cca",
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response?.razorpay_order_id,
                razorpay_payment_id: response?.razorpay_payment_id,
                razorpay_signature: response?.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json().catch(() => ({}));

            if (!verifyRes.ok || !verifyData?.success) {
              throw new Error(
                verifyData?.message || "Payment verification failed."
              );
            }

            setStatus({
              type: "success",
              message: "Payment successful. Your purchase has been completed.",
            });

            setTimeout(() => {
              onClose?.();
            }, 1200);
          } catch (error) {
            setStatus({
              type: "error",
              message: error?.message || "Payment verification failed.",
            });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: async function () {
            await markFailed(order.id, "cancelled");
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", async function (response) {
        await markFailed(order.id, "failed");
        setStatus({
          type: "error",
          message:
            response?.error?.description || "Payment failed. Please try again.",
        });
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Payment error:", error);
      setStatus({
        type: "error",
        message: error?.message || "Unable to start payment.",
      });
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => {
          setScriptLoaded(false);
          setStatus({
            type: "error",
            message: "Failed to load Razorpay checkout script.",
          });
        }}
      />

      <div
        onClick={closeModal}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.58)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "620px",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
            maxHeight: "92vh",
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                Buy Report
              </h3>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#6b7280",
                  fontSize: "15px",
                }}
              >
                Complete payment to purchase this report.
              </p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "30px",
                lineHeight: 1,
                color: "#6b7280",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
              padding: "18px",
              marginBottom: "18px",
              background: "#f8fafc",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "8px",
                fontWeight: 700,
              }}
            >
              Selected Report
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.4,
              }}
            >
              {report?.title || "Report"}
            </div>

            <div
              style={{
                marginTop: "12px",
                fontSize: "26px",
                fontWeight: 900,
                color: "#2f45bf",
              }}
            >
              ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>

          {status.message ? (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 14px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 700,
                color: status.type === "success" ? "#166534" : "#b91c1c",
                backgroundColor:
                  status.type === "success" ? "#dcfce7" : "#fee2e2",
                border:
                  status.type === "success"
                    ? "1px solid #bbf7d0"
                    : "1px solid #fecaca",
              }}
            >
              {status.message}
            </div>
          ) : null}

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Name *</label>
              <input
                type="text"
                className="form-control"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Company Name</label>
              <input
                type="text"
                className="form-control"
                name="customer_company"
                value={form.customer_company}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Email *</label>
              <input
                type="email"
                className="form-control"
                name="customer_email"
                value={form.customer_email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Phone *</label>
              <input
                type="text"
                className="form-control"
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="btn"
              style={{
                backgroundColor: "#3b4cca",
                color: "#ffffff",
                border: "none",
                borderRadius: "14px",
                fontWeight: 800,
                minWidth: "150px",
                opacity: loading ? 0.85 : 1,
              }}
            >
              {loading ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}