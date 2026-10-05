# Gemini run order — regenerated 2026-10-06

Same steps for every file: open it → copy everything → paste into Gemini (normal mode) →
download the JSON into Downloads → tell Claude "articles ready". Claude ingests, checks, publishes.
If Gemini's reply gets cut off, ask it for the rest in "Part 1 / Part 2" code blocks.

**22 article prompts + 1 glossary prompt.** Do them in any order.

## Glossary — 15 terms in ONE prompt

`glossary_entries.txt` → save the JSON to Downloads → tell Claude "glossary ready"
(Claude puts it in `content/glossary/` and runs `node scripts/glossary/ingest.mjs`).

## Food safety (medical — 1 real source each)

| # | File |
|---|---|
| 1 | `article_food_safety_الأناناس-آمن-للحامل؟.txt` |
| 2 | `article_food_safety_التمر-آمن-للحامل؟.txt` |
| 3 | `article_food_safety_التونة-آمنة-للحامل؟.txt` |
| 4 | `article_food_safety_الرنجة-آمنة-للحامل؟.txt` |
| 5 | `article_food_safety_الفسيخ-آمن-للحامل؟.txt` |
| 6 | `article_food_safety_القرفة-آمنة-للحامل؟.txt` |
| 7 | `article_food_safety_الكبدة-آمنة-للحامل؟.txt` |
| 8 | `article_food_safety_المايونيز-آمن-للحامل؟.txt` |

## Mother's guide

| # | File |
|---|---|
| 9 | `article_mother_expansion_أسباب-تورم-القدمين-للحامل-وطرق-طبيعية-لت.txt` |
| 10 | `article_mother_expansion_أسباب-حموضة-المعدة-للحامل-وطرق-تخفيفها-ب.txt` |
| 11 | `article_mother_expansion_أفضل-وضعيات-نوم-الحامل-لتجنب-الضغط-على-ا.txt` |
| 12 | `article_mother_expansion_أنواع-إفرازات-الحمل-الطبيعية-ومتى-يجب-اس.txt` |
| 13 | `article_mother_expansion_أهمية-حمض-الفوليك-للحامل-والجرعة-الموصى-.txt` |
| 14 | `article_mother_expansion_شروط-استخدام-صبغة-الشعر-للحامل-بأمان.txt` |
| 15 | `article_mother_expansion_شروط-السفر-بالطائرة-للحامل-والأسابيع-الآ.txt` |
| 16 | `article_mother_expansion_طرق-علاج-الإمساك-للحامل-بأمان-والوقاية-م.txt` |

## Father's guide

| # | File |
|---|---|
| 17 | `article_father_expansion_الطريقة-الصحيحة-لضمان-تجشؤ-الرضيع-بعد-ال.txt` |
| 18 | `article_father_expansion_تقنيات-المساج-الآمنة-من-أجل-تخفيف-ألم-ظه.txt` |
| 19 | `article_father_expansion_خطوات-تقميط-الرضيع-الصحيحة-لضمان-نوم-هاد.txt` |
| 20 | `article_father_expansion_دليلك-العملي-لخطوات-تنظيف-سرة-الرضيع-حتى.txt` |
| 21 | `article_father_expansion_دليلك-لإعداد-وجبات-الحامل-الصحية-والتعام.txt` |
| 22 | `article_father_expansion_دورك-في-متابعة-جدول-تطعيمات-الرضيع-وتخفي.txt` |

`done/` = prompts already used. `topics_glossary.txt` is done too (its output = `content/topics/glossary.json`).
