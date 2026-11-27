import { pageMetadata } from "../../lib/seo";

// The page itself is a client component, so its metadata lives here.
// Kept out of search results: not a public landing page.
export const metadata = pageMetadata({
  path: "/sample-flipbook",
  title: "Sample Report Viewer",
  description: "RACE Innovations: automotive market intelligence and ODC route surveys.",
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}
