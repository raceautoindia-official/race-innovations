import { revalidatePath } from "next/cache";

// The report listings and report pages are cached and rebuilt every few
// minutes (ISR). Call this after a report is created, edited or deleted so
// the change shows straight away.
export function refreshReportPages(slug) {
  try {
    revalidatePath("/market-report");
    revalidatePath("/lbi-reports");
    if (slug) revalidatePath(`/reports/${slug}`);
  } catch (error) {
    console.error("refreshReportPages failed:", error?.message || error);
  }
}

// Same for the blog: the listing and post pages are cached (ISR).
export function refreshBlogPages(slug) {
  try {
    revalidatePath("/web-blog");
    if (slug) revalidatePath(`/web-blog/${slug}`);
  } catch (error) {
    console.error("refreshBlogPages failed:", error?.message || error);
  }
}
