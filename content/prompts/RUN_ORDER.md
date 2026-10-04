# Gemini run order — generated 2026-10-05

For each file: open it → copy everything → paste into Gemini → copy the JSON
Gemini returns → save it as a new `.json` file in `content/articles/`
(any name). Then tell Claude "articles ready" — Claude runs
`node scripts/articles/ingest.mjs`, checks every source, and publishes.

| # | File | Gemini mode | Save to |
|---|---|---|---|
| 1 | `article_birth_cost_تكلفة-الولادة-في-مصر.txt` | **Deep Research ON** | `content/articles/` |
| 2 | `article_birth_cost_تكلفة-الولادة-في-السعودية.txt` | **Deep Research ON** | `content/articles/` |
| 3 | `article_newborn_admin_تسجيل-المولود-في-مصر.txt` | **Deep Research ON** | `content/articles/` |
| 4 | `article_newborn_admin_تسجيل-المولود-في-السعودية.txt` | **Deep Research ON** | `content/articles/` |
| 5 | `article_aqiqah_العقيقة-والتحنيك.txt` | normal | `content/articles/` |
| 6 | `topics_food_safety.txt` | normal | `content/topics/food_safety.json` |
| 7 | `topics_mother_expansion.txt` | normal | `content/topics/mother_expansion.json` |
| 8 | `topics_father_expansion.txt` | normal | `content/topics/father_expansion.json` |

Rows 6–8 return a topic LIST, not an article. After saving, Claude runs
`make_gemini_prompt.js batch <cluster>` to turn each topic with real search
demand into its own article prompt.

**Skip:** `topics_glossary.txt` — the glossary needs a hub page type that isn't
built yet. `done/` holds the prompts of articles already live; ignore it.

Sourcing rule (user, 2026-10-05): only medical claims need a source, any real
source is fine, one main source per article. Already inside every prompt.
