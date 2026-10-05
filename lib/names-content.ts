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
  title: { en: "Baby names guide", ar: "دليل الأسماء" },
  metaTitle: { en: "Baby Names — Meanings & Origins | Nawah", ar: "أسماء مواليد ومعانيها | نواة" },
  description: {
    en: "Browse boy and girl names with their meanings — and choose your favourite together in the Nawah app.",
    ar: "تصفّحي أسماء الأولاد والبنات مع معانيها، واختاري المفضّل منها مع شريكك في تطبيق نواة.",
  },
} as const;

/** Boys + girls page intro (user's copy, 2026-10-06; spelling normalised:
 *  فى→في, اصل→أصل, حمل→حمّل). Rendered as body text only — the meta
 *  description stays the short keyword one below, which is what Google shows. */
export const NAMES_INTRO = {
  ar: {
    lead: "قبل أن يخطو خطوته الأولى، وقبل أن ينطق كلمته الأولى، يكون اسمه هو رفيقه الأول. دليلك لاختيار اسمٍ يحمل من المعنى أعظمه، ومن الأثر أعمقه، نحن هنا لنلهمك في رحلة البحث عن أول وأغلى بصمة تتركها في حياة طفلك. كل اسم في القائمة موجود معناه، ولمعرفة أصل الاسم ",
    link: "حمّل تطبيق نواة",
    tail: ".",
  },
  en: {
    lead: "Before their first step, before their first word, their name is their first companion. Your guide to a name with the deepest meaning and the most lasting mark — we're here to inspire your search for the first, most precious imprint you'll leave on your child's life. Every name here comes with its meaning; to discover its origin, ",
    link: "get the Nawah app",
    tail: ".",
  },
} as const;

/** One per listing page, rotating (user's copy, 2026-10-06). The panel that
 *  carries it sits between the five names and the pager. */
export const NAME_QUOTES: Localized[] = [
  { ar: "اسمه اليوم.. هويته غداً.", en: "Their name today, their identity tomorrow." },
  { ar: "حيث تبدأ قصة طفلك.. بحرف.", en: "Where your child's story begins — with a letter." },
  { ar: "أول هدية، وأبقى أثر.", en: "The first gift, and the most lasting mark." },
  { ar: "بصمته الأولى في هذا العالم.", en: "Their first imprint on this world." },
  { ar: "دعوةٌ في اسم، وأمنيةٌ في نداء.", en: "A prayer in a name, a wish in every call." },
  { ar: "تاجٌ من الحروف، يرافقه مدى الحياة.", en: "A crown of letters, worn for life." },
  { ar: "رفيق دربه الأول.. وصوته للأبد.", en: "Their first companion — and their voice forever." },
  { ar: "صدى حبكم الأول، يتردد طوال العمر.", en: "The echo of your first love, heard for a lifetime." },
  { ar: "كلمةٌ واحدة.. تختصر كل أمنياتكم.", en: "One word that holds all your wishes." },
  { ar: "عنوان الروح، ورفيق العمر.", en: "The title of a soul, a companion for life." },
];

export const NAMES_BOYS = {
  title: { en: "Boy names", ar: "أسماء أولاد" },
  metaTitle: { en: "Boy Names — Meanings & Origins | Nawah", ar: "أسماء أولاد ومعانيها | نواة" },
  description: {
    en: "Boy names with their meanings — a guide to choosing your son's name.",
    ar: "أسماء أولاد مع معانيها — دليلك لاختيار اسم طفلك.",
  },
} as const;

export const NAMES_GIRLS = {
  title: { en: "Girl names", ar: "أسماء بنات" },
  metaTitle: { en: "Girl Names — Meanings & Origins | Nawah", ar: "أسماء بنات ومعانيها | نواة" },
  description: {
    en: "Girl names with their meanings — a guide to choosing your daughter's name.",
    ar: "أسماء بنات مع معانيها — دليلك لاختيار اسم طفلتك.",
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
