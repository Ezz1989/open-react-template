import type { Localized } from "./guide-content";
import generated from "./glossary-generated.json";

/**
 * قاموس الحمل — the glossary hub (built 2026-10-06, user's "yes").
 *
 * Entries come from one Gemini run (`content/prompts/glossary_entries.txt`),
 * checked and written to `glossary-generated.json` by
 * `scripts/glossary/ingest.mjs`. Every other article can link a term here
 * instead of re-explaining it — that is the hub's job (clusters.js).
 */
export interface GlossaryEntry {
  slug: string;
  term: Localized;
  aka: Localized;
  definition: Localized;
  when: Localized;
  body: Localized[];
  /** One internal path (`/guide/4`, `/father/labour-signs`…) or "". */
  link: string;
  citations: { org: string; title: string; url: string }[];
}

export const GLOSSARY: GlossaryEntry[] = (generated as GlossaryEntry[])
  .slice()
  .sort((a, b) => a.term.ar.localeCompare(b.term.ar, "ar"));

export function glossaryEntry(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((e) => e.slug === slug);
}

export const GLOSSARY_HUB = {
  title: { ar: "قاموس الحمل", en: "Pregnancy glossary" },
  metaTitle: { ar: "قاموس الحمل — معاني المصطلحات الطبية | نواة", en: "Pregnancy Glossary — Medical Terms Explained | Nawah" },
  description: {
    ar: "معاني المصطلحات الطبية التي تسمعينها في الحمل والولادة، بلغة بسيطة ومن مصادر طبية موثوقة.",
    en: "The medical terms you hear in pregnancy and birth, explained in plain language from trusted medical sources.",
  },
} as const;
