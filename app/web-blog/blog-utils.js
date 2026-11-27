// Small helpers shared by the blog pages. No database access, so both the
// server pages and the client components can import this file.

export function resolveImg(src) {
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

// Dates are shown in Indian time on both server and client, so the
// server-rendered HTML and the browser render always agree.
export const BLOG_TIME_ZONE = "Asia/Kolkata";

export function postPath(slug) {
  return `/web-blog/${encodeURIComponent(String(slug || "").trim())}`;
}

// Published date of a post: published_at, else created_at (as the listing does).
export function postDate(post) {
  const value = post?.published_at || post?.created_at;
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const ENTITIES = {
  nbsp: " ",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  bull: "•",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
  deg: "°",
  rupee: "₹",
};

function decodeEntities(text) {
  return String(text || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => safeFromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => safeFromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => {
      const key = name.toLowerCase();
      if (key === "amp") return m; // decoded last, below
      return Object.prototype.hasOwnProperty.call(ENTITIES, key) ? ENTITIES[key] : m;
    })
    .replace(/&amp;/gi, "&");
}

function safeFromCodePoint(code) {
  try {
    return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : "";
  } catch {
    return "";
  }
}

/** Plain text from stored post HTML (tags removed, entities decoded, spaces collapsed). */
export function toPlainText(html) {
  const stripped = String(html || "")
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ");
  return decodeEntities(stripped).replace(/\s+/g, " ").trim();
}

/** Cut text to at most `max` characters at a word boundary, adding an ellipsis. */
export function clipText(text, max = 155) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.\-–—]+$/, "")}…`;
}

// Text of the article: its paragraphs if it has any (skips headings that often
// repeat the title), else all of it.
function contentText(html) {
  const paragraphs = (String(html || "").match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [])
    .map(toPlainText)
    .filter(Boolean)
    .join(" ");
  return paragraphs || toPlainText(html);
}

/**
 * Meta description for a post (at most 155 characters): the excerpt, else the
 * start of the content. A very short excerpt is followed by the content.
 */
export function postDescription(post) {
  const excerpt = toPlainText(post?.excerpt);
  if (excerpt.length >= 70) return clipText(excerpt);

  const text = [excerpt, contentText(post?.content)].filter(Boolean).join(" ");
  if (text) return clipText(text);

  return clipText(
    `${post?.title || "Article"}: automotive industry insights and analysis from the RACE Innovations blog.`
  );
}
