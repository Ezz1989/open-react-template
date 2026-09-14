import type { Metadata } from "next";
import Link from "next/link";
import {
  HREFLANG,
  LOCALES,
  SITE_URL,
  X_DEFAULT_LOCALE,
  type Locale,
} from "@/lib/constants";
import { TOOLS } from "@/lib/tools-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";
import { notFound } from "next/navigation";

/**
 * Tools hub — lists all six calculators. Mirrors `guide/page.tsx`'s pattern
 * (server-rendered, `dynamicParams = false`) so Arabic is in the HTML that
 * leaves the server, same as every other guide route.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const HUB = {
  title: { en: "Pregnancy tools", ar: "أدوات الحمل" },
  metaTitle: { en: "Pregnancy Calculators & Tools | Nawah", ar: "حاسبات وأدوات الحمل | نواة" },
  description: {
    en: "Due date, weeks-to-months, weight gain, ovulation, kick counter and contraction timer — six free pregnancy calculators.",
    ar: "موعد الولادة، تحويل الأسابيع للأشهر، زيادة الوزن، التبويض، عداد الركلات، ومؤقت الطلق — ست حاسبات مجانية للحمل.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) return {};

  const path = (l: Locale) => `${SITE_URL}/${l}/tools`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: HUB.metaTitle[locale],
    description: HUB.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: HUB.metaTitle[locale],
      description: HUB.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function ToolsHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();

  return (
    <>
      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/tools`} variant="neutral" />

      <main className="container g-hub">
        <h1 className="display-md">{HUB.title[locale]}</h1>
        <p className="g-hub-stand">{HUB.description[locale]}</p>

        <ol className="t-hub-grid">
          {TOOLS.map((tool) => (
            <li key={tool.slug}>
              <Link href={`/${locale}/tools/${tool.slug}`}>
                <span className="t-hub-title">{tool.title[locale]}</span>
                <span className="t-hub-desc">{tool.description[locale]}</span>
              </Link>
            </li>
          ))}
        </ol>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .g-hub { max-width: 900px; padding-block: 56px 0; }
        .g-hub-stand { margin-top: 16px; font-size: 19px; line-height: 1.65; color: var(--fg-muted); }
        .t-hub-grid {
          list-style: none; margin-top: 40px; padding: 0;
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
        }
        .t-hub-grid a {
          display: block; padding: 22px; height: 100%;
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--bg-elev); transition: border-color 0.2s var(--ease);
        }
        .t-hub-grid a:hover { border-color: var(--accent); }
        .t-hub-title {
          display: block; font-family: var(--font-display); font-size: 21px;
          margin-bottom: 8px;
        }
        .t-hub-desc { display: block; font-size: 14px; line-height: 1.6; color: var(--fg-muted); }

        @media (max-width: 600px) {
          .t-hub-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
