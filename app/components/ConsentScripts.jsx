"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import {
  getCookieConsent,
  hasAnalyticsConsent,
  hasMarketingConsent,
} from "../../lib/cookieConsent";

const CONSENT_EVENT = "race-cookie-consent-changed";

// Set these in .env.local to enable real tracking. If left empty, the
// corresponding script block simply doesn't render.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export default function ConsentScripts() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    function refresh() {
      // Re-read every time so we react to Accept / Reject / Manage updates
      // without requiring a full page reload.
      getCookieConsent();
      setAnalyticsAllowed(hasAnalyticsConsent());
      setMarketingAllowed(hasMarketingConsent());
    }

    refresh();

    if (typeof window === "undefined") return undefined;

    window.addEventListener(CONSENT_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CONSENT_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <>
      {analyticsAllowed && GA_ID ? (
        <>
          <Script
            id="ga-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {marketingAllowed && META_PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
