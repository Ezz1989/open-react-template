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
  heading: Localized;
  /** One entry per paragraph, so the renderer owns spacing and never has to
   *  parse markdown or trust raw HTML. */
  body: Localized[];
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
 * ⚠️ There is no clinician on this project. The byline therefore credits the
 * team and points at the sources, and the reviewer line stays empty until a
 * real named clinician reviews the page. Inventing "Reviewed by Dr. X" would
 * be a fabricated credential on health content, which is not a shortcut worth
 * taking at any traffic volume.
 *
 * ⚠️ EN and AR deliberately differ here. The English line still states "Not
 * written or reviewed by a clinician"; the Arabic line does not. That was an
 * owner decision, not an oversight or a missing translation. Anyone syncing
 * the two languages should ask before "fixing" it.
 */
export const BYLINE: { name: Localized; role: Localized } = {
  name: { en: "The Nawah team", ar: "فريق نواة" },
  role: {
    en: "Written from the published guidance cited at the end of each article. Not written or reviewed by a clinician.",
    ar: "مكتوب استناداً إلى الإرشادات المنشورة المذكورة في نهاية كل مقال.",
  },
};

/** Shown under every article. Not collapsible, not fine print. */
export const MEDICAL_DISCLAIMER: Localized = {
  en: "This guide is general information, not medical advice. It does not replace a doctor or a midwife, and it knows nothing about your particular pregnancy. If something feels wrong, contact your care provider instead of waiting for the next scheduled visit.",
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
    en: "The first month of pregnancy contains two weeks in which nobody is pregnant. That is not a trick of language. It follows from how the weeks are counted, and understanding it explains most of the confusion that comes later.",
    ar: "الشهر الأول من الحمل يتضمّن أسبوعين لا يكون فيهما حمل أصلاً. هذه ليست لعبة لفظية، بل نتيجة مباشرة لطريقة حساب الأسابيع، وفهمها يزيل معظم الالتباس الذي يأتي لاحقاً.",
  },

  sections: [
    {
      heading: {
        en: "Why the count starts before conception",
        ar: "لماذا يبدأ العدّ قبل حدوث الحمل",
      },
      body: [
        {
          en: "Gestational age is measured in weeks from the first day of the last menstrual period, not from the day of conception. Conception cannot be dated reliably, because it is invisible and its timing varies. The first day of a period is a date a woman can usually name.",
          ar: "يُحسب عمر الحمل بالأسابيع ابتداءً من اليوم الأول لآخر دورة شهرية، لا من يوم حدوث الحمل. فيوم الإخصاب لا يمكن تحديده بدقة لأنه غير مرئي ويختلف توقيته من امرأة إلى أخرى، أما اليوم الأول للدورة فتاريخ تستطيع المرأة تحديده عادةً.",
        },
        {
          en: "One consequence follows immediately. In weeks 1 and 2, the body is preparing to release an egg and no pregnancy exists yet. Ovulation falls near the end of the second week, so fertilisation happens around week 2 or 3 of a count that began a fortnight earlier.",
          ar: "ويترتب على ذلك أمر مباشر: في الأسبوعين الأول والثاني يكون الجسم في طور التحضير لإطلاق البويضة ولا وجود لحمل بعد. تحدث الإباضة قرب نهاية الأسبوع الثاني، أي أن الإخصاب يقع في حدود الأسبوع الثاني أو الثالث من عدٍّ بدأ قبل ذلك بأسبوعين.",
        },
        {
          en: "This is why a woman who learns she is pregnant is often told she is already four or five weeks along on the day she finds out. The pregnancy did not start four weeks ago. The counting did.",
          ar: "ولهذا تُخبَر المرأة التي تكتشف حملها أنها في الأسبوع الرابع أو الخامس في اليوم نفسه الذي عرفت فيه. لم يبدأ الحمل قبل أربعة أسابيع، بل بدأ العدّ قبل أربعة أسابيع.",
        },
      ],
      cites: ["medlineplus-gestational-age"],
    },
    {
      heading: {
        en: "What actually happens in these four weeks",
        ar: "ما الذي يحدث فعلاً خلال هذه الأسابيع الأربعة",
      },
      body: [
        {
          en: "After fertilisation the cell cluster travels toward the uterus and embeds itself in the lining, which usually happens during the fourth week. Some women notice light spotting when it does. Many notice nothing.",
          ar: "بعد الإخصاب تتّجه الكتلة الخلوية نحو الرحم وتنغرس في بطانته، وهو ما يحدث عادةً خلال الأسبوع الرابع. تلاحظ بعض النساء نزفاً خفيفاً حين يحدث ذلك، ولا تلاحظ كثيرات منهنّ شيئاً.",
        },
        {
          en: "Home pregnancy tests detect a hormone the body only begins producing after implantation, which is why testing too early returns a negative result in a pregnancy that is genuinely there. A missed period is the usual signal to test.",
          ar: "تكشف اختبارات الحمل المنزلية هرموناً لا يبدأ الجسم بإفرازه إلا بعد الانغراس، ولهذا يعطي الاختبار المبكر نتيجة سلبية رغم وجود حمل فعلي. وتأخّر الدورة هو الإشارة المعتادة لإجراء الاختبار.",
        },
        {
          en: "Symptoms in this month are usually absent or easy to mistake for an approaching period. Tiredness, tender breasts and a shifting appetite all belong to both. Feeling nothing at all is common and means nothing is wrong.",
          ar: "الأعراض في هذا الشهر غائبة عادةً أو يسهل الخلط بينها وبين اقتراب الدورة. فالإرهاق وألم الثديين وتغيّر الشهية أعراض مشتركة بين الحالتين. وعدم الشعور بأي عرض أمر شائع ولا يدلّ على وجود خلل.",
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
        en: "Folic acid is the part that cannot wait",
        ar: "حمض الفوليك هو الأمر الذي لا يحتمل التأجيل",
      },
      body: [
        {
          en: "The World Health Organization recommends that all women take 400 micrograms of folic acid daily from the moment they begin trying to conceive until 12 weeks of gestation. Women who have previously had a fetus with a neural tube defect are offered a much higher dose of 5 milligrams daily.",
          ar: "توصي منظمة الصحة العالمية بأن تتناول كل امرأة ٤٠٠ ميكروغرام من حمض الفوليك يومياً منذ لحظة بدء محاولة الحمل وحتى الأسبوع الثاني عشر من الحمل. أما من سبق أن كان لديها جنين مصاب بعيب في الأنبوب العصبي فتُعطى جرعة أعلى بكثير تبلغ ٥ ملّيغرامات يومياً.",
        },
        {
          en: "The timing is the point. The structures that folic acid protects form in the earliest weeks, often before a woman knows she is pregnant at all. That is the reason the recommendation starts before conception rather than at the first appointment.",
          ar: "التوقيت هو جوهر المسألة. فالتراكيب التي يحميها حمض الفوليك تتكوّن في الأسابيع الأولى، وغالباً قبل أن تعرف المرأة أنها حامل. ولهذا تبدأ التوصية قبل حدوث الحمل لا عند أول موعد مع الطبيب.",
        },
        {
          en: "A woman who reads this after her positive test has not missed her chance. The recommendation runs through week 12, and starting late is better than not starting.",
          ar: "ومن تقرأ هذا بعد ظهور نتيجة الاختبار الإيجابية لم تفقد الفرصة. فالتوصية تمتدّ حتى الأسبوع الثاني عشر، والبدء متأخراً أفضل من عدم البدء.",
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
        en: "Booking the first appointment",
        ar: "حجز أول موعد",
      },
      body: [
        {
          en: "ACOG advises beginning prenatal care in the first trimester, ideally before 10 weeks. Booking usually takes longer than expected, so the appointment is worth arranging on the day of a positive test rather than in the week after it.",
          ar: "توصي الكلية الأمريكية لأطباء النساء والولادة ببدء متابعة الحمل في الثلث الأول، ويُفضَّل قبل الأسبوع العاشر. وغالباً ما يستغرق الحجز وقتاً أطول من المتوقع، لذا يُستحسن ترتيب الموعد يوم ظهور النتيجة الإيجابية لا في الأسبوع الذي يليه.",
        },
        {
          en: "The number of visits has changed recently. ACOG's 2025 clinical consensus moved away from the fixed twelve-to-fourteen visit schedule toward a plan tailored to the individual, citing equivalent outcomes with six to ten visits in average-risk pregnancies. A doctor proposing fewer appointments than an older relative remembers is following current guidance.",
          ar: "وقد تغيّر عدد الزيارات مؤخراً. فقد ابتعد التوافق السريري للكلية الأمريكية لعام ٢٠٢٥ عن جدول الاثنتي عشرة إلى الأربع عشرة زيارة الثابت نحو خطة مُفصَّلة على حالة كل امرأة، مستنداً إلى تكافؤ النتائج مع ست إلى عشر زيارات في الحمل متوسط الخطورة. فالطبيب الذي يقترح مواعيد أقلّ ممّا تتذكره قريبة أكبر سنّاً إنما يتّبع الإرشادات الحالية.",
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

export const GUIDE_MONTHS: GuideMonth[] = [month1];

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
