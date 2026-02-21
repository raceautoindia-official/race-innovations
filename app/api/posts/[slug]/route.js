import db from "../../../../lib/db";

export async function GET(_req, { params }) {
  const [rows] = await db.query(
    `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM posts p
    LEFT JOIN categories c ON c.id=p.category_id
    WHERE p.slug=? AND p.status='published'
    LIMIT 1
    `,
    [params.slug]
  );

  if (!rows.length) return new Response("Not found", { status: 404 });
  return Response.json({ post: rows[0] });
}
