export const COOKIE_KEY = "race_cookie_consent_v1";

export function getCookieConsent() {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(COOKIE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  const consent = getCookieConsent();
  return Boolean(consent?.preferences?.analytics);
}

export function hasMarketingConsent() {
  const consent = getCookieConsent();
  return Boolean(consent?.preferences?.marketing);
}
