import 'bootstrap/dist/css/bootstrap.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BootstrapClient from './components/BootstrapClient';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import 'core-js/full/promise/with-resolvers';
import "react-quill/dist/quill.snow.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Race Innovations",
  description: "Race Innovations is a global leader in technology solutions, with a strong presence across multiple countries and headquarters in India.",
  keywords: "Race Innovations, technology solutions, global innovation, AI, automation, digital transformation",
  robots: "index, follow",
  openGraph: {
    title: "Race Innovations - Transforming Industries",
    description: "Race Innovations provides cutting-edge technology solutions, AI-driven automation, and digital transformation services to businesses worldwide.",
    url: "https://raceinnovation.com",
    siteName: "Race Innovations",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Race Innovations ",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@raceinnovation",
    title: "Race Innovations ",
    description: "Join Race Innovations in pioneering AI, automation, and digital transformation on a global scale.",
    images: ["https://raceinnovation.com/assets/og-image.jpg"],
  },
  alternates: {
    canonical: "https://raceinnovation.com",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
  
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ToastContainer />
        {children}
        <BootstrapClient/>
        
      </body>
    </html>
  );
}
