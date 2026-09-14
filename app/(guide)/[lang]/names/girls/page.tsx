import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, type Locale } from "@/lib/constants";
import { getAllNames } from "@/lib/names-data";
import { NAMES_GIRLS } from "@/lib/names-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";
import { NameGrid } from "@/components/names/NameGrid";

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

  const path = (l: Locale) => `${SITE_URL}/${l}/names/girls`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: NAMES_GIRLS.metaTitle[locale],
    description: NAMES_GIRLS.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: NAMES_GIRLS.metaTitle[locale],
      description: NAMES_GIRLS.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function GirlNamesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const girls = (await getAllNames()).filter((n) => n.gender === "female");

  return (
    <>
      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/names/girls`} variant="neutral" />
      <main className="container g-hub">
        <h1 className="display-md">{NAMES_GIRLS.title[locale]}</h1>
        <p className="g-hub-stand">{NAMES_GIRLS.description[locale]}</p>
        <div style={{ marginTop: 40 }}>
          <NameGrid names={girls} locale={locale} />
        </div>
      </main>
      <GuideFooter locale={locale} />
      <style>{`
        .g-hub { max-width: 1000px; padding-block: 56px 0; }
        .g-hub-stand { margin-top: 16px; font-size: 19px; line-height: 1.65; color: var(--fg-muted); }
      `}</style>
    </>
  );
}
