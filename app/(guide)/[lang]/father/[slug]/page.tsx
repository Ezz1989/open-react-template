import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HREFLANG,
  LOCALES,
  SITE_URL,
  X_DEFAULT_LOCALE,
  fatherPlayUrl,
  type Locale,
} from "@/lib/constants";
import { BYLINE, MEDICAL_DISCLAIMER, type GuideImage } from "@/lib/guide-content";
import {
  FATHER_HUB,
  getArticle,
  publishedArticles,
} from "@/lib/father-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * One father article, server-rendered per locale.
 *
 * Deliberately a sibling of the month-article route rather than a shared
 * component. The two pages differ in four places that all sit inside the
 * render — the eyebrow, the red-flag heading, the breadcrumb and the mode
 * wrapper — and a shared component parameterised on all four would be harder
 * to read than two files that each say what they do. If a fifth difference
 * appears, revisit; three would have been the point to merge.
 *
 * Lives under the (guide) route group, not (site), because that group's
 * layout.tsx is what sets `lang` and `dir` per locale on the document. Putting
 * it in (site) would inherit the marketing layout, whose LangProvider assigns
 * `dir` in a useEffect — Arabic would render LTR for one frame.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    publishedArticles().map((a) => ({ lang, slug: a.slug })),
  );
}

function parse(params: { lang: string; slug: string }) {
  const locale = params.lang as Locale;
  if (!LOCALES.includes(locale)) return null;
  const doc = getArticle(params.slug);
  return doc ? { locale, doc } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const parsed = parse(await params);
  if (!parsed) return {};
  const { locale, doc } = parsed;

  const path = (l: Locale) => `${SITE_URL}/${l}/father/${doc.slug}`;

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

export default async function FatherArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const parsed = parse(await params);
  if (!parsed) notFound();
  const { locale, doc } = parsed;

  const url = `${SITE_URL}/${locale}/father/${doc.slug}`;
  const altPath = `/${locale === "en" ? "ar" : "en"}/father/${doc.slug}`;
  const cite = (id: string) => doc.citations.find((c) => c.id === id);

  const all = publishedArticles();
  const idx = all.findIndex((a) => a.slug === doc.slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  /** No FAQPage, for the same reason the month route gives: Google removed the
   *  FAQ rich result in 2026, so the markup would be dead weight. */
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
        publisher: { "@type": "Organization", name: "Nawah", url: SITE_URL },
        isPartOf: { "@id": `${SITE_URL}/${locale}/father#hub` },
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
            name: FATHER_HUB.title[locale],
            item: `${SITE_URL}/${locale}/father`,
          },
          { "@type": "ListItem", position: 2, name: doc.title[locale], item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* `data-mode="father"` flips the accent from rose to navy.
          globals.css declares it as a plain attribute selector that only sets
          CUSTOM PROPERTIES, and custom properties inherit — so putting the
          attribute on a wrapper works with no JavaScript at all. The marketing
          page reaches the same rule through mode-context writing the attribute
          on <html>; here it is simply part of the server-rendered markup,
          which is what a static article route wants. */}
      <div className="f-mode" data-mode="father">
        <GuideHeader locale={locale} altPath={altPath} />

        <main className="container g-wrap">
          <article>
            <p className="eyebrow">{FATHER_HUB.title[locale]}</p>
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

            {/* Optional on FatherArticle — a budget or a packing article has no
                emergency symptoms, and an empty red box would alarm a reader
                about nothing. Rendered before the CTA so nothing commercial
                sits between the reader and it. */}
            {doc.redFlags && (
              <section className="g-flags" aria-labelledby="redflags">
                {/* Per-article heading where one is set. The default suits the
                    obstetric articles; the paternal mental-health one needs to
                    say something else entirely, since its list is about the
                    reader himself. */}
                <h2 id="redflags">
                  {doc.redFlags.heading?.[locale] ??
                    (locale === "ar" ? "متى تتصلان فوراً" : "When to call straight away")}
                </h2>
                <p>{doc.redFlags.intro[locale]}</p>
                <ul>
                  {doc.redFlags.items.map((it, i) => (
                    <li key={i}>{it[locale]}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="g-cta">
              <h2>{doc.cta.headline[locale]}</h2>
              <p>{doc.cta.body[locale]}</p>
              <a
                className="btn btn-primary"
                href={fatherPlayUrl(locale, doc.slug)}
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

            <nav
              className="g-seq"
              aria-label={locale === "ar" ? "تصفّح الدليل" : "Guide navigation"}
            >
              {prev ? (
                <Link href={`/${locale}/father/${prev.slug}`} className="g-seq-prev">
                  <span>{locale === "ar" ? "السابق" : "Previous"}</span>
                  <strong>{prev.title[locale]}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/${locale}/father/${next.slug}`} className="g-seq-next">
                  <span>{locale === "ar" ? "التالي" : "Next"}</span>
                  <strong>{next.title[locale]}</strong>
                </Link>
              )}
            </nav>

            {/* Two links out, not one. The father hub is the series this page
                belongs to; the month guide is where a reader who arrived on a
                labour query often wants to go next, and it passes link equity
                to the pages that need it most. */}
            <p className="g-back">
              <Link href={`/${locale}/father`}>
                {locale === "ar" ? "← كل دليل الأب" : "← All of the father's guide"}
              </Link>
              <Link href={`/${locale}/guide`}>
                {locale === "ar" ? "دليل الأم شهراً بعد شهر" : "The mother's guide, month by month"}
              </Link>
            </p>
          </article>
        </main>

        <GuideFooter locale={locale} />
      </div>

      <style>{`
        /* globals.css carries [data-theme="dark"][data-mode="father"] as a
           COMPOUND selector, meaning both attributes must land on the same
           element. data-theme goes on <html> and our data-mode goes on this
           wrapper, so that rule can never match here and dark mode would give
           the article navy-on-near-black. Nothing in the codebase sets
           data-theme today — verified by grep — so this is a guard rather than
           a fix, and it keeps a future dark toggle from shipping an unreadable
           accent. Values are the ones globals.css already uses. */
        [data-theme="dark"] .f-mode {
          --chip-bg: rgba(58,72,107,0.25);
          --accent: #8AA0D0;
          --accent-strong: #B4C3E6;
        }

        .g-wrap { max-width: 760px; padding-block: 48px 0; }
        .g-h1 { margin: 10px 0 20px; }
        .g-stand { font-size: 20px; line-height: 1.6; color: var(--fg-muted); }
        .g-byline {
          margin: 24px 0 0; padding-block: 16px;
          border-block: 1px solid var(--border);
          font-size: 13px; color: var(--fg-muted);
        }
        .g-byline-role { display: block; margin-top: 6px; color: var(--fg-soft); }

        /* Same reset the month route needs, for the same reason: globals.css
           gives every <section> the marketing page's full-bleed band padding,
           which puts up to 160px of dead space above each heading. Scoped to
           the two classes rather than written as ".g-wrap section", which at
           specificity (0,1,1) would beat .g-flags and .g-cta and strip the
           padding those two depend on. */
        .g-section, .g-sources { padding: 0; }

        .g-figure { margin: 20px 0; }
        .g-figure img { width: 100%; height: auto; border-radius: var(--radius-md); }
        .g-figure figcaption { margin-top: 8px; font-size: 12px; color: var(--fg-soft); }
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

        .g-seq { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 40px; }
        .g-seq a {
          display: block; padding: 16px 18px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          transition: border-color 0.2s var(--ease);
        }
        .g-seq a:hover { border-color: var(--accent); }
        .g-seq span { display: block; font-size: 12px; color: var(--fg-soft); margin-bottom: 4px; }
        .g-seq strong { font-family: var(--font-display); font-size: 17px; font-weight: 400; }
        .g-seq-next { text-align: end; }

        .g-back { margin-top: 32px; font-size: 14px; display: flex; flex-wrap: wrap; gap: 8px 24px; }
        .g-back a { text-decoration: underline; }

        @media (max-width: 600px) {
          .g-seq { grid-template-columns: 1fr; }
          .g-seq-next { text-align: start; }
          .g-stand { font-size: 18px; }
          .g-section h2 { font-size: 25px; }
        }
      `}</style>
    </>
  );
}
