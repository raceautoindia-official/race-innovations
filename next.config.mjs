/** @type {import('next').NextConfig} */
const nextConfig = {
  // 301 redirect www → non-www so Google + audit tools see a single canonical
  // host. Without this, https://www.raceinnovations.in/* serves duplicate
  // content alongside https://raceinnovations.in/*, which the on-page audit
  // flagged as a critical SEO issue.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.raceinnovations.in" }],
        destination: "https://raceinnovations.in/:path*",
        permanent: true,
      },
    ];
  },

  // SEO + security headers. Caching headers for static asset folders to
  // help the "Improve page response time" tip.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          // Explicit Expires header so audit tools that don't read Cache-Control
          // (e.g. Seobility) still see a long-lived expiry for static images.
          { key: "Expires", value: "Thu, 31 Dec 2037 23:59:59 GMT" },
        ],
      },
      // Catch-all for image extensions served from the public root (favicons,
      // og-images, etc.) — the /images/ rule above only matches /images/*.
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "Expires", value: "Thu, 31 Dec 2037 23:59:59 GMT" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "Expires", value: "Thu, 31 Dec 2037 23:59:59 GMT" },
        ],
      },
      {
        source: "/_next/image:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "Expires", value: "Thu, 31 Dec 2037 23:59:59 GMT" },
        ],
      },
    ];
  },

  // Make sure the image optimizer also emits long-lived cache headers for the
  // optimized variants of our images (separate from the static /images/ path).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raceautonextjs-bucket.s3.ap-south-1.amazonaws.com",
      },
    ],
    minimumCacheTTL: 31536000,
  },

  // Smaller bundles → faster TTFB → better audit score.
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  // Reduce the number of separate JS modules emitted for icon and UI
  // libraries. Without this, every imported icon ships as its own module — the
  // audit flagged that as "too many JavaScript files." This consolidates them
  // into far fewer chunks at build time.
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "react-icons/md",
      "react-icons/fa",
      "react-icons/fa6",
      "react-icons/fi",
      "react-icons/hi",
      "react-icons/si",
      "lucide-react",
      "framer-motion",
      "swiper",
      "react-bootstrap",
    ],
  },
};

export default nextConfig;
