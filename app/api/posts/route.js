import db from "../../../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category"); // slug
  const q = searchParams.get("q");

  const where = ["p.status='published'"];
  const params = [];

  if (category && category !== "all") {
    where.push("c.slug=?");
    params.push(category);
  }

  if (q && q.trim()) {
    where.push("(p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const [rows] = await db.query(
    `
    SELECT
      p.id, p.title, p.slug, p.excerpt, p.cover_image, p.created_at, p.published_at,
      c.name AS category_name, c.slug AS category_slug
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE ${where.join(" AND ")}
    ORDER BY COALESCE(p.published_at, p.created_at) DESC
    LIMIT 50
    `,
    params
  );

  return Response.json({ posts: rows });
}
