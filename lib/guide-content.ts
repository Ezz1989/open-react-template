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
  title: {
    en: "The pregnancy guide, month by month",
    ar: "دليل الحمل، شهراً بعد شهر",
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

export const GUIDE_MONTHS: GuideMonth[] = [month1, month2, month3];

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
