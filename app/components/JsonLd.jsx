// Renders one or more JSON-LD blocks. Works in server components.
// "<" is escaped so text from the database can't close the script tag.
export default function JsonLd({ data }) {
  const blocks = Array.isArray(data) ? data : [data];
  return blocks.filter(Boolean).map((block, i) => (
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, "\\u003c") }}
    />
  ));
}
