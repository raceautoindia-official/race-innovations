"use client";

import { useEffect, useRef, useState } from "react";
import ExactEditor from "../../../components/ExactEditor";

function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export default function NewPostPage() {
  const editorRef = useRef(null);

  // ✅ meta only what we still use (categories)
  const [meta, setMeta] = useState({ categories: [] });
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [coverImage, setCoverImage] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // ✅ Load meta (only categories)
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
          throw new Error("blog-meta route not returning JSON. Check /api/blog-meta");
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load meta");

        if (!ignore) {
          setMeta({
            categories: data.categories || [],
          });
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

  // ✅ Auto slug until user edits manually
  useEffect(() => {
    if (!slugManuallyEdited) setSlug(slugify(title));
  }, [title, slugManuallyEdited]);

  function addTag(value) {
    const t = String(value || "").trim();
    if (!t) return;
    const exists = tags.some((x) => String(x).toLowerCase() === t.toLowerCase());
    if (exists) return;
    if (tags.length >= 5) return;
    setTags((prev) => [...prev, t]);
  }

  function removeTag(t) {
    setTags((prev) => prev.filter((x) => x !== t));
  }

  async function onSubmit(status) {
    const finalContent = content;

    if (!title.trim()) return alert("Title is required");
    if (!finalContent.trim()) return alert("Content is required");

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
        alert("Posts API is not returning JSON (maybe route missing / error).");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data?.error || "Failed to save post");
        return;
      }

      alert(`Saved! Slug: ${data.slug}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
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
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            className="btn btn-dark"
            onClick={() => onSubmit("published")}
            disabled={saving || loadingMeta}
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT */}
        <div className="col-12 col-lg-8">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              className="form-control form-control-lg"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Slug */}
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

          {/* Summary */}
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

          {/* Tags */}
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

          {/* Content Editor */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Content</label>
            <div className="form-text mb-2">
              Note: Set the image property to <code>width: 100%; height: auto;</code> for proper display
              within the content.
            </div>

            <ExactEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-12 col-lg-4">
          {/* Category */}
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

          {/* Cover Image Upload */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Image</label>

            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                if (file.size > 3 * 1024 * 1024) {
                  alert("Max image size is 3MB");
                  return;
                }

                try {
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
                    alert("Upload API is not returning JSON.");
                    return;
                  }

                  const data = await res.json();
                  if (!res.ok) {
                    alert(data?.error || "Upload failed");
                    return;
                  }

                  setCoverImage(data.url);
                } catch (err) {
                  console.error(err);
                  alert("Upload failed");
                }
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
        </div>
      </div>
    </div>
  );
}
