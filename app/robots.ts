import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * /robots.txt
 *
 * `/api/` is disallowed because nothing under it is a page. (The Nawal demo
 * chat route that lived there was removed with the A2 home page, 2026-11-06;
 * the rule stays so the robots.txt Google already has does not change.)
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
