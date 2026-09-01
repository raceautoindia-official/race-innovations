// Build an absolute S3 asset URL from a stored key/path.
//
// Tolerant of whether NEXT_PUBLIC_S3_BUCKET_URL has a trailing slash and
// whether the stored path has a leading slash, so it never produces
// "...amazonaws.comuploads/..." (missing slash → ERR_NAME_NOT_RESOLVED) or
// "...amazonaws.com//uploads/..." (double slash). If the stored value is
// already an absolute URL, it's returned unchanged.
export function s3Url(pathOrKey) {
  const raw = String(pathOrKey || "");
  if (/^https?:\/\//i.test(raw)) return raw;

  const base = (process.env.NEXT_PUBLIC_S3_BUCKET_URL || "").replace(/\/+$/, "");
  const key = raw.replace(/^\/+/, "");
  return `${base}/${key}`;
}
