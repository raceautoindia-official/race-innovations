// The old AWS account's bucket now has all access disabled (S3 answers every
// request with 403 AllAccessDisabled), but many absolute URLs saved in the DB
// still point at it. Every key was copied to the new account's bucket, so any
// URL on the old host is rewritten to the same key on the new host.
const OLD_BUCKET_HOST_RE = /:\/\/raceautonextjs-bucket\.s3\.ap-south-1\.amazonaws\.com/i;
const NEW_BUCKET_HOST = "://raceautonextjs-backup.s3.ap-south-1.amazonaws.com";

export function retireOldBucket(url) {
  return String(url || "").replace(OLD_BUCKET_HOST_RE, NEW_BUCKET_HOST);
}

// Build an absolute S3 asset URL from a stored key/path.
//
// Tolerant of whether NEXT_PUBLIC_S3_BUCKET_URL has a trailing slash and
// whether the stored path has a leading slash, so it never produces
// "...amazonaws.comuploads/..." (missing slash → ERR_NAME_NOT_RESOLVED) or
// "...amazonaws.com//uploads/..." (double slash). If the stored value is
// already an absolute URL, it's returned unchanged (apart from moving it off
// the disabled old bucket).
export function s3Url(pathOrKey) {
  const raw = String(pathOrKey || "");
  if (/^https?:\/\//i.test(raw)) return retireOldBucket(raw);

  const base = (process.env.NEXT_PUBLIC_S3_BUCKET_URL || "").replace(/\/+$/, "");
  const key = raw.replace(/^\/+/, "");
  return retireOldBucket(`${base}/${key}`);
}
