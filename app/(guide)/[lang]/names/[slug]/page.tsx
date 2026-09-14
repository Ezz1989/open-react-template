import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, toolsPlayUrl, type Locale } from "@/lib/constants";
import { getAllNames, getNameBySlug, slugForName, type BabyName } from "@/lib/names-data";
import { GENDER_LABELS, ORIGIN_LABELS, POPULAR_THRESHOLD, originSlug } from "@/lib/names-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * One name per page. Same reason every other guide route is server-rendered:
 * the Arabic name and meaning have to be in the HTML Google's crawler sees,
 * not assembled client-side from a fetch.
 */

export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await getAllNames();
  return LOCALES.flatMap((lang) => all.map((n) => ({ lang, slug: slugForName(n) })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) return {};
  const n = await getNameBySlug(slug);
  if (!n) return {};

  const displayName = locale === "ar" ? n.name_ar : n.name_en;
  const meaning = locale === "ar" ? n.meaning_ar : n.meaning_en;
  const title =
    locale === "ar"
      ? `معنى اسم ${displayName} — ${ORIGIN_LABELS[n.origin]?.ar ?? n.origin} | نواة`
      : `${displayName} — Meaning & Origin | Nawah`;
  const description =
    locale === "ar"
      ? `معنى اسم ${displayName}: ${meaning}. اسم ${GENDER_LABELS[n.gender].ar} من أصل ${ORIGIN_LABELS[n.origin]?.ar ?? n.origin}.`
      : `${displayName} means "${meaning}" — a ${GENDER_LABELS[n.gender].en.toLowerCase()}'s name of ${(ORIGIN_LABELS[n.origin]?.en ?? n.origin).toLowerCase()} origin.`;

  const path = (l: Locale) => `${SITE_URL}/${l}/names/${slug}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title,
    description,
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title,
      description,
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

/** A few names to browse next: same origin, opposite/same gender mixed in,
 *  excluding the current one — real internal linking rather than a dead end. */
function related(all: BabyName[], current: BabyName, count = 6): BabyName[] {
  return all.filter((n) => n.origin === current.origin && n.id !== current.id).slice(0, count);
}

export default async function NameDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();
  const [n, all] = await Promise.all([getNameBySlug(slug), getAllNames()]);
  if (!n) notFound();

  const url = `${SITE_URL}/${locale}/names/${slug}`;
  const originLabel = (ORIGIN_LABELS[n.origin] ?? { en: n.origin, ar: n.origin })[locale];
  const suggestions = related(all, n);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "ar" ? "أسماء المواليد" : "Baby names",
            item: `${SITE_URL}/${locale}/names`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: originLabel,
            item: `${SITE_URL}/${locale}/names/origin/${originSlug(n.origin)}`,
          },
          { "@type": "ListItem", position: 3, name: locale === "ar" ? n.name_ar : n.name_en, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/names/${slug}`} variant="neutral" />

      <main className="container t-wrap">
        <article>
          <p className="eyebrow">
            <Link href={`/${locale}/names/origin/${originSlug(n.origin)}`}>{originLabel}</Link>
            {" · "}
            {GENDER_LABELS[n.gender][locale]}
            {n.gcc_popularity >= POPULAR_THRESHOLD && (
              <>
                {" · "}
                {locale === "ar" ? "شائع في الخليج" : "Popular in the Gulf"}
              </>
            )}
          </p>
          <h1 className="display-md g-h1" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
            {locale === "ar" ? n.name_ar : n.name_en}
          </h1>
          {locale === "ar" && <p className="n-translit">{n.name_en}</p>}

          <div className="t-card" style={{ marginTop: 24 }}>
            <p className="t-result-label">{locale === "ar" ? "المعنى" : "Meaning"}</p>
            <p className="t-result-value" style={{ fontSize: 24 }}>
              {locale === "ar" ? n.meaning_ar : n.meaning_en}
            </p>
          </div>

          <section className="g-cta">
            <h2>{locale === "ar" ? "لسه بتختاري اسم؟" : "Still choosing a name?"}</h2>
            <p>
              {locale === "ar"
                ? "تطبيق نواة فيه أكتر من ٢٥٠ اسم تقدري تتصفحيهم وتحفظي المفضّل عندك."
                : "The Nawah app has 250+ names you can browse together and shortlist as a couple."}
            </p>
            <a className="btn btn-primary" href={toolsPlayUrl(locale, `name_${slug}`)} rel="noopener">
              {locale === "ar" ? "حمّلي التطبيق" : "Get the app"}
            </a>
          </section>

          {suggestions.length > 0 && (
            <section className="g-section">
              <h2>{locale === "ar" ? `أسماء ${originLabel} أخرى` : `More ${originLabel} names`}</h2>
              <ul className="n-related">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <Link href={`/${locale}/names/${slugForName(s)}`}>
                      {locale === "ar" ? s.name_ar : s.name_en}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="g-back">
            <Link href={`/${locale}/names`}>{locale === "ar" ? "→ كل الأسماء" : "← All names"}</Link>
          </p>
        </article>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .t-wrap { max-width: 640px; padding-block: 48px 0; }
        .g-h1 { margin: 10px 0 4px; }
        .n-translit { font-size: 15px; color: var(--fg-soft); margin-bottom: 20px; }
        .t-card {
          padding: 24px; background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .t-result-label { display: block; font-size: 12px; color: var(--fg-soft); text-transform: uppercase; letter-spacing: 0.05em; }
        .t-result-value { display: block; font-family: var(--font-display); margin-top: 4px; }
        .g-cta {
          margin-top: 32px; padding: 28px;
          background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .g-cta h2 { font-family: var(--font-display); font-size: 22px; font-weight: 400; margin-bottom: 10px; }
        .g-cta p { line-height: 1.7; margin-bottom: 18px; }
        .g-section { margin-top: 40px; }
        .g-section h2 { font-family: var(--font-display); font-size: 22px; font-weight: 400; margin-bottom: 14px; }
        .n-related { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
        .n-related a {
          display: inline-block; padding: 8px 16px; font-size: 14px;
          border: 1px solid var(--border); border-radius: 999px; color: var(--fg-muted);
        }
        .n-related a:hover { border-color: var(--accent); color: var(--fg); }
        .g-back { margin-top: 32px; font-size: 14px; }
        .g-back a { text-decoration: underline; }
      `}</style>
    </>
  );
}
