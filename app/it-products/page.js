import ItProducts from "./ItProducts";

export const metadata = {
  title: "IT Products & Software Solutions | Race Innovations",
  description:
    "Explore software products built by Race Innovations — video calling, project management, mobile apps, bale management, lead generation, forecasting, e-commerce, media platform, attendance, skin & hair analyzer, newsletter, email marketing and portfolio websites. Request a demo or enquiry.",
  keywords:
    "Race Innovations IT services, video calling app, project management app, mobile app development, bale management app, lead generation tool, forecasting tool, ecommerce website, media platform, attendance app, skin and hair analyzer app, newsletter app, email marketing tool, portfolio website, custom software",
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
