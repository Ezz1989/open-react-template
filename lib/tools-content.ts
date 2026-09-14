import type { Citation, Localized } from "./guide-content";

/**
 * THE TOOLS — six calculators, the site's biggest content gap.
 *
 * Every Arabic pregnancy competitor (WebTeb, SuperMama, البيبي) ships
 * calculators; this site shipped none. See the traffic plan
 * (docs/gsc/ once exported) for the payoff ranking.
 *
 * Same discipline as `guide-content.ts`: content is data, `Localized` has no
 * fallback, every health claim carries a `Citation` that was actually fetched
 * (see each tool's `citations` below — every URL was opened this session,
 * 2026-09-15). `Localized`/`Citation` are imported from there rather than
 * redefined, since they're identical shapes.
 */

export interface ToolDef {
  slug: string;
  /** Emoji-free, short — shown in the hub grid. */
  title: Localized;
  metaTitle: Localized;
  description: Localized;
  /** One-paragraph intro shown above the calculator widget. */
  intro: Localized;
  citations?: Citation[];
  /** ISO date, fed to the WebApplication schema's dateModified. */
  updated: string;
}

export const TOOLS: ToolDef[] = [
  {
    slug: "due-date",
    title: { en: "Due date calculator", ar: "حاسبة موعد الولادة" },
    metaTitle: {
      en: "Due Date Calculator (Gregorian & Hijri) | Nawah",
      ar: "حاسبة موعد الولادة بالميلادي والهجري | نواة",
    },
    description: {
      en: "Enter the first day of your last period to get your due date and current pregnancy week, shown in both the Gregorian and Hijri calendars.",
      ar: "أدخلي أول يوم من آخر دورة شهرية لمعرفة موعد ولادتك وأسبوع حملك الحالي، بالتقويمين الميلادي والهجري معاً.",
    },
    intro: {
      en: "Doctors count pregnancy from the first day of your last period, not from conception. The standard estimate adds 280 days (40 weeks) to that date — the same rule the Nawah app uses to set your due date.",
      ar: "يحسب الأطباء الحمل من أول يوم في آخر دورة شهرية، لا من يوم حدوث الحمل. القاعدة المعتمدة تضيف ٢٨٠ يوماً (٤٠ أسبوعاً) على هذا التاريخ — وهي نفس القاعدة التي يعتمدها تطبيق نواة لتحديد موعد ولادتك.",
    },
    updated: "2026-09-15",
  },
  {
    slug: "weeks-months",
    title: { en: "Weeks ↔ months converter", ar: "تحويل الأسابيع والشهور" },
    metaTitle: {
      en: "Pregnancy Weeks to Months Converter | Nawah",
      ar: "تحويل أسابيع الحمل إلى أشهر | نواة",
    },
    description: {
      en: "Your doctor talks in weeks, your family talks in months. Convert instantly between the two.",
      ar: "طبيبك يتحدث بالأسابيع، وعائلتك تتحدث بالأشهر. حوّلي بينهما فوراً.",
    },
    intro: {
      en: "Pregnancy months are not four weeks each — nine months of ~4.4 weeks add up to 40 weeks, not 36. This tool uses the same nine-month bands as our monthly guide, so the month it gives you matches the article you'll read next.",
      ar: "شهور الحمل ليست أربعة أسابيع بالضبط لكل شهر — تسعة أشهر بمعدل ٤.٤ أسبوع تقريباً تجمع ٤٠ أسبوعاً وليس ٣٦. تعتمد هذه الأداة نفس تقسيم الأشهر التسعة المستخدم في دليلنا الشهري، فالشهر الذي تحصلين عليه يطابق المقال الذي ستقرئينه بعده.",
    },
    updated: "2026-09-15",
  },
  {
    slug: "weight-gain",
    title: { en: "Pregnancy weight gain", ar: "حاسبة زيادة الوزن في الحمل" },
    metaTitle: {
      en: "Pregnancy Weight Gain Calculator (by BMI) | Nawah",
      ar: "حاسبة زيادة الوزن في الحمل حسب كتلة الجسم | نواة",
    },
    description: {
      en: "See the healthy weight-gain range for your pre-pregnancy BMI, based on CDC/IOM guidance.",
      ar: "تعرّفي على المدى الصحي لزيادة الوزن حسب مؤشر كتلة جسمك قبل الحمل، استناداً إلى إرشادات مراكز السيطرة على الأمراض الأمريكية (CDC).",
    },
    intro: {
      en: "How much weight is \"healthy\" to gain depends on your weight before pregnancy, not a single number for everyone. These ranges come from the CDC, based on the Institute of Medicine's 2009 guidelines.",
      ar: "مقدار الزيادة \"الصحي\" في الوزن يعتمد على وزنك قبل الحمل، لا على رقم واحد يناسب الجميع. هذه المعدلات صادرة عن مراكز السيطرة على الأمراض الأمريكية (CDC)، استناداً إلى إرشادات معهد الطب الأمريكي لعام ٢٠٠٩.",
    },
    citations: [
      {
        id: "cdc-weight-gain",
        org: "CDC",
        title: {
          en: "Weight Gain During Pregnancy",
          ar: "زيادة الوزن أثناء الحمل",
        },
        url: "https://www.cdc.gov/maternal-infant-health/pregnancy-weight/index.html",
        retrieved: "2026-09-15",
      },
    ],
    updated: "2026-09-15",
  },
  {
    slug: "ovulation",
    title: { en: "Ovulation calculator", ar: "حاسبة التبويض" },
    metaTitle: {
      en: "Ovulation Calculator | Nawah",
      ar: "حاسبة أيام التبويض | نواة",
    },
    description: {
      en: "Estimate your fertile window from your last period and average cycle length.",
      ar: "احسبي نافذة الخصوبة تقديرياً من تاريخ آخر دورة ومتوسط طول الدورة.",
    },
    intro: {
      en: "This is an estimate, not a measurement — actual ovulation can shift cycle to cycle. It works backward from your next expected period using the average 14-day luteal phase (the time between ovulation and your next period, which varies less than the first half of the cycle).",
      ar: "هذه أداة تقديرية وليست قياساً دقيقاً — فموعد التبويض الفعلي قد يختلف من دورة لأخرى. تعمل الأداة بالحساب العكسي من موعد دورتك القادمة المتوقع، مستخدمة متوسط ١٤ يوماً لمرحلة الجسم الأصفر (الفترة بين التبويض والدورة التالية، وهي أقل تبايناً من النصف الأول من الدورة).",
    },
    citations: [
      {
        id: "omnicalculator-luteal",
        org: "Omni Calculator",
        title: { en: "Luteal Phase Calculator", ar: "حاسبة مرحلة الجسم الأصفر" },
        url: "https://www.omnicalculator.com/health/luteal-phase",
        retrieved: "2026-09-15",
      },
    ],
    updated: "2026-09-15",
  },
  {
    slug: "kick-counter",
    title: { en: "Kick counter", ar: "عداد ركلات الجنين" },
    metaTitle: {
      en: "Fetal Kick Counter | Nawah",
      ar: "عداد ركلات الجنين | نواة",
    },
    description: {
      en: "Tap for every kick, flutter or roll you feel. See how long it takes to reach 10.",
      ar: "اضغطي مع كل ركلة أو حركة تشعرين بها. اعرفي كم استغرق الوصول لعشر حركات.",
    },
    intro: {
      en: "ACOG's guidance: feeling 10 movements — kicks, flutters, swishes or rolls — within about two hours is typical. This counter times you from your first tap and tells you when you've reached 10.",
      ar: "توصية الكلية الأمريكية لأطباء النساء والتوليد (ACOG): الشعور بعشر حركات — ركلات أو رفرفة أو التفافات — خلال حوالي ساعتين أمر طبيعي. يبدأ هذا العداد التوقيت من أول ضغطة ويخبرك عند وصولك للحركة العاشرة.",
    },
    citations: [
      {
        id: "clevelandclinic-kicks",
        org: "Cleveland Clinic",
        title: { en: "Kick Counts (Fetal Movement Counting)", ar: "عدّ حركات الجنين" },
        url: "https://my.clevelandclinic.org/health/articles/23497-kick-counts",
        retrieved: "2026-09-15",
      },
    ],
    updated: "2026-09-15",
  },
  {
    slug: "contraction-timer",
    title: { en: "Contraction timer", ar: "مؤقت الطلق" },
    metaTitle: {
      en: "Contraction Timer (5-1-1 Rule) | Nawah",
      ar: "مؤقت الطلق (قاعدة ٥-١-١) | نواة",
    },
    description: {
      en: "Time each contraction's length and the gap between them. Get flagged when they match the 5-1-1 pattern.",
      ar: "احسبي مدة كل تقلّص والفاصل بينهما. تنبيه فوري عند مطابقة نمط ٥-١-١.",
    },
    intro: {
      en: "The common rule of thumb for active labour is \"5-1-1\": contractions 5 minutes apart, lasting 1 minute each, for at least 1 hour straight. This timer tracks both numbers for you and tells you when you've hit that pattern — always confirm with your doctor or midwife rather than relying on this alone.",
      ar: "القاعدة الشائعة للطلق الفعلي هي \"٥-١-١\": تقلّصات كل ٥ دقائق، تستمر دقيقة واحدة، لمدة ساعة كاملة على الأقل. يتابع هذا المؤقت الرقمين تلقائياً وينبهك عند مطابقة النمط — تأكدي دائماً مع طبيبتك أو القابلة بدل الاعتماد على هذه الأداة وحدها.",
    },
    citations: [
      {
        id: "texashealth-511",
        org: "Texas Health",
        title: { en: "Stages of Labor and Childbirth", ar: "مراحل المخاض والولادة" },
        url: "https://www.texashealth.org/baby-care/Pregnancy/stages-of-labor-and-childbirth",
        retrieved: "2026-09-15",
      },
    ],
    updated: "2026-09-15",
  },
];

export function getTool(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
