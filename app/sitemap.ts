import type { MetadataRoute } from "next";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE } from "@/lib/constants";
import { publishedMonths } from "@/lib/guide-content";
import { publishedArticles } from "@/lib/father-content";
import { TOOLS } from "@/lib/tools-content";
import { getAllNames, getOrigins, slugForName } from "@/lib/names-data";
import { originSlug } from "@/lib/names-content";
import { cohortSlug, upcomingCohorts } from "@/lib/due-content";

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
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // The father series. A separate loop rather than a shared one, because these
  // are keyed by slug — folding them into the month loop above would emit
  // /ar/father/1 and advertise a route that does not exist.
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/father`,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: alt((l) => `${SITE_URL}/${l}/father`) },
    });
  }

  for (const doc of publishedArticles()) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/father/${doc.slug}`,
        lastModified: new Date(doc.updated),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: alt((l) => `${SITE_URL}/${l}/father/${doc.slug}`),
        },
      });
    }
  }

  // The calculator tools. Same shape as the father-series loop above: keyed
  // by slug, so it gets its own hub + per-tool loop rather than folding into
  // the month numbers.
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/tools`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: alt((l) => `${SITE_URL}/${l}/tools`) },
    });
  }

  for (const tool of TOOLS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/tools/${tool.slug}`,
        lastModified: new Date(tool.updated),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: alt((l) => `${SITE_URL}/${l}/tools/${tool.slug}`),
        },
      });
    }
  }

  // Baby names hub — hub + /boys + /girls + one per origin + every name.
  // `updated` isn't tracked per-row in `baby_names` (unlike the guide's
  // `updated` field), so these get no `lastModified` rather than a fake one.
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/names`,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: alt((l) => `${SITE_URL}/${l}/names`) },
    });
    for (const seg of ["boys", "girls"]) {
      entries.push({
        url: `${SITE_URL}/${locale}/names/${seg}`,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: alt((l) => `${SITE_URL}/${l}/names/${seg}`) },
      });
    }
  }

  const [origins, names] = await Promise.all([getOrigins(), getAllNames()]);

  for (const origin of origins) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/names/origin/${originSlug(origin)}`,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: {
          languages: alt((l) => `${SITE_URL}/${l}/names/origin/${originSlug(origin)}`),
        },
      });
    }
  }

  for (const n of names) {
    const slug = slugForName(n);
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/names/${slug}`,
        changeFrequency: "yearly",
        priority: 0.5,
        alternates: { languages: alt((l) => `${SITE_URL}/${l}/names/${slug}`) },
      });
    }
  }

  // Birth-month cohort pages — a rolling 24-month forward window, so this
  // list (and the sitemap entry for it) simply moves forward on the next
  // build with no manual upkeep, same as `upcomingCohorts()` itself.
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/due`,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: alt((l) => `${SITE_URL}/${l}/due`) },
    });
  }

  for (const cohort of upcomingCohorts(24)) {
    const slug = cohortSlug(cohort);
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/due/${slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: alt((l) => `${SITE_URL}/${l}/due/${slug}`) },
      });
    }
  }

  return entries;
}
