import ItProducts from "./ItProducts";

export const metadata = {
  title: "IT Products & Software Solutions | Race Innovations",
  description:
    "Explore software products built by Race Innovations — video calling app, project management app, custom mobile apps, bale management app, LeanSentra lead generation, and forecasting tool. Request a demo or enquiry.",
  keywords:
    "Race Innovations IT services, video calling app, project management app, mobile app development, bale management app, LeanSentra lead generation tool, forecasting tool, custom software",
  robots: "index, follow",
  openGraph: {
    title: "IT Products & Software Solutions | Race Innovations",
    description:
      "Video calling app, project management app, custom mobile apps, and bale management app — built and delivered by Race Innovations.",
    url: "https://raceinnovations.in/it-products",
    siteName: "Race Innovations",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Race Innovations IT Products",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://raceinnovations.in/it-products",
  },
};

export default function Page() {
  return <ItProducts />;
}
