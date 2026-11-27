// /blog/{slug} is the older URL for blog posts. It showed the same `posts`
// rows (same slug, via /api/posts/{slug}) as /web-blog/{slug}, so it was a
// duplicate of every post. It now permanently redirects (308) to the canonical
// /web-blog/{slug}, leaving one URL per post.

import { permanentRedirect } from "next/navigation";

export default async function LegacyBlogPostRedirect({ params }) {
  const { slug } = await params;
  const raw = String((Array.isArray(slug) ? slug[0] : slug) || "").trim();

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // keep the raw value
  }

  permanentRedirect(decoded ? `/web-blog/${encodeURIComponent(decoded)}` : "/web-blog");
}
