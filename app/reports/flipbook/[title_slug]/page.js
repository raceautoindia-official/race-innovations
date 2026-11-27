import { cache } from "react";
import Navbar from "../../../components/Navbar";
import Flip from "./Home.js";
import JsonLd from "../../../components/JsonLd";
import db from "../../../../lib/db";
import { toPublicFlipbook } from "../../../../lib/flipbook-service";
import { pageMetadata, breadcrumbJsonLd } from "../../../../lib/seo";

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 155;

function decodeSlug(raw) {
  try {
    return decodeURIComponent(String(raw || ""));
  } catch {
    return String(raw || "");
  }
}

// "electric-truck-market-2026" -> "Electric Truck Market 2026"
function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function shorten(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,:;.-]+$/, "")}…`;
}

function describe(title) {
  const tail =
    ": read this RACE Innovations report online in a page-flip reader with page thumbnails, zoom and full-screen view.";
  return `${shorten(title, MAX_DESCRIPTION - tail.length)}${tail}`;
}

// One lookup per request, shared by generateMetadata and the page.
// toPublicFlipbook drops the password hash. A database that can't be reached
// (for example at build time) gives { found: null } instead of an error.
const getFlipbook = cache(async (slug) => {
  try {
    const [rows] = await db.query("SELECT * FROM pdf WHERE title_slug = ? LIMIT 1", [slug]);
    const row = rows[0] ? toPublicFlipbook(rows[0]) : null;
    return {
      found: Boolean(row),
      title: String(row?.title || "").trim(),
      watermark: Number(row?.watermark) === 1,
    };
  } catch (error) {
    console.error("Flipbook metadata lookup failed:", error);
    return { found: null, title: "", watermark: false };
  }
});

export async function generateMetadata({ params }) {
  const slug = decodeSlug((await params).title_slug);
  const path = `/reports/flipbook/${encodeURIComponent(slug)}`;
  const flipbook = await getFlipbook(slug);

  if (flipbook.found === false) {
    return pageMetadata({
      path,
      title: "Report Not Found",
      description: "This report flipbook could not be found. Browse RACE Innovations market reports and LBI route survey reports instead.",
      noindex: true,
    });
  }

  const title = flipbook.title || titleFromSlug(slug) || "Report Flipbook";
  return pageMetadata({
    path,
    title: shorten(title, MAX_TITLE),
    description: describe(title),
    // A watermarked copy is prepared for one named client: keep it out of search.
    noindex: flipbook.watermark,
  });
}

export default async function Page({ params }) {
  const slug = decodeSlug((await params).title_slug);
  const flipbook = await getFlipbook(slug);
  const title = flipbook.title || titleFromSlug(slug);

  const jsonLd =
    flipbook.found !== false && title
      ? [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: title, path: `/reports/flipbook/${encodeURIComponent(slug)}` },
          ]),
        ]
      : null;

 return(
  <main>
   {jsonLd ? <JsonLd data={jsonLd} /> : null}
   <Flip/>
  </main>
 )
}
