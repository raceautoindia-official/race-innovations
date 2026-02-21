"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

/** ✅ Robust image resolver */
function resolveImg(src) {
  if (!src) return "";

  let s = String(src).trim();
  if (!s || s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return "";

  s = s.replaceAll("\\", "/");

  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;

  if (s.startsWith("public/")) s = s.slice("public/".length);

  if (s.startsWith("uploads/")) return "/" + s;
  if (s.startsWith("/uploads/")) return s;

  if (!s.startsWith("/")) s = "/" + s;

  return s;
}

const HERO_BANNER = "/images/blog-1.webp";
const FALLBACK_HERO = "/default-banner.jpg";
const FALLBACK_CARD = "/default-banner.jpg";

export default function BlogPage() {
  const [active, setActive] = useState("all"); // tab = slug
  const [q, setQ] = useState("");

  const [categories, setCategories] = useState([{ name: "All", slug: "all" }]);
  const [allPosts, setAllPosts] = useState([]); // store all posts

  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);

  async function loadCategories() {
    try {
      setLoadingCats(true);
      const res = await fetch("/api/categories", { cache: "no-store" });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.error("categories non-JSON:", text.slice(0, 300));
        setCategories([{ name: "All", slug: "all" }]);
        return;
      }

      const data = await res.json();
      const cats = (data.categories || []).map((c) => ({
        name: c.name,
        slug: c.slug,
      }));

      setCategories([{ name: "All", slug: "all" }, ...cats]);
    } catch (e) {
      console.error(e);
      setCategories([{ name: "All", slug: "all" }]);
    } finally {
      setLoadingCats(false);
    }
  }

  async function loadAllPosts() {
    try {
      setLoading(true);

      const res = await fetch("/api/posts", { cache: "no-store" });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.error("posts non-JSON:", text.slice(0, 300));
        setAllPosts([]);
        return;
      }

      const data = await res.json();
      setAllPosts(data.posts || []);
    } catch (e) {
      console.error(e);
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    loadAllPosts();
  }, []);

  // ✅ filter using YOUR API keys: category_slug + (title/excerpt search)
  const filteredPosts = useMemo(() => {
    let list = Array.isArray(allPosts) ? [...allPosts] : [];

    if (active !== "all") {
      list = list.filter(
        (p) => String(p?.category_slug || "").toLowerCase() === String(active).toLowerCase()
      );
    }

    const qq = String(q || "").trim().toLowerCase();
    if (qq) {
      list = list.filter((p) => {
        const t = String(p?.title || "").toLowerCase();
        const e = String(p?.excerpt || "").toLowerCase();
        return t.includes(qq) || e.includes(qq);
      });
    }

    return list;
  }, [allPosts, active, q]);

  // ✅ hero = first post of filtered list
  const featured = filteredPosts?.[0] || null;

  // ✅ FIX: do NOT slice(1) (this was causing missing posts)
  const gridPosts = useMemo(() => {
    if (!filteredPosts?.length) return [];
    return filteredPosts; // ✅ show all filtered posts
  }, [filteredPosts]);

  return (
    <>
      <Navbar />

      <div className="bg-white">
        {/* HERO */}
        <div className="position-relative overflow-hidden" style={{ height: 320 }}>
          <img
            src={HERO_BANNER}
            alt="hero"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_HERO;
            }}
          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,0.35)" }}
          />
          <div className="position-absolute top-50 start-50 translate-middle text-center px-3 w-100">
            <span className="badge bg-light text-dark px-3 py-2 rounded-pill">Latest</span>
            <h1 className="text-white mt-3 fw-semibold display-5">{featured?.title || "Blog"}</h1>
            <p className="text-white mt-2 mb-0 mx-auto fw-bold" style={{ maxWidth: 720 }}>
              {featured?.excerpt || "Read our latest updates and guides."}
            </p>
          </div>
        </div>

        <div className="container py-4">
          {/* SEARCH */}
          <div className="topSearch">
            <div className="topSearchInner">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search blogs..."
                className="topSearchInput"
              />
              <button className="topSearchBtn" aria-label="Search">
                🔍
              </button>
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div className="tabsBar mt-3">
            <div className="label">Blogs:</div>

            {loadingCats ? (
              <div className="text-muted small">Loading categories...</div>
            ) : (
              <div className="tabsScroller" role="tablist" aria-label="Blog categories">
                {categories.map((c) => {
                  const isActive = active === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => setActive(c.slug)}
                      className={`tabBtn ${isActive ? "active" : ""}`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* GRID */}
          <div className="mt-4">
            {loading ? (
              <div className="text-center text-muted py-5">Loading...</div>
            ) : gridPosts.length === 0 ? (
              <div className="text-center text-muted py-5">No posts found.</div>
            ) : (
              <div className="row g-4">
                {gridPosts.map((p) => {
                  const cardSrc = p?.cover_image ? resolveImg(p.cover_image) : FALLBACK_CARD;

                  return (
                    <div className="col-12 col-md-4" key={p.id}>
                      <Link href={`/blog/${p.slug}`} className="text-decoration-none">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="p-3 pb-0">
                            <div className="rounded overflow-hidden">
                              <img
                                src={cardSrc || FALLBACK_CARD}
                                alt={p.title}
                                className="w-100"
                                style={{ height: 160, objectFit: "cover" }}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_CARD;
                                }}
                              />
                            </div>
                          </div>

                          <div className="card-body">
                            <h5 className="card-title fw-semibold mb-2">{p.title}</h5>
                            <p className="card-text text-muted" style={{ fontSize: 14 }}>
                              {p.excerpt}
                            </p>
                          </div>

                          <div className="card-footer bg-white border-0 pt-0">
                            <div className="d-flex justify-content-between text-muted" style={{ fontSize: 12 }}>
                              <span>{p.category_name || "Uncategorized"}</span>
                              <span>{new Date(p.published_at || p.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* STYLES */}
        <style jsx>{`
          .topSearch {
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            background: #fff;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
            padding: 12px;
          }
          .topSearchInner {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .topSearchInput {
            width: 100%;
            border: 1px solid rgba(0, 0, 0, 0.12);
            border-radius: 14px;
            padding: 12px 14px;
            outline: none;
            font-size: 14px;
          }
          .topSearchInput:focus {
            border-color: rgba(107, 59, 90, 0.7);
            box-shadow: 0 0 0 4px rgba(107, 59, 90, 0.12);
          }
          .topSearchBtn {
            border: none;
            background: #6b3b5a;
            color: #fff;
            border-radius: 14px;
            padding: 12px 16px;
            cursor: pointer;
            line-height: 1;
            flex: 0 0 auto;
          }

          .tabsBar {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border: 1px solid rgba(0, 0, 0, 0.06);
            border-radius: 14px;
            background: #fff;
          }
          .label {
            color: #6c757d;
            font-size: 14px;
            white-space: nowrap;
            flex: 0 0 auto;
          }
          .tabsScroller {
            display: flex;
            gap: 10px;
            flex: 1;
            min-width: 0;
            overflow-x: auto;
            padding-bottom: 2px;
            scrollbar-width: none;
          }
          .tabsScroller::-webkit-scrollbar {
            display: none;
          }
          .tabBtn {
            border: 1px solid rgba(0, 0, 0, 0.18);
            background: #fff;
            color: #343a40;
            border-radius: 999px;
            padding: 8px 14px;
            font-size: 14px;
            line-height: 1;
            white-space: nowrap;
            flex: 0 0 auto;
            transition: all 0.15s ease;
          }
          .tabBtn:hover {
            border-color: rgba(0, 0, 0, 0.35);
            transform: translateY(-1px);
          }
          .tabBtn.active {
            background: #212529;
            color: #fff;
            border-color: #212529;
          }
        `}</style>
      </div>
    </>
  );
}