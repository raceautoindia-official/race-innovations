/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raceautonextjs-bucket.s3.ap-south-1.amazonaws.com",
      },
    ],
  },

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
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Smaller bundles → faster TTFB → better audit score.
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
