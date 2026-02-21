import PostClient from "./PostClient";

export default async function Post({ params }) {
  // ✅ Next 15: params can be async
  const { slug } = await params;

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/posts/${slug}`, { cache: "no-store" });

  if (!res.ok) return <div className="p-6">Post not found</div>;

  const data = await res.json();
  const post = data?.post || data; // supports either {post:{...}} or {...}

  return <PostClient post={post} />;
}
