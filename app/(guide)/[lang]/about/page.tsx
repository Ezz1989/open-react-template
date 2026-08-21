import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  HREFLANG,
  LOCALES,
  SITE_URL,
  X_DEFAULT_LOCALE,
  playStoreUrl,
  type Locale,
} from "@/lib/constants";
import {
  ABOUT_CTA,
  ABOUT_FATHER,
  ABOUT_META,
  ABOUT_MOTTO,
  ABOUT_NAME,
  ABOUT_OPENING,
  ABOUT_PROMISES,
  ABOUT_STORY,
} from "@/lib/about-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * /ar/about and /en/about.
 *
 * Server-rendered per locale, like the guide and unlike the homepage. An About
 * page is one of the strongest trust signals a site carries, and Google's
 * helpful-content guidance asks explicitly for "background about the author or
 * the site that publishes it" when weighing YMYL content. That only counts if
 * the crawler can read it in the language the audience reads.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) return {};

  const path = (l: Locale) => `${SITE_URL}/${l}/about`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: ABOUT_META.metaTitle[locale],
    description: ABOUT_META.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: ABOUT_META.metaTitle[locale],
      description: ABOUT_META.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const url = `${SITE_URL}/${locale}/about`;

  /**
   * AboutPage schema, tied back to the Organization node the homepage
   * declares, so the two describe one entity rather than two.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#about`,
    url,
    name: ABOUT_META.metaTitle[locale],
    description: ABOUT_META.description[locale],
    inLanguage: HREFLANG[locale],
    mainEntity: { "@id": `${SITE_URL}#org` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/about`} />

      <main className="container a-wrap">
        <p className="eyebrow">{ABOUT_META.kicker[locale]}</p>
        {/* The brand renders in the reader's script. A Latin "Nawah" as the h1
            of an Arabic page is the exact "translated from English" impression
            this page argues against. */}
        <h1 className="display-md a-h1">{locale === "ar" ? "نواة" : "Nawah"}</h1>
        <p className="a-sub">{ABOUT_META.title[locale]}</p>

        {ABOUT_OPENING.map((b, i) => (
          <section key={`o${i}`} className="a-block">
            {b.paragraphs.map((p, j) => (
              <p key={j}>{p[locale]}</p>
            ))}
          </section>
        ))}

        {/* The bridge from her experience into the founding story. Kept as its
            own element because it is the hinge of the whole page. */}
        <p className="a-pull">
          {locale === "ar"
            ? "وزوجكِ يقف بجانبكِ، ولا يعرف ماذا يفعل. يسألكِ: «كيف حالكِ؟» فتجيبين: «بخير». وينتهي الحديث."
            : "And your husband stands beside you with no idea what to do. He asks “how are you feeling?” You say “fine.” The conversation ends."}
        </p>

        {ABOUT_STORY.map((b, i) => (
          <section key={`s${i}`} className={`a-block ${b.emphasis ? "a-emph" : ""}`}>
            {b.heading && <h2>{b.heading[locale]}</h2>}
            {b.paragraphs.map((p, j) => (
              <p key={j}>{p[locale]}</p>
            ))}
          </section>
        ))}

        <section className="a-block a-father">
          <h2>{ABOUT_FATHER.heading[locale]}</h2>
          {ABOUT_FATHER.intro.map((p, i) => (
            <p key={i}>{p[locale]}</p>
          ))}
          <dl className="a-points">
            {ABOUT_FATHER.points.map((pt, i) => (
              <div key={i}>
                <dt>{pt.title[locale]}</dt>
                <dd>{pt.body[locale]}</dd>
              </div>
            ))}
          </dl>
          <p className="a-close">{ABOUT_FATHER.close[locale]}</p>
        </section>

        <section className="a-block">
          <h2>{ABOUT_PROMISES.heading[locale]}</h2>
          <dl className="a-points">
            {ABOUT_PROMISES.items.map((pt, i) => (
              <div key={i}>
                <dt>{pt.title[locale]}</dt>
                <dd>{pt.body[locale]}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="a-block">
          <h2>{ABOUT_NAME.heading![locale]}</h2>
          {ABOUT_NAME.paragraphs.map((p, i) => (
            <p key={i}>{p[locale]}</p>
          ))}
        </section>

        <p className="a-motto">{ABOUT_MOTTO[locale]}</p>

        <section className="a-cta">
          <p>{ABOUT_CTA.body[locale]}</p>
          <a
            className="btn btn-primary"
            href={playStoreUrl({
              source: "nawahapp.net",
              medium: "organic_page",
              campaign: "about",
              content: `${locale}_about`,
            })}
            rel="noopener"
          >
            {ABOUT_CTA.button[locale]}
          </a>
        </section>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        /* globals.css sets "section { padding: clamp(40px, 6vw, 80px) 0 }" for
           the homepage's full-bleed bands. Reset for the same reason the guide
           does, scoped to these classes so nothing with its own padding is
           caught by a more specific selector. */
        .a-block, .a-cta { padding: 0; }

        .a-wrap { max-width: 720px; padding-block: 48px 0; }
        .a-h1 { margin: 10px 0 6px; }
        .a-sub { font-size: 20px; color: var(--fg-muted); margin-bottom: 8px; }

        .a-block { margin-top: 34px; }
        .a-block h2 {
          font-family: var(--font-display); font-size: 28px; font-weight: 400;
          margin-bottom: 14px;
        }
        .a-block p { line-height: 1.8; margin-bottom: 14px; font-size: 17px; }

        /* The two thesis lines. Larger, in the display face, no heading. */
        .a-emph p {
          font-family: var(--font-display); font-size: 27px; line-height: 1.35;
          color: var(--accent-strong); margin: 6px 0;
        }

        .a-pull {
          margin-top: 28px; padding-inline-start: 18px;
          border-inline-start: 2px solid var(--accent);
          font-size: 18px; line-height: 1.8; color: var(--fg-muted);
        }

        .a-father {
          margin-top: 48px; padding: 28px;
          background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }

        .a-points { margin-top: 20px; }
        .a-points > div { margin-bottom: 18px; }
        .a-points dt { font-weight: 500; margin-bottom: 4px; }
        .a-points dd { margin: 0; line-height: 1.75; color: var(--fg-muted); }

        .a-close {
          margin-top: 22px; font-family: var(--font-display);
          font-size: 22px; line-height: 1.4; color: var(--accent-strong);
        }

        .a-motto {
          margin-top: 48px; text-align: center;
          font-family: var(--font-display); font-size: 30px;
          color: var(--accent-strong);
        }

        .a-cta {
          margin-top: 40px; text-align: center;
          padding-top: 32px; border-top: 1px solid var(--border);
        }
        .a-cta p { color: var(--fg-muted); margin-bottom: 18px; }

        @media (max-width: 600px) {
          .a-block h2 { font-size: 24px; }
          .a-emph p { font-size: 22px; }
          .a-father { padding: 20px; }
          .a-motto { font-size: 25px; }
        }
      `}</style>
    </>
  );
}
