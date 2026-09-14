import { cache } from "react";
import { getSupabase } from "./supabase";

/**
 * Baby names, read live from the same `baby_names` Supabase table the app
 * reads at runtime (`lib/features/shared/baby_names_screen.dart`) — not a
 * copy. New rows the app gets, this hub gets on the next build.
 *
 * Verified 2026-09-15: 250 rows (125 male / 125 female), RLS policy "anyone
 * can read baby names" (SELECT, public role) — the same anon key the site
 * already ships for `auth/reset-password` can read this table, no new
 * credential needed.
 */
export interface BabyName {
  id: string;
  name_ar: string;
  name_en: string;
  meaning_ar: string;
  meaning_en: string;
  origin: string;
  gender: "male" | "female";
  gcc_popularity: number;
}

/**
 * `cache()` memoizes this within one page's render pass — `generateMetadata`
 * and the page component both call it, and without memoizing that's two
 * network round trips per page for identical data. It does NOT dedupe across
 * the ~260 separately-generated static pages; each of those does its own
 * (cheap — 250 small rows) fetch, which is the accepted cost of static
 * generation over a live table.
 */
export const getAllNames = cache(async (): Promise<BabyName[]> => {
  const { data, error } = await getSupabase()
    .from("baby_names")
    .select("id, name_ar, name_en, meaning_ar, meaning_en, origin, gender, gcc_popularity")
    .order("name_en", { ascending: true });
  if (error) throw new Error(`baby_names fetch failed: ${error.message}`);
  return data ?? [];
});

export function slugForName(n: BabyName): string {
  return n.name_en.toLowerCase();
}

export async function getNameBySlug(slug: string): Promise<BabyName | undefined> {
  const all = await getAllNames();
  return all.find((n) => slugForName(n) === slug);
}

/** The 10 origins present in the table today, each spelled exactly as the
 *  `origin` column stores it — used both to build the per-origin hub routes
 *  and to slug them (lowercased, no other characters need escaping since
 *  every value here is a single ASCII word). */
export async function getOrigins(): Promise<string[]> {
  const all = await getAllNames();
  return Array.from(new Set(all.map((n) => n.origin))).sort();
}
