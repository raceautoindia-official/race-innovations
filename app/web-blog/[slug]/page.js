"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
} from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
      <rect width="100%" height="100%" fill="#e2e2e2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="34" fill="#666">
        Blog Image
      </text>
    </svg>
  `);

function formatDate(value) {
  const d = new Date(value || Date.now());
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function fetchJsonSafe(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const ct = res.headers.get("content-type") || "";

    if (!res.ok) return { ok: false, data: null };
    if (!ct.includes("application/json")) return { ok: false, data: null };

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    console.error("fetch failed:", url, error);
    return { ok: false, data: null };
  }
}

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const slug = useMemo(() => {
    if (!params?.slug) return "";
    return Array.isArray(params.slug) ? params.slug[0] : params.slug;
  }, [params]);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadPage() {
      try {
        setLoading(true);

        const possiblePostUrls = [
          `/api/posts/slug/${slug}`,
          `/api/posts/${slug}`,
          `/api/posts?slug=${encodeURIComponent(slug)}`,
        ];

        let foundPost = null;

        for (const url of possiblePostUrls) {
          const result = await fetchJsonSafe(url);
          if (!result.ok || !result.data) continue;

          const data = result.data;

          if (data?.post) {
            foundPost = data.post;
            break;
          }

          if (Array.isArray(data?.posts) && data.posts.length > 0) {
            const exact = data.posts.find((p) => p?.slug === slug) || data.posts[0];
            if (exact) {
              foundPost = exact;
              break;
            }
          }

          if (data?.slug || data?.title) {
            foundPost = data;
            break;
          }
        }

        if (!mounted) return;
        setPost(foundPost || null);
      } catch (error) {
        console.error(error);
        if (!mounted) return;
        setPost(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPage();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post?.id) {
      setComments([]);
      return;
    }

    let mounted = true;

    async function loadComments() {
      try {
        const result = await fetchJsonSafe(`/api/comments?postId=${post.id}`);
        if (!mounted) return;

        if (result.ok && result.data) {
          const list = Array.isArray(result.data?.comments) ? result.data.comments : [];
          setComments(list);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setComments([]);
      }
    }

    loadComments();

    return () => {
      mounted = false;
    };
  }, [post?.id]);

  async function handlePostComment() {
    const value = String(commentText || "").trim();
    if (!value || !post?.id) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
          comment: value,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to post comment");
        return;
      }

      setCommentText("");

      const newComment = data?.comment;
      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
      } else {
        const reload = await fetchJsonSafe(`/api/comments?postId=${post.id}`);
        if (reload.ok && reload.data) {
          setComments(Array.isArray(reload.data?.comments) ? reload.data.comments : []);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to post comment");
    }
  }

  async function handleShare() {
    try {
      if (typeof window === "undefined") return;

      const shareUrl = window.location.href;
      const shareTitle = post?.title || "Blog Post";
      const shareText = post?.excerpt || shareTitle;

      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied successfully");
    } catch (error) {
      console.error(error);
      try {
        if (typeof window !== "undefined") {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link copied successfully");
        }
      } catch (copyError) {
        console.error(copyError);
        alert("Share failed");
      }
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="blogDetailPage">
          <div className="detailContainer">
            <div className="emptyState">Loading...</div>
          </div>
        </div>
        <Footer />

        <style jsx>{`
          .blogDetailPage {
            background: #f4f6fb;
            min-height: 100vh;
            padding: 40px 0 60px;
          }
          .detailContainer {
            max-width: 1340px;
            margin: 0 auto;
            padding: 0 24px;
          }
          .emptyState {
            background: #fff;
            border: 1px solid #e5e7eb;
            padding: 80px 20px;
            text-align: center;
            color: #666;
            font-size: 18px;
            border-radius: 20px;
          }
        `}</style>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="blogDetailPage">
          <div className="detailContainer">
            <div className="emptyState">Post not found.</div>
          </div>
        </div>
        <Footer />

        <style jsx>{`
          .blogDetailPage {
            background: #f4f6fb;
            min-height: 100vh;
            padding: 40px 0 60px;
          }
          .detailContainer {
            max-width: 1340px;
            margin: 0 auto;
            padding: 0 24px;
          }
          .emptyState {
            background: #fff;
            border: 1px solid #e5e7eb;
            padding: 80px 20px;
            text-align: center;
            color: #666;
            font-size: 18px;
            border-radius: 20px;
          }
        `}</style>
      </>
    );
  }

  const coverImage = resolveImg(post?.cover_image) || SAFE_FALLBACK;
  const linkedinThumbnail = resolveImg(post?.linkedin_thumbnail) || SAFE_FALLBACK;

  return (
    <>
      <Navbar />

      <div className="blogDetailPage main-content">
        <div className="detailContainer">
          <div className="mainGrid">
            <article className="articleCard">
              <div className="articleContent">
                <div className="topActions">
                  <button type="button" className="backButton" onClick={() => router.back()}>
                    ← Back
                  </button>

                  <div className="shareActions">
                    <button type="button" className="shareButton" onClick={handleShare}>
                      <FaShareAlt size={16} />
                      <span>Share</span>
                    </button>

                    <div className="socialLinks">
                      <a
                        href="https://www.instagram.com/raceinnovations/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="socialIconButton"
                        aria-label="Instagram"
                      >
                        <FaInstagram size={18} style={{ color: "#E4405F" }} />
                      </a>

                      <a
                        href="https://www.facebook.com/raceinnovationspvtltd/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="socialIconButton"
                        aria-label="Facebook"
                      >
                        <FaFacebook size={18} style={{ color: "#1877F2" }} />
                      </a>

                      <a
                        href="https://x.com/raceinnovations"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="socialIconButton"
                        aria-label="X"
                      >
                        <FaXTwitter size={18} style={{ color: "#000" }} />
                      </a>

                      <a
                        href="https://www.linkedin.com/company/race-innovations-private-limited/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="socialIconButton"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin size={18} style={{ color: "#0077B5" }} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="metaRow">
                  <span className="dateText">
                    {formatDate(post?.published_at || post?.created_at)}
                  </span>

                  {post?.category_name ? (
                    <span className="categoryBadge">{post.category_name}</span>
                  ) : null}
                </div>

                <h1 className="articleTitle">{post?.title || "Untitled Post"}</h1>

                <div className="articleImageWrap">
                  <img
                    src={coverImage}
                    alt={post?.title || "Blog image"}
                    className="articleImage"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = SAFE_FALLBACK;
                    }}
                  />
                </div>

                {post?.excerpt ? <p className="articleExcerpt">{post.excerpt}</p> : null}

                <div
                  className="articleBody"
                  dangerouslySetInnerHTML={{ __html: post?.content || post?.description || "" }}
                />
              </div>
            </article>

            <aside className="sidebarCard">
              {(post?.linkedin_url || post?.linkedin_content || post?.linkedin_thumbnail) ? (
                <div className="linkedinSection">
                  <div className="linkedinSectionHead">
                    <h3>LinkedIn</h3>
                    <span>From post</span>
                  </div>

                  <a
                    href={post?.linkedin_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="linkedinCard"
                  >
                    <div className="linkedinThumbBox">
                      {post?.linkedin_thumbnail ? (
                        <img
                          src={linkedinThumbnail}
                          alt="LinkedIn thumbnail"
                          className="linkedinThumb"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = SAFE_FALLBACK;
                          }}
                        />
                      ) : (
                        <div className="linkedinThumb linkedinThumbPlaceholder">in</div>
                      )}
                    </div>

                    <div className="linkedinContent">
                      <h4>LinkedIn Post</h4>

                      {post?.linkedin_url ? (
                        <div className="linkedinUrlTop">{post.linkedin_url}</div>
                      ) : null}

                      {post?.linkedin_content ? (
                        <p>{post.linkedin_content}</p>
                      ) : (
                        <p>Open the original LinkedIn post in a new tab.</p>
                      )}

                      <span className="linkedinOpenLink">Open on LinkedIn →</span>
                    </div>
                  </a>
                </div>
              ) : null}

              <div className="commentsSection sidebarBlock">
                <div className="commentsTitle">Discussions</div>

                <div className="commentsOn">
                  On: <strong>{post?.title || "Untitled Post"}</strong>
                </div>

                <div className="commentsDivider" />

                <textarea
                  className="commentInput"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <button type="button" className="commentButton" onClick={handlePostComment}>
                  Post
                </button>

                {comments.length === 0 ? (
                  <div className="noComments">No comments yet.</div>
                ) : (
                  <div className="commentsList">
                    {comments.map((item, index) => (
                      <div
                        key={item.id || item.comment_id || item.created_at || index}
                        className="commentItem"
                      >
                        <div className="commentMeta">
                          {item?.name || item?.user_name || "Anonymous"}
                          {item?.created_at ? ` • ${formatDate(item.created_at)}` : ""}
                        </div>
                        <div className="commentText">
                          {item?.comment || item?.content || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .blogDetailPage {
          background: #f4f6fb;
          min-height: 100vh;
          padding: 52px 0 70px;
        }

        .detailContainer {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 20px;
          margin-top: 24px;
        }

        .mainGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 400px;
          gap: 22px;
          align-items: start;
        }

        .articleCard,
        .sidebarCard {
          background: #eef3fb;
          border: 1px solid #dbe3f0;
          border-radius: 28px;
        }

        .articleCard {
          min-width: 0;
          overflow: hidden;
        }

        .articleContent {
          padding: 34px 38px 40px;
          min-width: 0;
        }

        .topActions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .backButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #d3dceb;
          background: #fff;
          color: #14213d;
          height: 44px;
          padding: 0 16px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
        }

        .shareActions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .shareButton {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #d3dceb;
          background: #fff;
          color: #14213d;
          height: 44px;
          padding: 0 16px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
        }

        .socialLinks {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .socialIconButton {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #d3dceb;
          background: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .metaRow {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .dateText {
          color: #61708d;
          font-size: 15px;
          font-weight: 700;
        }

        .categoryBadge {
          background: #e4ebf8;
          color: #233967;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 999px;
        }

        .articleTitle {
          font-size: 48px;
          line-height: 1.08;
          font-weight: 800;
          color: #0f1933;
          margin: 0 0 28px;
          letter-spacing: -0.02em;
        }

        .articleImageWrap {
          width: 100%;
          height: 420px;
          overflow: hidden;
          background: #dfe6f2;
          border-radius: 22px;
          margin-bottom: 26px;
        }

        .articleImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .articleExcerpt {
          font-size: 18px;
          line-height: 1.9;
          color: #4b5a76;
          margin: 0 0 24px;
          text-align: justify;
        }

        .articleBody {
          font-size: 17px;
          line-height: 1.95;
          color: #1e2a44;
          text-align: justify;
        }

        .articleBody :global(*) {
          max-width: 100%;
          box-sizing: border-box;
        }

        .articleBody :global(p) {
          margin-bottom: 18px;
        }

        .articleBody :global(h1),
        .articleBody :global(h2),
        .articleBody :global(h3),
        .articleBody :global(h4),
        .articleBody :global(h5),
        .articleBody :global(h6) {
          margin-top: 28px;
          margin-bottom: 14px;
          color: #0f1933;
          line-height: 1.3;
        }

        .articleBody :global(img) {
          max-width: 100% !important;
          height: auto !important;
        }

        .articleBody :global(ul),
        .articleBody :global(ol) {
          padding-left: 22px;
          margin-bottom: 18px;
        }

        .articleBody :global(a) {
          color: #2563eb;
          text-decoration: none;
          word-break: break-word;
        }

        .sidebarCard {
          padding: 18px;
          position: sticky;
          top: 24px;
        }

        .sidebarBlock {
          margin-top: 16px;
        }

        .linkedinSectionHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding: 0 2px;
        }

        .linkedinSectionHead h3 {
          margin: 0;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 800;
          color: #0f1933;
        }

        .linkedinSectionHead span {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .linkedinCard {
          background: #f7f9fd;
          border: 1px solid #dbe3f0;
          border-radius: 24px;
          padding: 18px;
          display: grid;
          grid-template-columns: 88px minmax(0, 1fr);
          gap: 16px;
          align-items: start;
          text-decoration: none;
        }

        .linkedinThumbBox {
          width: 88px;
          height: 88px;
          flex-shrink: 0;
        }

        .linkedinThumb {
          width: 88px;
          height: 88px;
          border-radius: 18px;
          object-fit: cover;
          display: block;
          background: #0a66c2;
        }

        .linkedinThumbPlaceholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 34px;
          font-weight: 800;
          text-transform: lowercase;
        }

        .linkedinContent {
          min-width: 0;
        }

        .linkedinContent h4 {
          margin: 0 0 8px;
          font-size: 17px;
          line-height: 1.3;
          font-weight: 800;
          color: #0f1933;
        }

        .linkedinUrlTop {
          margin: 0 0 10px;
          font-size: 13px;
          line-height: 1.55;
          color: #2563eb;
          word-break: break-all;
        }

        .linkedinContent p {
          margin: 0 0 10px;
          font-size: 16px;
          line-height: 1.65;
          color: #667085;
          text-align: justify;
          word-break: break-word;
        }

        .linkedinOpenLink {
          display: inline-block;
          color: #2563eb;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
        }

        .commentsSection {
          background: #eef3fb;
          border: 1px solid #dbe3f0;
          border-radius: 24px;
          padding: 18px;
        }

        .commentsTitle {
          font-size: 18px;
          line-height: 1.2;
          font-weight: 800;
          color: #0f1933;
          margin-bottom: 10px;
        }

        .commentsOn {
          font-size: 15px;
          line-height: 1.5;
          color: #667085;
          margin-bottom: 12px;
          word-break: break-word;
        }

        .commentsOn strong {
          color: #0f1933;
        }

        .commentsDivider {
          height: 1px;
          background: #d6deeb;
          margin-bottom: 14px;
        }

        .commentInput {
          width: 100%;
          min-height: 128px;
          border: 1px solid #cfd8e6;
          border-radius: 18px;
          background: #fff;
          padding: 16px;
          font-size: 16px;
          line-height: 1.6;
          color: #111827;
          resize: vertical;
          outline: none;
          margin-bottom: 16px;
          box-sizing: border-box;
        }

        .commentButton {
          width: 100%;
          height: 58px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(90deg, #aab3c2 0%, #70798b 100%);
          color: #fff;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          margin-bottom: 14px;
        }

        .noComments {
          font-size: 16px;
          color: #667085;
        }

        .commentsList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .commentItem {
          background: #fff;
          border: 1px solid #dde5f0;
          border-radius: 16px;
          padding: 14px 16px;
        }

        .commentMeta {
          font-size: 13px;
          font-weight: 700;
          color: #667085;
          margin-bottom: 6px;
        }

        .commentText {
          font-size: 15px;
          line-height: 1.7;
          color: #0f1933;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .emptyState {
          background: #fff;
          border: 1px solid #e5e7eb;
          padding: 80px 20px;
          text-align: center;
          color: #666;
          font-size: 18px;
          border-radius: 20px;
        }

        @media (max-width: 1199px) {
          .mainGrid {
            grid-template-columns: 1fr;
          }

          .sidebarCard {
            position: static;
          }

          .articleTitle {
            font-size: 38px;
          }

          .articleImageWrap {
            height: 360px;
          }
        }

        @media (max-width: 767px) {
          .blogDetailPage {
            padding: 24px 0 50px;
          }

          .detailContainer {
            padding: 0 14px;
          }

          .articleContent {
            padding: 22px 16px 26px;
          }

          .topActions {
            align-items: stretch;
          }

          .shareActions {
            width: 100%;
            justify-content: space-between;
          }

          .socialLinks {
            gap: 8px;
          }

          .articleTitle {
            font-size: 28px;
          }

          .articleImageWrap {
            height: 230px;
            border-radius: 18px;
          }

          .articleExcerpt,
          .articleBody {
            font-size: 16px;
          }

          .sidebarCard {
            padding: 14px;
          }

          .linkedinCard {
            grid-template-columns: 72px minmax(0, 1fr);
            padding: 16px;
            border-radius: 20px;
          }

          .linkedinThumbBox,
          .linkedinThumb {
            width: 72px;
            height: 72px;
          }

          .linkedinThumb {
            border-radius: 16px;
          }

          .commentsSection {
            padding: 16px;
            border-radius: 20px;
          }

          .commentButton {
            height: 54px;
            font-size: 17px;
          }
        }
      `}</style>
    </>
  );
}