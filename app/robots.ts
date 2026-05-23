import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://raceinnovations.in"
).replace(/\/+$/, "");

// Strict robots.txt syntax — robots.txt does prefix matching by default, so
// "Disallow: /admin" already blocks /admin and /admin/anything.
//
// AI / LLM crawlers are explicitly allowed so ChatGPT, Claude, Perplexity,
// Google AI Overviews, etc. can read and cite our public pages when users ask
// them about automotive market reports. Each AI crawler has its own UA and
// must be allowed individually — Disallow: /admin still applies via the
// catch-all "*" rule below.
const DISALLOW = ["/admin", "/api", "/login", "/admin-access"];

const AI_CRAWLERS = [
  "GPTBot",            // OpenAI training crawler
  "OAI-SearchBot",     // ChatGPT search-time citation crawler
  "ChatGPT-User",      // ChatGPT browse-tool requests
  "ClaudeBot",         // Anthropic Claude training + search
  "Claude-Web",        // Claude browse / citation crawler
  "anthropic-ai",      // Legacy Anthropic identifier
  "PerplexityBot",     // Perplexity AI citation crawler
  "Perplexity-User",   // Perplexity browse-tool requests
  "Google-Extended",   // Google Gemini / AI Overviews opt-in
  "Applebot-Extended", // Apple Intelligence
  "CCBot",             // Common Crawl (powers many LLMs)
  "Bytespider",        // ByteDance / TikTok AI
  "Amazonbot",         // Amazon Alexa / Rufus AI
  "Meta-ExternalAgent",// Meta AI assistant
  "FacebookBot",       // Meta AI citations
  "DuckAssistBot",     // DuckDuckGo AI assist
];

export default function robots(): MetadataRoute.Robots {
  const aiRules = AI_CRAWLERS.map((userAgent) => ({
    userAgent,
    allow: "/",
    disallow: DISALLOW,
  }));

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...aiRules,
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
