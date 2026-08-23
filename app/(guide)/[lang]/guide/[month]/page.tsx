import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HREFLANG,
  LOCALES,
  SITE_URL,
  X_DEFAULT_LOCALE,
  guidePlayUrl,
  type Locale,
} from "@/lib/constants";
import {
  BYLINE,
  MEDICAL_DISCLAIMER,
  MONTH_LABEL,
  getMonth,
  publishedMonths,
  type GuideImage,
  type GuideMonth,
} from "@/lib/guide-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * One month-article, server-rendered per locale.
 *
 * Every published month is generated for every locale at build time. Nothing
 * on this page runs on the client, which is the whole point: the Arabic text
 * has to be in the HTML that leaves the server for Google's language
 * algorithms to see it at all.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    publishedMonths().map((m) => ({ lang, month: String(m.month) })),
  );
}

function parse(params: { lang: string; month: string }) {
  const locale = params.lang as Locale;
  const n = Number(params.month);
  if (!LOCALES.includes(locale) || !Number.isInteger(n)) return null;
  const doc = getMonth(n);
  return doc ? { locale, doc } : null;
}

/** Arabic-Indic digits for Arabic, Latin for English. A raw `${n}` renders
 *  Latin digits inside Arabic text and looks imported. */
function num(n: number, locale: Locale): string {
  return n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
}

function weekRange(doc: GuideMonth, locale: Locale): string {
  const [a, b] = doc.weeks;
  return locale === "ar"
    ? `الأسابيع ${num(a, locale)}–${num(b, locale)}`
    : `Weeks ${a}–${b}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; month: string }>;
}): Promise<Metadata> {
  const parsed = parse(await params);
  if (!parsed) return {};
  const { locale, doc } = parsed;

  const path = (l: Locale) => `${SITE_URL}/${l}/guide/${doc.month}`;

  /**
   * hreflang, built to Google's three stated requirements: every version lists
   * itself as well as all the others, the pages point at each other, and
   * x-default names a fallback. "If two pages don't both point to each other,
   * the tags will be ignored."
   */
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: doc.metaTitle[locale],
    description: doc.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "article",
      title: doc.metaTitle[locale],
      description: doc.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{ url: doc.hero.src, width: 1200, height: 800 }],
      publishedTime: doc.updated,
      modifiedTime: doc.updated,
    },
  };
}

/**
 * Photo plus its credit line.
 *
 * `priority` is set on the hero and nowhere else. next/image lazy-loads by
 * default, which is right for the in-body photos and wrong for the hero: it is
 * the Largest Contentful Paint element, so lazy-loading it delays the metric
 * Google actually measures. Below-fold figures stay lazy on purpose.
 */
function Figure({
  image,
  locale,
  priority = false,
}: {
  image: GuideImage;
  locale: Locale;
  priority?: boolean;
}) {
  const ratio = image.height / image.width;
  return (
    <figure className="g-figure">
      <Image
        src={image.src}
        alt={image.alt[locale]}
        width={1200}
        height={Math.round(1200 * ratio)}
        sizes="(max-width: 760px) 100vw, 760px"
        priority={priority}
      />
      <figcaption>
        {locale === "ar" ? "تصوير " : "Photo by "}
        <a href={image.photographerUrl} rel="nofollow noopener" target="_blank">
          {image.photographer}
        </a>
        {" · "}
        <a href={image.pexelsUrl} rel="nofollow noopener" target="_blank">
          Pexels
        </a>
      </figcaption>
    </figure>
  );
}

export default async function GuideMonthPage({
  params,
}: {
  params: Promise<{ lang: string; month: string }>;
}) {
  const parsed = parse(await params);
  if (!parsed) notFound();
  const { locale, doc } = parsed;

  const url = `${SITE_URL}/${locale}/guide/${doc.month}`;
  const altPath = `/${locale === "en" ? "ar" : "en"}/guide/${doc.month}`;
  const cite = (id: string) => doc.citations.find((c) => c.id === id);

  // Neighbours among PUBLISHED months only, so an unwritten month never
  // produces a link to a route that does not exist.
  const all = publishedMonths();
  const idx = all.findIndex((m) => m.month === doc.month);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  /**
   * Structured data: Article and BreadcrumbList only.
   *
   * ⚠️ No FAQPage. Google deprecated the FAQ rich result on 8 May 2026 and
   * removed the documentation on 15 June 2026: "The FAQ rich result feature is
   * no longer shown in Google Search results." The questions stay because
   * readers and answer engines use them; the markup would be dead weight.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: doc.title[locale],
        description: doc.description[locale],
        image: `${SITE_URL}${doc.hero.src}`,
        inLanguage: HREFLANG[locale],
        datePublished: doc.updated,
        dateModified: doc.updated,
        author: { "@type": "Organization", name: BYLINE.name[locale] },
        publisher: {
          "@type": "Organization",
          name: "Nawah",
          url: SITE_URL,
        },
        isPartOf: { "@id": `${SITE_URL}/${locale}/guide#hub` },
        citation: doc.citations.map((c) => ({
          "@type": "CreativeWork",
          name: c.title[locale],
          url: c.url,
          producer: { "@type": "Organization", name: c.org },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "ar" ? "دليل الأم" : "Mother's guide",
            item: `${SITE_URL}/${locale}/guide`,
          },
          { "@type": "ListItem", position: 2, name: doc.title[locale], item: url },
        ],
      },
    ],
  };

  return (
    <>
      {/* All of jsonLd comes from build-time constants in guide-content.ts, so
          there is no untrusted input here. `<` is still escaped because a
          literal "</script>" anywhere in the data would otherwise close the
          tag and turn the rest of the JSON into markup. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <GuideHeader locale={locale} altPath={altPath} />

      <main className="container g-wrap">
        <article>
          <p className="eyebrow">
            {MONTH_LABEL[doc.month][locale]} · {weekRange(doc, locale)}
          </p>
          <h1 className="display-md g-h1">{doc.title[locale]}</h1>
          <p className="g-stand">{doc.standfirst[locale]}</p>

          <p className="g-byline">
            {BYLINE.name[locale]}
            {" · "}
            <time dateTime={doc.updated}>
              {new Date(doc.updated).toLocaleDateString(
                locale === "ar" ? "ar-EG" : "en-GB",
                { year: "numeric", month: "long", day: "numeric" },
              )}
            </time>
            <span className="g-byline-role">{BYLINE.role[locale]}</span>
          </p>

          <Figure image={doc.hero} locale={locale} priority />

          {doc.sections.map((s, i) => (
            <section key={i} className="g-section">
              <h2>{s.heading[locale]}</h2>
              {s.body.map((p, j) => (
                <p key={j}>{p[locale]}</p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="g-list">
                  {s.bullets.map((b, j) => (
                    <li key={j}>{b[locale]}</li>
                  ))}
                </ul>
              )}
              {s.afterBullets?.map((p, j) => (
                <p key={`a${j}`}>{p[locale]}</p>
              ))}
              {s.cites && s.cites.length > 0 && (
                <p className="g-cites">
                  {locale === "ar" ? "المصدر: " : "Source: "}
                  {s.cites.map((id, k) => {
                    const c = cite(id);
                    if (!c) return null;
                    return (
                      <span key={id}>
                        {k > 0 && " · "}
                        <a href={c.url} rel="noopener" target="_blank">
                          {c.org}
                        </a>
                      </span>
                    );
                  })}
                </p>
              )}
              {s.image && <Figure image={s.image} locale={locale} />}
            </section>
          ))}

          {/* Highest-stakes block on the page. Rendered before the CTA on
              purpose: nothing commercial should sit between a reader and this. */}
          <section className="g-flags" aria-labelledby="redflags">
            <h2 id="redflags">
              {locale === "ar" ? "متى تتصلين بالطبيب فوراً" : "When to call a doctor now"}
            </h2>
            <p>{doc.redFlags.intro[locale]}</p>
            <ul>
              {doc.redFlags.items.map((it, i) => (
                <li key={i}>{it[locale]}</li>
              ))}
            </ul>
          </section>

          <section className="g-cta">
            <h2>{doc.cta.headline[locale]}</h2>
            <p>{doc.cta.body[locale]}</p>
            <a
              className="btn btn-primary"
              href={guidePlayUrl(locale, doc.month)}
              rel="noopener"
            >
              {doc.cta.button[locale]}
            </a>
          </section>

          <section className="g-section">
            <h2>{locale === "ar" ? "أسئلة شائعة" : "Common questions"}</h2>
            {doc.faqs.map((f, i) => (
              <div key={i} className="g-faq">
                <h3>{f.q[locale]}</h3>
                <p>{f.a[locale]}</p>
              </div>
            ))}
          </section>

          <section className="g-sources">
            <h2>{locale === "ar" ? "المصادر" : "Sources"}</h2>
            <ol>
              {doc.citations.map((c) => (
                <li key={c.id}>
                  <a href={c.url} rel="noopener" target="_blank">
                    {c.title[locale]}
                  </a>
                  <span className="g-src-org">
                    {c.org}
                    {locale === "ar" ? " · اطُّلع عليه في " : " · retrieved "}
                    {c.retrieved}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <p className="g-disclaimer">{MEDICAL_DISCLAIMER[locale]}</p>

          {/* Prev/next across published months. Real internal linking: it
              gives a crawler a path between the articles instead of leaving
              each one reachable only from the hub, and it is how a reader
              actually moves through a month-by-month series. */}
          <nav className="g-seq" aria-label={locale === "ar" ? "تصفّح الأشهر" : "Month navigation"}>
            {prev ? (
              <Link href={`/${locale}/guide/${prev.month}`} className="g-seq-prev">
                <span>{locale === "ar" ? "السابق" : "Previous"}</span>
                <strong>{prev.title[locale]}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/${locale}/guide/${next.month}`} className="g-seq-next">
                <span>{locale === "ar" ? "التالي" : "Next"}</span>
                <strong>{next.title[locale]}</strong>
              </Link>
            )}
          </nav>

          <p className="g-back">
            <Link href={`/${locale}/guide`}>
              {locale === "ar" ? "→ كل أشهر الدليل" : "← All months"}
            </Link>
          </p>
        </article>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .g-wrap { max-width: 760px; padding-block: 48px 0; }
        .g-h1 { margin: 10px 0 20px; }
        .g-stand { font-size: 20px; line-height: 1.6; color: var(--fg-muted); }
        .g-byline {
          margin: 24px 0 0; padding-block: 16px;
          border-block: 1px solid var(--border);
          font-size: 13px; color: var(--fg-muted);
        }
        .g-byline-role { display: block; margin-top: 6px; color: var(--fg-soft); }

        /* globals.css carries "section { padding: clamp(80px, 12vw, 160px) 0 }"
           for the marketing page's full-bleed bands. Every <section> in this
           article inherited it, which put 160px of dead space above every
           heading on desktop and 80px on mobile. .g-flags and .g-cta happened
           to escape because they set their own padding; .g-section and
           .g-sources did not.

           Reset here rather than in globals.css, which the homepage still
           needs. Scoped to these two classes and NOT written as
           ".g-wrap section": that selector is specificity (0,1,1) and would
           beat .g-flags and .g-cta at (0,1,0), stripping the padding those
           two depend on. */
        .g-section, .g-sources { padding: 0; }

        .g-figure { margin: 20px 0; }
        .g-figure img {
          width: 100%; height: auto; border-radius: var(--radius-md);
        }
        .g-figure figcaption {
          margin-top: 8px; font-size: 12px; color: var(--fg-soft);
        }
        .g-figure figcaption a { text-decoration: underline; }

        .g-section { margin-top: 28px; }
        .g-section h2 { font-family: var(--font-display); font-size: 30px; font-weight: 400; margin-bottom: 14px; }
        .g-section p { margin-bottom: 16px; line-height: 1.75; }
        /* list-style restated because Tailwind preflight zeroes it. */
        .g-list { margin: 0 0 16px; padding-inline-start: 20px; list-style: disc; }
        .g-list li { margin-bottom: 8px; line-height: 1.7; }

        .g-cites { font-size: 13px; color: var(--fg-soft); }
        .g-cites a { text-decoration: underline; }

        .g-faq { margin-bottom: 24px; }
        .g-faq h3 { font-size: 17px; font-weight: 500; margin-bottom: 6px; }

        .g-flags {
          margin-top: 48px; padding: 24px;
          border: 1px solid var(--accent); border-radius: var(--radius-md);
        }
        .g-flags h2 { font-size: 20px; font-weight: 500; margin-bottom: 10px; color: var(--accent-strong); }
        /* Tailwind's preflight sets "ol, ul { list-style: none }", which
           silently strips the markers off both lists on this page. The
           red-flag list is scanned, not read, so the bullets earn their place. */
        .g-flags ul { margin: 12px 0 0; padding-inline-start: 20px; list-style: disc; }
        .g-flags li { margin-bottom: 8px; line-height: 1.6; }

        .g-cta {
          margin-top: 48px; padding: 28px;
          background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .g-cta h2 { font-family: var(--font-display); font-size: 26px; font-weight: 400; margin-bottom: 10px; }
        .g-cta p { line-height: 1.7; margin-bottom: 18px; }

        .g-sources { margin-top: 48px; }
        .g-sources h2 { font-size: 20px; font-weight: 500; margin-bottom: 12px; }
        .g-sources ol { padding-inline-start: 20px; list-style: decimal; }
        .g-sources li { margin-bottom: 14px; font-size: 14px; line-height: 1.6; }
        .g-sources a { text-decoration: underline; }
        .g-src-org { display: block; color: var(--fg-soft); font-size: 12px; }

        .g-disclaimer {
          margin-top: 32px; padding: 18px;
          background: var(--bg-elev); border-radius: var(--radius-sm);
          font-size: 13px; line-height: 1.7; color: var(--fg-muted);
        }
        .g-seq {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
          margin-top: 40px;
        }
        .g-seq a {
          display: block; padding: 16px 18px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          transition: border-color 0.2s var(--ease);
        }
        .g-seq a:hover { border-color: var(--accent); }
        .g-seq span { display: block; font-size: 12px; color: var(--fg-soft); margin-bottom: 4px; }
        .g-seq strong { font-family: var(--font-display); font-size: 17px; font-weight: 400; }
        .g-seq-next { text-align: end; }

        @media (max-width: 600px) {
          .g-seq { grid-template-columns: 1fr; }
          .g-seq-next { text-align: start; }
        }

        .g-back { margin-top: 32px; font-size: 14px; }
        .g-back a { text-decoration: underline; }

        @media (max-width: 600px) {
          .g-stand { font-size: 18px; }
          .g-section h2 { font-size: 25px; }
        }
      `}</style>
    </>
  );
}
