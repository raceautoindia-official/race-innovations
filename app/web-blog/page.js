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
      <rect width="100%" height="100%" fill="#e8edf5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="34" fill="#4b5563">
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
  const router = useRouter();

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

  return (
    <>
      <Navbar />

      <div className="blogPageWrap main-content ">
        <div className="container-fluid blogContainer mt-5">
          <div className="pageHero ">
            <div>
              <p className="eyebrow">Insights / Analysis / Market Intelligence</p>
              <h1>Web Blog</h1>
              <p className="heroText">
                Explore the latest articles, industry updates, and automotive market insights in a
                cleaner and more professional reading experience.
              </p>
            </div>
          </div>

          <div className="filterPanel">
            <div className="filterHeader">
              <div>
                <h2>Browse Articles</h2>
                <p>Filter by category, year, and sorting preference.</p>
              </div>
            </div>

            <div className="filterBar">
              <div className="filterBox">
                <label>Category</label>
                <div className="selectWrap">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories
                      .filter((c) => c.slug !== "all")
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  <span className="selectArrow">⌄</span>
                </div>
              </div>

              <div className="filterBox">
                <label>Year</label>
                <div className="selectWrap">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="all">All Years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <span className="selectArrow">⌄</span>
                </div>
              </div>

              <div className="filterBox">
                <label>Sort By</label>
                <div className="selectWrap">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest</option>
                    <option value="az">Title A-Z</option>
                    <option value="za">Title Z-A</option>
                  </select>
                  <span className="selectArrow">⌄</span>
                </div>
              </div>

              <div className="applyWrap">
                <button type="button" className="applyBtn" onClick={applyFilters}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="emptyState">Loading articles...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="emptyState">No posts found.</div>
          ) : (
            <div className="newsGrid">
              {filteredPosts.map((post, index) => {
                const imageSrc = resolveImg(post?.cover_image) || SAFE_FALLBACK;
                const isFeatured = index === 0;

                return (
                  <article
                    key={post.id || index}
                    className={`newsCard ${isFeatured ? "featuredCard" : ""}`}
                    onClick={() => router.push(`/web-blog/${post.slug}`)}
                  >
                    <div className="imageWrap">
                      <img
                        src={imageSrc}
                        alt={post?.title || "Blog image"}
                        className="newsImage"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = SAFE_FALLBACK;
                        }}
                      />
                    </div>

                    <div className="cardOverlay" />

                    <div className="newsMeta">
                      <span className="dateBadge">
                        {formatDate(post?.published_at || post?.created_at)}
                      </span>
                      {post?.category_name ? (
                        <span className="categoryBadge">{post.category_name}</span>
                      ) : null}
                    </div>

                    <div className="newsContent">
                      <h3>{post?.title || "Untitled Post"}</h3>
                      <div className="readMore">
                        <span>Read Article</span>
                        <span className="arrow">→</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <style jsx>{`
          .blogPageWrap {
            
            padding: 28px 0 70px;
            min-height: 100vh;
          }

          .blogContainer {
            padding-left: 44px;
            padding-right: 44px;
          }

          .pageHero {
            background: linear-gradient(135deg, #ffffff 0%, #f3f7fc 100%);
            border: 1px solid rgba(12, 25, 64, 0.08);
            border-radius: 26px;
            padding: 34px 34px 28px;
            margin: 26px 0 26px;
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.06);
          }

          .eyebrow {
            margin: 0 0 10px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #1e3a8a;
          }

          .pageHero h1 {
            margin: 0;
            font-size: 42px;
            line-height: 1.1;
            font-weight: 800;
            color: #0b1220;
          }

          .heroText {
            margin: 14px 0 0;
            max-width: 820px;
            font-size: 16px;
            line-height: 1.7;
            color: #475569;
          }

          .filterPanel {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 24px;
            padding: 24px;
            margin-bottom: 30px;
            box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
          }

          .filterHeader {
            margin-bottom: 18px;
          }

          .filterHeader h2 {
            margin: 0;
            font-size: 24px;
            line-height: 1.2;
            font-weight: 800;
            color: #0f172a;
          }

          .filterHeader p {
            margin: 8px 0 0;
            font-size: 14px;
            color: #64748b;
          }

          .filterBar {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) 220px;
            gap: 18px;
            align-items: end;
          }

          .filterBox label {
            display: block;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
          }

          .selectWrap {
            position: relative;
          }

          .filterBox select {
            width: 100%;
            height: 58px;
            border: 1px solid #d7dfeb;
            background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
            color: #0f172a;
            font-size: 15px;
            font-weight: 500;
            padding: 0 48px 0 16px;
            outline: none;
            border-radius: 16px;
            appearance: none;
            transition: all 0.22s ease;
            box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.03);
          }

          .filterBox select:hover {
            border-color: #b8c5db;
          }

          .filterBox select:focus {
            border-color: #1d4ed8;
            box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
          }

          .selectArrow {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-52%);
            font-size: 20px;
            color: #475569;
            pointer-events: none;
          }

          .applyWrap {
            display: flex;
            align-items: end;
          }

          .applyBtn {
            width: 100%;
            height: 58px;
            border: none;
            border-radius: 16px;
            background: linear-gradient(135deg, #08114b 0%, #102a83 100%);
            color: #fff;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 14px 28px rgba(8, 17, 75, 0.24);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .applyBtn:hover {
            transform: translateY(-1px);
            box-shadow: 0 18px 34px rgba(8, 17, 75, 0.28);
          }

          .newsGrid {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 22px;
          }

          .newsCard {
            position: relative;
            grid-column: span 4;
            min-width: 0;
            border-radius: 24px;
            overflow: hidden;
            cursor: pointer;
            background: #dbe4f0;
            box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.55);
            transition: transform 0.28s ease, box-shadow 0.28s ease;
            isolation: isolate;
          }

          .newsCard:hover {
            transform: translateY(-4px);
            box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
          }

          .featuredCard {
            grid-column: span 8;
          }

          .imageWrap {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 10;
            overflow: hidden;
          }

          .featuredCard .imageWrap {
            aspect-ratio: 16 / 8.2;
          }

          .newsImage {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.45s ease;
          }

          .newsCard:hover .newsImage {
            transform: scale(1.03);
          }

          .cardOverlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to top,
              rgba(5, 10, 25, 0.72) 0%,
              rgba(8, 17, 40, 0.28) 38%,
              rgba(8, 17, 40, 0.08) 64%,
              rgba(8, 17, 40, 0.01) 100%
            );
            z-index: 1;
          }

          .newsMeta {
            position: absolute;
            top: 18px;
            left: 18px;
            right: 18px;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
            flex-wrap: wrap;
          }

          .dateBadge,
          .categoryBadge {
            display: inline-flex;
            align-items: center;
            min-height: 34px;
            padding: 8px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.02em;
          }

          .dateBadge {
            background: rgba(7, 14, 34, 0.72);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.14);
          }

          .categoryBadge {
            background: rgba(255, 255, 255, 0.92);
            color: #0f172a;
          }

          .newsContent {
            position: absolute;
            left: 18px;
            right: 18px;
            bottom: 18px;
            z-index: 2;
            padding: 0;
            border-radius: 0;
            background: transparent;
            border: none;
            backdrop-filter: none;
            box-shadow: none;
          }

          .newsContent h3 {
            margin: 0;
            color: #ffffff;
            font-size: 25px;
            line-height: 1.24;
            font-weight: 800;
            letter-spacing: -0.01em;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.22);
          }

          .newsCard:not(.featuredCard) .newsContent h3 {
            font-size: 21px;
          }

          .readMore {
            margin-top: 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.95);
            letter-spacing: 0.03em;
            text-transform: uppercase;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
          }

          .arrow {
            font-size: 16px;
            line-height: 1;
          }

          .emptyState {
            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 24px;
            text-align: center;
            padding: 90px 20px;
            color: #475569;
            font-size: 18px;
            box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
          }

          @media (max-width: 1440px) {
            .blogContainer {
              padding-left: 28px;
              padding-right: 28px;
            }

            .pageHero h1 {
              font-size: 36px;
            }

            .newsContent h3 {
              font-size: 23px;
            }

            .newsCard:not(.featuredCard) .newsContent h3 {
              font-size: 19px;
            }
          }

          @media (max-width: 1199px) {
            .filterBar {
              grid-template-columns: 1fr 1fr;
            }

            .featuredCard,
            .newsCard {
              grid-column: span 6;
            }

            .featuredCard .imageWrap,
            .newsCard .imageWrap {
              aspect-ratio: 16 / 10;
            }
          }

          @media (max-width: 767px) {
            .blogPageWrap {
              padding: 18px 0 54px;
            }

            .blogContainer {
              padding-left: 16px;
              padding-right: 16px;
            }

            .pageHero {
              border-radius: 20px;
              padding: 24px 18px 22px;
              margin-top: 18px;
            }

            .pageHero h1 {
              font-size: 28px;
            }

            .heroText {
              font-size: 14px;
            }

            .filterPanel {
              border-radius: 20px;
              padding: 18px;
            }

            .filterBar {
              grid-template-columns: 1fr;
              gap: 14px;
            }

            .featuredCard,
            .newsCard {
              grid-column: span 12;
            }

            .newsGrid {
              gap: 16px;
            }

            .imageWrap,
            .featuredCard .imageWrap {
              aspect-ratio: 16 / 11;
            }

            .newsMeta {
              top: 14px;
              left: 14px;
              right: 14px;
            }

            .newsContent {
              left: 14px;
              right: 14px;
              bottom: 14px;
            }

            .newsContent h3,
            .newsCard:not(.featuredCard) .newsContent h3 {
              font-size: 18px;
              line-height: 1.3;
            }

            .dateBadge,
            .categoryBadge {
              min-height: 30px;
              padding: 6px 10px;
              font-size: 11px;
            }

            .applyBtn,
            .filterBox select {
              height: 54px;
              font-size: 15px;
            }
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}