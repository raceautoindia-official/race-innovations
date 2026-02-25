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

/**
 * ✅ Extract LinkedIn "activity" id from common LinkedIn URLs.
 */
function extractLinkedInActivityId(url) {
  const s = String(url || "").trim();
  if (!s) return "";

  const m1 = s.match(/urn:li:activity:(\d+)/i);
  if (m1 && m1[1]) return m1[1];

  const m2 = s.match(/activity-(\d+)/i);
  if (m2 && m2[1]) return m2[1];

  const m3 = s.match(/(\d{12,})/);
  if (m3 && m3[1]) return m3[1];

  return "";
}

const LS_EMAIL_KEY = "commenter_email_v1";
const FALLBACK_POST_IMG = "/default-banner.jpg";

/** ✅ Static fallback LinkedIn URL */
const LINKEDIN_POST_URL =
  "https://www.linkedin.com/posts/race-innovations-private-limited_raceinnovations-indonesiamining-businessgrowth-activity-7368138962076430336-NEUm?utm_source=share&utm_medium=member_desktop&rcm=ACoAAF3_G9IBEMRowcRVIMvHqy6IGZiDev2Lmw0";

export default function PostClient() {
  const params = useParams();
  const slug = params?.slug;

  // Center: one post
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);

  // Left: posts (only to build categories + search)
  const [latest, setLatest] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(false);

  // Sidebar search + active type
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState("All");

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

  // Share toast
  const [shareMsg, setShareMsg] = useState("");

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
      const res = await fetch(`/api/posts?limit=200`, { cache: "no-store" });
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

  function scrollToComments() {
    const el = document.getElementById("commentBox");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus?.();
  }

  async function handleShare() {
    try {
      const url = window.location.href;
      const title = post?.title || "Race Auto India";
      const text = title;

      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied");
      setTimeout(() => setShareMsg(""), 1400);
    } catch (e) {
      console.error(e);
      setShareMsg("Could not share");
      setTimeout(() => setShareMsg(""), 1400);
    }
  }

  const imgSrc = useMemo(
    () => resolveImg(post?.cover_image) || FALLBACK_POST_IMG,
    [post?.cover_image]
  );

  // Build categories from all posts
  const categories = useMemo(() => {
    const set = new Set();
    (latest || []).forEach((p) => {
      const c = String(p?.category_name || "").trim();
      if (c) set.add(c);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [latest]);

  // Show types one-by-one
  const typeList = useMemo(() => {
    const query = String(q || "").trim().toLowerCase();
    return (categories || [])
      .filter((c) => c !== "All")
      .filter((c) => (!query ? true : String(c).toLowerCase().includes(query)))
      .map((c) => ({
        name: c,
        count: (latest || []).filter((p) => String(p?.category_name || "").trim() === c).length,
      }));
  }, [categories, latest, q]);

  // ✅ LinkedIn embed (DB first, else static fallback)
  const linkedInUrl = String(post?.linkedin_url || LINKEDIN_POST_URL || "").trim();
  const linkedInActivityId = useMemo(() => extractLinkedInActivityId(linkedInUrl), [linkedInUrl]);
  const linkedInEmbedSrc = linkedInActivityId
    ? `https://www.linkedin.com/embed/feed/update/urn:li:activity:${linkedInActivityId}`
    : "";

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
            {/* LEFT */}
            <aside className="raLeft">
              <div className="raSideCard">
                <div className="raSideBodyNoHero">
                  <div className="raSearchRow">
                    <div className="raSearchWrap">
                      <span className="raSearchIcon" aria-hidden="true">
                        🔎
                      </span>
                      <input
                        className="raSearchInput"
                        placeholder="Search types…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                      />
                      {q ? (
                        <button className="raClearBtn" onClick={() => setQ("")} title="Clear">
                          ✕
                        </button>
                      ) : null}
                    </div>

                    <button
                      className="raSideRefresh"
                      onClick={loadLatestPosts}
                      disabled={loadingLatest}
                      title="Refresh"
                    >
                      {loadingLatest ? "…" : "↻"}
                    </button>
                  </div>

                  <div className="raSideLine" />

                  <div className="raTypeHeaderRow">
                    <div className="raTypeHeader">Blogs</div>
                    <div className="raTypeSub">Select a type</div>
                  </div>

                  <div className="raTypeList">
                    {loadingLatest ? (
                      <div className="muted small">Loading…</div>
                    ) : typeList?.length ? (
                      typeList.map((t) => (
                        <button
                          key={t.name}
                          type="button"
                          className={`raTypeItem ${activeCat === t.name ? "active" : ""}`}
                          onClick={() => setActiveCat(t.name)}
                        >
                          <span className="raTypeName">{t.name}</span>
                          <span className="raTypeCount">{t.count}</span>
                        </button>
                      ))
                    ) : (
                      <div className="muted small">No types found.</div>
                    )}
                  </div>

                  {/* ✅ LinkedIn embed */}
                  <div className="raSideLine" />

                  <div className="raLiHeaderRow">
                    <div className="raTypeHeader">LinkedIn</div>
                    <div className="raTypeSub">{post?.linkedin_url ? "From post" : "Static"}</div>
                  </div>

                  {linkedInEmbedSrc ? (
                    <>
                      <div className="raLiFrameWrap">
                        <iframe
                          src={linkedInEmbedSrc}
                          width="100%"
                          height="520"
                          frameBorder="0"
                          allowFullScreen
                          title="LinkedIn Post"
                        />
                      </div>

                      <a className="raLiOpenBtn" href={linkedInUrl} target="_blank" rel="noreferrer">
                        Open on LinkedIn →
                      </a>
                    </>
                  ) : (
                    <div className="muted small">LinkedIn URL invalid or missing activity id.</div>
                  )}
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
                <article className="raPostClean">
                  <div className="raArticleOuter">
                    <div className="raArticleInner">
                      {/* ✅ TITLE ROW: title left, share icon right (like your screenshot) */}
                      <div className="raTitleRow">
                        <h1 className="raHeroTitle">{post.title}</h1>

                        <button className="raShareIconBtn" onClick={handleShare} type="button" title="Share">
                          ⤴
                        </button>
                      </div>

                      <div className="raTitleMetaRow">
                        <div className="raTitleMeta">
                          {formatDateStable(post.published_at || post.created_at)}
                        </div>

                        <button className="raCommentsPill" onClick={scrollToComments} type="button">
                          💬 <span className="raCommentsCount">{comments?.length || 0}</span> Comments
                        </button>
                      </div>

                      {shareMsg ? <div className="raShareToast">{shareMsg}</div> : null}

                      {/* ✅ COVER IMAGE: directly below title */}
                      {imgSrc ? (
                        <div className="raCoverMedia">
                          <img
                            src={imgSrc}
                            alt={post.title}
                            className="raCoverImg"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_POST_IMG;
                            }}
                          />
                        </div>
                      ) : null}

                      {/* ✅ CONTENT */}
                      {post.content ? (
                        <div
                          className="raPostContentRef"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      ) : post.excerpt ? (
                        <p className="raPara">{post.excerpt}</p>
                      ) : null}
                    </div>
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
          .raSideBodyNoHero {
            padding: 14px;
          }
          .raSideLine {
            height: 1px;
            background: rgba(17, 24, 39, 0.08);
            margin: 12px 0;
          }
          .raSearchRow {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .raSearchWrap {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid rgba(17, 24, 39, 0.14);
            background: #fff;
            border-radius: 999px;
            padding: 8px 10px;
          }
          .raSearchIcon {
            font-size: 13px;
            opacity: 0.75;
          }
          .raSearchInput {
            border: none;
            outline: none;
            width: 100%;
            font-size: 13px;
            color: #111827;
            background: transparent;
          }
          .raClearBtn {
            border: none;
            background: transparent;
            font-weight: 900;
            opacity: 0.7;
            padding: 0 6px;
            cursor: pointer;
          }
          .raClearBtn:hover {
            opacity: 1;
          }
          .raSideRefresh {
            border: 1px solid rgba(17, 24, 39, 0.12);
            background: #fff;
            border-radius: 10px;
            padding: 8px 10px;
            font-weight: 900;
          }

          .raTypeHeaderRow {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
          }
          .raTypeHeader {
            font-size: 13px;
            font-weight: 950;
            color: #111827;
          }
          .raTypeSub {
            font-size: 12px;
            color: #6b7280;
          }
          .raTypeList {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 44vh;
            overflow: auto;
            padding-right: 4px;
          }
          .raTypeItem {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid rgba(17, 24, 39, 0.12);
            background: #fff;
            border-radius: 12px;
            padding: 12px 12px;
            cursor: pointer;
          }
          .raTypeItem.active {
            background: #111827;
            border-color: #111827;
          }
          .raTypeName {
            font-size: 14px;
            font-weight: 900;
            color: #111827;
          }
          .raTypeItem.active .raTypeName {
            color: #fff;
          }
          .raTypeCount {
            font-size: 12px;
            font-weight: 900;
            color: #6b7280;
            background: rgba(17, 24, 39, 0.06);
            padding: 4px 8px;
            border-radius: 999px;
          }
          .raTypeItem.active .raTypeCount {
            color: #111827;
            background: #fff;
          }

          /* LinkedIn */
          .raLiHeaderRow {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
          }
          .raLiFrameWrap {
            border: 1px solid rgba(17, 24, 39, 0.12);
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
          }
          .raLiOpenBtn {
            display: inline-block;
            margin-top: 10px;
            font-weight: 900;
            color: #2563eb;
            text-decoration: none;
          }
          .raLiOpenBtn:hover {
            text-decoration: underline;
          }

          /* CENTER */
          .raCenter {
            min-width: 0;
            display: block;
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
          .raPostClean {
            background: #fff;
            border: 1px solid rgba(17, 24, 39, 0.12);
            border-radius: 12px;
            overflow: hidden;
          }

          .raArticleOuter {
            padding: 0 56px;
          }
          .raArticleInner {
            max-width: 860px;
            margin: 0 auto;
            padding: 18px 0 30px;
          }
          @media (max-width: 900px) {
            .raArticleOuter {
              padding: 0 18px;
            }
            .raArticleInner {
              max-width: 100%;
            }
          }

          /* ✅ TITLE row */
          .raTitleRow {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
          }
          .raHeroTitle {
            font-size: 38px;
            font-weight: 950;
            color: #111827;
            line-height: 1.06;
            letter-spacing: -0.02em;
            margin: 6px 0 0;
            flex: 1;
          }
          .raShareIconBtn {
            width: 54px;
            height: 54px;
            border-radius: 12px;
            border: 2px solid #111827;
            background: #fff;
            font-weight: 950;
            font-size: 18px;
            cursor: pointer;
            flex: 0 0 auto;
          }
          .raShareIconBtn:hover {
            background: rgba(17, 24, 39, 0.04);
          }

          .raTitleMetaRow {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }
          .raTitleMeta {
            color: #6b7280;
            font-size: 13px;
            font-weight: 700;
          }

          .raCommentsPill {
            border: none;
            background: rgba(37, 99, 235, 0.12);
            color: #2563eb;
            font-weight: 950;
            border-radius: 10px;
            padding: 10px 12px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
          }
          .raCommentsPill:hover {
            background: rgba(37, 99, 235, 0.16);
          }
          .raCommentsCount {
            font-weight: 950;
          }

          .raShareToast {
            display: inline-block;
            margin-top: 10px;
            margin-bottom: 6px;
            color: #111827;
            background: rgba(17, 24, 39, 0.06);
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 900;
          }

          /* ✅ COVER IMAGE below title */
          .raCoverMedia {
            margin-top: 14px;
            border: 1px solid rgba(17, 24, 39, 0.08);
            border-radius: 14px;
            overflow: hidden;
            background: #fff;
          }
          .raCoverImg {
            width: 100%;
            display: block;
            height: auto;
            max-height: 420px;
            object-fit: contain;
            background: #fff;
          }

          /* CONTENT */
          .raPostContentRef {
            margin-top: 18px;
            text-align: justify;
            text-justify: inter-word;
            hyphens: auto;
          }
          .raPostContentRef :global(p),
          .raPostContentRef :global(h1),
          .raPostContentRef :global(h2),
          .raPostContentRef :global(h3),
          .raPostContentRef :global(h4),
          .raPostContentRef :global(blockquote),
          .raPostContentRef :global(ul),
          .raPostContentRef :global(ol),
          .raPostContentRef :global(li) {
            margin-left: 0 !important;
            padding-left: 0 !important;
          }
          .raPostContentRef :global(p) {
            margin: 0 0 26px !important;
            line-height: 1.85;
            font-size: 18px;
          }
          .raPostContentRef :global(ul),
          .raPostContentRef :global(ol) {
            margin: 0 0 26px !important;
            padding: 0 !important;
            list-style: none !important;
          }
          .raPostContentRef :global(li) {
            margin: 0 0 14px !important;
            padding: 0 !important;
            list-style: none !important;
            font-size: 18px;
            line-height: 1.85;
          }
          .raPostContentRef :global(li::marker) {
            content: "" !important;
          }
          .raPostContentRef :global(a) {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 800;
          }

          .raPara {
            margin: 0 0 26px;
            line-height: 1.85;
            font-size: 18px;
            text-align: justify;
            text-justify: inter-word;
            hyphens: auto;
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
            .raHeroTitle {
              font-size: 40px;
            }
            .raPostContentRef :global(p),
            .raPostContentRef :global(li) {
              font-size: 16px;
            }
          }
        `}</style>
      </div>
    </>
  );
}