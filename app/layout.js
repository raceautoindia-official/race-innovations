import 'bootstrap/dist/css/bootstrap.min.css';
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
import JsonLd from './components/JsonLd';
import {
  SITE_URL,
  SITE_NAME,
  TWITTER_HANDLE,
  DEFAULT_SHARE_IMAGE,
  organizationJsonLd,
  websiteJsonLd,
} from '../lib/seo';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Global defaults. Every public page sets its own title, description and
// canonical with pageMetadata() from lib/seo.js. There is deliberately no
// canonical here: an inherited one made inner pages point at the homepage.
// metadataBase makes relative URLs in metadata resolve against the domain.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RACE Innovations | Automotive Research & ODC Route Surveys",
    template: "%s | RACE Innovations",
  },
  description:
    "Automotive market intelligence and ODC route surveys from Chennai: market and EV reports, OEM benchmarking and over-dimensional cargo route studies.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  robots: "index, follow",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    images: [DEFAULT_SHARE_IMAGE.url],
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
          href="https://raceautonextjs-backup.s3.ap-south-1.amazonaws.com"
        />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://mail.google.com" />

        {/* Theme colour for mobile browser chrome */}
        <meta name="theme-color" content="#2f45bf" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
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
