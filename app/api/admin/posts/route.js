import db from "../../../../lib/db";

function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export async function POST(req) {
  const body = await req.json();

  const {
    title,
    slug,
    excerpt,
    content,
    category_id,
    sub_category_id,
    market,
    keywords,
    cover_image, // for now use URL string
    tags, // array of tag strings
    status, // draft | published
  } = body;

  if (!title || !content) return new Response("Missing fields", { status: 400 });

  const finalSlug = slug?.trim() ? slugify(slug) : slugify(title);

  // Ensure slug unique
  const [exists] = await db.query("SELECT id FROM posts WHERE slug=? LIMIT 1", [finalSlug]);
  let uniqueSlug = finalSlug;
  if (exists.length) uniqueSlug = `${finalSlug}-${Date.now()}`;

  const published_at = status === "published" ? new Date() : null;

  const [result] = await db.query(
    `
    INSERT INTO posts
      (title, slug, excerpt, content, cover_image, category_id, sub_category_id, market, keywords, status, published_at)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      title,
      uniqueSlug,
      excerpt || null,
      content,
      cover_image || null,
      category_id || null,
      sub_category_id || null,
      market || null,
      keywords || null,
      status || "draft",
      published_at,
    ]
  );

  const postId = result.insertId;

  // tags: upsert into tags table, map to post_tags
  if (Array.isArray(tags) && tags.length) {
    for (const t of tags) {
      const name = String(t).trim();
      if (!name) continue;
      const tagSlug = slugify(name);

      // insert tag if not exists
      await db.query(
        "INSERT IGNORE INTO tags (name, slug) VALUES (?, ?)",
        [name, tagSlug]
      );

      const [tagRow] = await db.query("SELECT id FROM tags WHERE slug=? LIMIT 1", [tagSlug]);
      if (tagRow.length) {
        await db.query(
          "INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)",
          [postId, tagRow[0].id]
        );
      }
    }
  }

  return Response.json({ ok: true, id: postId, slug: uniqueSlug });
}
