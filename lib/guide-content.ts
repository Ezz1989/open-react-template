import type { Locale } from "./constants";

/**
 * THE PREGNANCY GUIDE — nine month-articles, the site's organic traffic layer.
 *
 * WHY NINE AND NOT FORTY
 * ----------------------
 * The Flutter app does not hold forty distinct texts. It holds nine bands. See
 * `../../lib/features/shared/weekly_content_screen.dart`, where
 * `_motherSymptoms` and `_fatherAction` both branch on
 * `<=8 / <=12 / <=16 / <=20 / <=24 / <=28 / <=32 / <=36 / term`. Weeks 21 and
 * 24 already return the same string. Forty pages built from nine sources would
 * be four near-duplicates per band, which is the pattern Google's
 * helpful-content guidance demotes. Month is also the unit Arabic speakers use
 * for pregnancy, while weeks are what the clinic uses.
 *
 * LANGUAGE
 * --------
 * Modern Standard Arabic only. The app ships four Arabic locales
 * (`app_ar`, `app_ar_EG`, `app_ar_SA`, `app_ar_AE`) and the dialect belongs
 * there, close to the user. An article written in Egyptian would read as
 * foreign to a Saudi reader and vice versa, so the guide stays in MSA and lets
 * the app do the dialect work.
 *
 * HOW THIS FILE IS STRUCTURED
 * ---------------------------
 * Content is data, never JSX. Components render it. This mirrors the rule in
 * `../CLAUDE.md`: user-facing copy lives in a content module, never hardcoded
 * in a component.
 *
 * Every string is `Localized`, an en/ar pair with no fallback. A missing
 * Arabic string is a type error rather than a silent English leak, which
 * matters here more than anywhere else on the site: the entire purpose of
 * these routes is that Arabic is server-rendered at its own URL.
 */

export type Localized = Record<Locale, string>;

/**
 * A source the article leans on.
 *
 * Pregnancy is a YMYL topic. Google's creating-helpful-content guidance asks
 * whether content "present[s] information in a way that makes you want to
 * trust it, such as clear sourcing", and gives "even more weight" to E-E-A-T
 * for topics that "could significantly impact the health ... of people".
 *
 * RULE: every URL here was opened and read before it was written down.
 * `retrieved` records the day that happened. A plausible-looking acog.org path
 * that nobody fetched is a fabrication, and on a health page that is the worst
 * kind of mistake available.
 */
export interface Citation {
  id: string;
  /** Publishing body, shown to the reader. Org names are not translated. */
  org: string;
  title: Localized;
  url: string;
  /** ISO date the URL was verified to resolve and to say what we claim. */
  retrieved: string;
}

/**
 * A Pexels photo plus the credit for it.
 *
 * Pexels does not require attribution (pexels.com/license, read 2026-08-21)
 * but we carry it anyway: on a health page, showing where things came from is
 * the same instinct that produces the citation list.
 *
 * The license prohibition that shapes layout: "Don't imply endorsement of your
 * product by people or brands on the imagery." Photos therefore appear in
 * editorial positions only. None goes inside the CTA, where a face would read
 * as a testimonial.
 *
 * Sourced by `../scripts/fetch-guide-images.mjs`; credits.json in
 * public/guide/ is that script's output and the source of these fields.
 */
export interface GuideImage {
  src: string;
  /** Describes the picture for a reader who cannot see it. Not keyword filler. */
  alt: Localized;
  photographer: string;
  photographerUrl: string;
  pexelsUrl: string;
  width: number;
  height: number;
}

export interface Section {
  /**
   * Headings are NOUN PHRASES carrying the search term, not sentences.
   *
   * Both Arabic market leaders do this and it is the single clearest pattern
   * in them. WebTeb: "الحمل في الشهر الأول", "اسابيع الحمل في الشهر الأول".
   * SuperMama: "أعراض الحمل في الشهر الأول", "شكل الجنين في الشهر الأول من
   * الحمل". Every heading repeats the month phrase, because that is what
   * people type.
   *
   * The first draft of this file used literary sentences instead
   * ("لماذا يبدأ العدّ قبل حدوث الحمل"). Better prose, worse article: it
   * matches no query and gives a scanning reader nothing to lock onto.
   */
  heading: Localized;
  /** One entry per paragraph, so the renderer owns spacing and never has to
   *  parse markdown or trust raw HTML. */
  body: Localized[];
  /**
   * Scannable facts. Both competitors lean on lists heavily; WebTeb is roughly
   * 60% bullets. Symptoms in particular get read as a checklist, never as
   * prose, so any list of them belongs here rather than in `body`.
   */
  bullets?: Localized[];
  /** Paragraphs that must land after the list rather than before it, e.g. the
   *  reassurance that follows a symptom checklist. */
  afterBullets?: Localized[];
  cites?: string[];
  image?: GuideImage;
}

/**
 * Symptoms that mean "call someone now".
 *
 * Its own required field rather than an ordinary section: it is the
 * highest-stakes content on the page, it must render identically every month,
 * and it must be impossible to forget when a new month is added. Requiring it
 * in the type is the enforcement.
 */
export interface RedFlags {
  intro: Localized;
  items: Localized[];
  cites?: string[];
}

export interface Faq {
  q: Localized;
  a: Localized;
  cites?: string[];
}

/**
 * The in-article call to action.
 *
 * It has to name something the app genuinely does for a reader at this point
 * in the pregnancy. A generic "download our app" block is the mistake
 * `../../docs/AD_PLAN_150USD.md` §7 names outright: "People install because
 * the content was useful, not because you asked them to."
 */
export interface GuideCta {
  headline: Localized;
  body: Localized;
  button: Localized;
}

export interface GuideMonth {
  month: number;
  /** Inclusive gestational-week span. */
  weeks: [number, number];
  trimester: 1 | 2 | 3;
  hero: GuideImage;
  /**
   * Only published months get a route, a sitemap entry, or a link from the
   * hub. An unwritten month must 404 rather than render an empty page.
   */
  published: boolean;

  /** <h1>, written for a person. */
  title: Localized;
  /** <title>, which may lead with the query phrasing instead. */
  metaTitle: Localized;
  /** <meta name="description">, 120-160 characters. */
  description: Localized;
  /** Opening paragraph, set larger. One promise, no throat-clearing. */
  standfirst: Localized;

  sections: Section[];
  redFlags: RedFlags;
  faqs: Faq[];
  cta: GuideCta;
  citations: Citation[];

  /** ISO date. Rendered as "last reviewed" and fed to Article schema. */
  updated: string;
}

/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Who wrote this.
 *
 * Google "strongly encourage[s] adding accurate authorship information, such
 * as bylines to content where readers might expect it", and a pregnancy
 * article is exactly where a reader expects it.
 *
 * ⚠️ There is no clinician on this project, and nothing here may imply there
 * is. The byline credits the team and points at the sources. Adding
 * "Reviewed by Dr. X" would be a fabricated credential on health content and
 * is not a shortcut worth taking at any traffic volume.
 *
 * The line saying so explicitly was dropped from both languages by owner
 * decision on 2026-08-21. The remaining defences are the sources list, which
 * shows exactly what the article is built on, and MEDICAL_DISCLAIMER, which
 * states plainly that this is not medical advice. Neither may be removed.
 */
export const BYLINE: { name: Localized; role: Localized } = {
  name: { en: "The Nawah team", ar: "فريق نواة" },
  role: {
    en: "Written from the published guidance cited at the end of each article.",
    ar: "مكتوب استناداً إلى الإرشادات المنشورة المذكورة في نهاية كل مقال.",
  },
};

/** Shown under every article. Not collapsible, not fine print. */
export const MEDICAL_DISCLAIMER: Localized = {
  en: "This guide is general information, not medical advice. It does not replace a doctor, and it knows nothing about your particular pregnancy. If something feels wrong, contact your doctor instead of waiting for the next scheduled visit.",
  ar: "هذا الدليل معلومات عامة وليس استشارة طبية. لا يغني عن الطبيب، ولا يعرف شيئاً عن حالة حملكِ تحديداً. إذا شعرتِ أن هناك ما ليس على ما يُرام، تواصلي مع طبيبكِ بدل انتظار الموعد التالي.",
};

export const GUIDE_HUB: {
  title: Localized;
  metaTitle: Localized;
  description: Localized;
  standfirst: Localized;
} = {
  /**
   * ⚠️ The H1 carries the nav's new name AND the query phrase, on purpose.
   *
   * The nav was renamed to "Mother's guide" on 2026-08-22 so it reads as a
   * sibling of the father's guide. Renaming this H1 to match exactly would
   * have dropped "pregnancy" / "الحمل" from the one page whose entire job is
   * to rank for it — nobody searches "mother's guide". Keeping both words
   * satisfies the nav consistency and the search term.
   *
   * `metaTitle` is deliberately NOT renamed. It leads with the query phrasing
   * because that is what appears in the search result, and it is the single
   * highest-value string in the month series.
   */
  title: {
    en: "The mother's guide: pregnancy month by month",
    ar: "دليل الأم: الحمل شهراً بعد شهر",
  },
  metaTitle: {
    en: "Pregnancy Month by Month: The Nine-Month Guide | Nawah",
    ar: "الحمل شهراً بعد شهر: دليل الأشهر التسعة | نواة",
  },
  description: {
    en: "Nine months, nine guides. What changes, what counts as normal, and when to call a doctor. In Arabic and English.",
    ar: "تسعة أشهر وتسعة أدلة. ما الذي يتغيّر، وما الذي يُعدّ طبيعياً، ومتى يجب الاتصال بالطبيب. بالعربية والإنجليزية.",
  },
  standfirst: {
    en: "Doctors count pregnancy in weeks. Everyone else counts it in months. These nine guides follow the months and say which weeks each one covers.",
    ar: "الأطباء يحسبون الحمل بالأسابيع، وبقية الناس يحسبونه بالأشهر. هذه الأدلة التسعة تتبع الأشهر، وتوضّح الأسابيع التي يشملها كل شهر.",
  },
};

/* ────────────────────────────────────────────────────────────────────────── */

const heroImage: GuideImage = {
  src: "/guide/month-1-hero.jpg",
  alt: {
    en: "A pregnancy test, a pacifier and white tulips arranged on a pink surface.",
    ar: "اختبار حمل ولهّاية وزهور توليب بيضاء مرتبة على سطح وردي.",
  },
  photographer: "Nataliya Vaitkevich",
  photographerUrl: "https://www.pexels.com/@n-voitkevich",
  pexelsUrl: "https://www.pexels.com/photo/white-and-pink-tulips-on-pink-surface-5982453/",
  width: 6240,
  height: 4160,
};

/**
 * Month 1 — the pilot article.
 *
 * It carries the one fact about early pregnancy that reliably confuses people
 * and that the app quietly depends on: gestational age is counted from the
 * last menstrual period, so the first two weeks precede conception. That makes
 * it the honest place to start the series, and it sets up a CTA that is
 * actually true, because computing the week from an LMP is literally what
 * `weekly_content_screen.dart` does on launch.
 */
const month1: GuideMonth = {
  month: 1,
  weeks: [1, 4],
  trimester: 1,
  hero: heroImage,
  published: true,

  title: {
    en: "Month 1 of pregnancy: weeks 1 to 4",
    ar: "الشهر الأول من الحمل: الأسابيع ١ إلى ٤",
  },
  metaTitle: {
    en: "Month 1 of Pregnancy (Weeks 1-4): Symptoms, Folic Acid, First Steps | Nawah",
    ar: "الشهر الأول من الحمل (الأسبوع ١–٤): الأعراض وحمض الفوليك وأول الخطوات | نواة",
  },
  description: {
    en: "Weeks 1 to 4, when the count starts before conception. What the numbers mean, why folic acid cannot wait, and the symptoms that need a doctor now.",
    ar: "الأسابيع ١ إلى ٤، حين يبدأ العدّ قبل حدوث الحمل. ماذا تعني الأرقام، ولماذا لا يحتمل حمض الفوليك التأجيل، والأعراض التي تستدعي الطبيب فوراً.",
  },
  standfirst: {
    en: "You have just found out, and the first thing that confuses everyone is the numbers. The first month of pregnancy contains two weeks in which nobody is pregnant. That is not a trick of language, and once you see why, most of what comes later makes sense.",
    ar: "عرفتِ للتوّ، وأول ما يربك الجميع هو الأرقام. الشهر الأول من الحمل يشمل أسبوعين لا يوجد فيهما حمل أصلاً. ليست لعبة لفظية، وحين تفهمين السبب يتضح معظم ما يأتي بعده.",
  },

  sections: [
    {
      heading: {
        en: "How the weeks are counted in month 1",
        ar: "حساب أسابيع الحمل في الشهر الأول",
      },
      body: [
        {
          en: "Gestational age is measured in weeks from the first day of the last menstrual period, not from the day of conception. Conception cannot be dated reliably, because it is invisible and its timing varies. The first day of a period is a date you can usually name.",
          ar: "يُحسب عمر حملكِ بالأسابيع من اليوم الأول لآخر دورة شهرية، لا من يوم حدوث الحمل. سبب ذلك بسيط: يوم الإخصاب لا يمكن تحديده بدقة، أما اليوم الأول لدورتكِ فتاريخ تعرفينه.",
        },
        {
          en: "One consequence follows immediately. In weeks 1 and 2 your body is preparing to release an egg, and no pregnancy exists yet. Ovulation falls near the end of the second week, so fertilisation happens around week 2 or 3 of a count that began a fortnight earlier.",
          ar: "ويترتب على ذلك أمر مهم. في الأسبوعين الأول والثاني يكون جسمكِ يستعد لإطلاق البويضة، ولا يوجد حمل بعد. تحدث الإباضة قرب نهاية الأسبوع الثاني، فيقع الإخصاب في حدود الأسبوع الثاني أو الثالث من عدٍّ بدأ قبله بأسبوعين.",
        },
        {
          en: "This is why you may be told you are four or five weeks pregnant on the very day you find out. The pregnancy did not start four weeks ago. The counting did.",
          ar: "لهذا قد يقول لكِ الطبيب إنكِ في الأسبوع الرابع أو الخامس في اليوم نفسه الذي عرفتِ فيه. حملكِ لم يبدأ قبل أربعة أسابيع، بل العدّ هو الذي بدأ.",
        },
      ],
      cites: ["medlineplus-gestational-age"],
    },
    {
      heading: {
        en: "Symptoms in month 1 of pregnancy",
        ar: "أعراض الحمل في الشهر الأول",
      },
      body: [
        {
          en: "After fertilisation the cell cluster travels toward the uterus and embeds itself in the lining, usually during the fourth week. Some women notice light spotting. Many notice nothing.",
          ar: "بعد الإخصاب تتّجه الكتلة الخلوية نحو الرحم وتنغرس في بطانته، وذلك عادةً خلال الأسبوع الرابع. بعض النساء يلاحظن نزفاً خفيفاً، وكثيرات لا يلاحظن شيئاً.",
        },
        {
          en: "Most symptoms this month are either absent or easy to mistake for an approaching period. The ones you are most likely to notice:",
          ar: "معظم أعراض هذا الشهر إما غائبة أو يسهل الخلط بينها وبين اقتراب الدورة. وأكثر ما قد تلاحظينه:",
        },
      ],
      bullets: [
        { en: "A missed period, usually the first real sign", ar: "تأخّر الدورة، وهي أول علامة حقيقية عادةً" },
        { en: "Tiredness that sleep does not fix", ar: "إرهاق لا ينفع معه النوم" },
        { en: "Tender or heavier breasts", ar: "ألم في الثديين أو ثِقَل فيهما" },
        { en: "Needing to urinate more often", ar: "الحاجة إلى التبوّل بصورة متكررة" },
        { en: "Bloating, gas, or constipation", ar: "انتفاخ أو غازات أو إمساك" },
        { en: "A shifting appetite, or a sharper sense of smell", ar: "تغيّر الشهية، أو حِدّة في حاسة الشم" },
        { en: "Light spotting around week 4", ar: "نزف خفيف في حدود الأسبوع الرابع" },
      ],
      afterBullets: [
        {
          en: "Feeling none of these is common and does not mean anything is wrong. Symptom intensity is not a measure of how a pregnancy is going.",
          ar: "ألّا تشعري بأيٍّ منها أمر شائع، ولا يعني أن هناك خطأ. شدّة الأعراض ليست مقياساً لسير الحمل.",
        },
        {
          en: "A home test looks for a hormone your body only starts producing after implantation, so testing too early can read negative in a pregnancy that is genuinely there. A missed period is the usual signal to test.",
          ar: "اختبار الحمل المنزلي يبحث عن هرمون لا يفرزه جسمكِ إلا بعد الانغراس، لذا قد يعطي الاختبار المبكر نتيجة سلبية رغم وجود حمل. تأخّر الدورة هو الوقت المناسب للاختبار.",
        },
      ],
      image: {
        src: "/guide/month-1-quiet.jpg",
        alt: {
          en: "A teacup on a saucer resting on linen in morning light.",
          ar: "فنجان شاي على صحن موضوع على قماش كتّان في ضوء الصباح.",
        },
        photographer: "İdil Ceren Çelikler",
        photographerUrl: "https://www.pexels.com/@idilcelikler",
        pexelsUrl: "https://www.pexels.com/photo/vintage-tea-cup-with-shadows-on-linen-33489604/",
        width: 6000,
        height: 4000,
      },
    },
    {
      heading: {
        en: "Folic acid in month 1 of pregnancy",
        ar: "حمض الفوليك في الشهر الأول من الحمل",
      },
      body: [
        {
          en: "The World Health Organization recommends 400 micrograms of folic acid daily, from the moment you begin trying to conceive until 12 weeks of gestation. Women who have previously had a fetus with a neural tube defect are offered a much higher dose of 5 milligrams daily.",
          ar: "توصي منظمة الصحة العالمية بتناول ٤٠٠ ميكروغرام من حمض الفوليك يومياً، منذ لحظة بدء محاولة الحمل وحتى الأسبوع الثاني عشر. أما من سبق أن كان لديها جنين مصاب بعيب في الأنبوب العصبي، فتُعطى جرعة أعلى بكثير تبلغ ٥ ملّيغرامات يومياً.",
        },
        {
          en: "The timing is the whole point. The structures folic acid protects form in the earliest weeks, often before you know you are pregnant. That is why the recommendation starts before conception, not at the first appointment.",
          ar: "التوقيت هنا هو كل شيء. فالتراكيب التي يحميها حمض الفوليك تتكوّن في الأسابيع الأولى، وغالباً قبل أن تعرفي أنكِ حامل. لهذا تبدأ التوصية قبل الحمل، لا عند أول موعد مع الطبيب.",
        },
        {
          en: "If you are reading this after a positive test, you have not missed your chance. The recommendation runs through week 12, and starting late is better than not starting.",
          ar: "وإن كنتِ تقرأين هذا بعد نتيجة إيجابية، فأنتِ لم تفوّتي الفرصة. التوصية تمتدّ حتى الأسبوع الثاني عشر، والبدء متأخرة أفضل من عدم البدء.",
        },
      ],
      cites: ["who-folic-acid"],
      image: {
        src: "/guide/month-1-folate.jpg",
        alt: {
          en: "Assorted capsules and tablets on a white marble surface.",
          ar: "كبسولات وأقراص متنوعة على سطح رخامي أبيض.",
        },
        photographer: "Nataliya Vaitkevich",
        photographerUrl: "https://www.pexels.com/@n-voitkevich",
        pexelsUrl: "https://www.pexels.com/photo/a-variety-of-capsules-7615410/",
        width: 6240,
        height: 4160,
      },
    },
    {
      heading: {
        en: "The first doctor's appointment",
        ar: "موعد الطبيب الأول ومتابعة الحمل",
      },
      body: [
        {
          en: "ACOG advises starting prenatal care in the first trimester, ideally before 10 weeks. Booking usually takes longer than you expect, so arrange it on the day of a positive test rather than the week after.",
          ar: "توصي الكلية الأمريكية لأطباء النساء والولادة ببدء متابعة الحمل في الثلث الأول، ويُفضَّل قبل الأسبوع العاشر. الحجز عادةً يستغرق وقتاً أطول ممّا تتوقعين، لذا رتّبي الموعد يوم ظهور النتيجة الإيجابية، لا في الأسبوع الذي يليه.",
        },
        {
          en: "The number of visits has changed recently. ACOG's 2025 clinical consensus moved away from the fixed twelve-to-fourteen visit schedule toward a plan tailored to you, citing equivalent outcomes with six to ten visits in average-risk pregnancies. If your doctor suggests fewer appointments than your mother had, that is current practice, not neglect.",
          ar: "عدد الزيارات تغيّر مؤخراً. فقد ابتعد التوافق السريري للكلية الأمريكية لعام ٢٠٢٥ عن جدول الاثنتي عشرة إلى الأربع عشرة زيارة الثابت، نحو خطة مُفصَّلة على حالتكِ، استناداً إلى تكافؤ النتائج مع ست إلى عشر زيارات في الحمل متوسط الخطورة. فإن اقترح طبيبكِ مواعيد أقلّ ممّا كان لدى والدتكِ، فهذا هو المعمول به اليوم، وليس إهمالاً.",
        },
      ],
      cites: ["acog-prenatal-care", "acog-tailored-2025"],
    },
  ],

  redFlags: {
    intro: {
      en: "Contact a doctor or go to a hospital if any of the following happens. Some of these can occur before a pregnancy has been confirmed, so a negative or untaken test is not a reason to wait.",
      ar: "تواصلي مع طبيب أو توجّهي إلى المستشفى إذا حدث أيٌّ ممّا يلي. بعض هذه الأعراض قد يظهر قبل تأكيد الحمل، لذا فإن نتيجة سلبية أو اختباراً لم يُجرَ بعد ليسا سبباً للانتظار.",
    },
    items: [
      {
        en: "Sharp pain on one side of the lower abdomen",
        ar: "ألم حادّ في جهة واحدة من أسفل البطن",
      },
      {
        en: "Heavy vaginal bleeding, or bleeding with severe pain",
        ar: "نزيف مهبلي غزير، أو نزيف مصحوب بألم شديد",
      },
      {
        en: "Pain in the shoulder tip alongside abdominal pain",
        ar: "ألم في أعلى الكتف مصاحب لألم في البطن",
      },
      {
        en: "Fainting, or dizziness that does not pass on sitting down",
        ar: "إغماء، أو دوخة لا تزول عند الجلوس",
      },
      {
        en: "Fever, or pain and burning while urinating",
        ar: "ارتفاع في الحرارة، أو ألم وحرقان أثناء التبوّل",
      },
    ],
  },

  faqs: [
    {
      q: {
        en: "I just found out. Why does the doctor say I am five weeks pregnant?",
        ar: "عرفتُ للتوّ. لماذا يقول الطبيب إنني في الأسبوع الخامس؟",
      },
      a: {
        en: "Because the count runs from the first day of the last period rather than from conception. Roughly two of those five weeks passed before there was a pregnancy to count.",
        ar: "لأن العدّ يبدأ من اليوم الأول لآخر دورة شهرية لا من لحظة حدوث الحمل. أي أن نحو أسبوعين من تلك الخمسة مرّا قبل وجود حمل أصلاً.",
      },
      cites: ["medlineplus-gestational-age"],
    },
    {
      q: {
        en: "My test was negative but my period is late. What now?",
        ar: "الاختبار سلبي لكن الدورة متأخرة. ماذا أفعل؟",
      },
      a: {
        en: "Testing before implantation can return a negative result in a real pregnancy, since the hormone the test looks for has not yet risen. Repeating the test after a few days, or asking for a blood test, resolves most of these cases.",
        ar: "قد يعطي الاختبار قبل الانغراس نتيجة سلبية رغم وجود حمل حقيقي، لأن الهرمون الذي يبحث عنه الاختبار لم يرتفع بعد. وإعادة الاختبار بعد أيام قليلة أو طلب تحليل دم يحسم معظم هذه الحالات.",
      },
    },
    {
      q: {
        en: "I started folic acid late. Does that mean I missed it?",
        ar: "بدأتُ حمض الفوليك متأخرة. هل يعني ذلك أنني فوّتُّ الأمر؟",
      },
      a: {
        en: "No. The WHO recommendation runs until 12 weeks of gestation, so there is still a window. Start now and mention the timing at the first appointment.",
        ar: "لا. توصية منظمة الصحة العالمية تمتدّ حتى الأسبوع الثاني عشر، أي أن هناك متّسعاً. ابدئي الآن واذكري التوقيت في أول موعد مع الطبيب.",
      },
      cites: ["who-folic-acid"],
    },
    {
      q: {
        en: "I have no symptoms at all. Is something wrong?",
        ar: "لا أشعر بأي أعراض إطلاقاً. هل هناك خلل؟",
      },
      a: {
        en: "Most women feel little or nothing in the first month, and symptom intensity is not a measure of how the pregnancy is going. The absence of symptoms is not evidence of a problem.",
        ar: "معظم النساء لا يشعرن بشيء يُذكر في الشهر الأول، وشدّة الأعراض ليست مقياساً لسير الحمل. فغياب الأعراض ليس دليلاً على وجود مشكلة.",
      },
    },
  ],

  cta: {
    headline: {
      en: "Give it the date of your last period and it does the arithmetic",
      ar: "أعطيها تاريخ آخر دورة، وهي تتولّى الحساب",
    },
    body: {
      en: "Nawah works out the gestational week from the last menstrual period, so the offset described above stops being something to recalculate. It also carries the appointment schedule, a symptom log a doctor can read, and a linked view for the father showing the same week. Arabic and English, free.",
      ar: "تحسب نواة أسبوع الحمل انطلاقاً من آخر دورة شهرية، فيتوقّف الفارق الموضّح أعلاه عن كونه شيئاً يُعاد حسابه في كل مرة. وتضمّ كذلك جدول المواعيد، وسجلّ أعراض يستطيع الطبيب قراءته، وعرضاً مرتبطاً للأب يُظهر الأسبوع نفسه. بالعربية والإنجليزية، مجاناً.",
    },
    button: {
      en: "Get Nawah on Google Play",
      ar: "حمّلي نواة من جوجل بلاي",
    },
  },

  citations: [
    {
      id: "medlineplus-gestational-age",
      org: "MedlinePlus, U.S. National Library of Medicine",
      title: {
        en: "Gestational age",
        ar: "عمر الحمل",
      },
      url: "https://medlineplus.gov/ency/article/002367.htm",
      retrieved: "2026-08-21",
    },
    {
      id: "who-folic-acid",
      org: "World Health Organization (WHO)",
      title: {
        en: "Periconceptional folic acid supplementation to prevent neural tube defects",
        ar: "مكمّلات حمض الفوليك حول فترة الإخصاب للوقاية من عيوب الأنبوب العصبي",
      },
      url: "https://www.who.int/tools/elena/interventions/folate-periconceptional",
      retrieved: "2026-08-21",
    },
    {
      id: "acog-prenatal-care",
      org: "American College of Obstetricians and Gynecologists (ACOG)",
      title: {
        en: "Prenatal Care, frequently asked questions",
        ar: "متابعة الحمل، أسئلة شائعة",
      },
      url: "https://www.acog.org/womens-health/faqs/prenatal-care",
      retrieved: "2026-08-21",
    },
    {
      id: "acog-tailored-2025",
      org: "American College of Obstetricians and Gynecologists (ACOG)",
      title: {
        en: "Tailored Prenatal Care Delivery for Pregnant Individuals, clinical consensus, April 2025",
        ar: "تقديم رعاية حمل مُفصَّلة للحوامل، توافق سريري، أبريل ٢٠٢٥",
      },
      url: "https://www.acog.org/clinical/clinical-guidance/clinical-consensus/articles/2025/04/tailored-prenatal-care-delivery-for-pregnant-individuals",
      retrieved: "2026-08-21",
    },
  ],

  updated: "2026-08-21",
};

/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Month 2 — the nausea month.
 *
 * "أعراض الحمل في الشهر الثاني" is the query this article exists for, so it is
 * a heading rather than a buried paragraph, and the symptoms are a list
 * because that is how they get read.
 *
 * Sources are NHS and MedlinePlus rather than ACOG. ACOG returns HTTP 402 to
 * every automated fetch, so its pages cannot be opened and checked the way
 * §5 of ARTICLE_PATTERN.md requires.
 */
const month2: GuideMonth = {
  month: 2,
  weeks: [5, 8],
  trimester: 1,
  hero: {
    src: "/guide/month-2-hero.jpg",
    alt: {
      en: "Fresh ginger root on a deep red plate against white marble.",
      ar: "جذور زنجبيل طازجة في طبق أحمر على رخام أبيض.",
    },
    photographer: "Kaboompics",
    photographerUrl: "https://www.pexels.com/@karola-g",
    pexelsUrl: "https://www.pexels.com/photo/close-up-shot-of-a-ginger-on-the-plate-5202108/",
    width: 4633,
    height: 3089,
  },
  published: true,

  title: {
    en: "Month 2 of pregnancy: weeks 5 to 8",
    ar: "الشهر الثاني من الحمل: الأسابيع ٥ إلى ٨",
  },
  metaTitle: {
    en: "Month 2 of Pregnancy (Weeks 5-8): Symptoms and Morning Sickness | Nawah",
    ar: "الشهر الثاني من الحمل (الأسبوع ٥–٨): الأعراض والغثيان | نواة",
  },
  description: {
    en: "Weeks 5 to 8, the month most symptoms arrive. Nausea, exhaustion, the baby's heartbeat, and the signs that mean call a doctor now.",
    ar: "من الأسبوع الخامس إلى الثامن، الشهر الذي تبدأ فيه معظم الأعراض. الغثيان والإرهاق ونبض الجنين، والعلامات التي تستدعي الطبيب فوراً.",
  },
  standfirst: {
    en: "This is usually the month pregnancy stops being an idea and starts being something you feel all day. Most of what arrives now is normal, a few things are not, and knowing which is which is most of what you need.",
    ar: "هذا عادةً هو الشهر الذي يتوقف فيه الحمل عن كونه فكرة ويصبح شيئاً تشعرين به طوال اليوم. معظم ما يأتي الآن طبيعي، وقليل منه ليس كذلك، ومعرفة الفرق هي أهم ما تحتاجينه.",
  },

  sections: [
    {
      heading: {
        en: "Symptoms in month 2 of pregnancy",
        ar: "أعراض الحمل في الشهر الثاني",
      },
      body: [
        {
          en: "Hormones rise steeply through these four weeks, and most women notice it. What you are most likely to feel:",
          ar: "ترتفع الهرمونات بسرعة خلال هذه الأسابيع الأربعة، ومعظم النساء يشعرن بذلك. وأكثر ما قد تشعرين به:",
        },
      ],
      bullets: [
        { en: "Nausea, with or without vomiting", ar: "غثيان، مع قيء أو بدونه" },
        { en: "Exhaustion that sleep does not fix", ar: "إرهاق لا ينفع معه النوم" },
        { en: "Sore, swollen or heavier breasts", ar: "ألم أو تورّم أو ثِقَل في الثديين" },
        { en: "A sense of smell that has turned against you", ar: "حاسة شمّ صارت ضدّكِ" },
        { en: "Going to the bathroom far more often", ar: "الذهاب إلى الحمّام أكثر بكثير" },
        { en: "Food you loved last month now unbearable", ar: "طعام كنتِ تحبّينه صار لا يُحتمل" },
        { en: "Mood swinging without an obvious reason", ar: "تقلّب المزاج دون سبب واضح" },
        { en: "Mild cramping, similar to period pain", ar: "مغص خفيف يشبه ألم الدورة" },
      ],
      afterBullets: [
        {
          en: "Mild cramping alone is common as the uterus grows. Cramping with bleeding is not, and belongs in the list further down.",
          ar: "المغص الخفيف وحده شائع مع تمدّد الرحم. أما المغص مع نزيف فليس كذلك، وهو مذكور في القائمة أدناه.",
        },
      ],
    },
    {
      heading: {
        en: "Morning sickness in month 2",
        ar: "غثيان الحمل في الشهر الثاني",
      },
      body: [
        {
          en: "The name is misleading. The NHS puts it plainly: it \"can affect you at any time of the day or night or you may feel sick all day long.\" Plenty of women find evenings worse.",
          ar: "الاسم مضلّل. تقول هيئة الخدمات الصحية البريطانية بوضوح إنه «قد يصيبكِ في أي وقت من النهار أو الليل، وقد تشعرين بالغثيان طوال اليوم». وكثيرات يجدن المساء أسوأ.",
        },
        {
          en: "It usually clears up by weeks 16 to 20. That is a long way off when you are in week 6, and saying so honestly is more useful than pretending it passes quickly.",
          ar: "وينتهي عادةً مع الأسبوع السادس عشر إلى العشرين. هذه مدة طويلة وأنتِ في الأسبوع السادس، وقول ذلك بصراحة أنفع من التظاهر بأنه يزول سريعاً.",
        },
        {
          en: "What tends to help: eating small amounts often rather than full meals, keeping something plain within reach for the morning before you sit up, and drinking in small sips through the day rather than a glass at once.",
          ar: "ما يساعد عادةً: تناول كميات صغيرة على فترات متقاربة بدل الوجبات الكاملة، وإبقاء شيء خفيف في متناول يدكِ لتأكليه قبل النهوض من السرير، وشرب الماء برشفات صغيرة على مدار اليوم بدل كوب دفعة واحدة.",
        },
        {
          en: "Feeling no nausea at all is also normal and is not a sign that anything is wrong.",
          ar: "وألّا تشعري بالغثيان إطلاقاً أمر طبيعي كذلك، وليس علامة على وجود خطأ.",
        },
      ],
      cites: ["nhs-morning-sickness"],
      image: {
        src: "/guide/month-2-rest.jpg",
        alt: {
          en: "White bed linen and pillows in soft daylight.",
          ar: "أغطية سرير ووسائد بيضاء في ضوء نهار هادئ.",
        },
        photographer: "Castorly Stock",
        photographerUrl: "https://www.pexels.com/@castorlystock",
        pexelsUrl: "https://www.pexels.com/photo/white-bed-with-pillows-3755590/",
        width: 6000,
        height: 4000,
      },
    },
    {
      heading: {
        en: "The baby in month 2",
        ar: "تطور الجنين في الشهر الثاني",
      },
      body: [
        {
          en: "This is the month the heart starts working. By weeks 6 to 7 it \"continues to grow and now beats at a regular rhythm.\" By week 8, hands and feet \"begin to form and look like little paddles.\"",
          ar: "هذا هو الشهر الذي يبدأ فيه القلب بالعمل. ففي الأسبوعين السادس والسابع «يستمر القلب في النمو وينبض بإيقاع منتظم». ومع الأسبوع الثامن «تبدأ اليدان والقدمان بالتكوّن وتبدوان كمجدافين صغيرين».",
        },
        {
          en: "A heartbeat may be visible on an early ultrasound, though not always, and timing varies with equipment and with your dates. Fetal heart tones are detectable by Doppler around week 10, so not hearing one yet at week 7 says nothing on its own.",
          ar: "قد يظهر النبض في سونار مبكر، وليس دائماً، والتوقيت يختلف باختلاف الجهاز وباختلاف تاريخ حملكِ. أما سماع النبض بجهاز الدوبلر فيكون في حدود الأسبوع العاشر، لذا فعدم سماعه في الأسبوع السابع لا يعني شيئاً بحدّ ذاته.",
        },
      ],
      cites: ["medlineplus-fetal-development"],
    },
  ],

  redFlags: {
    intro: {
      en: "Nausea is expected this month. These are the signs that it has stopped being ordinary, or that something else needs attention. Contact a doctor rather than waiting.",
      ar: "الغثيان متوقّع هذا الشهر. وهذه هي العلامات التي تدلّ على أنه تجاوز الحدّ الطبيعي، أو أن هناك أمراً آخر يحتاج انتباهاً. تواصلي مع طبيب ولا تنتظري.",
    },
    items: [
      {
        en: "You cannot keep food or fluids down for 24 hours",
        ar: "عدم القدرة على الاحتفاظ بالطعام أو السوائل لمدة ٢٤ ساعة",
      },
      {
        en: "Very dark urine, or you have not passed urine in more than 8 hours",
        ar: "بول داكن جداً، أو عدم التبوّل لأكثر من ٨ ساعات",
      },
      {
        en: "You feel very weak, dizzy or faint when standing up",
        ar: "شعور بضعف شديد أو دوخة أو إغماء عند الوقوف",
      },
      { en: "You are vomiting blood", ar: "قيء مصحوب بدم" },
      { en: "You are losing weight", ar: "نقصان في الوزن" },
      { en: "A high temperature", ar: "ارتفاع في درجة الحرارة" },
      {
        en: "Vaginal bleeding, or sharp pain on one side of the lower abdomen",
        ar: "نزيف مهبلي، أو ألم حادّ في جهة واحدة من أسفل البطن",
      },
    ],
    cites: ["nhs-morning-sickness"],
  },

  faqs: [
    {
      q: {
        en: "When can the baby's heartbeat be seen or heard?",
        ar: "متى يظهر نبض الجنين؟",
      },
      a: {
        en: "The heart is beating at a regular rhythm by weeks 6 to 7, and heart tones are detectable by Doppler around week 10. Whether it shows on your particular scan depends on your dates and the equipment, so an early scan that does not show one is not a verdict.",
        ar: "ينبض القلب بإيقاع منتظم في الأسبوعين السادس والسابع، ويمكن التقاط النبض بجهاز الدوبلر في حدود الأسبوع العاشر. أما ظهوره في السونار عندكِ فيعتمد على تاريخ حملكِ وعلى الجهاز، لذا فسونار مبكر لا يُظهر النبض ليس حُكماً نهائياً.",
      },
      cites: ["medlineplus-fetal-development"],
    },
    {
      q: {
        en: "My nausea is severe. When does it stop being normal?",
        ar: "غثياني شديد. متى يتوقف عن كونه طبيعياً؟",
      },
      a: {
        en: "When you cannot keep fluids down for a day, when you are losing weight, or when you are passing very little urine. That severe form can lead to dehydration and sometimes needs hospital treatment, so it is worth calling early rather than enduring it.",
        ar: "حين لا تستطيعين الاحتفاظ بالسوائل ليوم كامل، أو حين ينقص وزنكِ، أو حين يقلّ التبوّل كثيراً. هذه الصورة الشديدة قد تؤدي إلى الجفاف وتحتاج أحياناً إلى علاج في المستشفى، لذا الاتصال مبكراً أفضل من التحمّل.",
      },
      cites: ["nhs-morning-sickness"],
    },
    {
      q: {
        en: "I have no symptoms at all. Should I worry?",
        ar: "لا أشعر بأي أعراض. هل أقلق؟",
      },
      a: {
        en: "No. Symptom intensity varies enormously between women and between pregnancies, and having none is within the normal range. It is not a measure of how the pregnancy is going.",
        ar: "لا. تختلف شدّة الأعراض اختلافاً كبيراً بين امرأة وأخرى وبين حمل وآخر، وعدم وجودها يقع ضمن الطبيعي. وهي ليست مقياساً لسير الحمل.",
      },
    },
    {
      q: {
        en: "Why am I this tired?",
        ar: "لماذا أشعر بهذا الإرهاق؟",
      },
      a: {
        en: "Because your body is building an entire organ, the placenta, at the same time as everything else it normally does. The tiredness of the first trimester is not ordinary tiredness and usually does not respond to sleeping more. It commonly eases in the second trimester.",
        ar: "لأن جسمكِ يبني عضواً كاملاً هو المشيمة، في الوقت نفسه الذي يقوم فيه بكل ما يفعله عادةً. إرهاق الثلث الأول ليس تعباً عادياً، وغالباً لا ينفع معه النوم أكثر. وهو يخفّ عادةً في الثلث الثاني.",
      },
    },
  ],

  cta: {
    headline: {
      en: "Your doctor will ask how bad it has been. Have an answer",
      ar: "سيسألكِ الطبيب كم كان الأمر سيئاً. اجعلي لديكِ إجابة",
    },
    body: {
      en: "Nawah logs symptoms and severity by day, so \"it was bad, I think Tuesday?\" becomes a record your doctor can read in ten seconds. It also carries the appointment schedule, and Nawal is awake when the questions arrive at 3 a.m. Arabic and English, free.",
      ar: "تسجّل نواة الأعراض وشدّتها يوماً بيوم، فتتحوّل «كان سيئاً، أظن يوم الثلاثاء؟» إلى سجلّ يقرأه طبيبكِ في عشر ثوانٍ. وتضمّ كذلك جدول المواعيد، ونوال مستيقظة حين تأتي الأسئلة في الثالثة فجراً. بالعربية والإنجليزية، مجاناً.",
    },
    button: {
      en: "Get Nawah on Google Play",
      ar: "حمّلي نواة من جوجل بلاي",
    },
  },

  citations: [
    {
      id: "nhs-morning-sickness",
      org: "NHS",
      title: {
        en: "Vomiting and morning sickness",
        ar: "القيء وغثيان الحمل",
      },
      url: "https://www.nhs.uk/pregnancy/related-conditions/common-symptoms/vomiting-and-morning-sickness/",
      retrieved: "2026-08-21",
    },
    {
      id: "medlineplus-fetal-development",
      org: "MedlinePlus, U.S. National Library of Medicine",
      title: { en: "Fetal development", ar: "تطوّر الجنين" },
      url: "https://medlineplus.gov/ency/article/002398.htm",
      retrieved: "2026-08-21",
    },
  ],

  updated: "2026-08-21",
};

/**
 * Month 3 — the end of the first trimester.
 *
 * Carries the dating scan, which is the concrete thing a reader in this month
 * is searching for, and the point where the WHO folic acid recommendation
 * ends. The miscarriage line is tied to heartbeat detection rather than to
 * week 12, because that is what the cited source actually says.
 */
const month3: GuideMonth = {
  month: 3,
  weeks: [9, 12],
  trimester: 1,
  hero: {
    src: "/guide/month-3-hero.jpg",
    alt: {
      en: "Warm daylight coming through a sheer curtain.",
      ar: "ضوء نهار دافئ يتسلّل من ستارة شفافة.",
    },
    photographer: "Pexels contributor",
    photographerUrl: "https://www.pexels.com/@pexels-user-176206548",
    pexelsUrl: "https://www.pexels.com/photo/low-angle-shot-of-a-curtain-11111717/",
    width: 4032,
    height: 3024,
  },
  published: true,

  title: {
    en: "Month 3 of pregnancy: weeks 9 to 12",
    ar: "الشهر الثالث من الحمل: الأسابيع ٩ إلى ١٢",
  },
  metaTitle: {
    en: "Month 3 of Pregnancy (Weeks 9-12): The 12-Week Scan | Nawah",
    ar: "الشهر الثالث من الحمل (الأسبوع ٩–١٢): سونار الأسبوع الثاني عشر | نواة",
  },
  description: {
    en: "Weeks 9 to 12: the end of the first trimester. The dating scan, nausea starting to ease, folic acid ending, and what the numbers actually mean.",
    ar: "من الأسبوع التاسع إلى الثاني عشر: نهاية الثلث الأول. سونار تحديد الموعد، وبداية انحسار الغثيان، ونهاية حمض الفوليك، وما تعنيه الأرقام فعلاً.",
  },
  standfirst: {
    en: "The third month closes the hardest stretch of the first trimester. The scan that dates your pregnancy happens now, and for many women the nausea finally starts to loosen its grip.",
    ar: "الشهر الثالث يُنهي أصعب فترات الثلث الأول. السونار الذي يحدّد موعد ولادتكِ يكون الآن، وعند كثيرات يبدأ الغثيان أخيراً في التراجع.",
  },

  sections: [
    {
      heading: {
        en: "Symptoms in month 3 of pregnancy",
        ar: "أعراض الحمل في الشهر الثالث",
      },
      body: [
        {
          en: "Most of month 2 is still with you at the start of this month, and much of it begins to ease by the end. What you are likely to notice:",
          ar: "معظم ما كان في الشهر الثاني ما زال معكِ في بدايته، وكثير منه يبدأ بالخفّة قرب نهايته. وأكثر ما قد تلاحظينه:",
        },
      ],
      bullets: [
        { en: "Nausea, often at its peak then starting to fade", ar: "غثيان يبلغ ذروته ثم يبدأ بالانحسار" },
        { en: "Tiredness still heavy, but lifting for some", ar: "إرهاق ما زال ثقيلاً، لكنه يخفّ عند بعض النساء" },
        { en: "Waistbands getting tight before anything shows", ar: "ضيق الملابس عند الخصر قبل أن يظهر البطن" },
        { en: "Visible veins across the chest", ar: "ظهور عروق واضحة في منطقة الصدر" },
        { en: "Headaches, often from dehydration", ar: "صداع، غالباً بسبب قلّة السوائل" },
        { en: "Mild cramping as the uterus grows", ar: "مغص خفيف مع تمدّد الرحم" },
      ],
      afterBullets: [
        {
          en: "Not showing yet is normal, particularly in a first pregnancy, and says nothing about the baby's size.",
          ar: "عدم ظهور البطن بعد أمر طبيعي، خاصةً في الحمل الأول، ولا يدلّ على حجم الجنين.",
        },
      ],
    },
    {
      heading: {
        en: "The 12-week scan",
        ar: "سونار الأسبوع الثاني عشر",
      },
      body: [
        {
          en: "In England this scan is offered \"at around 10 to 14 weeks of pregnancy.\" Local practice differs, but the window is broadly the same, and it is the appointment that sets your due date.",
          ar: "يُقدَّم هذا السونار في إنجلترا «في حدود الأسبوع العاشر إلى الرابع عشر من الحمل». والممارسة تختلف من بلد لآخر، لكن الفترة متقاربة، وهو الموعد الذي يُحدَّد فيه تاريخ ولادتكِ.",
        },
        {
          en: "The NHS lists what it checks: \"how many weeks pregnant you are and work out your due date,\" \"whether you're expecting more than 1 baby,\" \"that the baby is growing in the right place,\" and \"your baby's development.\"",
          ar: "وتذكر الهيئة ما يتحقّق منه: «في أي أسبوع أنتِ وتحديد موعد الولادة»، و«ما إذا كنتِ تحملين أكثر من جنين»، و«أن الجنين ينمو في المكان الصحيح»، و«تطوّر الجنين».",
        },
        {
          en: "You may also be offered screening in the same visit. The combined test pairs a blood test with a measurement of the fluid at the back of the baby's neck, called nuchal translucency. It is offered, not required, and the choice is yours.",
          ar: "وقد يُعرض عليكِ فحص في الزيارة نفسها. الفحص المشترك يجمع بين تحليل دم وقياس السائل خلف رقبة الجنين، ويُسمّى الشفافية القفوية. وهو يُعرض ولا يُفرض، والقرار قراركِ.",
        },
        {
          en: "This scan sets the dates your whole pregnancy is measured against, so it is worth booking rather than assuming it will be arranged for you.",
          ar: "هذا السونار يضبط التواريخ التي يُقاس عليها حملكِ كله، لذا يستحقّ أن تحجزيه بنفسكِ لا أن تفترضي أنه سيُرتَّب تلقائياً.",
        },
      ],
      cites: ["nhs-12-week-scan"],
      image: {
        src: "/guide/month-3-detail.jpg",
        alt: {
          en: "Dried flowers against a soft neutral background.",
          ar: "زهور مجفّفة أمام خلفية هادئة بلون محايد.",
        },
        photographer: "Johnny Ng",
        photographerUrl: "https://www.pexels.com/@johnny-ng-74121137",
        pexelsUrl: "https://www.pexels.com/photo/dried-flowers-in-tilt-shift-lens-9055006/",
        width: 6016,
        height: 4016,
      },
    },
    {
      heading: {
        en: "The baby in month 3",
        ar: "تطور الجنين في الشهر الثالث",
      },
      body: [
        {
          en: "By week 9, \"all of your baby's essential organs have begun to grow,\" and the toes can be seen. Between weeks 11 and 14, nails appear on the fingers and toes.",
          ar: "مع الأسبوع التاسع «تكون كل أعضاء الجنين الأساسية قد بدأت في النمو»، وتظهر أصابع القدمين. وبين الأسبوعين الحادي عشر والرابع عشر تظهر الأظافر على أصابع اليدين والقدمين.",
        },
        {
          en: "Formed is not the same as finished. The organs go on developing for the rest of the pregnancy. What changes this month is that the period in which they were being built for the first time is behind you.",
          ar: "والتكوّن ليس اكتمالاً. فالأعضاء تواصل نموّها بقية فترة الحمل. ما يتغيّر هذا الشهر أن مرحلة تكوّنها الأولى صارت خلفكِ.",
        },
      ],
      cites: ["medlineplus-fetal-development"],
    },
    {
      heading: {
        en: "The end of the first trimester",
        ar: "نهاية الثلث الأول",
      },
      body: [
        {
          en: "Two things change at week 12, and it is worth being precise about both.",
          ar: "أمران يتغيّران مع الأسبوع الثاني عشر، ويستحقّان الدقة.",
        },
        {
          en: "Folic acid. The World Health Organization's recommendation of 400 micrograms daily runs \"until 12 weeks of gestation.\" Ask your doctor what to continue, because a prenatal vitamin usually carries other things you still need.",
          ar: "حمض الفوليك: توصية منظمة الصحة العالمية بـ ٤٠٠ ميكروغرام يومياً تمتدّ «حتى الأسبوع الثاني عشر من الحمل». اسألي طبيبكِ عمّا تواصلين تناوله، فمكمّلات الحمل تحتوي عادةً على عناصر أخرى ما زلتِ تحتاجينها.",
        },
        {
          en: "Risk. Most miscarriages \"occur during the first 7 weeks of pregnancy,\" and the rate \"drops after the fetus's heartbeat is detected.\" So the reassurance is real, but it is tied to a confirmed heartbeat rather than to the number 12 on a calendar.",
          ar: "والاحتمال: معظم حالات الإجهاض «تحدث خلال الأسابيع السبعة الأولى من الحمل»، ومعدّلها «ينخفض بعد الكشف عن نبض الجنين». فالطمأنينة حقيقية، لكنها مرتبطة بنبض مؤكَّد لا برقم اثني عشر على التقويم.",
        },
      ],
      cites: ["who-folic-acid", "medlineplus-miscarriage"],
    },
  ],

  redFlags: {
    intro: {
      en: "Contact a doctor or go to a hospital if any of these happen, whatever week you are in.",
      ar: "تواصلي مع طبيب أو توجّهي إلى المستشفى إذا حدث أيٌّ من هذه، في أي أسبوع كنتِ.",
    },
    items: [
      {
        en: "Vaginal bleeding, especially with cramping",
        ar: "نزيف مهبلي، خاصةً مع مغص",
      },
      {
        en: "Severe abdominal pain, or pain on one side",
        ar: "ألم شديد في البطن، أو ألم في جهة واحدة",
      },
      {
        en: "Fluid leaking from the vagina",
        ar: "تسرّب سائل من المهبل",
      },
      {
        en: "A high temperature, or pain and burning when passing urine",
        ar: "ارتفاع في الحرارة، أو ألم وحرقان عند التبوّل",
      },
      {
        en: "Fainting, or dizziness that does not pass on sitting down",
        ar: "إغماء، أو دوخة لا تزول عند الجلوس",
      },
      {
        en: "Vomiting so persistent you cannot keep fluids down",
        ar: "قيء متواصل يمنعكِ من الاحتفاظ بالسوائل",
      },
    ],
  },

  faqs: [
    {
      q: {
        en: "When should I tell people?",
        ar: "متى أخبر الناس بالحمل؟",
      },
      a: {
        en: "There is no medical rule, only a convention built around risk falling after the early weeks. Some people tell everyone early precisely so they will have support if something goes wrong. Both are reasonable. It is your news.",
        ar: "لا توجد قاعدة طبية، بل عُرف نشأ حول انخفاض الاحتمال بعد الأسابيع الأولى. بعض النساء يخبرن الجميع مبكراً تحديداً كي يجدن سنداً إن حدث شيء. وكلا الخيارين معقول. الخبر خبركِ.",
      },
    },
    {
      q: {
        en: "My nausea stopped suddenly. Is that a bad sign?",
        ar: "توقف الغثيان فجأة. هل هذه علامة سيئة؟",
      },
      a: {
        en: "Usually not. This is the month it commonly eases, and it can ease quickly. But symptoms disappearing is worth mentioning to your doctor rather than sitting with, particularly alongside bleeding or cramping.",
        ar: "غالباً لا. هذا هو الشهر الذي يخفّ فيه عادةً، وقد يخفّ بسرعة. لكن اختفاء الأعراض يستحقّ أن تذكريه لطبيبكِ بدل الجلوس معه، خاصةً إذا صاحبه نزيف أو مغص.",
      },
    },
    {
      q: {
        en: "Do I stop folic acid after week 12?",
        ar: "هل أتوقف عن حمض الفوليك بعد الأسبوع الثاني عشر؟",
      },
      a: {
        en: "The WHO recommendation for folic acid specifically runs until 12 weeks. That is not the same as stopping your prenatal vitamin, which usually contains iron and other things you still need. Ask your doctor what to continue.",
        ar: "توصية منظمة الصحة العالمية بخصوص حمض الفوليك تحديداً تمتدّ حتى الأسبوع الثاني عشر. وهذا لا يعني التوقف عن مكمّل الحمل، فهو يحتوي عادةً على الحديد وعناصر أخرى ما زلتِ تحتاجينها. اسألي طبيبكِ.",
      },
      cites: ["who-folic-acid"],
    },
    {
      q: {
        en: "Is the nuchal translucency scan compulsory?",
        ar: "هل فحص الشفافية القفوية إجباري؟",
      },
      a: {
        en: "No. Screening is offered, and you can accept or decline it. It estimates a likelihood rather than giving a diagnosis, which is worth understanding before the appointment rather than during it.",
        ar: "لا. الفحص يُعرض عليكِ، ولكِ أن تقبليه أو ترفضيه. وهو يقدّر احتمالاً ولا يعطي تشخيصاً، وهذا ممّا يُستحسن فهمه قبل الموعد لا أثناءه.",
      },
      cites: ["nhs-12-week-scan"],
    },
  ],

  cta: {
    headline: {
      en: "The scan that sets your due date is this month",
      ar: "السونار الذي يحدّد موعد ولادتكِ هذا الشهر",
    },
    body: {
      en: "Nawah keeps the appointment schedule, surfaces the lab work in the week you need it, and once your dates are confirmed it counts the weeks for you. The father sees the same week from his side. Arabic and English, free.",
      ar: "تحتفظ نواة بجدول المواعيد، وتُظهر التحاليل في الأسبوع الذي تحتاجينها فيه، وبمجرد تأكيد تواريخكِ تحسب الأسابيع بدلاً عنكِ. ويرى الأب الأسبوع نفسه من جهته. بالعربية والإنجليزية، مجاناً.",
    },
    button: {
      en: "Get Nawah on Google Play",
      ar: "حمّلي نواة من جوجل بلاي",
    },
  },

  citations: [
    {
      id: "nhs-12-week-scan",
      org: "NHS",
      title: { en: "12-week scan", ar: "سونار الأسبوع الثاني عشر" },
      url: "https://www.nhs.uk/pregnancy/your-pregnancy-care/12-week-scan/",
      retrieved: "2026-08-21",
    },
    {
      id: "medlineplus-fetal-development",
      org: "MedlinePlus, U.S. National Library of Medicine",
      title: { en: "Fetal development", ar: "تطوّر الجنين" },
      url: "https://medlineplus.gov/ency/article/002398.htm",
      retrieved: "2026-08-21",
    },
    {
      id: "medlineplus-miscarriage",
      org: "MedlinePlus, U.S. National Library of Medicine",
      title: { en: "Miscarriage", ar: "الإجهاض" },
      url: "https://medlineplus.gov/ency/article/001488.htm",
      retrieved: "2026-08-21",
    },
    {
      id: "who-folic-acid",
      org: "World Health Organization (WHO)",
      title: {
        en: "Periconceptional folic acid supplementation to prevent neural tube defects",
        ar: "مكمّلات حمض الفوليك حول فترة الإخصاب للوقاية من عيوب الأنبوب العصبي",
      },
      url: "https://www.who.int/tools/elena/interventions/folate-periconceptional",
      retrieved: "2026-08-21",
    },
  ],

  updated: "2026-08-21",
};

/* ── Shared citations, so months 4 to 9 do not each re-declare them ──────── */

const CITE_FETAL: Citation = {
  id: "medlineplus-fetal-development",
  org: "MedlinePlus, U.S. National Library of Medicine",
  title: { en: "Fetal development", ar: "تطوّر الجنين" },
  url: "https://medlineplus.gov/ency/article/002398.htm",
  retrieved: "2026-08-21",
};

const CITE_MOVEMENTS: Citation = {
  id: "nhs-movements",
  org: "NHS",
  title: { en: "Your baby's movements", ar: "حركة الجنين" },
  url: "https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/",
  retrieved: "2026-08-21",
};

const CITE_20WEEK: Citation = {
  id: "nhs-20-week-scan",
  org: "NHS",
  title: { en: "20-week screening scan", ar: "سونار الأسبوع العشرين" },
  url: "https://www.nhs.uk/pregnancy/your-pregnancy-care/20-week-scan/",
  retrieved: "2026-08-21",
};

const CITE_GD: Citation = {
  id: "nhs-gestational-diabetes",
  org: "NHS",
  title: { en: "Gestational diabetes", ar: "سكري الحمل" },
  url: "https://www.nhs.uk/conditions/gestational-diabetes/",
  retrieved: "2026-08-21",
};

const CITE_PRETERM: Citation = {
  id: "nhs-premature-labour",
  org: "NHS",
  title: { en: "Premature labour and birth", ar: "الولادة المبكرة" },
  url: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/premature-labour-and-birth/",
  retrieved: "2026-08-21",
};

const CITE_LABOUR: Citation = {
  id: "nhs-labour-signs",
  org: "NHS",
  title: { en: "Signs that labour has begun", ar: "علامات بدء الولادة" },
  url: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/signs-that-labour-has-begun/",
  retrieved: "2026-08-21",
};

/** Movement red flags. Identical from month 5 on, and must never drift: this
 *  is the single most time-critical thing in the whole guide. */
const MOVEMENT_FLAG: Localized = {
  en: "Your baby is moving less than usual, you cannot feel movement any more, or the usual pattern has changed. Call immediately, at any hour. Do not wait to see if it improves.",
  ar: "حركة جنينكِ أقلّ من المعتاد، أو لم تعودي تشعرين بها، أو تغيّر نمطها المعتاد. اتصلي فوراً في أي ساعة، ولا تنتظري لترَي إن كانت ستتحسّن.",
};

const month4: GuideMonth = {
  month: 4,
  weeks: [13, 16],
  trimester: 2,
  hero: {
    src: "/guide/month-4-hero.jpg",
    alt: {
      en: "A stack of folded clothes in terracotta, rose and cream.",
      ar: "ملابس مطوية بألوان الطين والوردي والكريمي.",
    },
    photographer: "Ron Lach",
    photographerUrl: "https://www.pexels.com/@ron-lach",
    pexelsUrl: "https://www.pexels.com/photo/a-person-holding-folded-textile-8346226/",
    width: 5464,
    height: 3643,
  },
  published: true,
  title: {
    en: "Month 4 of pregnancy: weeks 13 to 16",
    ar: "الشهر الرابع من الحمل: الأسابيع ١٣ إلى ١٦",
  },
  metaTitle: {
    en: "Month 4 of Pregnancy (Weeks 13-16): The Second Trimester Begins | Nawah",
    ar: "الشهر الرابع من الحمل (الأسبوع ١٣–١٦): بداية الثلث الثاني | نواة",
  },
  description: {
    en: "Weeks 13 to 16: the second trimester begins. Energy returning, the bump starting, first movements, and what is normal now.",
    ar: "من الأسبوع ١٣ إلى ١٦: يبدأ الثلث الثاني. عودة الطاقة، وبداية ظهور البطن، وأول الحركات، وما هو الطبيعي الآن.",
  },
  standfirst: {
    en: "Many women describe the second trimester as the part of pregnancy they actually enjoyed. The nausea usually loosens, the exhaustion lifts, and for the first time in months you may feel like yourself again.",
    ar: "كثيرات يصفن الثلث الثاني بأنه الجزء الذي استمتعن به فعلاً من الحمل. الغثيان يخفّ عادةً، والإرهاق ينحسر، وقد تشعرين لأول مرة منذ شهور أنكِ عدتِ إلى نفسكِ.",
  },
  sections: [
    {
      heading: {
        en: "Symptoms in month 4 of pregnancy",
        ar: "أعراض الحمل في الشهر الرابع",
      },
      body: [
        {
          en: "This month usually gives more than it takes. What tends to change:",
          ar: "هذا الشهر يعطي عادةً أكثر ممّا يأخذ. وما يتغيّر غالباً:",
        },
      ],
      bullets: [
        { en: "Nausea easing, often noticeably", ar: "انحسار الغثيان، وغالباً بشكل ملحوظ" },
        { en: "Energy coming back", ar: "عودة الطاقة" },
        { en: "A small bump beginning to show", ar: "بداية ظهور بطن صغير" },
        { en: "Sharp, brief pain low on one side when you move suddenly", ar: "ألم قصير وحادّ أسفل جهة واحدة عند الحركة المفاجئة" },
        { en: "A blocked nose, or gums that bleed when you brush", ar: "انسداد الأنف، أو نزف اللثة عند التنظيف" },
        { en: "Darker skin patches, or a line down the belly", ar: "بقع داكنة في البشرة، أو خط أسفل البطن" },
        { en: "Appetite returning, sometimes sharply", ar: "عودة الشهية، وأحياناً بقوة" },
      ],
      afterBullets: [
        {
          en: "The brief one-sided pain is usually round ligament pain, the muscles supporting the uterus stretching as it grows. It passes in seconds. Pain that is severe, constant, or comes with bleeding is a different thing and is in the list below.",
          ar: "الألم القصير في جهة واحدة هو غالباً ألم الرباط المستدير، أي تمدّد العضلات التي تحمل الرحم مع كبره. ويزول خلال ثوانٍ. أما الألم الشديد أو المستمر أو المصحوب بنزيف فأمر آخر، وهو في القائمة أدناه.",
        },
      ],
    },
    {
      heading: {
        en: "The baby in month 4",
        ar: "تطور الجنين في الشهر الرابع",
      },
      body: [
        {
          en: "Between weeks 11 and 14, the eyelids close and \"will not reopen until about the 28th week.\" Between weeks 15 and 18, \"fine hair called lanugo develops on your baby's head.\"",
          ar: "بين الأسبوعين الحادي عشر والرابع عشر تنغلق الجفون، و«لن تُفتح مجدداً حتى الأسبوع الثامن والعشرين تقريباً». وبين الأسبوعين الخامس عشر والثامن عشر «ينمو شعر ناعم يُسمّى الزغب على رأس الجنين».",
        },
        {
          en: "The baby is now moving a great deal. You will probably not feel it yet, because there is still room to move without touching anything you can sense.",
          ar: "الجنين يتحرك كثيراً الآن. وغالباً لن تشعري بذلك بعد، لأن المساحة ما زالت تسمح له بالحركة دون أن يلامس ما تشعرين به.",
        },
      ],
      cites: ["medlineplus-fetal-development"],
    },
    {
      heading: {
        en: "When you will feel the baby move",
        ar: "متى تشعرين بحركة الجنين",
      },
      body: [
        {
          en: "The NHS puts the window broadly: \"You should start to feel your baby move between 16 to 24 weeks of pregnancy.\" That is an eight-week range, and all of it is normal.",
          ar: "تحدّد هيئة الخدمات الصحية البريطانية الفترة بمرونة: «من المفترض أن تبدئي بالشعور بحركة جنينكِ بين الأسبوع السادس عشر والرابع والعشرين». هذه فترة تمتدّ ثمانية أسابيع، وكلها طبيعية.",
        },
        {
          en: "In a first pregnancy it is usually later. The first movements feel like bubbles, a flutter, or a muscle twitching, and are easy to mistake for digestion. Feeling nothing at week 16 means nothing at all.",
          ar: "في الحمل الأول يكون ذلك متأخراً عادةً. والحركات الأولى تشبه فقاعات أو رفرفة أو ارتعاش عضلة، ويسهل الخلط بينها وبين الهضم. وعدم الشعور بشيء في الأسبوع السادس عشر لا يعني شيئاً إطلاقاً.",
        },
      ],
      cites: ["nhs-movements"],
    },
  ],
  redFlags: {
    intro: {
      en: "Contact a doctor rather than waiting for your next appointment if any of these happen.",
      ar: "تواصلي مع طبيب بدل انتظار موعدكِ التالي إذا حدث أيٌّ ممّا يلي.",
    },
    items: [
      { en: "Vaginal bleeding", ar: "نزيف مهبلي" },
      { en: "Severe or constant abdominal pain", ar: "ألم شديد أو مستمر في البطن" },
      { en: "Fluid leaking from the vagina", ar: "تسرّب سائل من المهبل" },
      { en: "A high temperature, or pain when passing urine", ar: "ارتفاع في الحرارة، أو ألم عند التبوّل" },
      { en: "A severe headache, or changes in your vision", ar: "صداع شديد، أو تغيّر في الرؤية" },
      { en: "Sudden swelling of the face or hands", ar: "تورّم مفاجئ في الوجه أو اليدين" },
    ],
  },
  faqs: [
    {
      q: { en: "When will I look pregnant?", ar: "متى يظهر البطن؟" },
      a: {
        en: "Usually somewhere in this month or the next, and later in a first pregnancy. Height, build and the position of the uterus all change the answer. It is not a measure of the baby's growth.",
        ar: "غالباً خلال هذا الشهر أو الذي يليه، ومتأخراً أكثر في الحمل الأول. الطول والبنية وموضع الرحم كلها تغيّر الإجابة. وهو ليس مقياساً لنمو الجنين.",
      },
    },
    {
      q: { en: "I felt a sharp pain in my side. Is that normal?", ar: "شعرتُ بألم حادّ في جانبي. هل هذا طبيعي؟" },
      a: {
        en: "If it was brief and came with a sudden movement, it is most likely the ligaments supporting your uterus stretching. If it is severe, lasts, or comes with bleeding or fever, call your doctor.",
        ar: "إذا كان قصيراً وجاء مع حركة مفاجئة، فالأرجح أنه تمدّد الأربطة الحاملة للرحم. أما إذا كان شديداً أو استمرّ أو صاحبه نزيف أو حرارة، فاتصلي بطبيبكِ.",
      },
    },
    {
      q: { en: "Should I be counting movements yet?", ar: "هل أبدأ بعدّ الحركات الآن؟" },
      a: {
        en: "No. Most women have not felt reliable movement this early, and the NHS says you do not need to count at all. What matters later is knowing your baby's usual pattern, not a number.",
        ar: "لا. معظم النساء لا يشعرن بحركة منتظمة في هذا الوقت المبكر، والهيئة البريطانية تقول إنكِ لا تحتاجين إلى العدّ أصلاً. المهم لاحقاً هو معرفة النمط المعتاد لجنينكِ، لا رقم معيّن.",
      },
      cites: ["nhs-movements"],
    },
  ],
  cta: {
    headline: {
      en: "The good months are the ones worth writing down",
      ar: "الشهور الجميلة هي التي تستحقّ أن تُكتب",
    },
    body: {
      en: "Nawah gives you a journal you can share with him, week-by-week content written for both of you, and a father's view showing the same week from his side. In Arabic and English, free.",
      ar: "تمنحكِ نواة مفكّرة تشاركينها معه، ومحتوى أسبوعياً مكتوباً لكما معاً، وواجهة للأب تُظهر الأسبوع نفسه من جهته. بالعربية والإنجليزية، مجاناً.",
    },
    button: { en: "Get Nawah on Google Play", ar: "حمّلي نواة من جوجل بلاي" },
  },
  citations: [CITE_FETAL, CITE_MOVEMENTS],
  updated: "2026-08-21",
};

const month5: GuideMonth = {
  month: 5,
  weeks: [17, 20],
  trimester: 2,
  hero: {
    src: "/guide/month-5-hero.jpg",
    alt: {
      en: "A pair of very small baby shoes on a white background.",
      ar: "حذاء صغير جداً للأطفال على خلفية بيضاء.",
    },
    photographer: "Pixabay",
    photographerUrl: "https://www.pexels.com/@pixabay",
    pexelsUrl: "https://www.pexels.com/photo/pair-of-toddler-s-white-and-gray-shoes-267278/",
    width: 1920,
    height: 1200,
  },
  published: true,
  title: {
    en: "Month 5 of pregnancy: weeks 17 to 20",
    ar: "الشهر الخامس من الحمل: الأسابيع ١٧ إلى ٢٠",
  },
  metaTitle: {
    en: "Month 5 of Pregnancy (Weeks 17-20): The 20-Week Scan | Nawah",
    ar: "الشهر الخامس من الحمل (الأسبوع ١٧–٢٠): سونار الأسبوع العشرين | نواة",
  },
  description: {
    en: "Weeks 17 to 20: halfway. The 20-week scan, the first movements you can trust, and the baby starting to hear you.",
    ar: "من الأسبوع ١٧ إلى ٢٠: منتصف الطريق. سونار الأسبوع العشرين، وأول حركة تثقين بها، وبداية سماع الجنين لكِ.",
  },
  standfirst: {
    en: "Halfway. This is the month most women feel unmistakable movement for the first time, and the month of the longest scan of the whole pregnancy.",
    ar: "منتصف الطريق. هذا هو الشهر الذي تشعر فيه معظم النساء بحركة لا تُخطئها لأول مرة، وشهر أطول سونار في الحمل كله.",
  },
  sections: [
    {
      heading: { en: "Symptoms in month 5 of pregnancy", ar: "أعراض الحمل في الشهر الخامس" },
      body: [
        {
          en: "The bump is now doing things to the rest of you. What most women notice:",
          ar: "البطن الآن يؤثر على بقية جسمكِ. وأكثر ما تلاحظه معظم النساء:",
        },
      ],
      bullets: [
        { en: "Movement you can finally identify as movement", ar: "حركة تستطيعين أخيراً تمييزها كحركة" },
        { en: "Backache, especially at the end of the day", ar: "ألم في الظهر، خاصةً آخر اليوم" },
        { en: "Leg cramps, often at night", ar: "تشنّج في الساقين، غالباً ليلاً" },
        { en: "Heartburn after meals", ar: "حرقة في المعدة بعد الأكل" },
        { en: "Trouble finding a comfortable sleeping position", ar: "صعوبة في إيجاد وضعية نوم مريحة" },
        { en: "Mild swelling in the feet and ankles", ar: "تورّم خفيف في القدمين والكاحلين" },
        { en: "Feeling short of breath more easily", ar: "ضيق في النفس بسهولة أكبر" },
      ],
    },
    {
      heading: { en: "The 20-week scan", ar: "سونار الأسبوع العشرين" },
      body: [
        {
          en: "This is the anomaly scan, and it is the most detailed look at your baby you will get. The NHS offers it \"when you're between 18 and 21 weeks pregnant,\" and it \"usually takes around 30 minutes.\"",
          ar: "هذا هو سونار الكشف عن التشوّهات، وهو أدقّ نظرة ستحصلين عليها على جنينكِ. تقدّمه الهيئة البريطانية «حين تكونين بين الأسبوع الثامن عشر والحادي والعشرين»، و«يستغرق عادةً نحو ثلاثين دقيقة».",
        },
        {
          en: "The baby \"will be checked for signs of 11 different conditions.\" It also checks growth, and \"your placenta and the blood flow in your uterus will also be checked.\"",
          ar: "ويُفحص الجنين «بحثاً عن علامات ١١ حالة مختلفة». كما يتحقّق من النمو، و«يُفحص كذلك موضع المشيمة وتدفّق الدم في الرحم».",
        },
        {
          en: "It is offered, not required: \"It's your choice if you want to have a 20-week scan or not.\" Some parents want everything known in advance and some do not, and both are legitimate.",
          ar: "وهو يُعرض ولا يُفرض: «القرار قراركِ إن كنتِ تريدين إجراء سونار الأسبوع العشرين أم لا». بعض الآباء يريدون معرفة كل شيء مسبقاً وبعضهم لا، وكلا الموقفين مشروع.",
        },
        {
          en: "The scan is long and quiet, and the sonographer will be concentrating rather than chatting. That silence is the job, not bad news.",
          ar: "السونار طويل وهادئ، وسيكون الفنّي مركّزاً لا متحدّثاً. هذا الصمت جزء من العمل، وليس خبراً سيئاً.",
        },
      ],
      cites: ["nhs-20-week-scan"],
      image: {
        src: "/guide/month-5-scan.jpg",
        alt: {
          en: "A single soft white feather on a pale background.",
          ar: "ريشة بيضاء ناعمة على خلفية فاتحة.",
        },
        photographer: "NSU MON",
        photographerUrl: "https://www.pexels.com/@nsu-mon",
        pexelsUrl: "https://www.pexels.com/photo/close-up-of-white-feather-4066847/",
        width: 5184,
        height: 3456,
      },
    },
    {
      heading: { en: "The baby in month 5", ar: "تطور الجنين في الشهر الخامس" },
      body: [
        {
          en: "Between weeks 19 and 21, \"your baby can hear.\" By the end of that period the baby can also swallow.",
          ar: "بين الأسبوعين التاسع عشر والحادي والعشرين «يستطيع جنينكِ السمع». ومع نهاية تلك الفترة يستطيع البلع أيضاً.",
        },
        {
          en: "Hearing is the detail worth telling the father, because it is the first thing he can do that reaches the baby directly. His voice carries. That is not sentiment, it is anatomy.",
          ar: "والسمع هو التفصيل الذي يستحقّ أن تخبري الأب به، لأنه أول شيء يستطيع فعله ويصل إلى الجنين مباشرة. صوته يصل. وهذه ليست عاطفة، بل تشريح.",
        },
      ],
      cites: ["medlineplus-fetal-development"],
    },
  ],
  redFlags: {
    intro: {
      en: "Contact your doctor or maternity unit if any of these happen.",
      ar: "تواصلي مع طبيبكِ أو قسم الولادة إذا حدث أيٌّ ممّا يلي.",
    },
    items: [
      MOVEMENT_FLAG,
      { en: "Vaginal bleeding", ar: "نزيف مهبلي" },
      { en: "Fluid leaking from the vagina", ar: "تسرّب سائل من المهبل" },
      { en: "Regular tightening or period-type pains", ar: "تقلّصات منتظمة أو آلام تشبه الدورة" },
      { en: "A severe headache, blurred vision, or sudden swelling", ar: "صداع شديد، أو تشوّش في الرؤية، أو تورّم مفاجئ" },
      { en: "A high temperature", ar: "ارتفاع في درجة الحرارة" },
    ],
    cites: ["nhs-movements"],
  },
  faqs: [
    {
      q: { en: "Will the scan tell me the baby's sex?", ar: "هل يخبرني السونار بجنس الجنين؟" },
      a: {
        en: "Often yes, if you ask and if the baby is positioned to allow it. But that is not what the scan is for, and policies differ between clinics and countries. Ask in advance rather than on the day.",
        ar: "غالباً نعم، إذا سألتِ وإذا سمحت وضعية الجنين. لكن هذا ليس الغرض من السونار، والسياسات تختلف بين العيادات والدول. اسألي مسبقاً لا يوم الموعد.",
      },
    },
    {
      q: { en: "The sonographer went quiet. Is something wrong?", ar: "صمت الفنّي أثناء السونار. هل هناك مشكلة؟" },
      a: {
        en: "Almost always no. Measuring eleven conditions takes concentration, and talking through it is not part of the task. If something needs a second look, you will be told.",
        ar: "في الغالب لا. فحص إحدى عشرة حالة يتطلّب تركيزاً، والحديث أثناءه ليس جزءاً من المهمة. وإذا احتاج شيء إلى نظرة ثانية فسيُقال لكِ.",
      },
      cites: ["nhs-20-week-scan"],
    },
    {
      q: { en: "I still have not felt movement. Should I worry?", ar: "لم أشعر بالحركة بعد. هل أقلق؟" },
      a: {
        en: "The normal window runs to 24 weeks, and first pregnancies are usually later. Mention it at your next appointment so it is on record, but on its own at week 18 it is not a warning sign.",
        ar: "الفترة الطبيعية تمتدّ حتى الأسبوع الرابع والعشرين، والحمل الأول يكون متأخراً عادةً. اذكري ذلك في موعدكِ التالي ليُسجَّل، لكنه وحده في الأسبوع الثامن عشر ليس علامة تحذير.",
      },
      cites: ["nhs-movements"],
    },
  ],
  cta: {
    headline: { en: "He can talk to the baby now, and be heard", ar: "يستطيع أن يكلّم الجنين الآن، وأن يُسمَع" },
    body: {
      en: "Nawah shows the father the same week you are living and tells him what he can actually do in it. When you log a kick, an alert reaches his phone. Arabic and English, free.",
      ar: "تُظهر نواة للأب الأسبوع نفسه الذي تعيشينه وتخبره بما يستطيع فعله فيه. وحين تسجّلين ركلة، يصله تنبيه على هاتفه. بالعربية والإنجليزية، مجاناً.",
    },
    button: { en: "Get Nawah on Google Play", ar: "حمّلي نواة من جوجل بلاي" },
  },
  citations: [CITE_20WEEK, CITE_FETAL, CITE_MOVEMENTS],
  updated: "2026-08-21",
};

const month6: GuideMonth = {
  month: 6,
  weeks: [21, 24],
  trimester: 2,
  hero: {
    src: "/guide/month-6-hero.jpg",
    alt: {
      en: "A glass of water with lemon and mint in bright daylight.",
      ar: "كوب ماء بالليمون والنعناع في ضوء نهار ساطع.",
    },
    photographer: "Kaboompics",
    photographerUrl: "https://www.pexels.com/@karola-g",
    pexelsUrl: "https://www.pexels.com/photo/glass-of-cold-beverage-on-white-background-4021976/",
    width: 3648,
    height: 5472,
  },
  published: true,
  title: {
    en: "Month 6 of pregnancy: weeks 21 to 24",
    ar: "الشهر السادس من الحمل: الأسابيع ٢١ إلى ٢٤",
  },
  metaTitle: {
    en: "Month 6 of Pregnancy (Weeks 21-24): Movement and the Glucose Test | Nawah",
    ar: "الشهر السادس من الحمل (الأسبوع ٢١–٢٤): الحركة وتحليل السكر | نواة",
  },
  description: {
    en: "Weeks 21 to 24: the baby's movements settle into a pattern, and the gestational diabetes test approaches. What the test involves and who is offered it.",
    ar: "من الأسبوع ٢١ إلى ٢٤: تنتظم حركة الجنين في نمط، ويقترب موعد تحليل سكر الحمل. ما هو التحليل ولمن يُقدَّم.",
  },
  standfirst: {
    en: "This is the month the baby stops being a set of measurements and becomes someone with habits. Movements settle into a pattern, and that pattern becomes the most useful thing you own.",
    ar: "هذا هو الشهر الذي يتوقف فيه الجنين عن كونه مجموعة قياسات ويصبح شخصاً له عاداته. تنتظم حركته في نمط، ويصبح ذلك النمط أنفع ما تملكينه.",
  },
  sections: [
    {
      heading: { en: "Symptoms in month 6 of pregnancy", ar: "أعراض الحمل في الشهر السادس" },
      body: [
        { en: "What most women notice now:", ar: "ما تلاحظه معظم النساء الآن:" },
      ],
      bullets: [
        { en: "Strong, regular movement", ar: "حركة قوية ومنتظمة" },
        { en: "Backache and aching hips", ar: "ألم في الظهر والوركين" },
        { en: "Stretch marks appearing on the belly or breasts", ar: "ظهور علامات تمدّد على البطن أو الثديين" },
        { en: "Swollen ankles by evening", ar: "تورّم الكاحلين مع المساء" },
        { en: "Heartburn that worsens lying down", ar: "حرقة معدة تزداد عند الاستلقاء" },
        { en: "Occasional painless tightening of the bump", ar: "تقلّص عرضي غير مؤلم في البطن" },
        { en: "Itchy skin as the belly stretches", ar: "حكّة في الجلد مع تمدّد البطن" },
      ],
      afterBullets: [
        {
          en: "Occasional painless tightening is usually practice contractions. Tightening that becomes regular, painful, or comes with pressure is different, and is in the list below.",
          ar: "التقلّص العرضي غير المؤلم هو غالباً تقلّصات تدريبية. أما التقلّص الذي يصبح منتظماً أو مؤلماً أو مصحوباً بضغط فأمر مختلف، وهو في القائمة أدناه.",
        },
      ],
    },
    {
      heading: { en: "The gestational diabetes test", ar: "تحليل سكر الحمل" },
      body: [
        {
          en: "Gestational diabetes is \"high blood sugar (glucose) that develops during pregnancy and usually disappears after giving birth.\" It often has no symptoms at all, which is why it is screened for rather than waited for.",
          ar: "سكري الحمل هو «ارتفاع في سكر الدم يظهر أثناء الحمل ويزول عادةً بعد الولادة». وكثيراً ما لا تظهر له أعراض إطلاقاً، ولهذا يُفحص عنه بدل انتظاره.",
        },
        {
          en: "The test is an oral glucose tolerance test, and \"the OGTT is done when you're between 24 and 28 weeks pregnant.\" It takes about two hours, most of which is waiting.",
          ar: "الفحص هو اختبار تحمّل الجلوكوز الفموي، و«يُجرى حين تكونين بين الأسبوع الرابع والعشرين والثامن والعشرين». ويستغرق نحو ساعتين، معظمها انتظار.",
        },
        {
          en: "Screening is offered to women with certain risk factors, and one of them matters here: the NHS lists being of \"South Asian, Black, African-Caribbean or Middle Eastern origin\" among them, alongside a BMI above 30, being over 40, a previous baby weighing 4.5kg or more, previous gestational diabetes, and a family history of diabetes.",
          ar: "يُعرض الفحص على من لديهنّ عوامل خطر معيّنة، وأحدها يهمّنا هنا: تذكر الهيئة البريطانية أن الأصل «الجنوب آسيوي أو الأسود أو الأفريقي الكاريبي أو الشرق أوسطي» من بين هذه العوامل، إلى جانب مؤشر كتلة جسم فوق ٣٠، والعمر فوق ٤٠، وولادة سابقة لطفل وزنه ٤٫٥ كجم أو أكثر، وإصابة سابقة بسكري الحمل، ووجود تاريخ عائلي للسكري.",
        },
        {
          en: "If you are reading this from Egypt or the Gulf, that last point means the test is more likely to be offered to you than not. It is worth asking about rather than waiting to be told.",
          ar: "وإن كنتِ تقرئين هذا من مصر أو الخليج، فهذه النقطة الأخيرة تعني أن احتمال عرض الفحص عليكِ أكبر. ويستحقّ أن تسألي عنه بدل انتظار أن يُقال لكِ.",
        },
      ],
      cites: ["nhs-gestational-diabetes"],
    },
    {
      heading: { en: "Your baby's pattern of movement", ar: "نمط حركة جنينكِ" },
      body: [
        {
          en: "There is a widespread belief that you should count ten kicks a day. The NHS is direct about this: \"You do not need to count the number of kicks or movements you feel each day.\"",
          ar: "يشيع اعتقاد بأن عليكِ عدّ عشر ركلات يومياً. والهيئة البريطانية صريحة في هذا: «لستِ بحاجة إلى عدّ الركلات أو الحركات التي تشعرين بها كل يوم».",
        },
        {
          en: "What replaces it: \"The important thing is to get to know your baby's usual pattern of movements from day to day.\" And plainly, \"There's no set number of movements you should feel each day, every baby is different.\"",
          ar: "وما يحلّ محلّه: «المهم أن تتعرّفي على النمط المعتاد لحركة جنينكِ من يوم إلى يوم». وبوضوح: «لا يوجد عدد محدّد من الحركات يجب أن تشعري به يومياً، فكل جنين مختلف».",
        },
        {
          en: "So the thing to learn this month is your own baby, not a number. When he is usually active, what usually wakes him, what quiet looks like for him. That knowledge is what makes a change detectable.",
          ar: "إذن ما تتعلّمينه هذا الشهر هو جنينكِ أنتِ، لا رقماً. متى ينشط عادةً، وما الذي يوقظه، وكيف يكون هدوؤه المعتاد. هذه المعرفة هي ما يجعل أي تغيّر قابلاً للملاحظة.",
        },
      ],
      cites: ["nhs-movements"],
    },
  ],
  redFlags: {
    intro: {
      en: "Contact your maternity unit if any of these happen. The first one is the most time-critical thing in this whole guide.",
      ar: "تواصلي مع قسم الولادة إذا حدث أيٌّ ممّا يلي. والبند الأول هو الأكثر إلحاحاً في هذا الدليل كله.",
    },
    items: [
      MOVEMENT_FLAG,
      { en: "Regular tightening, or period-type pains", ar: "تقلّصات منتظمة، أو آلام تشبه الدورة" },
      { en: "Vaginal bleeding", ar: "نزيف مهبلي" },
      { en: "A gush or trickle of fluid from the vagina", ar: "اندفاع أو تسرّب سائل من المهبل" },
      { en: "A severe headache, blurred vision, or sudden swelling of face or hands", ar: "صداع شديد، أو تشوّش رؤية، أو تورّم مفاجئ في الوجه أو اليدين" },
      { en: "Severe itching, particularly of the hands and feet", ar: "حكّة شديدة، خاصةً في اليدين والقدمين" },
    ],
    cites: ["nhs-movements"],
  },
  faqs: [
    {
      q: { en: "Do I have to count ten kicks a day?", ar: "هل يجب أن أعدّ عشر ركلات يومياً؟" },
      a: {
        en: "No. The NHS says you do not need to count at all, and that there is no set number. Knowing your baby's usual pattern is what matters, because a change from it is the signal.",
        ar: "لا. تقول الهيئة البريطانية إنكِ لستِ بحاجة إلى العدّ إطلاقاً، وإنه لا يوجد عدد محدّد. المهم معرفة النمط المعتاد لجنينكِ، لأن تغيّره هو الإشارة.",
      },
      cites: ["nhs-movements"],
    },
    {
      q: { en: "Will I be offered the glucose test?", ar: "هل سيُعرض عليّ تحليل السكر؟" },
      a: {
        en: "If you have any of the listed risk factors, yes, and Middle Eastern origin is one of them. The test is done between 24 and 28 weeks. If nobody has mentioned it by week 24, ask.",
        ar: "إذا كان لديكِ أيٌّ من عوامل الخطر المذكورة فنعم، والأصل الشرق أوسطي أحدها. ويُجرى الفحص بين الأسبوع الرابع والعشرين والثامن والعشرين. وإذا لم يذكره أحد حتى الأسبوع الرابع والعشرين، فاسألي.",
      },
      cites: ["nhs-gestational-diabetes"],
    },
    {
      q: { en: "Does gestational diabetes go away?", ar: "هل يزول سكري الحمل؟" },
      a: {
        en: "It \"usually disappears after giving birth.\" It still needs managing during the pregnancy, and having had it once affects screening in a future pregnancy.",
        ar: "إنه «يزول عادةً بعد الولادة». لكنه يحتاج إلى متابعة أثناء الحمل، والإصابة به مرة تؤثر على الفحص في حمل لاحق.",
      },
      cites: ["nhs-gestational-diabetes"],
    },
  ],
  cta: {
    headline: { en: "A pattern you can see beats a number you have to remember", ar: "نمط تَرينه أفضل من رقم تحفظينه" },
    body: {
      en: "Nawah's kick counter records sessions by week, so your baby's usual rhythm becomes something visible rather than something you are trying to hold in your head. And the father gets an alert when you log one. Arabic and English, free.",
      ar: "يسجّل عدّاد الركلات في نواة الجلسات أسبوعاً بأسبوع، فيصبح إيقاع جنينكِ المعتاد شيئاً تَرينه بدل شيء تحاولين تذكّره. ويصل الأب تنبيه حين تسجّلين ركلة. بالعربية والإنجليزية، مجاناً.",
    },
    button: { en: "Get Nawah on Google Play", ar: "حمّلي نواة من جوجل بلاي" },
  },
  citations: [CITE_MOVEMENTS, CITE_GD, CITE_FETAL],
  updated: "2026-08-21",
};

const month7: GuideMonth = {
  month: 7,
  weeks: [25, 28],
  trimester: 3,
  hero: {
    src: "/guide/month-7-hero.jpg",
    alt: {
      en: "An open notebook and pen beside a mug on a wooden table.",
      ar: "دفتر مفتوح وقلم بجانب فنجان على طاولة خشبية.",
    },
    photographer: "Angela Roma",
    photographerUrl: "https://www.pexels.com/@angela-roma",
    pexelsUrl: "https://www.pexels.com/photo/table-with-stationery-in-workspace-7319188/",
    width: 4000,
    height: 6000,
  },
  published: true,
  title: {
    en: "Month 7 of pregnancy: weeks 25 to 28",
    ar: "الشهر السابع من الحمل: الأسابيع ٢٥ إلى ٢٨",
  },
  metaTitle: {
    en: "Month 7 of Pregnancy (Weeks 25-28): The Third Trimester Begins | Nawah",
    ar: "الشهر السابع من الحمل (الأسبوع ٢٥–٢٨): بداية الثلث الثالث | نواة",
  },
  description: {
    en: "Weeks 25 to 28: the third trimester begins. The baby's eyes open, movements matter more than ever, and sleep gets harder.",
    ar: "من الأسبوع ٢٥ إلى ٢٨: يبدأ الثلث الثالث. تنفتح عينا الجنين، وتصبح حركته أهم من أي وقت، ويصعب النوم.",
  },
  standfirst: {
    en: "The last third begins. From here the pregnancy is less about milestones and more about watching, and the thing you are watching is movement.",
    ar: "يبدأ الثلث الأخير. ومن هنا يصبح الحمل أقلّ تعلّقاً بالمحطات وأكثر تعلّقاً بالمراقبة، وما تراقبينه هو الحركة.",
  },
  sections: [
    {
      heading: { en: "Symptoms in month 7 of pregnancy", ar: "أعراض الحمل في الشهر السابع" },
      body: [{ en: "What tends to arrive or intensify now:", ar: "ما يظهر أو يشتدّ الآن عادةً:" }],
      bullets: [
        { en: "Sleep becoming genuinely difficult", ar: "صعوبة حقيقية في النوم" },
        { en: "Heartburn, often worse at night", ar: "حرقة معدة، غالباً أسوأ ليلاً" },
        { en: "Backache and pelvic pressure", ar: "ألم في الظهر وضغط في الحوض" },
        { en: "Shortness of breath climbing stairs", ar: "ضيق نفس عند صعود الدرج" },
        { en: "Swelling in the hands, feet and ankles", ar: "تورّم في اليدين والقدمين والكاحلين" },
        { en: "Practice contractions, painless and irregular", ar: "تقلّصات تدريبية، غير مؤلمة وغير منتظمة" },
        { en: "Leaking colostrum from the breasts", ar: "تسرّب اللبأ من الثديين" },
        { en: "Restless legs at night", ar: "تململ الساقين ليلاً" },
      ],
    },
    {
      heading: { en: "The baby in month 7", ar: "تطور الجنين في الشهر السابع" },
      body: [
        {
          en: "By week 26 \"all parts of your baby's eyes are developed,\" and between weeks 27 and 30 \"your baby's eyelids can open and close.\" They have been closed since around week 14.",
          ar: "مع الأسبوع السادس والعشرين «تكون جميع أجزاء عيني الجنين قد تكوّنت»، وبين الأسبوعين السابع والعشرين والثلاثين «يستطيع الجنين فتح جفنيه وإغلاقهما». وكانا مغلقين منذ الأسبوع الرابع عشر تقريباً.",
        },
        {
          en: "The lungs are the organ still under construction. The respiratory system, though immature, now produces surfactant, the substance that lets the lungs inflate. That is the single most important thing happening in the next three months.",
          ar: "الرئتان هما العضو الذي ما زال قيد البناء. فالجهاز التنفسي، رغم عدم اكتماله، بدأ ينتج المادة الفاعلة بالسطح التي تسمح للرئتين بالانتفاخ. وهذا أهم ما يحدث في الأشهر الثلاثة القادمة.",
        },
      ],
      cites: ["medlineplus-fetal-development"],
      image: {
        src: "/guide/month-7-count.jpg",
        alt: {
          en: "Hands resting calmly on a knee.",
          ar: "يدان تستقرّان بهدوء على الركبة.",
        },
        photographer: "Mikhail Nilov",
        photographerUrl: "https://www.pexels.com/@mikhail-nilov",
        pexelsUrl: "https://www.pexels.com/photo/woman-sitting-with-crossed-arms-on-her-knees-8307809/",
        width: 4000,
        height: 6000,
      },
    },
    {
      heading: { en: "Movement, and when to call", ar: "الحركة ومتى تتصلين" },
      body: [
        {
          en: "By now you know your baby's rhythm. That knowledge is the point of it, because from here a change in the pattern is the thing that gets acted on.",
          ar: "أصبحتِ الآن تعرفين إيقاع جنينكِ. وهذه المعرفة هي المقصودة، لأن تغيّر النمط من هنا فصاعداً هو ما يُتصرَّف بناءً عليه.",
        },
        {
          en: "The NHS instruction is unambiguous. Call your midwife or maternity unit immediately if your baby is moving less than usual, if you cannot feel movement any more, or if there is a change to the usual pattern.",
          ar: "وتعليمات الهيئة البريطانية لا لبس فيها: اتصلي بالقابلة أو قسم الولادة فوراً إذا كانت حركة جنينكِ أقلّ من المعتاد، أو لم تعودي تشعرين بها، أو تغيّر نمطها المعتاد.",
        },
        {
          en: "Immediately means immediately. Not in the morning, not after a cold drink, not after lying down to see whether it improves. Maternity units expect these calls and would far rather receive one that turns out to be nothing.",
          ar: "وفوراً تعني فوراً. لا في الصباح، ولا بعد شرب شيء بارد، ولا بعد الاستلقاء لترَي إن كانت ستتحسّن. أقسام الولادة تتوقّع هذه الاتصالات، وتفضّل كثيراً أن تتلقّى اتصالاً يتبيّن أنه لا شيء.",
        },
      ],
      cites: ["nhs-movements"],
    },
  ],
  redFlags: {
    intro: {
      en: "Call your maternity unit if any of these happen, at any hour.",
      ar: "اتصلي بقسم الولادة إذا حدث أيٌّ ممّا يلي، في أي ساعة.",
    },
    items: [
      MOVEMENT_FLAG,
      { en: "Regular contractions before 37 weeks", ar: "تقلّصات منتظمة قبل الأسبوع ٣٧" },
      { en: "A gush or trickle of fluid from the vagina", ar: "اندفاع أو تسرّب سائل من المهبل" },
      { en: "Vaginal bleeding", ar: "نزيف مهبلي" },
      { en: "A severe headache, blurred vision, or sudden swelling", ar: "صداع شديد، أو تشوّش رؤية، أو تورّم مفاجئ" },
      { en: "Severe itching, particularly of the hands and feet", ar: "حكّة شديدة، خاصةً في اليدين والقدمين" },
    ],
    cites: ["nhs-movements"],
  },
  faqs: [
    {
      q: { en: "Do babies move less as they run out of room?", ar: "هل تقلّ حركة الجنين مع ضيق المساحة؟" },
      a: {
        en: "No, and this belief is dangerous. The character of movement changes, from kicks to rolls and pushes, but the amount should not decrease. Reduced movement is always a reason to call, at any stage.",
        ar: "لا، وهذا الاعتقاد خطير. تتغيّر طبيعة الحركة من ركلات إلى تقلّبات ودفعات، لكن مقدارها لا ينبغي أن يقلّ. وقلّة الحركة سبب للاتصال دائماً، في أي مرحلة.",
      },
      cites: ["nhs-movements"],
    },
    {
      q: { en: "What are these painless tightenings?", ar: "ما هذه التقلّصات غير المؤلمة؟" },
      a: {
        en: "Usually practice contractions. They are irregular, do not get closer together, and ease if you change position. Contractions that become regular, get stronger, or come every five minutes are a different thing, especially before 37 weeks.",
        ar: "هي غالباً تقلّصات تدريبية. غير منتظمة، ولا تتقارب، وتخفّ إذا غيّرتِ وضعيتكِ. أما التقلّصات التي تصبح منتظمة أو تقوى أو تأتي كل خمس دقائق فأمر مختلف، خاصةً قبل الأسبوع ٣٧.",
      },
    },
    {
      q: { en: "I cannot sleep. Does that harm the baby?", ar: "لا أستطيع النوم. هل يضرّ هذا الجنين؟" },
      a: {
        en: "Poor sleep in the third trimester is close to universal and does not harm the baby. It does make everything else harder, so it is worth raising with your doctor rather than treating as something to endure quietly.",
        ar: "سوء النوم في الثلث الثالث يكاد يكون عاماً، ولا يضرّ الجنين. لكنه يجعل كل شيء آخر أصعب، لذا يستحقّ أن تذكريه لطبيبكِ بدل اعتباره أمراً يُحتمل بصمت.",
      },
    },
  ],
  cta: {
    headline: { en: "Reduced movement is a call you make at 3 a.m.", ar: "قلّة الحركة اتصال تجرينه في الثالثة فجراً" },
    body: {
      en: "Nawah's kick counter shows your baby's usual rhythm week by week, so a change is something you can see rather than something you are second-guessing. The father gets the alert too, so you are not the only one watching. Arabic and English, free.",
      ar: "يُظهر عدّاد الركلات في نواة إيقاع جنينكِ المعتاد أسبوعاً بأسبوع، فيصبح أي تغيّر شيئاً ترينه بدل شيء تشكّكين فيه. ويصل التنبيه إلى الأب أيضاً، فلا تكونين وحدكِ من يراقب. بالعربية والإنجليزية، مجاناً.",
    },
    button: { en: "Get Nawah on Google Play", ar: "حمّلي نواة من جوجل بلاي" },
  },
  citations: [CITE_FETAL, CITE_MOVEMENTS],
  updated: "2026-08-21",
};

const month8: GuideMonth = {
  month: 8,
  weeks: [29, 32],
  trimester: 3,
  hero: {
    src: "/guide/month-8-hero.jpg",
    alt: {
      en: "Someone folding small baby clothes in soft neutral colours.",
      ar: "شخص يطوي ملابس أطفال صغيرة بألوان هادئة.",
    },
    photographer: "Sarah Chai",
    photographerUrl: "https://www.pexels.com/@sarah-chai",
    pexelsUrl: "https://www.pexels.com/photo/unrecognizable-woman-arranging-baby-clothes-at-table-7282431/",
    width: 6000,
    height: 4000,
  },
  published: true,
  title: {
    en: "Month 8 of pregnancy: weeks 29 to 32",
    ar: "الشهر الثامن من الحمل: الأسابيع ٢٩ إلى ٣٢",
  },
  metaTitle: {
    en: "Month 8 of Pregnancy (Weeks 29-32): Signs of Premature Labour | Nawah",
    ar: "الشهر الثامن من الحمل (الأسبوع ٢٩–٣٢): علامات الولادة المبكرة | نواة",
  },
  description: {
    en: "Weeks 29 to 32: the baby is putting on weight and practising breathing. The signs of premature labour, and what to have ready.",
    ar: "من الأسبوع ٢٩ إلى ٣٢: يزداد وزن الجنين ويتدرّب على التنفّس. علامات الولادة المبكرة، وما ينبغي تجهيزه.",
  },
  standfirst: {
    en: "The baby is mostly growing now rather than forming. Your job this month is to know what early labour looks like, so that if it happens you recognise it instead of talking yourself out of it.",
    ar: "الجنين الآن ينمو أكثر ممّا يتكوّن. ومهمّتكِ هذا الشهر أن تعرفي كيف تبدو الولادة المبكرة، فإن حدثت تتعرّفي عليها بدل أن تقنعي نفسكِ بأنها لا شيء.",
  },
  sections: [
    {
      heading: { en: "Symptoms in month 8 of pregnancy", ar: "أعراض الحمل في الشهر الثامن" },
      body: [{ en: "What most women are dealing with now:", ar: "ما تتعامل معه معظم النساء الآن:" }],
      bullets: [
        { en: "Practice contractions becoming more noticeable", ar: "تقلّصات تدريبية أكثر وضوحاً" },
        { en: "Breathlessness as the bump presses upward", ar: "ضيق نفس مع ضغط البطن إلى أعلى" },
        { en: "Heartburn that resists everything", ar: "حرقة معدة لا ينفع معها شيء" },
        { en: "Pelvic and hip pain, especially turning in bed", ar: "ألم في الحوض والوركين، خاصةً عند التقلّب في السرير" },
        { en: "Needing the bathroom constantly again", ar: "الحاجة المتكررة للحمّام من جديد" },
        { en: "Swelling that is worse by evening", ar: "تورّم يزداد مع المساء" },
        { en: "Difficulty sleeping in any position", ar: "صعوبة النوم في أي وضعية" },
      ],
    },
    {
      heading: { en: "Signs of premature labour", ar: "علامات الولادة المبكرة" },
      body: [
        {
          en: "The NHS definition is simple: \"Premature labour is labour that happens before the 37th week of pregnancy.\" You are inside that window for the whole of this month and the next.",
          ar: "تعريف الهيئة البريطانية بسيط: «الولادة المبكرة هي التي تحدث قبل الأسبوع السابع والثلاثين». وأنتِ داخل هذه الفترة طوال هذا الشهر والذي يليه.",
        },
        {
          en: "Call your midwife or maternity unit if you are less than 37 weeks and have regular contractions or tightenings, period-type pains, a gush or trickle of fluid from the vagina, or backache that is not usual for you.",
          ar: "اتصلي بالقابلة أو قسم الولادة إذا كنتِ قبل الأسبوع السابع والثلاثين وشعرتِ بتقلّصات أو تشنّجات منتظمة، أو آلام تشبه الدورة، أو اندفاع أو تسرّب سائل من المهبل، أو ألم ظهر غير معتاد بالنسبة لكِ.",
        },
        {
          en: "The NHS adds a line worth taking literally: \"You can also call your midwife or maternity unit if you're unsure or worried about anything.\" Uncertainty is a sufficient reason. You do not need to earn the call.",
          ar: "وتضيف الهيئة عبارة تستحقّ أن تُؤخذ حرفياً: «يمكنكِ أيضاً الاتصال بالقابلة أو قسم الولادة إن كنتِ غير متأكدة أو قلقة من أي شيء». عدم اليقين سبب كافٍ. ولستِ مضطرة لأن تستحقّي الاتصال.",
        },
      ],
      cites: ["nhs-premature-labour"],
    },
    {
      heading: { en: "The baby in month 8", ar: "تطور الجنين في الشهر الثامن" },
      body: [
        {
          en: "Between weeks 31 and 34, \"rhythmic breathing occurs, but baby's lungs are not fully mature.\" The baby is practising a movement it will not use for real until birth.",
          ar: "بين الأسبوعين الحادي والثلاثين والرابع والثلاثين «يحدث تنفّس إيقاعي، لكن رئتي الجنين لم تنضجا تماماً». فهو يتدرّب على حركة لن يستخدمها فعلياً حتى الولادة.",
        },
        {
          en: "Most of what happens now is weight. That is also why the last weeks matter so much, and why a baby born now would usually need help breathing that a baby born at term would not.",
          ar: "ومعظم ما يحدث الآن هو زيادة الوزن. ولهذا أيضاً تكون الأسابيع الأخيرة بهذه الأهمية، ولهذا يحتاج المولود الآن عادةً إلى مساعدة على التنفّس لا يحتاجها المولود في موعده.",
        },
      ],
      cites: ["medlineplus-fetal-development"],
    },
  ],
  redFlags: {
    intro: {
      en: "Call your maternity unit if any of these happen. Before 37 weeks, do not wait to see whether it settles.",
      ar: "اتصلي بقسم الولادة إذا حدث أيٌّ ممّا يلي. وقبل الأسبوع ٣٧، لا تنتظري لترَي إن كان سيهدأ.",
    },
    items: [
      MOVEMENT_FLAG,
      { en: "Regular contractions or tightenings", ar: "تقلّصات أو تشنّجات منتظمة" },
      { en: "Period-type pains", ar: "آلام تشبه الدورة" },
      { en: "A gush or trickle of fluid from the vagina", ar: "اندفاع أو تسرّب سائل من المهبل" },
      { en: "Backache that is not usual for you", ar: "ألم ظهر غير معتاد بالنسبة لكِ" },
      { en: "Vaginal bleeding", ar: "نزيف مهبلي" },
      { en: "A severe headache, blurred vision, or sudden swelling", ar: "صداع شديد، أو تشوّش رؤية، أو تورّم مفاجئ" },
    ],
    cites: ["nhs-premature-labour", "nhs-movements"],
  },
  faqs: [
    {
      q: { en: "How do I tell practice contractions from real ones?", ar: "كيف أفرّق بين التقلّصات التدريبية والحقيقية؟" },
      a: {
        en: "Practice contractions are irregular, do not get closer together or stronger, and often ease if you move or change position. Real ones become longer, stronger and more frequent. Before 37 weeks, anything regular is worth a call rather than an experiment.",
        ar: "التقلّصات التدريبية غير منتظمة، ولا تتقارب ولا تقوى، وتخفّ غالباً إذا تحرّكتِ أو غيّرتِ وضعيتكِ. أما الحقيقية فتصبح أطول وأقوى وأكثر تكراراً. وقبل الأسبوع ٣٧، أي شيء منتظم يستحقّ اتصالاً لا تجربة.",
      },
      cites: ["nhs-premature-labour"],
    },
    {
      q: { en: "When should the hospital bag be ready?", ar: "متى تكون حقيبة المستشفى جاهزة؟" },
      a: {
        en: "This month. Not because labour is likely now, but because a bag packed calmly at week 30 is a better bag than one packed in a hurry at week 34, and because it removes one decision from a day that will have enough of them.",
        ar: "هذا الشهر. لا لأن الولادة مرجّحة الآن، بل لأن حقيبة تُجهَّز بهدوء في الأسبوع الثلاثين أفضل من حقيبة تُجهَّز على عجل في الأسبوع الرابع والثلاثين، ولأنها تُسقط قراراً واحداً من يوم سيكون مليئاً بالقرارات.",
      },
    },
    {
      q: { en: "The baby feels like it is always in my ribs.", ar: "أشعر أن الجنين دائماً في أضلاعي." },
      a: {
        en: "Common at this stage and usually just position. It often changes as the baby moves head-down later. Mention it at your next appointment, but on its own it is not a warning sign.",
        ar: "شائع في هذه المرحلة، وسببه غالباً وضعية الجنين. ويتغيّر عادةً حين ينقلب رأسه إلى أسفل لاحقاً. اذكريه في موعدكِ التالي، لكنه وحده ليس علامة تحذير.",
      },
    },
  ],
  cta: {
    headline: { en: "Pack it once, calmly, with him", ar: "جهّزيها مرة واحدة، بهدوء، معه" },
    body: {
      en: "Nawah's hospital bag list splits three ways: yours, the baby's, and his, so packing is a shared task instead of one more thing on your list. The contraction timer is there for when the tightenings stop being practice. Arabic and English, free.",
      ar: "قائمة حقيبة المستشفى في نواة مقسّمة ثلاثة أقسام: لكِ، وللطفل، وله، فيصبح التجهيز مهمة مشتركة بدل بند إضافي على قائمتكِ. ومؤقّت التقلّصات جاهز حين تتوقف عن كونها تدريبية. بالعربية والإنجليزية، مجاناً.",
    },
    button: { en: "Get Nawah on Google Play", ar: "حمّلي نواة من جوجل بلاي" },
  },
  citations: [CITE_PRETERM, CITE_FETAL, CITE_MOVEMENTS],
  updated: "2026-08-21",
};

const month9: GuideMonth = {
  month: 9,
  weeks: [33, 40],
  trimester: 3,
  hero: {
    src: "/guide/month-9-hero.jpg",
    alt: {
      en: "A folded towel, unlabelled bottles and a sponge on a white surface.",
      ar: "منشفة مطوية وعبوات بلا علامات وإسفنجة على سطح أبيض.",
    },
    photographer: "Cup of Couple",
    photographerUrl: "https://www.pexels.com/@cup-of-couple",
    pexelsUrl: "https://www.pexels.com/photo/bathroom-accessories-with-sponge-8015811/",
    width: 6000,
    height: 4000,
  },
  published: true,
  title: {
    en: "Month 9 of pregnancy: weeks 33 to 40",
    ar: "الشهر التاسع من الحمل: الأسابيع ٣٣ إلى ٤٠",
  },
  metaTitle: {
    en: "Month 9 of Pregnancy (Weeks 33-40): Signs of Labour | Nawah",
    ar: "الشهر التاسع من الحمل (الأسبوع ٣٣–٤٠): علامات الولادة | نواة",
  },
  description: {
    en: "Weeks 33 to 40. The signs that labour has begun, when to call, when to go in, and what to have ready before any of it starts.",
    ar: "من الأسبوع ٣٣ إلى ٤٠. علامات بدء الولادة، ومتى تتصلين، ومتى تذهبين، وما تجهّزينه قبل أن يبدأ أي شيء.",
  },
  standfirst: {
    en: "The last stretch. This month is mostly waiting, and waiting is easier when you already know exactly what you are waiting for and what you will do when it arrives.",
    ar: "المرحلة الأخيرة. هذا الشهر انتظار في معظمه، والانتظار أسهل حين تعرفين بالضبط ما تنتظرينه وما ستفعلينه حين يأتي.",
  },
  sections: [
    {
      heading: { en: "Symptoms in month 9 of pregnancy", ar: "أعراض الحمل في الشهر التاسع" },
      body: [{ en: "What the last weeks usually bring:", ar: "ما تجلبه الأسابيع الأخيرة عادةً:" }],
      bullets: [
        { en: "The bump dropping lower, easing your breathing", ar: "نزول البطن إلى أسفل، فيخفّ ضيق النفس" },
        { en: "More pressure on the pelvis and bladder", ar: "ضغط أكبر على الحوض والمثانة" },
        { en: "Practice contractions that are frequent and convincing", ar: "تقلّصات تدريبية متكررة ومقنِعة" },
        { en: "Broken sleep almost every night", ar: "نوم متقطّع كل ليلة تقريباً" },
        { en: "Sudden bursts of energy, or of wanting to clean", ar: "نوبات مفاجئة من النشاط أو الرغبة في التنظيف" },
        { en: "Aching pelvis when walking", ar: "ألم في الحوض عند المشي" },
        { en: "Swollen feet and hands", ar: "تورّم القدمين واليدين" },
      ],
    },
    {
      heading: { en: "Signs that labour has begun", ar: "علامات بدء الولادة" },
      body: [
        {
          en: "The NHS lists the signs: contractions or tightenings, a show, backache, an urge to go to the toilet, and your waters breaking.",
          ar: "تذكر الهيئة البريطانية العلامات: تقلّصات أو تشنّجات، ونزول السدادة المخاطية، وألم في الظهر، ورغبة في دخول الحمّام، ونزول ماء الرأس.",
        },
        {
          en: "Contractions: \"When you have a contraction, your womb tightens and then relaxes,\" and they \"tend to become longer, stronger and more frequent as your labour progresses.\" That progression is what separates them from practice.",
          ar: "التقلّصات: «حين يأتيكِ تقلّص، ينقبض الرحم ثم يرتخي»، وهي «تميل إلى أن تصبح أطول وأقوى وأكثر تكراراً مع تقدّم المخاض». وهذا التدرّج هو ما يفرّقها عن التدريبية.",
        },
        {
          en: "The show: \"This sticky, jelly-like pink mucus is called a show.\" It does not mean labour is imminent. \"Labour may quickly follow or may take a few days.\"",
          ar: "السدادة المخاطية: «هذا المخاط الوردي اللزج يُسمّى السدادة». وظهورها لا يعني أن الولادة وشيكة، فـ«قد يتبعها المخاض سريعاً وقد يستغرق أياماً».",
        },
        {
          en: "Waters breaking: \"you may feel a slow trickle or a sudden gush of water you cannot control.\" It is not always the dramatic version.",
          ar: "نزول ماء الرأس: «قد تشعرين بتسرّب بطيء أو باندفاع مفاجئ للماء لا تستطيعين التحكّم فيه». وليس دائماً بالصورة الدرامية.",
        },
      ],
      cites: ["nhs-labour-signs"],
    },
    {
      heading: { en: "When to call and when to go in", ar: "متى تتصلين ومتى تذهبين" },
      body: [
        {
          en: "Call if you think you are in labour, or if you are having regular contractions coming every 5 minutes or more often.",
          ar: "اتصلي إذا شعرتِ أنكِ في مخاض، أو إذا كانت التقلّصات منتظمة وتأتي كل خمس دقائق أو أكثر تكراراً.",
        },
        {
          en: "Call urgently if your waters break, if you have vaginal bleeding, if your baby is moving less than usual, or if you are having 6 or more contractions every 10 minutes.",
          ar: "واتصلي بشكل عاجل إذا نزل ماء الرأس، أو حدث نزيف مهبلي، أو كانت حركة جنينكِ أقلّ من المعتاد، أو جاءتكِ ٦ تقلّصات أو أكثر كل عشر دقائق.",
        },
        {
          en: "Reduced movement remains on that urgent list right up to birth. It never stops being a reason to call, no matter how close you are.",
          ar: "وتبقى قلّة الحركة على قائمة الحالات العاجلة حتى الولادة. فهي لا تتوقف أبداً عن كونها سبباً للاتصال، مهما اقترب الموعد.",
        },
      ],
      cites: ["nhs-labour-signs"],
      image: {
        src: "/guide/month-9-ready.jpg",
        alt: {
          en: "A newborn's feet under a soft knitted blanket.",
          ar: "قدما مولود تحت بطانية محبوكة ناعمة.",
        },
        photographer: "Kaboompics",
        photographerUrl: "https://www.pexels.com/@karola-g",
        pexelsUrl: "https://www.pexels.com/photo/photograph-of-a-baby-s-feet-4964255/",
        width: 5760,
        height: 3840,
      },
    },
    {
      heading: { en: "The baby in month 9", ar: "تطور الجنين في الشهر التاسع" },
      body: [
        {
          en: "Between weeks 35 and 37, \"your baby's heart and blood vessels are complete.\" From 37 weeks the pregnancy is no longer considered premature.",
          ar: "بين الأسبوعين الخامس والثلاثين والسابع والثلاثين «يكتمل قلب الجنين وأوعيته الدموية». ومن الأسبوع السابع والثلاثين لم يعد الحمل يُعدّ مبكراً.",
        },
        {
          en: "A detail that puts the whole count in perspective: \"In your 40th week of pregnancy, it has been 38 weeks since conception.\" The two weeks from month 1 are still there at the end, exactly where they started.",
          ar: "وتفصيل يضع العدّ كله في نصابه: «في أسبوعكِ الأربعين من الحمل، يكون قد مرّ ٣٨ أسبوعاً على الإخصاب». فالأسبوعان اللذان بدأنا بهما في الشهر الأول ما زالا هنا في النهاية، في موضعهما تماماً.",
        },
      ],
      cites: ["medlineplus-fetal-development"],
    },
  ],
  redFlags: {
    intro: {
      en: "Call urgently, at any hour, if any of these happen.",
      ar: "اتصلي بشكل عاجل، في أي ساعة، إذا حدث أيٌّ ممّا يلي.",
    },
    items: [
      MOVEMENT_FLAG,
      { en: "Your waters break", ar: "نزول ماء الرأس" },
      { en: "Vaginal bleeding", ar: "نزيف مهبلي" },
      { en: "6 or more contractions every 10 minutes", ar: "٦ تقلّصات أو أكثر كل عشر دقائق" },
      { en: "Regular contractions every 5 minutes or more often", ar: "تقلّصات منتظمة كل خمس دقائق أو أكثر تكراراً" },
      { en: "A severe headache, blurred vision, or sudden swelling", ar: "صداع شديد، أو تشوّش رؤية، أو تورّم مفاجئ" },
    ],
    cites: ["nhs-labour-signs", "nhs-movements"],
  },
  faqs: [
    {
      q: { en: "My waters broke but there are no contractions. What now?", ar: "نزل ماء الرأس بلا تقلّصات. ماذا أفعل؟" },
      a: {
        en: "Call urgently. Waters breaking is on the urgent list on its own, whether or not contractions have started. Note the time and the colour of the fluid, because you will be asked both.",
        ar: "اتصلي بشكل عاجل. نزول ماء الرأس وحده على قائمة الحالات العاجلة، سواء بدأت التقلّصات أم لا. وسجّلي الوقت ولون السائل، لأنكِ ستُسألين عنهما.",
      },
      cites: ["nhs-labour-signs"],
    },
    {
      q: { en: "I had a show. Is the baby coming today?", ar: "نزلت السدادة المخاطية. هل سيأتي الطفل اليوم؟" },
      a: {
        en: "Not necessarily. Labour \"may quickly follow or may take a few days.\" A show on its own is a sign of progress, not a countdown.",
        ar: "ليس بالضرورة. فالمخاض «قد يتبعها سريعاً وقد يستغرق أياماً». ونزول السدادة وحده علامة تقدّم، لا عدّاً تنازلياً.",
      },
      cites: ["nhs-labour-signs"],
    },
    {
      q: { en: "I am past my due date. Is that a problem?", ar: "تجاوزتُ موعد الولادة. هل هذه مشكلة؟" },
      a: {
        en: "A due date is an estimate, not a deadline, and going past it is common. Your doctor will monitor you more closely from then and will discuss options with you. Keep watching movement exactly as before.",
        ar: "موعد الولادة تقدير لا موعد نهائي، وتجاوزه أمر شائع. سيتابعكِ طبيبكِ عن قرب أكبر من ذلك الحين ويناقش معكِ الخيارات. وواصلي مراقبة الحركة تماماً كما كنتِ.",
      },
    },
    {
      q: { en: "How will I know it is real labour?", ar: "كيف أعرف أنه مخاض حقيقي؟" },
      a: {
        en: "Real contractions get longer, stronger and more frequent, and they do not ease when you change position. If they are coming every 5 minutes, call. If you are unsure, call anyway.",
        ar: "التقلّصات الحقيقية تصبح أطول وأقوى وأكثر تكراراً، ولا تخفّ عند تغيير الوضعية. وإذا جاءت كل خمس دقائق فاتصلي. وإذا لم تكوني متأكدة فاتصلي أيضاً.",
      },
      cites: ["nhs-labour-signs"],
    },
  ],
  cta: {
    headline: { en: "Time them properly, so you can say the number", ar: "احسبيها بدقّة، لتستطيعي قول الرقم" },
    body: {
      en: "The first question you will be asked is how far apart they are. Nawah's contraction timer records interval and duration to the second, so you have an answer instead of a guess. The hospital bag list and your emergency contacts are one tap away. Arabic and English, free.",
      ar: "أول سؤال سيُطرح عليكِ هو كم المدة بينها. مؤقّت التقلّصات في نواة يسجّل الفاصل والمدة بالثانية، فتكون لديكِ إجابة لا تخمين. وقائمة حقيبة المستشفى وأرقام الطوارئ على بُعد لمسة واحدة. بالعربية والإنجليزية، مجاناً.",
    },
    button: { en: "Get Nawah on Google Play", ar: "حمّلي نواة من جوجل بلاي" },
  },
  citations: [CITE_LABOUR, CITE_FETAL, CITE_MOVEMENTS],
  updated: "2026-08-21",
};

export const GUIDE_MONTHS: GuideMonth[] = [
  month1,
  month2,
  month3,
  month4,
  month5,
  month6,
  month7,
  month8,
  month9,
];

/** Week spans for all nine months, mirroring the app's nine bands. Used by the
 *  hub so the shape of the series is visible before the rest is written. */
export const MONTH_WEEKS: Record<number, [number, number]> = {
  1: [1, 4],
  2: [5, 8],
  3: [9, 12],
  4: [13, 16],
  5: [17, 20],
  6: [21, 24],
  7: [25, 28],
  8: [29, 32],
  9: [33, 40],
};

export const MONTH_LABEL: Record<number, Localized> = {
  1: { en: "Month 1", ar: "الشهر الأول" },
  2: { en: "Month 2", ar: "الشهر الثاني" },
  3: { en: "Month 3", ar: "الشهر الثالث" },
  4: { en: "Month 4", ar: "الشهر الرابع" },
  5: { en: "Month 5", ar: "الشهر الخامس" },
  6: { en: "Month 6", ar: "الشهر السادس" },
  7: { en: "Month 7", ar: "الشهر السابع" },
  8: { en: "Month 8", ar: "الشهر الثامن" },
  9: { en: "Month 9", ar: "الشهر التاسع" },
};

export function getMonth(month: number): GuideMonth | undefined {
  return GUIDE_MONTHS.find((m) => m.month === month && m.published);
}

export function publishedMonths(): GuideMonth[] {
  return GUIDE_MONTHS.filter((m) => m.published).sort((a, b) => a.month - b.month);
}
