import type { Localized } from "./guide-content";

/**
 * Static Arabic/English copy wrapping the live `baby_names` table
 * (`lib/names-data.ts`). Kept separate from that file on purpose: one module
 * fetches data, this one holds the words around it — same split
 * `guide-content.ts` vs. the page components already use.
 */

export const ORIGIN_LABELS: Record<string, Localized> = {
  Arabic: { en: "Arabic", ar: "عربي" },
  Greek: { en: "Greek", ar: "يوناني" },
  Hebrew: { en: "Hebrew", ar: "عبري" },
  Quranic: { en: "Quranic", ar: "قرآني" },
  Coptic: { en: "Coptic", ar: "قبطي" },
  Persian: { en: "Persian", ar: "فارسي" },
  Aramaic: { en: "Aramaic", ar: "آرامي" },
  Turkish: { en: "Turkish", ar: "تركي" },
  Berber: { en: "Berber", ar: "أمازيغي" },
  Syriac: { en: "Syriac", ar: "سرياني" },
};

export const GENDER_LABELS: Record<"male" | "female", Localized> = {
  male: { en: "Boy", ar: "ولد" },
  female: { en: "Girl", ar: "بنت" },
};

/** `gcc_popularity` (60–99) is the app's own internal relative ranking, not
 *  a sourced population statistic — shown only as a "popular" cutoff badge,
 *  never as a percentage or count that would imply a measured figure. */
export const POPULAR_THRESHOLD = 90;

export function originSlug(origin: string): string {
  return origin.toLowerCase();
}

export const NAMES_HUB = {
  title: { en: "Baby names", ar: "أسماء المواليد" },
  metaTitle: { en: "Baby Names — Meanings & Origins | Nawah", ar: "أسماء مواليد ومعانيها | نواة" },
  description: {
    en: "Browse 250 boy and girl names with their Arabic meanings and origins — Arabic, Quranic, Coptic, Greek, Hebrew and more.",
    ar: "تصفّحي ٢٥٠ اسماً للأولاد والبنات مع معانيها وأصولها — عربية وقرآنية وقبطية ويونانية وعبرية وغيرها.",
  },
} as const;

export const NAMES_BOYS = {
  title: { en: "Boy names", ar: "أسماء أولاد" },
  metaTitle: { en: "Boy Names — Meanings & Origins | Nawah", ar: "أسماء أولاد ومعانيها | نواة" },
  description: {
    en: "125 boy names with their meanings and origins, from Arabic and Quranic names to Coptic and Greek.",
    ar: "١٢٥ اسم ولد مع معانيها وأصولها، من العربية والقرآنية إلى القبطية واليونانية.",
  },
} as const;

export const NAMES_GIRLS = {
  title: { en: "Girl names", ar: "أسماء بنات" },
  metaTitle: { en: "Girl Names — Meanings & Origins | Nawah", ar: "أسماء بنات ومعانيها | نواة" },
  description: {
    en: "125 girl names with their meanings and origins, from Arabic and Quranic names to Coptic and Greek.",
    ar: "١٢٥ اسم بنت مع معانيها وأصولها، من العربية والقرآنية إلى القبطية واليونانية.",
  },
} as const;

export function originHubMeta(origin: string): { title: Localized; metaTitle: Localized; description: Localized } {
  const label = ORIGIN_LABELS[origin] ?? { en: origin, ar: origin };
  return {
    title: { en: `${label.en} names`, ar: `أسماء ${label.ar}` },
    metaTitle: {
      en: `${label.en} Baby Names — Meanings | Nawah`,
      ar: `أسماء ${label.ar} للمواليد ومعانيها | نواة`,
    },
    description: {
      en: `Boy and girl names of ${label.en.toLowerCase()} origin, with their meanings.`,
      ar: `أسماء أولاد وبنات من أصل ${label.ar}، مع معانيها.`,
    },
  };
}
