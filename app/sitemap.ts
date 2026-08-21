import type { MetadataRoute } from "next";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE } from "@/lib/constants";
import { publishedMonths } from "@/lib/guide-content";

/**
 * /sitemap.xml
 *
 * Google treats HTML link tags, HTTP headers and sitemap annotations as
 * "equivalent" ways to declare localized versions, so the `alternates.
 * languages` entries here say the same thing the <link rel="alternate"> tags
 * on each page say. Declaring it twice is not redundant in practice: the
 * sitemap is what gets fetched on a schedule.
 *
 * Only published months appear. Listing an unwritten month would advertise a
 * 404, since `dynamicParams = false` means unpublished months are not built.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const alt = (build: (l: string) => string) => {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) languages[HREFLANG[l]] = build(l);
    languages["x-default"] = build(X_DEFAULT_LOCALE);
    return languages;
  };

  // The marketing homepage. It still serves both languages from one URL via
  // the client-side toggle, so it gets no hreflang cluster: there is only one
  // document to point at.
  entries.push({
    url: SITE_URL,
    changeFrequency: "monthly",
    priority: 1,
  });

  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/about`,
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: { languages: alt((l) => `${SITE_URL}/${l}/about`) },
    });
  }

  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/guide`,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: alt((l) => `${SITE_URL}/${l}/guide`) },
    });
  }

  for (const doc of publishedMonths()) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/guide/${doc.month}`,
        lastModified: new Date(doc.updated),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: alt((l) => `${SITE_URL}/${l}/guide/${doc.month}`),
        },
      });
    }
  }

  return entries;
}
