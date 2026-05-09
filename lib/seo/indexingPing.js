// Auto-indexing helpers — fire HTTP requests to search engines whenever a
// report or blog post is created/updated. All calls are best-effort and
// fail silently so admin saves never break.
//
// Required env (in .env.local on production):
//   NEXT_PUBLIC_SITE_URL                    e.g. https://raceinnovations.in
//   INDEXNOW_KEY                            32+ hex chars (any random string)
//   GOOGLE_INDEXING_CLIENT_EMAIL            service-account email (optional)
//   GOOGLE_INDEXING_PRIVATE_KEY             service-account private key with \n escapes (optional)

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://raceinnovations.in").replace(
    /\/+$/,
    ""
  );

function absUrl(path) {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * IndexNow — Bing + Yandex + Seznam. No auth needed beyond a static key.
 * Drop the key file at /public/<INDEXNOW_KEY>.txt with the key as content
 * so search engines can verify ownership (handled by /api/indexnow-key).
 */
async function pingIndexNow(urls) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || !urls || urls.length === 0) return { ok: false, reason: "no key or urls" };

  try {
    const host = new URL(SITE_URL).host;
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls.map(absUrl),
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("[IndexNow] ping failed:", err?.message || err);
    return { ok: false, error: err?.message };
  }
}

/**
 * Google Indexing API — officially supports JobPosting + BroadcastEvent
 * but is widely used for any URL change notification. Requires a Google
 * Cloud service account with "Indexing API" enabled and the account
 * added as Owner in Google Search Console for the property.
 */
async function getGoogleAccessToken() {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY;
  if (!clientEmail || !rawKey) return null;

  // Decode \n escapes commonly found in env vars.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const header = { alg: "RS256", typ: "JWT" };

  const base64url = (input) =>
    Buffer.from(input)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const headerSegment = base64url(JSON.stringify(header));
  const claimSegment = base64url(JSON.stringify(claim));
  const signingInput = `${headerSegment}.${claimSegment}`;

  let crypto;
  try {
    // Node 18+ provides global crypto, fallback to require for older.
    crypto = await import("crypto");
  } catch {
    return null;
  }

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signingInput)
    .sign(privateKey)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signingInput}.${signature}`;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }).toString(),
    });
    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.error("[GoogleIndexing] token error:", err?.message || err);
    return null;
  }
}

async function pingGoogleIndexing(urls, type = "URL_UPDATED") {
  if (!urls || urls.length === 0) return { ok: false, reason: "no urls" };

  const token = await getGoogleAccessToken();
  if (!token) return { ok: false, reason: "no google credentials" };

  // Indexing API has a per-request quota; send each URL individually.
  const results = await Promise.allSettled(
    urls.map((u) =>
      fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: absUrl(u), type }),
      }).then((r) => ({ url: u, ok: r.ok, status: r.status }))
    )
  );

  return { ok: true, results };
}

/**
 * Notify all configured search engines that the given URLs were created
 * or updated. Fire-and-forget — admin saves never wait on these.
 */
export async function notifySearchEngines(urls, type = "URL_UPDATED") {
  const list = (Array.isArray(urls) ? urls : [urls])
    .filter(Boolean)
    .map((u) => String(u).trim())
    .filter(Boolean);

  if (list.length === 0) return;

  // Run in parallel; never block the caller's flow.
  Promise.allSettled([
    pingIndexNow(list),
    pingGoogleIndexing(list, type),
  ]).then((results) => {
    results.forEach((r, i) => {
      const name = i === 0 ? "IndexNow" : "GoogleIndexing";
      if (r.status === "fulfilled") {
        console.log(`[${name}]`, JSON.stringify(r.value));
      } else {
        console.error(`[${name}] error:`, r.reason);
      }
    });
  });
}

export async function notifyDeletedUrl(url) {
  const list = [url].filter(Boolean);
  if (!list.length) return;

  Promise.allSettled([
    pingIndexNow(list),
    pingGoogleIndexing(list, "URL_DELETED"),
  ]).then((results) => {
    results.forEach((r, i) => {
      const name = i === 0 ? "IndexNow" : "GoogleIndexing";
      if (r.status === "fulfilled") {
        console.log(`[${name}/delete]`, JSON.stringify(r.value));
      }
    });
  });
}
