"use client";

import { useEffect, useRef, useState } from "react";
import ExactEditor from "../../components/ExactEditor";

function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

const MAX_INLINE_IMAGES = 3;
const MAX_INLINE_IMAGE_SIZE = 3 * 1024 * 1024;

function countInlineImages(html = "") {
  const matches = String(html || "").match(/<img\b[^>]*>/gi);
  return matches ? matches.length : 0;
}

function extractImgSrcs(html = "") {
  const srcs = [];
  const re = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(String(html || "")))) {
    srcs.push(m[1]);
  }
  return srcs;
}

function normalizeUploadedUrl(rawUrl = "") {
  const url = String(rawUrl || "").trim();
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  return `/${url}`;
}

function parseTags(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

export default function NewPostPage() {
  const editorRef = useRef(null);

  const [meta, setMeta] = useState({ categories: [] });
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [inlineFiles, setInlineFiles] = useState([]);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editPostId, setEditPostId] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [editLinkedinUrl, setEditLinkedinUrl] = useState("");
  const [editTags, setEditTags] = useState([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [editInlineFiles, setEditInlineFiles] = useState([]);
  const [uploadingEditInline, setUploadingEditInline] = useState(false);
  const [uploadingEditCover, setUploadingEditCover] = useState(false);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoadingMeta(true);

        const res = await fetch("/api/blog-meta", { cache: "no-store" });
        const ct = res.headers.get("content-type") || "";

        if (!ct.includes("application/json")) {
          const html = await res.text();
          console.error("blog-meta returned non-JSON:", html.slice(0, 200));
          throw new Error("blog-meta route not returning JSON.");
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load meta");

        if (!ignore) {
          setMeta({ categories: data.categories || [] });
        }
      } catch (err) {
        console.error(err);
        if (!ignore) setMeta({ categories: [] });
      } finally {
        if (!ignore) setLoadingMeta(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoadingPosts(true);
      const res = await fetch("/api/admin/posts?limit=500", { cache: "no-store" });
      const ct = res.headers.get("content-type") || "";

      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.error("admin posts non-JSON:", text.slice(0, 200));
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        return;
      }

      setAllPosts(Array.isArray(data?.posts) ? data.posts : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  }

  function resetCreateForm() {
    setTitle("");
    setSlug("");
    setSlugManuallyEdited(false);
    setExcerpt("");
    setContent("");
    setCategoryId("");
    setCoverImage("");
    setLinkedinUrl("");
    setTagInput("");
    setTags([]);
    setInlineFiles([]);
  }

  function addTag(value) {
    const t = String(value || "").trim();
    if (!t) return;
    const exists = tags.some((x) => x.toLowerCase() === t.toLowerCase());
    if (exists || tags.length >= 5) return;
    setTags((prev) => [...prev, t]);
  }

  function removeTag(t) {
    setTags((prev) => prev.filter((x) => x !== t));
  }

  function addEditTag(value) {
    const t = String(value || "").trim();
    if (!t) return;
    const exists = editTags.some((x) => x.toLowerCase() === t.toLowerCase());
    if (exists || editTags.length >= 5) return;
    setEditTags((prev) => [...prev, t]);
  }

  function removeEditTag(t) {
    setEditTags((prev) => prev.filter((x) => x !== t));
  }

  function insertImageIntoContent(url) {
    const safeUrl = normalizeUploadedUrl(url);
    if (!safeUrl) return;

    const imgHtml = `<p><img src="${safeUrl}" alt="content-image" style="max-width:100%;height:auto;display:block;" /></p>`;

    setContent((prev) => {
      const oldContent = String(prev || "").trim();
      return oldContent ? `${oldContent}\n${imgHtml}` : imgHtml;
    });
  }

  function insertImageIntoEditContent(url) {
    const safeUrl = normalizeUploadedUrl(url);
    if (!safeUrl) return;

    const imgHtml = `<p><img src="${safeUrl}" alt="content-image" style="max-width:100%;height:auto;display:block;" /></p>`;

    setEditContent((prev) => {
      const oldContent = String(prev || "").trim();
      return oldContent ? `${oldContent}\n${imgHtml}` : imgHtml;
    });
  }

  function resyncInlineFilesFromContent(nextContent) {
    const srcs = new Set(extractImgSrcs(nextContent));
    setInlineFiles((prev) => prev.filter((x) => srcs.has(x.url)));
  }

  function resyncEditInlineFilesFromContent(nextContent) {
    const srcs = new Set(extractImgSrcs(nextContent));
    setEditInlineFiles((prev) => prev.filter((x) => srcs.has(x.url)));
  }

  async function uploadFileToApi(file) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      console.error("upload returned non-JSON:", text.slice(0, 200));
      throw new Error("Upload API is not returning JSON.");
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Upload failed");
    }

    const url = normalizeUploadedUrl(data?.url);
    if (!url) throw new Error("Upload succeeded but image URL is missing.");

    return url;
  }

  async function uploadInlineImage(file) {
    if (!file) return;

    if (file.size > MAX_INLINE_IMAGE_SIZE) {
      alert("Content image must be 3MB or less.");
      return;
    }

    if (countInlineImages(content) >= MAX_INLINE_IMAGES) {
      alert("Maximum 3 images allowed inside content.");
      return;
    }

    try {
      setUploadingInline(true);
      const url = await uploadFileToApi(file);

      setInlineFiles((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          url,
        },
      ]);

      insertImageIntoContent(url);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Upload failed");
    } finally {
      setUploadingInline(false);
    }
  }

  async function uploadEditInlineImage(file) {
    if (!file) return;

    if (file.size > MAX_INLINE_IMAGE_SIZE) {
      alert("Content image must be 3MB or less.");
      return;
    }

    if (countInlineImages(editContent) >= MAX_INLINE_IMAGES) {
      alert("Maximum 3 images allowed inside content.");
      return;
    }

    try {
      setUploadingEditInline(true);
      const url = await uploadFileToApi(file);

      setEditInlineFiles((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          url,
        },
      ]);

      insertImageIntoEditContent(url);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Upload failed");
    } finally {
      setUploadingEditInline(false);
    }
  }

  async function uploadCoverImage(file) {
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Max cover image size is 3MB");
      return;
    }

    try {
      setUploadingCover(true);
      const url = await uploadFileToApi(file);
      setCoverImage(url);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function uploadEditCoverImage(file) {
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Max cover image size is 3MB");
      return;
    }

    try {
      setUploadingEditCover(true);
      const url = await uploadFileToApi(file);
      setEditCoverImage(url);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Upload failed");
    } finally {
      setUploadingEditCover(false);
    }
  }

  async function onSubmit(status) {
    const finalContent = String(content || "").trim();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!finalContent) {
      alert("Content is required");
      return;
    }

    if (countInlineImages(finalContent) > MAX_INLINE_IMAGES) {
      alert("Content allows maximum 3 images only.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: title.trim(),
        slug: slugify(slug || title),
        excerpt: excerpt.trim(),
        content: finalContent,
        category_id: categoryId ? Number(categoryId) : null,
        cover_image: coverImage ? String(coverImage).trim() : null,
        tags,
        status,
        linkedin_url: linkedinUrl ? String(linkedinUrl).trim() : null,
      };

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const html = await res.text();
        console.error("posts API returned non-JSON:", html.slice(0, 200));
        alert("Posts API is not returning JSON.");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data?.error || "Failed to save post");
        return;
      }

      alert(`Saved! Slug: ${data.slug || ""}`);
      resetCreateForm();
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function openEditModal(postId) {
    if (!postId) return;

    try {
      setEditLoading(true);
      setShowEditModal(true);

      const res = await fetch(`/api/admin/posts/${encodeURIComponent(postId)}`, {
        cache: "no-store",
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.error("single post non-JSON:", text.slice(0, 200));
        alert("Post API is not returning JSON.");
        setShowEditModal(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to load post");
        setShowEditModal(false);
        return;
      }

      const post = data?.post;
      if (!post) {
        alert("Post not found");
        setShowEditModal(false);
        return;
      }

      setEditPostId(String(post.id));
      setEditTitle(post.title || "");
      setEditSlug(post.slug || "");
      setEditExcerpt(post.excerpt || "");
      setEditContent(post.content || "");
      setEditCategoryId(post.category_id ? String(post.category_id) : "");
      setEditCoverImage(post.cover_image || "");
      setEditLinkedinUrl(post.linkedin_url || "");
      setEditTags(parseTags(post.tags));

      const srcs = extractImgSrcs(post.content || "");
      setEditInlineFiles(
        srcs.map((url, index) => ({
          id: `${post.id}-${index}`,
          name: `content-image-${index + 1}`,
          size: 0,
          url,
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to load post");
      setShowEditModal(false);
    } finally {
      setEditLoading(false);
    }
  }

  function closeEditModal() {
    if (editSaving) return;
    setShowEditModal(false);
    setEditPostId("");
    setEditTitle("");
    setEditSlug("");
    setEditExcerpt("");
    setEditContent("");
    setEditCategoryId("");
    setEditCoverImage("");
    setEditLinkedinUrl("");
    setEditTags([]);
    setEditTagInput("");
    setEditInlineFiles([]);
  }

  async function updatePost(status) {
    const finalContent = String(editContent || "").trim();

    if (!editPostId) {
      alert("Post id missing");
      return;
    }

    if (!editTitle.trim()) {
      alert("Title is required");
      return;
    }

    if (!finalContent) {
      alert("Content is required");
      return;
    }

    if (countInlineImages(finalContent) > MAX_INLINE_IMAGES) {
      alert("Content allows maximum 3 images only.");
      return;
    }

    try {
      setEditSaving(true);

      const payload = {
        title: editTitle.trim(),
        slug: slugify(editSlug || editTitle),
        excerpt: editExcerpt.trim(),
        content: finalContent,
        category_id: editCategoryId ? Number(editCategoryId) : null,
        cover_image: editCoverImage ? String(editCoverImage).trim() : null,
        tags: editTags,
        status,
        linkedin_url: editLinkedinUrl ? String(editLinkedinUrl).trim() : null,
      };

      const res = await fetch(`/api/admin/posts/${encodeURIComponent(editPostId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.error("update non-JSON:", text.slice(0, 200));
        alert("Update API is not returning JSON.");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to update post");
        return;
      }

      alert("Post updated successfully");
      closeEditModal();
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(postId) {
    if (!postId) return;

    const ok = window.confirm("Are you sure you want to delete this post?");
    if (!ok) return;

    try {
      setDeletingId(String(postId));

      const res = await fetch(`/api/admin/posts/${encodeURIComponent(postId)}`, {
        method: "DELETE",
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.error("delete non-JSON:", text.slice(0, 200));
        alert("Delete API is not returning JSON.");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to delete post");
        return;
      }

      alert("Post deleted successfully");
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="fw-bold m-0">Create New Post</h1>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => onSubmit("draft")}
            disabled={saving || loadingMeta}
            type="button"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            className="btn btn-dark"
            onClick={() => onSubmit("published")}
            disabled={saving || loadingMeta}
            type="button"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              className="form-control form-control-lg"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Slug</label>
            <input
              className="form-control"
              placeholder="slug"
              value={slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setSlug(slugify(e.target.value));
              }}
            />
            <div className="form-text">Best practice slug length 60, no special symbols.</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Summary</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Enter Summary"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
            <div className="form-text">10–30 characters for better clicks.</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Tag</label>
            <input
              className="form-control"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                  setTagInput("");
                }
              }}
            />
            <div className="form-text">Use up to 5 tags for best results</div>

            {tags.length > 0 && (
              <div className="mt-2 d-flex gap-2 flex-wrap">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="badge text-bg-light border d-inline-flex align-items-center"
                    style={{ gap: 6 }}
                  >
                    {t}
                    <button
                      type="button"
                      className="btn btn-sm p-0"
                      onClick={() => removeTag(t)}
                      aria-label="remove"
                      style={{ lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Content</label>

            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                disabled={uploadingInline}
                style={{ maxWidth: 420 }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  await uploadInlineImage(file);
                }}
              />

              <div className="text-muted" style={{ fontSize: 13 }}>
                Content images: max <b>3</b> images, each max <b>3MB</b>.
              </div>
            </div>

            {inlineFiles.length > 0 && (
              <div className="mb-2">
                <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>
                  Added to content ({inlineFiles.length}/{MAX_INLINE_IMAGES})
                </div>

                <div className="d-flex gap-2 flex-wrap">
                  {inlineFiles.map((f) => (
                    <span key={f.id} className="badge text-bg-light border">
                      {f.name} {f.size ? `(${Math.round(f.size / 1024)}KB)` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="form-text mb-2">
              Note: Images inserted into content are auto-set to{" "}
              <code>max-width: 100%; height: auto;</code>
            </div>

            <ExactEditor
              ref={editorRef}
              value={content}
              onChange={(next) => {
                const nextValue = String(next || "");
                const imgCount = countInlineImages(nextValue);

                if (imgCount > MAX_INLINE_IMAGES) {
                  alert("Maximum 3 images allowed inside content.");
                  return;
                }

                setContent(nextValue);
                resyncInlineFilesFromContent(nextValue);
              }}
            />
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="mb-3">
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingMeta}
            >
              <option value="">None</option>
              {meta.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Select Image</label>

            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              disabled={uploadingCover}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                await uploadCoverImage(file);
              }}
            />

            {coverImage ? (
              <div className="mt-2">
                <img
                  src={coverImage}
                  alt="preview"
                  className="w-100 rounded"
                  style={{ maxHeight: 180, objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => setCoverImage("")}
                >
                  Remove
                </button>
              </div>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">LinkedIn Post URL (optional)</label>
            <input
              className="form-control"
              placeholder="Paste LinkedIn post URL..."
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
            <div className="form-text">Example: https://www.linkedin.com/posts/...activity</div>
          </div>

          {linkedinUrl ? (
            <div className="mb-3">
              <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>
                Preview link
              </div>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-light"
              >
                Open LinkedIn →
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <div className="card mt-5">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Saved Posts</h5>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            onClick={loadPosts}
            disabled={loadingPosts}
          >
            {loadingPosts ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="card-body">
          {loadingPosts ? (
            <div className="text-muted">Loading posts...</div>
          ) : allPosts.length === 0 ? (
            <div className="text-muted">No posts found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th style={{ minWidth: 260 }}>Title</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th style={{ minWidth: 170 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allPosts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.title || "-"}</td>
                      <td>{post.slug || "-"}</td>
                      <td>
                        <span className="badge text-bg-light border">
                          {post.status || "-"}
                        </span>
                      </td>
                      <td>{post.category_name || "-"}</td>
                      <td>{formatDate(post.updated_at || post.created_at)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => openEditModal(post.id)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(post.id)}
                            disabled={String(deletingId) === String(post.id)}
                          >
                            {String(deletingId) === String(post.id) ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEditModal();
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditModal}
                  disabled={editSaving}
                />
              </div>

              <div className="modal-body">
                {editLoading ? (
                  <div className="text-muted">Loading post...</div>
                ) : (
                  <div className="row g-4">
                    <div className="col-12 col-lg-8">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Title</label>
                        <input
                          className="form-control form-control-lg"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Slug</label>
                        <input
                          className="form-control"
                          value={editSlug}
                          onChange={(e) => setEditSlug(slugify(e.target.value))}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Summary</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={editExcerpt}
                          onChange={(e) => setEditExcerpt(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Tag</label>
                        <input
                          className="form-control"
                          placeholder="Add a tag and press Enter"
                          value={editTagInput}
                          onChange={(e) => setEditTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addEditTag(editTagInput);
                              setEditTagInput("");
                            }
                          }}
                        />

                        {editTags.length > 0 && (
                          <div className="mt-2 d-flex gap-2 flex-wrap">
                            {editTags.map((t) => (
                              <span
                                key={t}
                                className="badge text-bg-light border d-inline-flex align-items-center"
                                style={{ gap: 6 }}
                              >
                                {t}
                                <button
                                  type="button"
                                  className="btn btn-sm p-0"
                                  onClick={() => removeEditTag(t)}
                                  style={{ lineHeight: 1 }}
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Content</label>

                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            disabled={uploadingEditInline}
                            style={{ maxWidth: 420 }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (!file) return;
                              await uploadEditInlineImage(file);
                            }}
                          />

                          <div className="text-muted" style={{ fontSize: 13 }}>
                            Content images: max <b>3</b> images, each max <b>3MB</b>.
                          </div>
                        </div>

                        {editInlineFiles.length > 0 && (
                          <div className="mb-2">
                            <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>
                              Added to content ({editInlineFiles.length}/{MAX_INLINE_IMAGES})
                            </div>

                            <div className="d-flex gap-2 flex-wrap">
                              {editInlineFiles.map((f) => (
                                <span key={f.id} className="badge text-bg-light border">
                                  {f.name} {f.size ? `(${Math.round(f.size / 1024)}KB)` : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <ExactEditor
                          value={editContent}
                          onChange={(next) => {
                            const nextValue = String(next || "");
                            const imgCount = countInlineImages(nextValue);

                            if (imgCount > MAX_INLINE_IMAGES) {
                              alert("Maximum 3 images allowed inside content.");
                              return;
                            }

                            setEditContent(nextValue);
                            resyncEditInlineFilesFromContent(nextValue);
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-lg-4">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Category</label>
                        <select
                          className="form-select"
                          value={editCategoryId}
                          onChange={(e) => setEditCategoryId(e.target.value)}
                        >
                          <option value="">None</option>
                          {meta.categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Select Image</label>

                        <input
                          type="file"
                          className="form-control mb-2"
                          accept="image/*"
                          disabled={uploadingEditCover}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (!file) return;
                            await uploadEditCoverImage(file);
                          }}
                        />

                        {editCoverImage ? (
                          <div className="mt-2">
                            <img
                              src={editCoverImage}
                              alt="preview"
                              className="w-100 rounded"
                              style={{ maxHeight: 180, objectFit: "cover" }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger mt-2"
                              onClick={() => setEditCoverImage("")}
                            >
                              Remove
                            </button>
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">LinkedIn Post URL (optional)</label>
                        <input
                          className="form-control"
                          value={editLinkedinUrl}
                          onChange={(e) => setEditLinkedinUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeEditModal}
                  disabled={editSaving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={() => updatePost("draft")}
                  disabled={editSaving || editLoading}
                >
                  {editSaving ? "Saving..." : "Update Draft"}
                </button>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => updatePost("published")}
                  disabled={editSaving || editLoading}
                >
                  {editSaving ? "Saving..." : "Update & Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}