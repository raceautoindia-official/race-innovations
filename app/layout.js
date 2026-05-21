import 'bootstrap/dist/css/bootstrap.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BootstrapClient from './components/BootstrapClient';
import GlobalFloatingWidgets from './components/GlobalFloatingWidgets';
import ScrollToTopButton from './components/ScrollToTopButton';
import CookieConsent from './components/CookieConsent';
import ConsentScripts from './components/ConsentScripts';
import NewsletterPopup from './components/NewsletterPopup';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import 'core-js/full/promise/with-resolvers';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Global defaults — individual pages (page.jsx in each route) override these
// with their own metadata. metadataBase makes every relative URL in a page's
// metadata (canonical, OG images) resolve against this domain automatically.
export const metadata = {
  metadataBase: new URL("https://raceinnovations.in"),
  title: {
    default: "RACE Innovations | Automotive Intelligence & ODC Reports",
    template: "%s | RACE Innovations",
  },
  description:
    "Automotive market intelligence, EV insights, OEM benchmarking, ODC route survey & LBI reports from RACE Innovations.",
  applicationName: "RACE Innovations",
  authors: [{ name: "RACE Innovations" }],
  generator: "Next.js",
  keywords: [
    "RACE Innovations",
    "automotive market intelligence",
    "ODC route survey",
    "LBI reports",
    "OEM benchmarking",
    "EV intelligence",
    "automotive forecast reports",
  ],
  robots: "index, follow",
  openGraph: {
    siteName: "RACE Innovations",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "RACE Innovations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@raceinnovation",
  },
  alternates: {
    canonical: "https://raceinnovations.in/",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect / DNS-prefetch for third-party origins we always use.
            Shaves 100–300ms off TTFB on first paint. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link
          rel="dns-prefetch"
          href="https://raceautonextjs-bucket.s3.ap-south-1.amazonaws.com"
        />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://mail.google.com" />

        {/* Theme colour for mobile browser chrome */}
        <meta name="theme-color" content="#2f45bf" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ToastContainer />
        {children}
        <BootstrapClient/>
        <GlobalFloatingWidgets />
        <ScrollToTopButton />
        <CookieConsent />
        <ConsentScripts />
        <NewsletterPopup />

      </body>
    </html>
  );
}
