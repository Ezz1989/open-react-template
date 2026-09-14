import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, type Locale } from "@/lib/constants";
import { getAllNames, getOrigins } from "@/lib/names-data";
import { originHubMeta, originSlug } from "@/lib/names-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";
import { NameGrid } from "@/components/names/NameGrid";

export const dynamicParams = false;

export async function generateStaticParams() {
  const origins = await getOrigins();
  return LOCALES.flatMap((lang) => origins.map((o) => ({ lang, origin: originSlug(o) })));
}

async function resolveOrigin(slug: string): Promise<string | undefined> {
  const origins = await getOrigins();
  return origins.find((o) => originSlug(o) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; origin: string }>;
}): Promise<Metadata> {
  const { lang, origin } = await params;
  const locale = lang as Locale;
  const realOrigin = await resolveOrigin(origin);
  if (!LOCALES.includes(locale) || !realOrigin) return {};

  const meta = originHubMeta(realOrigin);
  const path = (l: Locale) => `${SITE_URL}/${l}/names/origin/${origin}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: meta.metaTitle[locale],
    description: meta.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: meta.metaTitle[locale],
      description: meta.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function OriginNamesPage({
  params,
}: {
  params: Promise<{ lang: string; origin: string }>;
}) {
  const { lang, origin } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();
  const realOrigin = await resolveOrigin(origin);
  if (!realOrigin) notFound();

  const names = (await getAllNames()).filter((n) => n.origin === realOrigin);
  const meta = originHubMeta(realOrigin);

  return (
    <>
      <GuideHeader
        locale={locale}
        altPath={`/${locale === "en" ? "ar" : "en"}/names/origin/${origin}`}
        variant="neutral"
      />
      <main className="container g-hub">
        <h1 className="display-md">{meta.title[locale]}</h1>
        <p className="g-hub-stand">{meta.description[locale]}</p>
        <div style={{ marginTop: 40 }}>
          <NameGrid names={names} locale={locale} />
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
