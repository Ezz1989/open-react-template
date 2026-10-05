import type { Locale } from "@/lib/constants";
import type { BabyName } from "@/lib/names-data";
import { slugForName } from "@/lib/names-data";
import { POPULAR_THRESHOLD } from "@/lib/names-content";
import { PagedNames, type NameItem } from "./PagedNames";

export { NamesCta } from "./NamesCta";

/** Reused by the main hub, /boys and /girls. Maps the
 *  rows to plain props on the server so the paging client component never
 *  imports `names-data` (and with it the Supabase client). */
export function NameGrid({ names, locale }: { names: BabyName[]; locale: Locale }) {
  const items: NameItem[] = names.map((n) => ({
    id: n.id,
    href: `/${locale}/names/${slugForName(n)}`,
    name: locale === "ar" ? n.name_ar : n.name_en,
    meaning: locale === "ar" ? n.meaning_ar : n.meaning_en,
    popular: n.gcc_popularity >= POPULAR_THRESHOLD,
  }));
  return <PagedNames items={items} locale={locale} where="list" />;
}
