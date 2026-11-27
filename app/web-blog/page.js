// /web-blog: server page. Loads the posts and categories on the server and
// hands them to the client UI, so the HTML already lists every post with a
// real link. Regenerated at most every 5 minutes (ISR).

import BlogListClient from "./BlogListClient";
import JsonLd from "../components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo";
import {
  dbErrorShouldThrow,
  getBlogCategories,
  getBlogPosts,
} from "../../lib/blog-service";

export const revalidate = 300;

export const metadata = pageMetadata({
  path: "/web-blog",
  title: "Automotive Market Insights Blog",
  description:
    "Articles from RACE Innovations on India's automotive industry: EV and commercial vehicle trends, market analysis, OEM news and ODC logistics insights.",
});

export default async function WebBlogPage() {
  const [postsResult, categoriesResult] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);

  // At runtime, fail the regeneration so ISR keeps the last good page instead
  // of caching an empty listing (see dbErrorShouldThrow).
  if (!postsResult.ok && dbErrorShouldThrow()) {
    throw new Error("Blog listing: posts could not be loaded from the database");
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/web-blog" },
        ])}
      />
      <BlogListClient
        initialPosts={postsResult.posts}
        initialCategories={categoriesResult.categories}
      />
    </>
  );
}
