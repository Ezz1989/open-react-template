import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * /robots.txt
 *
 * `/api/` is disallowed because nothing under it is a page. The Nawal chat
 * route is a POST endpoint holding a server-side Groq key; there is no reason
 * for a crawler to spend requests discovering that it returns 405 to GET.
 *
 * The sitemap is declared here as well as being served at /sitemap.xml, which
 * is how a crawler that arrives without a Search Console submission finds it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
