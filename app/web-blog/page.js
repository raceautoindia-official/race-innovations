"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
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

const SAFE_FALLBACK =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <rect width="100%" height="100%" fill="#d9d9d9"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="34" fill="#666">
        Blog Image
      </text>
    </svg>
  `);

function formatDate(value) {
  const d = new Date(value || Date.now());
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [categories, setCategories] = useState([{ name: "All", slug: "all" }]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recent");

  const [appliedCategory, setAppliedCategory] = useState("all");
  const [appliedYear, setAppliedYear] = useState("all");
  const [appliedSort, setAppliedSort] = useState("recent");

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      const ct = res.headers.get("content-type") || "";

      if (!ct.includes("application/json")) {
        setCategories([{ name: "All", slug: "all" }]);
        return;
      }

      const data = await res.json();
      const cats = (data.categories || []).map((c) => ({
        name: c.name,
        slug: c.slug,
      }));

      setCategories([{ name: "All", slug: "all" }, ...cats]);
    } catch (error) {
      console.error(error);
      setCategories([{ name: "All", slug: "all" }]);
    }
  }

  async function loadAllPosts() {
    try {
      setLoading(true);

      const res = await fetch("/api/posts", { cache: "no-store" });
      const ct = res.headers.get("content-type") || "";

      if (!ct.includes("application/json")) {
        setAllPosts([]);
        return;
      }

      const data = await res.json();
      setAllPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (error) {
      console.error(error);
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    loadAllPosts();
  }, []);

  const years = useMemo(() => {
    const set = new Set();

    allPosts.forEach((post) => {
      const dt = post?.published_at || post?.created_at;
      if (!dt) return;
      const y = new Date(dt).getFullYear();
      if (!Number.isNaN(y)) set.add(String(y));
    });

    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let list = Array.isArray(allPosts) ? [...allPosts] : [];

    if (appliedCategory !== "all") {
      list = list.filter(
        (p) =>
          String(p?.category_slug || "").toLowerCase() ===
          String(appliedCategory).toLowerCase()
      );
    }

    if (appliedYear !== "all") {
      list = list.filter((p) => {
        const dt = p?.published_at || p?.created_at;
        if (!dt) return false;
        return String(new Date(dt).getFullYear()) === String(appliedYear);
      });
    }

    if (appliedSort === "recent") {
      list.sort(
        (a, b) =>
          new Date(b?.published_at || b?.created_at || 0).getTime() -
          new Date(a?.published_at || a?.created_at || 0).getTime()
      );
    } else if (appliedSort === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a?.published_at || a?.created_at || 0).getTime() -
          new Date(b?.published_at || b?.created_at || 0).getTime()
      );
    } else if (appliedSort === "az") {
      list.sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
    } else if (appliedSort === "za") {
      list.sort((a, b) => String(b?.title || "").localeCompare(String(a?.title || "")));
    }

    return list;
  }, [allPosts, appliedCategory, appliedYear, appliedSort]);

  const applyFilters = () => {
    setAppliedCategory(selectedCategory);
    setAppliedYear(selectedYear);
    setAppliedSort(selectedSort);
  };

  const getCardClass = (index) => {
    const mod = index % 4;
    if (mod === 0) return "large-left";
    if (mod === 1) return "small-right";
    if (mod === 2) return "small-left";
    return "large-right";
  };
const router = useRouter();
  return (
    <>
      <Navbar />

      <div className="blogPageWrap  main-content">
        <div className="container-fluid blogContainer">
          <div className="filterBar mt-40">
            <div className="filterBox">
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Select Category</option>
                {categories
                  .filter((c) => c.slug !== "all")
                  .map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="filterBox">
              <label>Year</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="all">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="filterBox">
              <label>Sort By</label>
              <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest</option>
                <option value="az">Title A-Z</option>
                <option value="za">Title Z-A</option>
              </select>
            </div>

            <div className="applyWrap">
              <button type="button" className="applyBtn" onClick={applyFilters}>
                Apply
              </button>
            </div>
          </div>

          {loading ? (
            <div className="emptyState">Loading...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="emptyState">No posts found.</div>
          ) : (
            <div className="newsGrid">
              {filteredPosts.map((post, index) => {
                const imageSrc = resolveImg(post?.cover_image) || SAFE_FALLBACK;

                return (
                  <div
                    key={post.id || index}
                    className={`newsCard ${getCardClass(index)}`}
                    onClick={() => router.push(`/web-blog/${post.slug}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={imageSrc}
                      alt={post?.title || "Blog image"}
                      className="newsImage"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SAFE_FALLBACK;
                      }}
                    />

                    <div className="newsOverlay" />

                    <div className="newsDate">
                      {formatDate(post?.published_at || post?.created_at)}
                    </div>

                    <div className="newsContent">
                      <h3>{post?.title || "Untitled Post"}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <style jsx>{`
          .blogPageWrap {
            background: #f3f3f3;
            
            padding: 22px 0 60px;
          }

          .blogContainer {
            padding-left: 56px;
            padding-right: 56px;
          }

          .filterBar {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) 180px;
            gap: 24px;
            align-items: end;
            margin-bottom: 44px;
            margin-top: 50px;
          }

          .filterBox label {
            display: block;
            font-size: 15px;
            font-weight: 700;
            color: #111;
            margin-bottom: 10px;
          }

          .filterBox select {
            width: 100%;
            height: 60px;
            border: 1px solid #d1d1d1;
            background: #fff;
            color: #1d1d1d;
            font-size: 16px;
            padding: 0 18px;
            outline: none;
            border-radius: 2px;
          }

          .applyWrap {
            display: flex;
            align-items: end;
          }

          .applyBtn {
            width: 100%;
            height: 60px;
            background: #030a35;
            color: #fff;
            border: none;
            border-radius: 2px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
          }

          .newsGrid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 18px;
            grid-auto-flow: row dense;
          }

          .newsCard {
            position: relative;
            display: block;
            overflow: hidden;
            background: #ddd;
            min-height: 390px;
          }

          .large-left,
          .large-right {
            grid-column: span 8;
            min-height: 420px;
          }

          .small-right,
          .small-left {
            grid-column: span 4;
            min-height: 420px;
          }

          .newsImage {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .newsOverlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.58) 0%,
              rgba(0, 0, 0, 0.2) 42%,
              rgba(0, 0, 0, 0.03) 100%
            );
            z-index: 1;
          }

          .newsDate {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 2;
            background: #414246;
            color: #fff;
            padding: 16px 26px;
            font-size: 16px;
            font-weight: 700;
            line-height: 1;
          }

          .newsContent {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2;
            padding: 22px 16px 18px;
          }

          .newsContent h3 {
            margin: 0;
            color: #fff;
            font-size: 23px;
            line-height: 1.18;
            font-weight: 700;
            max-width: 95%;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          }

          .small-right .newsContent h3,
          .small-left .newsContent h3 {
            font-size: 21px;
            max-width: 92%;
          }

          .emptyState {
            background: #fff;
            border: 1px solid #e4e4e4;
            text-align: center;
            padding: 80px 20px;
            color: #666;
            font-size: 18px;
          }

          @media (max-width: 1400px) {
            .blogContainer {
              padding-left: 32px;
              padding-right: 32px;
            }

            .newsContent h3 {
              font-size: 21px;
            }

            .small-right .newsContent h3,
            .small-left .newsContent h3 {
              font-size: 19px;
            }
          }

          @media (max-width: 1199px) {
            .filterBar {
              grid-template-columns: 1fr 1fr;
            }

            .large-left,
            .large-right,
            .small-right,
            .small-left {
              grid-column: span 6;
              min-height: 360px;
            }
          }

          @media (max-width: 767px) {
            .blogContainer {
              padding-left: 16px;
              padding-right: 16px;
            }

            .filterBar {
              grid-template-columns: 1fr;
              gap: 16px;
              margin-bottom: 28px;
            }

            .filterBox select,
            .applyBtn {
              height: 56px;
              font-size: 16px;
            }

            .newsGrid {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .large-left,
            .large-right,
            .small-right,
            .small-left {
              grid-column: span 1;
              min-height: 280px;
            }

            .newsDate {
              padding: 12px 16px;
              font-size: 14px;
            }

            .newsContent {
              padding: 16px;
            }

            .newsContent h3,
            .small-right .newsContent h3,
            .small-left .newsContent h3 {
              font-size: 19px;
              max-width: 100%;
            }
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
} 