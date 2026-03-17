"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter, FaShareNodes } from "react-icons/fa6";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

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
  if (Number.isNaN(d.getTime())) return "";
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

function normalizeSlug(slugValue) {
  if (Array.isArray(slugValue)) return String(slugValue[0] || "").trim();
  return String(slugValue || "").trim();
}

const LS_EMAIL_KEY = "commenter_email_v1";
const FALLBACK_POST_IMG = "";

const LINKEDIN_POST_URL =
  "https://www.linkedin.com/posts/race-innovations-private-limited_raceinnovations-indonesiamining-businessgrowth-activity-7368138962076430336-NEUm?utm_source=share&utm_medium=member_desktop&rcm=ACoAAF3_G9IBEMRowcRVIMvHqy6IGZiDev2Lmw0";

export default function PostClient() {
  const params = useParams();
  const slug = normalizeSlug(params?.slug);

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);

  const [latest, setLatest] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(false);

  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const [email, setEmail] = useState("");
  const [emailReady, setEmailReady] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const emailInputRef = useRef(null);

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
    const safeSlug = normalizeSlug(slugVal);

    if (!safeSlug) {
      setPost(null);
      setLoadingPost(false);
      return;
    }

    setLoadingPost(true);

    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(safeSlug)}`, {
        cache: "no-store",
      });

      const ct = res.headers.get("content-type") || "";

      if (!ct.includes("application/json")) {
        console.error("post non-JSON:", res.status, await res.text());
        setPost(null);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error("post fetch failed:", data);
        setPost(null);
        return;
      }

      console.log("Loaded post:", data?.post);
      console.log("post.content length:", data?.post?.content?.length || 0);

      setPost(data?.post || null);
    } catch (e) {
      console.error("loadPostBySlug error:", e);
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
      console.error("loadLatestPosts error:", e);
      setLatest([]);
    } finally {
      setLoadingLatest(false);
    }
  }

  async function loadComments(postId) {
    if (!postId) {
      setComments([]);
      setLoadingComments(false);
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
      setComments(Array.isArray(data?.comments) ? data.comments : []);
    } catch (e) {
      console.error("loadComments error:", e);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect(() => {
    loadPostBySlug(slug);
  }, [slug]);

  useEffect(() => {
    loadLatestPosts();
  }, []);

  useEffect(() => {
    loadComments(post?.id);
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

      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareMsg("Link copied");
        setTimeout(() => setShareMsg(""), 1400);
        return;
      }

      setShareMsg("Share not supported");
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

  const categories = useMemo(() => {
    const set = new Set();
    (latest || []).forEach((p) => {
      const c = String(p?.category_name || "").trim();
      if (c) set.add(c);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [latest]);

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

  const linkedInUrl = String(post?.linkedin_url || LINKEDIN_POST_URL || "").trim();

  return (
    <>
      <Navbar />

      <div className="raPage main-content">
        <div className="container-fluid raShellFluid">
          <div className="raHeaderRow">
            <Link href="/web-blog" className="raBackBtn">
              ← Back to Blogs
            </Link>
          </div>

          <div className="raGrid mt-5">
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
                      type="button"
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

                  <div className="raSideLine" />

                  <div className="raLiHeaderRow">
                    <div className="raTypeHeader">LinkedIn</div>
                    <div className="raTypeSub">{post?.linkedin_url ? "From post" : "Static"}</div>
                  </div>

                  {linkedInUrl ? (
                    <div className="raLiCard">
                      <div className="raLiCardIcon">in</div>
                      <div className="raLiCardContent">
                        <div className="raLiCardTitle">View LinkedIn post</div>
                        <div className="raLiCardText">
                          Open the original LinkedIn post in a new tab.
                        </div>
                        <a
                          className="raLiOpenBtn"
                          href={linkedInUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open on LinkedIn →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="muted small">LinkedIn URL not available.</div>
                  )}
                </div>
              </div>
            </aside>

            <main className="raCenter">
              {loadingPost ? (
                <div className="raCenterCard centerMuted">Loading post...</div>
              ) : !post ? (
                <div className="raCenterCard centerMuted">Post not found.</div>
              ) : (
                <article className="raPostClean">
                  <div className="raArticleOuter">
                    <div className="raArticleInner">
                      <div className="raTitleRow">
                        <h1 className="raHeroTitle">{post.title}</h1>

                        <div className="raTitleActions">
                          <button
                            className="raShareIconBtn"
                            onClick={handleShare}
                            type="button"
                            title="Share this post"
                          >
                            <FaShareNodes size={20} />
                          </button>

                          <div className="raSocialLinks">
                            <a
                              href="https://www.instagram.com/raceinnovations/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="raSocialIcon raInstagram"
                              title="Instagram"
                            >
                              <FaInstagram size={18} />
                            </a>

                            <a
                              href="https://www.facebook.com/raceinnovationspvtltd/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="raSocialIcon raFacebook"
                              title="Facebook"
                            >
                              <FaFacebook size={18} />
                            </a>

                            <a
                              href="https://x.com/raceinnovations"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="raSocialIcon raTwitter"
                              title="X"
                            >
                              <FaXTwitter size={16} />
                            </a>

                            <a
                              href="https://www.linkedin.com/company/race-innovations-private-limited/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="raSocialIcon raLinkedin"
                              title="LinkedIn"
                            >
                              <FaLinkedin size={18} />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="raTitleMetaRow">
                        <div className="raTitleMeta">
                          {formatDateStable(post.published_at || post.created_at)}
                        </div>

                        <button
                          className="raCommentsPill"
                          onClick={scrollToComments}
                          type="button"
                        >
                          💬 <span className="raCommentsCount">{comments?.length || 0}</span> Comments
                        </button>
                      </div>

                      {shareMsg ? <div className="raShareToast">{shareMsg}</div> : null}

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

                      {post.content ? (
                        <div
                          className="raPostContentRef"
                          dangerouslySetInnerHTML={{ __html: String(post.content) }}
                        />
                      ) : post.excerpt ? (
                        <p className="raPara">{post.excerpt}</p>
                      ) : (
                        <p className="raPara muted">No content available.</p>
                      )}
                    </div>
                  </div>
                </article>
              )}
            </main>

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
                  type="button"
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
                  <button
                    className="btn btn-light"
                    onClick={() => setShowEmailPrompt(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    type="button"
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
            background: linear-gradient(180deg, #e9eef6 0%, #dde6f2 100%);
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

          .raSideCard {
            background: rgba(243, 247, 252, 0.88);
            border: 1px solid rgba(148, 163, 184, 0.22);
            border-radius: 18px;
            overflow: hidden;
            position: sticky;
            top: 92px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
            backdrop-filter: blur(8px);
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
            border: 1px solid rgba(148, 163, 184, 0.2);
            background: rgba(255, 255, 255, 0.62);
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
            border: 1px solid rgba(148, 163, 184, 0.2);
            background: rgba(255, 255, 255, 0.62);
            border-radius: 12px;
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
            border: 1px solid rgba(148, 163, 184, 0.18);
            background: rgba(255, 255, 255, 0.52);
            border-radius: 14px;
            padding: 12px 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .raTypeItem:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
          }

          .raTypeItem.active {
            background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
            border-color: transparent;
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
            color: #475569;
            background: rgba(15, 23, 42, 0.06);
            padding: 4px 8px;
            border-radius: 999px;
          }

          .raTypeItem.active .raTypeCount {
            color: #111827;
            background: #fff;
          }

          .raLiHeaderRow {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
          }

          .raLiCard {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.58);
            padding: 14px;
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
          }

          .raLiCardIcon {
            width: 42px;
            height: 42px;
            flex: 0 0 42px;
            border-radius: 12px;
            background: #0a66c2;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 900;
            text-transform: lowercase;
          }

          .raLiCardContent {
            min-width: 0;
          }

          .raLiCardTitle {
            font-size: 14px;
            font-weight: 900;
            color: #111827;
            margin-bottom: 4px;
          }

          .raLiCardText {
            font-size: 12.5px;
            color: #6b7280;
            line-height: 1.5;
            margin-bottom: 10px;
          }

          .raLiOpenBtn {
            display: inline-block;
            font-weight: 900;
            color: #2563eb;
            text-decoration: none;
          }

          .raLiOpenBtn:hover {
            text-decoration: underline;
          }

          .raCenter {
            min-width: 0;
            display: block;
          }

          .raCenterCard {
            background: rgba(246, 249, 253, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 18px;
            padding: 18px;
            box-shadow: 0 16px 36px rgba(15, 23, 42, 0.07);
          }

          .centerMuted {
            color: #6b7280;
            text-align: center;
          }

          .raPostClean {
            background: rgba(246, 249, 253, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 16px 36px rgba(15, 23, 42, 0.07);
            backdrop-filter: blur(8px);
          }

          .raArticleOuter {
            padding: 0 56px;
          }

          .raArticleInner {
            max-width: 860px;
            margin: 0 auto;
            padding: 20px 0 30px;
          }

          .raTitleRow {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
          }

          .raHeroTitle {
            font-size: 38px;
            font-weight: 900;
            color: #0f172a;
            line-height: 1.08;
            letter-spacing: -0.02em;
            margin: 6px 0 0;
            flex: 1;
            text-shadow: 2px 2px 0 rgba(37, 99, 235, 0.08);
          }

          .raTitleActions {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            flex: 0 0 auto;
          }

          .raShareIconBtn {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            border: 1.5px solid rgba(148, 163, 184, 0.28);
            background: rgba(255, 255, 255, 0.68);
            color: #2563eb;
            box-shadow: 0 10px 24px rgba(37, 99, 235, 0.1);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.22s ease;
          }

          .raShareIconBtn:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 28px rgba(37, 99, 235, 0.16);
            background: rgba(255, 255, 255, 0.82);
          }

          .raSocialLinks {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
            max-width: 88px;
          }

          .raSocialIcon {
            width: 34px;
            height: 34px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(148, 163, 184, 0.16);
            box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .raSocialIcon:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);
          }

          .raInstagram {
            color: #e4405f;
          }

          .raFacebook {
            color: #1877f2;
          }

          .raTwitter {
            color: #000000;
          }

          .raLinkedin {
            color: #0077b5;
          }

          .raTitleMetaRow {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .raTitleMeta {
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
          }

          .raCommentsPill {
            border: none;
            background: rgba(37, 99, 235, 0.12);
            color: #2563eb;
            font-weight: 950;
            border-radius: 12px;
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

          .raCoverMedia {
            margin-top: 14px;
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: 16px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.8);
          }

          .raCoverImg {
            width: 100%;
            display: block;
            height: auto;
            max-height: 420px;
            object-fit: contain;
            background: transparent;
          }

          .raPostContentRef {
            margin-top: 18px;
            text-align: justify;
            text-justify: inter-word;
            hyphens: auto;
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
          }

          .raPostContentRef :global(*) {
            max-height: none !important;
          }

          .raPostContentRef :global(p),
          .raPostContentRef :global(h1),
          .raPostContentRef :global(h2),
          .raPostContentRef :global(h3),
          .raPostContentRef :global(h4),
          .raPostContentRef :global(h5),
          .raPostContentRef :global(h6),
          .raPostContentRef :global(blockquote),
          .raPostContentRef :global(ul),
          .raPostContentRef :global(ol),
          .raPostContentRef :global(li),
          .raPostContentRef :global(div),
          .raPostContentRef :global(section),
          .raPostContentRef :global(article),
          .raPostContentRef :global(span) {
            margin-left: 0 !important;
            padding-left: 0 !important;
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
          }

          .raPostContentRef :global(p) {
            margin: 0 0 26px !important;
            line-height: 1.85;
            font-size: 18px;
            color: #1f2937;
          }

          .raPostContentRef :global(ul),
          .raPostContentRef :global(ol) {
            margin: 0 0 26px !important;
            padding-left: 22px !important;
            list-style-position: outside !important;
          }

          .raPostContentRef :global(ul) {
            list-style: disc !important;
          }

          .raPostContentRef :global(ol) {
            list-style: decimal !important;
          }

          .raPostContentRef :global(li) {
            margin: 0 0 14px !important;
            font-size: 18px;
            line-height: 1.85;
            color: #1f2937;
          }

          .raPostContentRef :global(a) {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 800;
            word-break: break-word;
          }

          .raPostContentRef :global(img) {
            max-width: 100% !important;
            height: auto !important;
            display: block;
            margin: 18px auto;
            border-radius: 12px;
          }

          .raPostContentRef :global(table) {
            width: 100% !important;
            border-collapse: collapse;
            margin: 18px 0 24px;
            display: block;
            overflow-x: auto;
          }

          .raPostContentRef :global(th),
          .raPostContentRef :global(td) {
            border: 1px solid rgba(17, 24, 39, 0.12);
            padding: 10px 12px;
            font-size: 15px;
            text-align: left;
          }

          .raPostContentRef :global(iframe),
          .raPostContentRef :global(video) {
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 12px;
            margin: 18px 0 24px;
          }

          .raPara {
            margin: 0 0 26px;
            line-height: 1.85;
            font-size: 18px;
            text-align: justify;
            text-justify: inter-word;
            hyphens: auto;
            color: #1f2937;
          }

          .raDiscuss {
            position: sticky;
            top: 92px;
            background: rgba(243, 247, 252, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.22);
            border-radius: 18px;
            padding: 14px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
            backdrop-filter: blur(8px);
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
            border: 1px solid rgba(148, 163, 184, 0.28);
            border-radius: 14px;
            padding: 12px;
            outline: none;
            font-size: 13.5px;
            resize: vertical;
            background: rgba(255, 255, 255, 0.72);
          }

          .raPrimaryBtn {
            width: 100%;
            margin-top: 10px;
            border: none;
            border-radius: 14px;
            padding: 12px 12px;
            font-weight: 950;
            background: linear-gradient(135deg, #4b5563 0%, #111827 100%);
            color: #fff;
            cursor: pointer;
          }

          .raPrimaryBtn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .raDiscussListWrap {
            margin-top: 12px;
          }

          .raDiscussList {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 520px;
            overflow: auto;
            padding-right: 4px;
          }

          .raComment {
            background: rgba(255, 255, 255, 0.62);
            border: 1px solid rgba(148, 163, 184, 0.16);
            border-radius: 14px;
            padding: 10px;
          }

          .raCommentTop {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 6px;
          }

          .raCommentEmail {
            font-size: 12px;
            font-weight: 900;
            color: #111827;
            word-break: break-word;
          }

          .raCommentTime {
            font-size: 11px;
            font-weight: 700;
            color: #6b7280;
            white-space: nowrap;
          }

          .raCommentText {
            font-size: 13.5px;
            line-height: 1.6;
            color: #1f2937;
            white-space: pre-wrap;
            word-break: break-word;
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
            background: #f8fafc;
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

          @media (max-width: 900px) {
            .raArticleOuter {
              padding: 0 18px;
            }

            .raArticleInner {
              max-width: 100%;
            }

            .raTitleRow {
              flex-direction: column;
              align-items: stretch;
            }

            .raTitleActions {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }

            .raSocialLinks {
              max-width: none;
              justify-content: flex-start;
            }
          }

          @media (max-width: 640px) {
            .raHeroTitle {
              font-size: 30px;
            }

            .raTitleMetaRow {
              flex-direction: column;
              align-items: flex-start;
            }

            .raShareIconBtn {
              width: 50px;
              height: 50px;
            }

            .raSocialIcon {
              width: 32px;
              height: 32px;
            }

            .raLiCard {
              padding: 12px;
            }
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}