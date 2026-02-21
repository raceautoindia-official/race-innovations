"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

/** ✅ Robust image resolver */
function resolveImg(src) {
  if (!src) return "";
  let s = String(src).trim();
  if (!s || s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return "";
  s = s.replaceAll("\\", "/");
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  if (s.startsWith("public/")) s = s.slice("public/".length);
  if (s.startsWith("uploads/")) return "/" + s;
  if (!s.startsWith("/")) s = "/" + s;
  return s;
}

function stripHtml(html) {
  const s = String(html || "");
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDateStable(input) {
  if (!input) return "";
  const d = new Date(input);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function timeAgo(dateInput) {
  const d = new Date(dateInput);
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const day = Math.floor(h / 24);
  if (Number.isNaN(s)) return "";
  if (s < 45) return "now";
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  if (day < 7) return `${day}d`;
  return d.toLocaleDateString();
}

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

const LS_EMAIL_KEY = "commenter_email_v1";
const FALLBACK_POST_IMG = "/default-banner.jpg";

export default function InsightDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  // ✅ Center: one post
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);

  // ✅ Left: latest posts
  const [latest, setLatest] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(false);

  // Right: comments
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Email capture
  const [email, setEmail] = useState("");
  const [emailReady, setEmailReady] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_EMAIL_KEY);
      if (saved && isValidEmail(saved)) {
        setEmail(saved);
        setEmailReady(true);
        setShowEmailPrompt(false);
      }
    } catch {}
  }, []);

  async function loadPostBySlug(slugVal) {
    if (!slugVal) return;
    setLoadingPost(true);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slugVal)}`, { cache: "no-store" });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        console.error("post non-JSON:", res.status, await res.text());
        setPost(null);
        return;
      }
      const data = await res.json();
      setPost(data.post || null);
    } catch (e) {
      console.error(e);
      setPost(null);
    } finally {
      setLoadingPost(false);
    }
  }

  async function loadLatestPosts() {
    setLoadingLatest(true);
    try {
      const res = await fetch(`/api/posts?limit=12`, { cache: "no-store" });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        console.error("latest non-JSON:", res.status, await res.text());
        setLatest([]);
        return;
      }
      const data = await res.json();
      const postsArr = data?.posts || data?.data || data?.items || data?.result || [];
      setLatest(Array.isArray(postsArr) ? postsArr : []);
    } catch (e) {
      console.error(e);
      setLatest([]);
    } finally {
      setLoadingLatest(false);
    }
  }

  async function loadComments(postId) {
    if (!postId) {
      setComments([]);
      return;
    }
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/comments?post_id=${encodeURIComponent(postId)}`, {
        cache: "no-store",
      });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        console.error("comments non-JSON:", res.status, await res.text());
        setComments([]);
        return;
      }
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) {
      console.error(e);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect(() => {
    loadPostBySlug(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    loadLatestPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadComments(post?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id]);

  async function postComment(postId) {
    const text = String(commentText || "").trim();
    if (!postId || !text) return;

    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ post_id: postId, email, comment: text }),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error("Non-JSON response");

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to post comment");

      setCommentText("");
      await loadComments(postId);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to post comment");
    } finally {
      setPosting(false);
    }
  }

  async function handlePostClick() {
    const postId = post?.id;
    const text = String(commentText || "").trim();
    if (!postId || !text) return;

    if (!emailReady) {
      setShowEmailPrompt(true);
      setTimeout(() => emailInputRef.current?.focus?.(), 50);
      return;
    }

    await postComment(postId);
  }

  const imgSrc = useMemo(
    () => resolveImg(post?.cover_image) || FALLBACK_POST_IMG,
    [post?.cover_image]
  );

  return (
    <>
      <Navbar />

      <div className="raPage">
        <div className="container-fluid raShellFluid">
          <div className="raHeaderRow">
            <Link href="/web-blog" className="raBackBtn">
              ← Back to Blogs
            </Link>
          </div>

          <div className="raGrid mt-5">
            {/* ✅ LEFT: latest blogs cards (image on top) */}
            <aside className="raLeft">
              <div className="raSideCard">
                <div className="raSideCover" />
                <div className="raSideBody">
                  <div className="raSideAvatar">R</div>
                  <div className="raSideName">Race Auto India</div>
                  <div className="raSideSub">Insights & Reports</div>

                  <div className="raSideLine" />

                  <div className="raSideTitleRow">
                    <div className="raSideTitle">Latest Blogs</div>
                    <button
                      className="raSideRefresh"
                      onClick={loadLatestPosts}
                      disabled={loadingLatest}
                      title="Refresh"
                    >
                      {loadingLatest ? "…" : "↻"}
                    </button>
                  </div>

                  <div className="raLatestCards">
                    {loadingLatest ? (
                      <div className="muted small">Loading…</div>
                    ) : latest?.length ? (
                      latest
                        .filter((p) => p?.slug && p.slug !== slug)
                        .slice(0, 8)
                        .map((p) => {
                          const thumb = resolveImg(p.cover_image) || FALLBACK_POST_IMG;
                          const excerpt =
                            p.excerpt ||
                            (p.content ? stripHtml(p.content).slice(0, 130) + "…" : "");
                          return (
                            <Link
                              key={p.id || p.slug}
                              href={`/blog/${p.slug}`}
                              className="raLatestCard"
                            >
                              <img
                                src={thumb}
                                alt={p.title || "blog"}
                                className="raLatestCardImg"
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_POST_IMG;
                                }}
                              />

                              <div className="raLatestCardBody">
                                <div className="raLatestCardTitle">{p.title}</div>
                                {excerpt ? <div className="raLatestCardExcerpt">{excerpt}</div> : null}

                                <div className="raLatestCardFooter">
                                  <span className="raLatestCat">{p.category_name || "Insights"}</span>
                                  <span className="raLatestDate">
                                    {formatDateStable(p.published_at || p.created_at)}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })
                    ) : (
                      <div className="muted small">No posts found.</div>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* CENTER */}
            <main className="raCenter">
              {loadingPost ? (
                <div className="raCenterCard centerMuted">Loading post...</div>
              ) : !post ? (
                <div className="raCenterCard centerMuted">Post not found.</div>
              ) : (
                <article className="raPost">
                  <div className="raPostHead">
                    <div className="raAvatarCircle">R</div>

                    <div className="raHeadMeta">
                      <div className="raAuthorName">Race Auto India</div>
                      <div className="raMetaRow">
                        <span>{post.category_name || "Insights"}</span>
                        <span className="dot">•</span>
                        <span>{formatDateStable(post.published_at || post.created_at)}</span>
                      </div>
                    </div>

                    <div className="raKebab" aria-hidden="true">
                      •••
                    </div>
                  </div>

                  <div className="raPostBody">
                    <div className="raPostTitle">{post.title}</div>

                    {post.content ? (
                      <div
                        className="raPostContent"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    ) : post.excerpt ? (
                      <div className="raPostText">{post.excerpt}</div>
                    ) : null}
                  </div>

                  <div className="raPostMedia">
                    <img
                      src={imgSrc}
                      alt={post.title}
                      className="raPostMediaImg"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_POST_IMG;
                      }}
                    />
                  </div>
                </article>
              )}
            </main>

            {/* RIGHT */}
            <aside className="raRight">
              <div className="raDiscuss">
                <div className="raDiscussTitle">Discussions</div>
                <div className="raDiscussOn">
                  On: <span className="raDiscussOnTitle">{post?.title || "—"}</span>
                </div>

                <div className="raDiscussDivider" />

                <textarea
                  id="commentBox"
                  className="raTextarea"
                  rows={4}
                  placeholder="Add a comment…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <button
                  className="raPrimaryBtn"
                  disabled={posting || !String(commentText || "").trim() || !post?.id}
                  onClick={handlePostClick}
                >
                  {posting ? "Posting…" : "Post"}
                </button>

                <div className="raDiscussListWrap">
                  {loadingComments ? (
                    <div className="muted small">Loading comments...</div>
                  ) : comments.length === 0 ? (
                    <div className="muted small">No comments yet.</div>
                  ) : (
                    <div className="raDiscussList">
                      {comments.map((c) => (
                        <div className="raComment" key={c.id}>
                          <div className="raCommentTop">
                            <div className="raCommentEmail">{c.email || "User"}</div>
                            <div className="raCommentTime">{timeAgo(c.created_at)}</div>
                          </div>
                          <div className="raCommentText">{c.comment}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Email modal */}
          {showEmailPrompt ? (
            <div
              className="emailBackdrop"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setShowEmailPrompt(false);
              }}
            >
              <div className="emailCard" onMouseDown={(e) => e.stopPropagation()}>
                <div className="fw-semibold" style={{ fontSize: 16 }}>
                  Enter your email
                </div>
                <div className="text-muted mt-1" style={{ fontSize: 13 }}>
                  We’ll remember it for next time.
                </div>

                <input
                  ref={emailInputRef}
                  className="form-control mt-3"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = String(email || "").trim();
                      if (!isValidEmail(v)) return alert("Please enter a valid email");
                      localStorage.setItem(LS_EMAIL_KEY, v);
                      setEmail(v);
                      setEmailReady(true);
                      setShowEmailPrompt(false);
                      setTimeout(() => handlePostClick(), 0);
                    }
                  }}
                />

                <div className="d-flex gap-2 justify-content-end mt-3">
                  <button className="btn btn-light" onClick={() => setShowEmailPrompt(false)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => {
                      const v = String(email || "").trim();
                      if (!isValidEmail(v)) return alert("Please enter a valid email");
                      localStorage.setItem(LS_EMAIL_KEY, v);
                      setEmail(v);
                      setEmailReady(true);
                      setShowEmailPrompt(false);
                      setTimeout(() => handlePostClick(), 0);
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <style jsx>{`
          .raPage {
            background: #f6f7fb;
            min-height: 100vh;
          }
          .raShellFluid {
            padding-left: 14px;
            padding-right: 14px;
            padding-bottom: 28px;
          }
          .raHeaderRow {
            display: flex;
            align-items: center;
            padding: 10px 0;
          }
          .raBackBtn {
            text-decoration: none;
            color: #2563eb;
            font-weight: 800;
          }
          .raBackBtn:hover {
            text-decoration: underline;
          }

          .raGrid {
            margin-top: 10px;
            display: grid;
            grid-template-columns: 320px minmax(0, 1fr) 380px;
            gap: 18px;
            align-items: start;
          }

          /* LEFT */
          .raSideCard {
            background: #fff;
            border: 1px solid rgba(17, 24, 39, 0.12);
            border-radius: 12px;
            overflow: hidden;
            position: sticky;
            top: 92px;
          }
          .raSideCover {
            height: 72px;
            background: linear-gradient(90deg, #111827, #374151);
          }
          .raSideBody {
            padding: 14px;
            position: relative;
          }
          .raSideAvatar {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: #e5e7eb;
            display: grid;
            place-items: center;
            font-weight: 900;
            position: absolute;
            top: -29px;
            left: 14px;
            border: 2px solid #fff;
          }
          .raSideName {
            margin-top: 18px;
            font-weight: 900;
            color: #111827;
            font-size: 16px;
          }
          .raSideSub {
            margin-top: 4px;
            color: #6b7280;
            font-size: 13px;
          }
          .raSideLine {
            height: 1px;
            background: rgba(17, 24, 39, 0.08);
            margin: 12px 0;
          }
          .raSideTitleRow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
          }
          .raSideTitle {
            font-weight: 950;
            color: #111827;
            font-size: 13px;
          }
          .raSideRefresh {
            border: 1px solid rgba(17, 24, 39, 0.12);
            background: #fff;
            border-radius: 10px;
            padding: 6px 10px;
            font-weight: 900;
          }

          .raLatestCards {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 62vh;
            overflow: auto;
            padding-right: 4px;
          }

          /* ✅ remove blue underline/link highlight */
          .raLatestCard {
            text-decoration: none !important;
            color: inherit !important;
            border: 1px solid rgba(17, 24, 39, 0.08);
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
            display: block;
            transition: transform 0.12s ease, border-color 0.12s ease;
          }
          .raLatestCard * {
            text-decoration: none !important;
            color: inherit !important;
          }
          .raLatestCard:hover {
            transform: translateY(-1px);
            border-color: rgba(17, 24, 39, 0.18);
          }
          .raLatestCard:focus,
          .raLatestCard:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }

          .raLatestCardImg {
            width: 100%;
            height: 140px;
            object-fit: cover;
            display: block;
            background: #f3f4f6;
          }
          .raLatestCardBody {
            padding: 10px;
          }
          .raLatestCardTitle {
            font-weight: 950;
            color: #111827;
            font-size: 14px;
            line-height: 1.25;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .raLatestCardExcerpt {
            margin-top: 8px;
            color: #4b5563;
            font-size: 12.5px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .raLatestCardFooter {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #6b7280;
            font-size: 12px;
          }
          .raLatestCat {
            font-weight: 800;
            color: #111827;
          }

          /* CENTER */
          .raCenter {
            min-width: 0;
            display: block;
          }
          .raPost,
          .raCenterCard {
            width: 100%;
            max-width: none;
          }
          .raPost {
            background: #fff;
            border: 1px solid rgba(17, 24, 39, 0.12);
            border-radius: 12px;
            overflow: hidden;
          }
          .raCenterCard {
            background: #fff;
            border: 1px solid rgba(17, 24, 39, 0.12);
            border-radius: 12px;
            padding: 18px;
          }
          .centerMuted {
            color: #6b7280;
            text-align: center;
          }

          .raPostHead {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px 12px 8px;
          }
          .raAvatarCircle {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            background: #111827;
            color: #fff;
            display: grid;
            place-items: center;
            font-weight: 900;
            flex: 0 0 auto;
          }
          .raHeadMeta {
            flex: 1;
            min-width: 0;
          }
          .raAuthorName {
            font-weight: 900;
            color: #111827;
            font-size: 14px;
          }
          .raMetaRow {
            margin-top: 2px;
            display: flex;
            align-items: center;
            gap: 6px;
            color: #6b7280;
            font-size: 12px;
          }
          .dot {
            opacity: 0.7;
          }
          .raKebab {
            color: #6b7280;
            font-weight: 900;
            padding: 6px 8px;
          }
          @media (min-width: 1100px) {
            .raKebab {
              display: none !important;
            }
          }

          .raPostBody {
            padding: 0 12px 10px;
          }
          .raPostTitle {
            font-size: 28px;
            font-weight: 950;
            color: #111827;
            margin: 2px 0 10px;
            line-height: 1.15;
          }

          .raPostContent :global(p) {
            margin: 0 0 12px;
            color: #374151;
            line-height: 1.75;
            font-size: 14.5px;
          }

          .raPostMedia {
            border-top: 1px solid rgba(17, 24, 39, 0.08);
            border-bottom: 1px solid rgba(17, 24, 39, 0.08);
            background: #fff;
          }
          .raPostMediaImg {
            width: 100%;
            display: block;
            height: 360px;
            object-fit: contain;
            background: #fff;
          }

          /* RIGHT */
          .raDiscuss {
            position: sticky;
            top: 92px;
            background: #fff;
            border: 1px solid rgba(17, 24, 39, 0.12);
            border-radius: 12px;
            padding: 12px;
          }

          .raDiscussTitle {
            font-size: 14px;
            font-weight: 950;
            color: #111827;
          }
          .raDiscussOn {
            margin-top: 6px;
            font-size: 12.5px;
            color: #6b7280;
            line-height: 1.3;
          }
          .raDiscussOnTitle {
            color: #111827;
            font-weight: 900;
          }
          .raDiscussDivider {
            height: 1px;
            background: rgba(17, 24, 39, 0.08);
            margin: 10px 0;
          }
          .raTextarea {
            width: 100%;
            border: 1px solid rgba(17, 24, 39, 0.18);
            border-radius: 12px;
            padding: 10px;
            outline: none;
            font-size: 13.5px;
            resize: vertical;
          }
          .raPrimaryBtn {
            width: 100%;
            margin-top: 10px;
            border: none;
            border-radius: 12px;
            padding: 10px 12px;
            font-weight: 950;
            background: #111827;
            color: #fff;
          }

          .muted {
            color: #6b7280;
          }

          .emailBackdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 12px;
          }
          .emailCard {
            width: 100%;
            max-width: 420px;
            background: #fff;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 16px 60px rgba(0, 0, 0, 0.25);
          }

          @media (max-width: 1100px) {
            .raGrid {
              grid-template-columns: 1fr;
            }
            .raLeft {
              display: none;
            }
            .raDiscuss {
              position: static;
            }
          }
        `}</style>
      </div>
    </>
  );
}