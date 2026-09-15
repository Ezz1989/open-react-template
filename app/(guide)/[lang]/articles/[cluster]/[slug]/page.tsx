import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HREFLANG,
  LOCALES,
  SITE_URL,
  X_DEFAULT_LOCALE,
  articlesPlayUrl,
  type Locale,
} from "@/lib/constants";
import { BYLINE, MEDICAL_DISCLAIMER, type GuideImage } from "@/lib/guide-content";
import { ARTICLES, resolveArticle } from "@/lib/articles-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";
import { PanicNormalPanel } from "@/components/PanicNormalPanel";

/**
 * One P4 topic-cluster article, server-rendered per locale.
 *
 * Deliberately a near-copy of `father/[slug]/page.tsx` rather than a shared
 * component — same reasoning that file gives for not merging with the month
 * route: a handful of real differences (no father navy mode, no prev/next
 * series nav since these articles aren't ordered, `articlesPlayUrl` instead
 * of `fatherPlayUrl`) make a parameterised shared component harder to read
 * than two sibling files. Revisit if a fourth near-copy appears.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    ARTICLES.filter((a) => a.published).map((a) => ({
      lang,
      cluster: a.cluster,
      slug: a.slug,
    })),
  );
}

function parse(params: { lang: string; cluster: string; slug: string }) {
  const locale = params.lang as Locale;
  if (!LOCALES.includes(locale)) return null;
  const doc = resolveArticle(params.cluster, params.slug);
  return doc ? { locale, doc } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; cluster: string; slug: string }>;
}): Promise<Metadata> {
  const parsed = parse(await params);
  if (!parsed) return {};
  const { locale, doc } = parsed;

  const path = (l: Locale) => `${SITE_URL}/${l}/articles/${doc.cluster}/${doc.slug}`;

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

export default async function ClusterArticlePage({
  params,
}: {
  params: Promise<{ lang: string; cluster: string; slug: string }>;
}) {
  const parsed = parse(await params);
  if (!parsed) notFound();
  const { locale, doc } = parsed;

  const url = `${SITE_URL}/${locale}/articles/${doc.cluster}/${doc.slug}`;
  const altPath = `/${locale === "en" ? "ar" : "en"}/articles/${doc.cluster}/${doc.slug}`;
  const cite = (id: string) => doc.citations.find((c) => c.id === id);

  /** No FAQPage — Google removed the FAQ rich result in 2026, same as the
   *  month/father routes. */
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
          { "@type": "ListItem", position: 1, name: doc.eyebrow[locale], item: `${SITE_URL}/${locale}` },
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

      <GuideHeader locale={locale} altPath={altPath} />

      <main className="container g-wrap">
        <article>
          <p className="eyebrow">{doc.eyebrow[locale]}</p>
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

          <PanicNormalPanel sections={doc.sections} redFlags={doc.redFlags} locale={locale} />

          <section className="g-cta">
            <h2>{doc.cta.headline[locale]}</h2>
            <p>{doc.cta.body[locale]}</p>
            <a
              className="btn btn-primary"
              href={articlesPlayUrl(locale, doc.cluster, doc.slug)}
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

          <p className="g-back">
            <Link href={`/${locale}/guide`}>
              {locale === "ar" ? "→ دليل الأم شهراً بعد شهر" : "← The mother's guide, month by month"}
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

        .g-section, .g-sources { padding: 0; }

        .g-figure { margin: 20px 0; }
        .g-figure img { width: 100%; height: auto; border-radius: var(--radius-md); }
        .g-figure figcaption { margin-top: 8px; font-size: 12px; color: var(--fg-soft); }
        .g-figure figcaption a { text-decoration: underline; }

        .g-section { margin-top: 28px; }
        .g-section h2 { font-family: var(--font-display); font-size: 30px; font-weight: 400; margin-bottom: 14px; }
        .g-section p { margin-bottom: 16px; line-height: 1.75; }
        .g-list { margin: 0 0 16px; padding-inline-start: 20px; list-style: disc; }
        .g-list li { margin-bottom: 8px; line-height: 1.7; }

        .g-cites { font-size: 13px; color: var(--fg-soft); }
        .g-cites a { text-decoration: underline; }

        .g-faq { margin-bottom: 24px; }
        .g-faq h3 { font-size: 17px; font-weight: 500; margin-bottom: 6px; }

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
