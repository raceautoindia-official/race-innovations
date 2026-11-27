// Shared SEO helpers: page metadata (own canonical, matching Open Graph and
// Twitter text, one share image) and JSON-LD builders.
//
// The root layout's title template appends " | RACE Innovations", so pass
// the page part only: keep it under ~40 characters so the full title stays
// within 50-60. Descriptions should be 140-155 characters.

export const SITE_URL = "https://raceinnovations.in";
export const SITE_NAME = "RACE Innovations";
export const TWITTER_HANDLE = "@raceinnovations";

// 1200x630 branded share card used wherever a page has no image of its own.
export const DEFAULT_SHARE_IMAGE = {
  url: "/images/og-default.png",
  width: 1200,
  height: 630,
  alt: "RACE Innovations: automotive market intelligence and ODC route surveys",
};

export const ORGANIZATION = {
  name: "RACE Innovations Private Limited",
  brand: "RACE Innovations",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.jpg`,
  telephone: "+91-44-66108114",
  email: "info@raceinnovations.in",
  address: {
    streetAddress: "Olympia Platina, Guindy",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600032",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.linkedin.com/company/race-innovations-private-limited/",
    "https://www.facebook.com/raceinnovationspvtltd/",
    "https://www.instagram.com/raceinnovations/",
    "https://x.com/raceinnovations",
  ],
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Metadata for one page.
 *
 * @param {object} o
 * @param {string} o.path         Page path, e.g. "/intellect/lbi". Becomes the canonical.
 * @param {string} o.title        Page part of the title (template adds the brand).
 * @param {string} o.description  140-155 characters.
 * @param {string} [o.socialTitle] Title for share cards; defaults to the full title.
 * @param {object|string} [o.image] Share image ({url,width,height,alt} or a URL).
 * @param {string} [o.type]       Open Graph type ("website" or "article").
 * @param {boolean} [o.absoluteTitle] Use title as-is, without the brand suffix.
 * @param {boolean} [o.noindex]   Keep the page out of search results.
 * @param {object} [o.article]    { publishedTime, modifiedTime, authors, section, tags }
 */
export function pageMetadata({
  path,
  title,
  description,
  socialTitle,
  image,
  type = "website",
  absoluteTitle = false,
  noindex = false,
  article,
}) {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const shareTitle = socialTitle || fullTitle;
  const img =
    typeof image === "string"
      ? { url: image, alt: shareTitle }
      : image || DEFAULT_SHARE_IMAGE;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images: [img],
      ...(type === "article" && article ? article : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title: shareTitle,
      description,
      images: [img.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

// ── JSON-LD builders ──────────────────────────────────────────────────────
// Render with <JsonLd data={...} /> from app/components/JsonLd.jsx.

export function organizationJsonLd() {
  const o = ORGANIZATION;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: o.name,
    alternateName: o.brand,
    url: o.url,
    logo: o.logo,
    email: o.email,
    telephone: o.telephone,
    address: { "@type": "PostalAddress", ...o.address },
    sameAs: o.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: o.telephone,
        email: o.email,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
  };
}

export function localBusinessJsonLd() {
  const o = ORGANIZATION;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: o.brand,
    url: o.url,
    image: o.logo,
    telephone: o.telephone,
    email: o.email,
    address: { "@type": "PostalAddress", ...o.address },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

/** items: [{ name, path }] from the homepage down to the current page. */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** faqs: [{ question, answer }] with plain-text answers. */
export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceJsonLd({ name, description, path, serviceType, areaServed = "IN" }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType || name,
    url: absoluteUrl(path),
    areaServed,
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export function articleJsonLd({ title, description, path, image, datePublished, dateModified, section }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: String(title || "").slice(0, 110),
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: image ? [absoluteUrl(image)] : [absoluteUrl(DEFAULT_SHARE_IMAGE.url)],
    datePublished,
    dateModified: dateModified || datePublished,
    ...(section ? { articleSection: section } : {}),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
