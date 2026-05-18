"use client";

import { useEffect } from "react";

/**
 * Fires a single tracking ping to /api/track-view when this component
 * mounts on the client. SSR-safe (only runs in the browser), bot/admin
 * traffic is filtered server-side, and same-visitor refreshes within
 * 30 minutes are deduped server-side too.
 *
 * Usage:
 *   <PageViewTracker contentType="report" slug={report.slug} contentId={report.id} />
 *   <PageViewTracker contentType="blog"   slug={post.slug}   contentId={post.id} />
 */
export default function PageViewTracker({
  contentType,
  slug,
  contentId = null,
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!slug || !contentType) return;

    // Skip tracking when the page is opened from inside the admin (logged-in
    // editors browsing their own content) — referrer-based heuristic so we
    // don't need any auth wiring.
    try {
      const ref = document.referrer || "";
      if (ref.includes("/admin")) return;
      if (window.location.pathname.startsWith("/admin")) return;
    } catch {
      /* noop */
    }

    const ctrl = new AbortController();

    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, slug, contentId }),
      signal: ctrl.signal,
      keepalive: true,
    }).catch(() => {
      /* silent — tracking must never break the page */
    });

    return () => ctrl.abort();
  }, [contentType, slug, contentId]);

  return null;
}
