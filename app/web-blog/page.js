"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState([{ name: "All", slug: "all" }]);
  const [allPosts, setAllPosts] = useState([]);
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

  const featured = filteredPosts?.[0] || null;
  const gridPosts = filteredPosts?.length ? filteredPosts : [];

  return (
    <>
      <Navbar />

      <div className="bg-white main-content">
        <div className="position-relative overflow-hidden heroWrap">
          <img
            src={HERO_BANNER}
            alt="hero"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_HERO;
            }}
          />
          <div className="heroOverlay" />
          <div className="position-absolute top-50 start-50 translate-middle text-center px-3 w-100">
            <span className="badge bg-light text-dark px-3 py-2 rounded-pill">Latest</span>
            <h1 className="text-white mt-3 fw-semibold display-5">{featured?.title || "Blog"}</h1>
            <p className="text-white mt-2 mb-0 mx-auto fw-bold heroExcerpt">
              {featured?.excerpt || "Read our latest updates and guides."}
            </p>
          </div>
        </div>

        <div className="container py-4">
          <div className="topSearch">
            <div className="topSearchInner">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search blogs..."
                className="topSearchInput"
              />
              <button className="topSearchBtn" aria-label="Search" type="button">
                🔍
              </button>
            </div>
          </div>

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
                    <div className="col-12 col-md-6 col-lg-4" key={p.id}>
                      <Link href={`/web-blog/${p.slug}`} className="text-decoration-none">
                        <article className="blogHoverCard">
                          <img
                            src={cardSrc || FALLBACK_CARD}
                            alt={p.title || "Blog image"}
                            className="blogHoverImage"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_CARD;
                            }}
                          />

                          <div className="blogImageFade" />

                          <div className="blogCategoryBadge">
                            {String(p.category_name || "Uncategorized").toUpperCase()}
                          </div>

                          <div className="blogHoverOverlay">
                            <div className="blogMetaRow">
                              <span className="blogType">ARTICLE</span>
                              <span className="blogDate">
                                {new Date(p.published_at || p.created_at || Date.now()).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "long",
                                    day: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>

                            <h3 className="blogHoverTitle">{p.title || "Untitled Post"}</h3>

                            <p className="blogHoverExcerpt">
                              {p.excerpt || "Read more about this article."}
                            </p>

                            <span className="blogReadMore">
                              Read More <span className="arrow">→</span>
                            </span>
                          </div>
                        </article>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Footer />

        <style jsx>{`
          .heroWrap {
            height: 320px;
          }

          .heroOverlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.35);
          }

          .heroExcerpt {
            max-width: 720px;
          }

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
            transition: all 0.2s ease;
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

          .blogHoverCard {
            position: relative;
            height: 520px;
            overflow: hidden;
            background: #ddd;
            cursor: pointer;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
          }

          .blogHoverImage {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transform: scale(1);
            opacity: 1;
            transition:
              transform 0.6s ease,
              opacity 0.45s ease;
            z-index: 1;
          }

          .blogImageFade {
            position: absolute;
            inset: 0;
            background: #f3f3f3;
            opacity: 0;
            transition: opacity 0.45s ease;
            z-index: 2;
          }

          .blogHoverCard::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.24) 0%,
              rgba(0, 0, 0, 0.08) 35%,
              rgba(0, 0, 0, 0.02) 100%
            );
            pointer-events: none;
            z-index: 3;
            transition: opacity 0.35s ease;
          }

          .blogCategoryBadge {
            position: absolute;
            top: 22px;
            left: 24px;
            z-index: 6;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 38px;
            padding: 0 20px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.8);
            background: rgba(77, 83, 79, 0.72);
            backdrop-filter: blur(8px);
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.04em;
            transition: all 0.35s ease;
          }

          .blogHoverOverlay {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 5;
            background: rgba(239, 239, 239, 0.97);
            backdrop-filter: blur(10px);
            border-radius: 34px 34px 0 0;
            padding: 30px 30px 26px;
            min-height: 210px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            transition:
              min-height 0.4s ease,
              background 0.3s ease;
          }

          .blogMetaRow {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 14px;
            color: #2b2b2b;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .blogType {
            font-weight: 800;
          }

          .blogDate {
            color: #444;
            font-weight: 500;
          }

          .blogHoverTitle {
            margin: 0;
            color: #222;
            font-size: 24px;
            line-height: 1.35;
            font-weight: 400;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .blogHoverExcerpt {
            margin: 18px 0 0;
            color: #3f3f3f;
            font-size: 15px;
            line-height: 1.7;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition:
              opacity 0.35s ease,
              max-height 0.35s ease,
              margin 0.35s ease;
          }

          .blogReadMore {
            margin-top: 20px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #111;
            font-size: 14px;
            font-weight: 700;
            opacity: 0;
            transition: opacity 0.35s ease;
          }

          .arrow {
            font-size: 18px;
            line-height: 1;
          }

          .blogHoverCard:hover .blogHoverImage {
            transform: scale(1.03);
            opacity: 0;
          }

          .blogHoverCard:hover .blogImageFade {
            opacity: 1;
          }

          .blogHoverCard:hover::after {
            opacity: 0;
          }

          .blogHoverCard:hover .blogHoverOverlay {
            min-height: 290px;
            background: rgba(245, 245, 245, 0.99);
          }

          .blogHoverCard:hover .blogHoverExcerpt {
            opacity: 1;
            max-height: 180px;
            margin-top: 18px;
          }

          .blogHoverCard:hover .blogReadMore {
            opacity: 1;
          }

          @media (max-width: 991px) {
            .blogHoverCard {
              height: 460px;
            }

            .blogHoverTitle {
              font-size: 22px;
            }

            .blogHoverOverlay {
              min-height: 200px;
            }

            .blogHoverCard:hover .blogHoverOverlay {
              min-height: 270px;
            }
          }

          @media (max-width: 575px) {
            .heroWrap {
              height: 260px;
            }

            .blogHoverCard {
              height: 400px;
            }

            .blogCategoryBadge {
              top: 16px;
              left: 16px;
              min-height: 34px;
              padding: 0 16px;
              font-size: 12px;
            }

            .blogHoverOverlay {
              left: 0;
              right: 0;
              bottom: 0;
              border-radius: 24px 24px 0 0;
              padding: 20px;
              min-height: 190px;
            }

            .blogHoverCard:hover .blogHoverOverlay {
              min-height: 250px;
            }

            .blogHoverTitle {
              font-size: 20px;
            }

            .blogHoverExcerpt {
              font-size: 14px;
              line-height: 1.6;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}