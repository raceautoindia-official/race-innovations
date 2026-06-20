"use client";

import React, { useEffect, useMemo, useState } from "react";

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return num(value).toLocaleString();
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("reports"); // "reports" | "blogs" | "flipbooks"
  const [sortKey, setSortKey] = useState("total_views");
  const [sortDir, setSortDir] = useState("desc");

  async function load() {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/admin/analytics/views?limit=500", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to load analytics");
      }
      setData(json);
    } catch (err) {
      setErrorMsg(err?.message || "Failed to load analytics");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    const list =
      tab === "blogs"
        ? data.blogs || []
        : tab === "flipbooks"
        ? data.flipbooks || []
        : data.reports || [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? list.filter(
          (r) =>
            String(r.title || "").toLowerCase().includes(q) ||
            String(r.slug || "").toLowerCase().includes(q)
        )
      : list;

    return [...filtered].sort((a, b) => {
      let av = a?.[sortKey];
      let bv = b?.[sortKey];
      if (sortKey === "last_viewed") {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
      } else if (sortKey === "title" || sortKey === "slug") {
        av = String(av || "");
        bv = String(bv || "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      } else {
        av = num(av);
        bv = num(bv);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [data, tab, search, sortKey, sortDir]);

  function toggleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function header(label, key, alignRight = true) {
    const isActive = key === sortKey;
    const arrow = isActive ? (sortDir === "asc" ? " ↑" : " ↓") : "";
    return (
      <th
        scope="col"
        onClick={() => toggleSort(key)}
        style={{
          cursor: "pointer",
          textAlign: alignRight ? "right" : "left",
          whiteSpace: "nowrap",
        }}
      >
        {label}
        {arrow}
      </th>
    );
  }

  return (
    <main className="container-fluid px-3 px-md-4 py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-3">
        <div>
          <h1 className="h3 mb-1">Page Analytics</h1>
          <p className="text-muted mb-0 small">
            View counts for reports, blog posts and flipbooks. Same-visitor
            refreshes within 30 min are deduped; bots are excluded.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={load}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Top stats row */}
      <div className="row g-3 mb-3">
        {[
          { label: "Total views", value: data?.totals?.total_views },
          {
            label: "Unique visitors",
            value: data?.totals?.unique_visitors,
          },
          { label: "Last 24h", value: data?.totals?.views_24h },
          { label: "Last 7 days", value: data?.totals?.views_7d },
          { label: "Last 30 days", value: data?.totals?.views_30d },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-4 col-lg">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ background: "#ffffff" }}
            >
              <div className="card-body py-3">
                <div
                  className="text-uppercase small fw-bold"
                  style={{ color: "#64748b", letterSpacing: "0.6px" }}
                >
                  {s.label}
                </div>
                <div
                  className="fw-bold mt-1"
                  style={{ fontSize: "1.6rem", color: "#0b1220" }}
                >
                  {loading ? "…" : fmt(s.value)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {errorMsg ? (
        <div className="alert alert-danger py-2">{errorMsg}</div>
      ) : null}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${tab === "reports" ? "active" : ""}`}
                  onClick={() => setTab("reports")}
                >
                  Reports
                  {data?.reports ? (
                    <span className="badge bg-light text-dark border ms-2">
                      {data.reports.length}
                    </span>
                  ) : null}
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${tab === "blogs" ? "active" : ""}`}
                  onClick={() => setTab("blogs")}
                >
                  Blogs
                  {data?.blogs ? (
                    <span className="badge bg-light text-dark border ms-2">
                      {data.blogs.length}
                    </span>
                  ) : null}
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${tab === "flipbooks" ? "active" : ""}`}
                  onClick={() => setTab("flipbooks")}
                >
                  Flipbooks
                  {data?.flipbooks ? (
                    <span className="badge bg-light text-dark border ms-2">
                      {data.flipbooks.length}
                    </span>
                  ) : null}
                </button>
              </li>
            </ul>

            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search title or slug…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: "280px" }}
            />
          </div>

          {loading ? (
            <div className="text-muted small py-4 text-center">
              Loading…
            </div>
          ) : rows.length === 0 ? (
            <div
              className="text-center text-muted py-5 border rounded"
              style={{ background: "#fafbfe" }}
            >
              No views recorded yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    {header("Title", "title", false)}
                    {header("Total", "total_views")}
                    {header("Unique", "unique_views")}
                    {header("24h", "views_24h")}
                    {header("7d", "views_7d")}
                    {header("30d", "views_30d")}
                    {header("Last viewed", "last_viewed")}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const href =
                      tab === "blogs"
                        ? `/web-blog/${r.slug}`
                        : tab === "flipbooks"
                        ? r.slug === "corporate-profile"
                          ? "/corporate-profile"
                          : `/reports/flipbook/${r.slug}`
                        : `/reports/${r.slug}`;
                    return (
                      <tr key={`${r.content_type}-${r.slug}`}>
                        <td style={{ minWidth: "260px" }}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                            style={{ color: "#1f2a44", fontWeight: 600 }}
                          >
                            {r.title || r.slug || "—"}
                          </a>
                          <div className="text-muted small">{r.slug}</div>
                          {tab === "reports" && r.report_type === "lbi" ? (
                            <span className="badge bg-primary mt-1">LBI</span>
                          ) : null}
                        </td>
                        <td className="text-end fw-bold">
                          {fmt(r.total_views)}
                        </td>
                        <td className="text-end">{fmt(r.unique_views)}</td>
                        <td className="text-end">{fmt(r.views_24h)}</td>
                        <td className="text-end">{fmt(r.views_7d)}</td>
                        <td className="text-end">{fmt(r.views_30d)}</td>
                        <td
                          className="text-end text-muted small"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {formatDate(r.last_viewed)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
