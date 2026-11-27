// /web-blog/{slug}: server page for one blog post.
//
// The post is loaded on the server, so the HTML carries its own title,
// description, canonical and share image, one H1 (the post title), the
// published date in a <time> element, the full article and Article +
// BreadcrumbList JSON-LD. Buttons, comments and the LinkedIn card live in the
// client component BlogPostShell.

import { notFound } from "next/navigation";
import BlogPostShell from "./BlogPostShell";
import JsonLd from "../../components/JsonLd";
import {
  SITE_NAME,
  articleJsonLd,
  breadcrumbJsonLd,
  pageMetadata,
} from "../../../lib/seo";
import { dbErrorShouldThrow, getPostBySlug } from "../../../lib/blog-service";
import {
  BLOG_TIME_ZONE,
  postDate,
  postDescription,
  postPath,
  resolveImg,
} from "../blog-utils";

// ISR: each post is rendered on its first visit, cached, and refreshed at
// most every 5 minutes. Nothing is pre-rendered at build time, so the build
// does not need the database for these pages.
export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

const TITLE_SUFFIX = ` | ${SITE_NAME}`;

function readSlug(raw) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const s = String(value || "").trim();
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

async function loadPost(params) {
  const { slug: rawSlug } = await params;
  const slug = readSlug(rawSlug);
  const result = await getPostBySlug(slug);

  // A database error is not a missing post: at runtime fail the render so ISR
  // keeps serving the last good page instead of caching a 404.
  if (!result.ok && dbErrorShouldThrow()) {
    throw new Error(`Blog post "${slug}" could not be loaded from the database`);
  }
  return result.post;
}

function postDates(post) {
  const published = postDate(post);
  const publishedIso = published ? published.toISOString() : undefined;

  const updated = post?.updated_at ? new Date(post.updated_at) : null;
  const updatedValid =
    updated && !Number.isNaN(updated.getTime()) && (!published || updated >= published);

  return {
    published,
    publishedIso,
    modifiedIso: updatedValid ? updated.toISOString() : publishedIso,
  };
}

// Same dd/mm/yyyy format the page showed before, in Indian time.
function formatPostDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: BLOG_TIME_ZONE,
  });
}

// Cover image usable as a share image / schema image (a site path or an
// absolute URL), or "" when the post has none.
function shareImage(post) {
  const src = resolveImg(post?.cover_image);
  return /^https?:\/\//i.test(src) || src.startsWith("/") ? src : "";
}

// The post title is the page's only H1, so H1s inside the stored article HTML
// are demoted to H2.
function prepareContent(html) {
  return String(html || "").replace(/<(\/?)h1(?=[\s>/])/gi, "<$1h2");
}

export async function generateMetadata({ params }) {
  const post = await loadPost(params);
  if (!post) {
    return { title: "Post not found", robots: { index: false, follow: true } };
  }

  const title = post.title || "Blog post";
  const { publishedIso, modifiedIso } = postDates(post);
  const image = shareImage(post);

  return pageMetadata({
    path: postPath(post.slug),
    title,
    // Add " | RACE Innovations" only while the whole title stays within ~60
    // characters; long post titles are used on their own.
    absoluteTitle: title.length + TITLE_SUFFIX.length > 60,
    description: postDescription(post),
    type: "article",
    image: image ? { url: image, alt: title } : undefined,
    // Drafts open for previewing but stay out of search results.
    noindex: Boolean(post.status) && post.status !== "published",
    article: {
      ...(publishedIso ? { publishedTime: publishedIso } : {}),
      ...(modifiedIso ? { modifiedTime: modifiedIso } : {}),
      ...(post.category_name ? { section: post.category_name } : {}),
    },
  });
}

export default async function BlogPostPage({ params }) {
  const post = await loadPost(params);
  if (!post) notFound();

  const path = postPath(post.slug);
  const title = post.title || "Untitled Post";
  const description = postDescription(post);
  const { published, publishedIso, modifiedIso } = postDates(post);
  const image = shareImage(post);

  const header = (
    <>
      <div className="metaRow">
        {published ? (
          <time className="dateText" dateTime={publishedIso}>
            {formatPostDate(published)}
          </time>
        ) : null}

        {post.category_name ? (
          <span className="categoryBadge">{post.category_name}</span>
        ) : null}
      </div>

      <h1 className="articleTitle">{title}</h1>
    </>
  );

  const body = (
    <>
      {post.excerpt ? <p className="articleExcerpt">{post.excerpt}</p> : null}

      <div
        className="articleBody"
        dangerouslySetInnerHTML={{ __html: prepareContent(post.content) }}
      />
    </>
  );

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title,
            description,
            path,
            image: image || undefined,
            datePublished: publishedIso,
            dateModified: modifiedIso,
            section: post.category_name || undefined,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/web-blog" },
            { name: title, path },
          ]),
        ]}
      />

      <BlogPostShell
        post={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          cover_image: post.cover_image,
          linkedin_url: post.linkedin_url,
        }}
        header={header}
        body={body}
      />
    </>
  );
}
