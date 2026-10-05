import { PLAY_STORE_URL, SITE_URL } from "@/lib/constants";
import { publishedMonths } from "@/lib/guide-content";
import { publishedArticles as fatherArticles } from "@/lib/father-content";
import { publishedArticles as topicArticles } from "@/lib/articles-content";
import { TOOLS } from "@/lib/tools-content";
import type { Localized } from "@/lib/guide-content";

/**
 * /llms.txt — a plain-markdown map of the site for AI answer engines
 * (llmstxt.org). Flagged missing by the GEO audit 2026-10-05. The audit tool
 * itself calls it "an organizational signal, not a proven ranking factor", so
 * it is generated from the same content arrays as the sitemap: zero upkeep,
 * and it can't drift from what is actually published.
 */
export const dynamic = "force-static";

const line = (path: string, title: Localized, description: Localized) =>
  `- [${title.en}](${SITE_URL}/en/${path}) · [${title.ar}](${SITE_URL}/ar/${path}): ${description.en}`;

export function GET() {
  const body = [
    "# Nawah (نواة)",
    "",
    "> Arabic pregnancy companion app for mothers and fathers in Egypt and the Gulf. The site publishes free pregnancy guides, father guides, calculators and a baby-names directory in Arabic (Modern Standard Arabic) and English. Medical claims link to the source they come from; no clinician writes or reviews the pages.",
    "",
    `App: ${PLAY_STORE_URL}`,
    "",
    "## Pregnancy month by month",
    ...publishedMonths().map((m) => line(`guide/${m.month}`, m.title, m.description)),
    "",
    "## Topic articles",
    ...topicArticles().map((a) => line(`articles/${a.cluster}/${a.slug}`, a.title, a.description)),
    "",
    "## For fathers",
    ...fatherArticles().map((a) => line(`father/${a.slug}`, a.title, a.description)),
    "",
    "## Calculators",
    ...TOOLS.map((t) => line(`tools/${t.slug}`, t.title, t.description)),
    `- [Every pregnancy week in months](${SITE_URL}/en/tools/weeks-months/1): one page per week, 1 to 42`,
    "",
    "## Baby names",
    `- [Baby names with meanings](${SITE_URL}/en/names) · [دليل الأسماء ومعانيها](${SITE_URL}/ar/names)`,
    "",
    "## Optional",
    `- [About Nawah](${SITE_URL}/en/about)`,
    `- [Privacy policy](${SITE_URL}/privacy)`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
