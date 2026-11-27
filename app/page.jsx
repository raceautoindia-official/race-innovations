import Home from "./Home/home.js";
import { pageMetadata } from "../lib/seo";

// Company (Organization) and WebSite structured data come from the root
// layout, so they appear on every page.
export const metadata = pageMetadata({
  path: "/",
  title: "RACE Innovations | Automotive Research & ODC Route Surveys",
  absoluteTitle: true,
  description:
    "Automotive market intelligence and ODC route surveys from Chennai: market and EV reports, OEM benchmarking and over-dimensional cargo route studies.",
});

export default function Page() {
  return (
    <main>
      <Home />
    </main>
  );
}
