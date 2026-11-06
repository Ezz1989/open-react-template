import { HomePage } from "@/components/home/HomePage";
import type { Chip, HomeArticle } from "@/components/home/Articles";
import { publishedArticles, type Article } from "@/lib/articles-content";
import { APP_STORE_URL, PLAY_STORE_URL, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

/**
 * The articles block, trimmed here on the server so the browser gets ~25 small rows
 * instead of the whole articles JSON. «الكل» = the five the owner saw on the approved
 * A2 board; each chip = the first five of its cluster.
 */
const ALL_PICKS = [
  "father_expansion/burping-baby-after-feeding",
  "food_safety/pineapple-during-pregnancy",
  "mother_expansion/flying-during-pregnancy-safe-weeks",
  "food_safety/dates-during-pregnancy",
  "father_expansion/how-to-swaddle-a-newborn",
];
const CHIP_CLUSTER: Record<Exclude<Chip, "all">, string> = {
  food: "food_safety",
  mother: "mother_expansion",
  father: "father_expansion",
  cost: "birth_cost",
};

function row(a: Article): HomeArticle {
  return {
    path: `articles/${a.cluster}/${a.slug}`,
    img: a.hero.src,
    width: a.hero.width,
    height: a.hero.height,
    cat: { ar: a.eyebrow.ar, en: a.eyebrow.en },
    title: { ar: a.title.ar, en: a.title.en },
  };
}

function homeArticles(): Record<Chip, HomeArticle[]> {
  const live = publishedArticles();
  const byKey = new Map(live.map((a) => [`${a.cluster}/${a.slug}`, a]));
  return {
    all: ALL_PICKS.flatMap((k) => (byKey.has(k) ? [row(byKey.get(k)!)] : [])),
    ...Object.fromEntries(
      Object.entries(CHIP_CLUSTER).map(([chip, cl]) => [chip, live.filter((a) => a.cluster === cl).slice(0, 5).map(row)]),
    ),
  } as Record<Chip, HomeArticle[]>;
}

/** Without this Google picked babynawah.vercel.app as the homepage's canonical
 *  (GSC URL inspection, 2026-10-05: "Duplicate without user-selected canonical").
 *  Page-level only — in the layout it would point privacy/support at the home page. */
export const metadata: Metadata = { alternates: { canonical: "/" } };

/**
 * Organization and WebSite entity markup.
 *
 * Separate from the per-article Article schema. This tells Google that a thing
 * called Nawah exists, what it publishes, and where else it appears. Without
 * it the guide articles are loose pages by an unknown publisher, which is a
 * weak position for health content where trust is weighted heavily.
 *
 * `sameAs` is the part that does the work: it links this domain to profiles
 * that already exist, so the Play listing and the TikTok account corroborate
 * the site rather than sitting unconnected to it.
 */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "Nawah",
      alternateName: "نواة",
      url: SITE_URL,
      logo: `${SITE_URL}/nawah-logo-dark.png`,
      description:
        "Arabic pregnancy companion app for mothers and fathers, built for the GCC and Egypt.",
      sameAs: [
        PLAY_STORE_URL,
        APP_STORE_URL,
        "https://www.tiktok.com/@nawah_app",
        "https://www.instagram.com/nawah_app/",
        "https://www.facebook.com/profile.php?id=61593761370296",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "Nawah",
      inLanguage: ["ar", "en"],
      publisher: { "@id": `${SITE_URL}#org` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomePage articles={homeArticles()} />
    </>
  );
}
