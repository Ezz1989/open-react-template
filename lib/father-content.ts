import type { Locale } from "./constants";
import type {
  Citation,
  Faq,
  GuideCta,
  GuideImage,
  Localized,
  RedFlags,
  Section,
} from "./guide-content";

/**
 * THE FATHER GUIDE — event-indexed articles for the man, not the month.
 *
 * WHY THIS IS NOT A SECOND SET OF NINE MONTHS
 * -------------------------------------------
 * The obvious build was to mirror `guide-content.ts`: nine father months
 * against the same nine bands the app already branches on
 * (`_fatherAction` in ../../lib/features/shared/weekly_content_screen.dart).
 * It was rejected for the same reason that file gives for not writing forty
 * week-pages. A father month-5 article and a mother month-5 article would
 * restate the same fetal development and the same 20-week scan, in the same
 * language, on the same domain — four-fifths identical text at a different
 * URL, which is the near-duplicate pattern Google's helpful-content guidance
 * demotes. Worse here than there: it would also compete with our own ranking
 * month pages.
 *
 * Fathers also do not arrive on a month query. They arrive on an event —
 * "her waters broke", "when do we leave for the hospital", "what does the
 * 20-week scan show". So the unit is the event, and `slug` replaces `month`.
 *
 * WHAT THIS SERIES IS MEASURED BY
 * -------------------------------
 * Installs by the father, not sessions. The month articles chase head-term
 * traffic; these chase a man who is already worried at 2am and needs one
 * decision made. Every CTA therefore goes out through `fatherPlayUrl`, whose
 * utm_campaign separates this series from `pregnancy_guide` in Play Console.
 *
 * ⚠️ A CTA MAY ONLY NAME SOMETHING A FATHER CAN ACTUALLY DO IN THE APP.
 * This is not a style note. The first draft of the labour article ended on
 * "time her contractions in Nawah", which is false: `contraction_timer_screen`
 * lives under `features/mother_dashboard/` and the only `context.push` to it
 * is `mother_home_screen.dart:861`. A father has no route to that screen. What
 * he does have, verified in the tree: pairing, the father weekly view, and
 * `father_kick_alerts_screen.dart`, which receives the alert her kick counter
 * sends through `NotificationService.sendKickAlert`.
 *
 * LANGUAGE
 * --------
 * Modern Standard Arabic, same as the month guide and for the same reason.
 *
 * One deliberate difference: these articles address a man directly, so the
 * Arabic uses the MASCULINE second person (خُذ، احسب، اتصل). The project's
 * usual rule — no gendered imperative, use the verbal noun — exists because
 * the app's shared screens do not know who is reading. Here we do know. Using
 * a neutral verbal noun on a page titled "the father's guide" would read as
 * evasive rather than careful.
 */

/**
 * Red flags, plus an optional heading override.
 *
 * The month route hardcodes "When to call a doctor now", which is right for
 * every article it serves. It is wrong for at least one here: the paternal
 * mental-health article's urgent list is about the reader himself and about
 * thoughts of self-harm, and filing that under "call a doctor now" both
 * misdescribes it and makes it easy to skip as somebody else's problem.
 *
 * Extended locally rather than by widening `RedFlags` in guide-content.ts,
 * which nine live month articles depend on and which has no use for the field.
 */
export interface FatherRedFlags extends RedFlags {
  heading?: Localized;
}

export interface FatherArticle {
  /**
   * URL segment, and the identity of the article. Replaces `month` from
   * `GuideMonth`: these are not ordered by gestational time, so a number would
   * be a fake index that the prev/next links would then have to pretend to
   * respect.
   */
  slug: string;
  /** Only published articles get a route, a sitemap row or a hub link. */
  published: boolean;

  hero: GuideImage;

  title: Localized;
  metaTitle: Localized;
  description: Localized;
  standfirst: Localized;

  sections: Section[];
  /**
   * OPTIONAL here, unlike on `GuideMonth` where the type forces it.
   *
   * That requirement is right for a month article: every one of them covers a
   * span of pregnancy during which something can go wrong, so forgetting the
   * block would be a real omission. It is wrong for this series, which will
   * include articles — the newborn budget, what to pack — with no emergency
   * symptoms attached. Forcing the field there would produce an empty red box
   * that alarms a reader about nothing.
   */
  redFlags?: FatherRedFlags;
  faqs: Faq[];
  cta: GuideCta;
  citations: Citation[];

  /** ISO date. Rendered as "last reviewed" and fed to Article schema. */
  updated: string;
}

export const FATHER_HUB: {
  title: Localized;
  metaTitle: Localized;
  description: Localized;
  standfirst: Localized;
} = {
  title: {
    en: "The father's guide",
    ar: "دليل الأب",
  },
  metaTitle: {
    en: "The Father's Guide to Pregnancy and Birth | Nawah",
    ar: "دليل الأب في الحمل والولادة | نواة",
  },
  description: {
    en: "Straight answers for the father: when to go to hospital, what the scans show, what the first year costs. In Arabic and English.",
    ar: "إجابات مباشرة للأب: متى تذهبان إلى المستشفى، وماذا يكشف السونار، وكم تكلّف السنة الأولى. بالعربية والإنجليزية.",
  },
  standfirst: {
    en: "Most pregnancy advice written for men is a list of ways to be nicer. These are the parts where you actually have something to do, and a decision to get right.",
    ar: "معظم ما يُكتب للرجال عن الحمل قائمة نصائح عن اللطف. هذه الصفحات تتناول المواضع التي يكون فيها عليك فعل شيء فعلاً، وقرار يجب أن تصيبه.",
  },
};

/* ── Citations. Every URL below was opened this session. ─────────────────── */

const CITE_LABOUR: Citation = {
  id: "nhs-labour-signs",
  org: "NHS",
  title: {
    en: "Signs that labour has begun",
    ar: "علامات بدء المخاض",
  },
  url: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/signs-that-labour-has-begun/",
  retrieved: "2026-08-21",
};

const CITE_STAGES: Citation = {
  id: "nhs-stages-of-labour",
  org: "NHS",
  title: {
    en: "The stages of labour and birth",
    ar: "مراحل المخاض والولادة",
  },
  url: "https://www.nhs.uk/pregnancy/labour-and-birth/what-happens/the-stages-of-labour-and-birth/",
  retrieved: "2026-08-21",
};

const CITE_PRETERM: Citation = {
  id: "nhs-premature-labour",
  org: "NHS",
  title: {
    en: "Premature labour and birth",
    ar: "المخاض المبكر والولادة المبكرة",
  },
  url: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/premature-labour-and-birth/",
  retrieved: "2026-08-21",
};

const CITE_PARTNER: Citation = {
  id: "nhs-birth-partner",
  org: "NHS",
  title: {
    en: "Tips for your birthing partner or partners",
    ar: "نصائح لمرافق الولادة",
  },
  url: "https://www.nhs.uk/best-start-in-life/pregnancy/preparing-for-labour-and-birth/tips-for-your-birthing-partner-or-partners/",
  retrieved: "2026-08-21",
};

const CITE_20WEEK: Citation = {
  id: "nhs-20-week-scan",
  org: "NHS",
  title: { en: "20-week screening scan", ar: "سونار الأسبوع العشرين" },
  url: "https://www.nhs.uk/pregnancy/your-pregnancy-care/20-week-scan/",
  retrieved: "2026-08-22",
};

const CITE_MOVEMENTS: Citation = {
  id: "nhs-movements",
  org: "NHS",
  title: { en: "Your baby's movements", ar: "حركة الجنين" },
  url: "https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/",
  retrieved: "2026-08-22",
};

const CITE_BABYNEEDS: Citation = {
  id: "nhs-what-you-need",
  org: "NHS",
  title: {
    en: "What you'll need for your baby",
    ar: "ما ستحتاجه من أجل طفلك",
  },
  url: "https://www.nhs.uk/baby/caring-for-a-newborn/what-you-will-need-for-your-baby/",
  retrieved: "2026-08-22",
};

const CITE_BAG: Citation = {
  id: "nhs-hospital-bag",
  org: "NHS",
  title: { en: "Hospital bag checklist", ar: "قائمة حقيبة المستشفى" },
  url: "https://www.nhs.uk/best-start-in-life/pregnancy/preparing-for-labour-and-birth/hospital-bag-checklist/",
  retrieved: "2026-08-22",
};

const CITE_PND: Citation = {
  id: "nhs-postnatal-depression",
  org: "NHS",
  title: { en: "Postnatal depression", ar: "اكتئاب ما بعد الولادة" },
  url: "https://www.nhs.uk/mental-health/conditions/post-natal-depression/overview/",
  retrieved: "2026-08-22",
};

/**
 * The one source carrying a prevalence figure for men that we could actually
 * open. Two others were tried and refused: the Israeli Ministry of Health's
 * Arabic page and healthiertogether.nhs.uk both returned 403 to a fetch. The
 * "1 in 10 dads" number circulating in search snippets is therefore NOT used
 * anywhere — this page's wording is, verbatim and attributed.
 */
const CITE_MENTAL: Citation = {
  id: "nhs-your-mental-health",
  org: "NHS",
  title: { en: "Your mental health", ar: "صحتك النفسية" },
  url: "https://www.nhs.uk/best-start-in-life/baby/your-mental-health/",
  retrieved: "2026-08-22",
};

const CITE_MENTAL_PREG: Citation = {
  id: "nhs-mental-health-pregnancy",
  org: "NHS",
  title: { en: "Mental health in pregnancy", ar: "الصحة النفسية أثناء الحمل" },
  url: "https://www.nhs.uk/pregnancy/keeping-well/mental-health/",
  retrieved: "2026-08-22",
};

/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Article 1 — علامات المخاض.
 *
 * First of the series on purpose. It is the moment in the whole pregnancy
 * where the father holds the decision: she is in pain, it is the middle of the
 * night, and someone has to say whether this is the drive or not. Every other
 * father topic can be read early and calmly. This one gets read once, under
 * pressure, and the reader wants a number rather than a paragraph — which is
 * why the timing rule appears as its own section with its own heading instead
 * of being folded into the signs list.
 *
 * ⚠️ NO EMERGENCY PHONE NUMBER APPEARS ANYWHERE ON THIS PAGE. The NHS source
 * says "call 999", which is the UK. Ambulance numbers differ across this
 * audience — and printing the wrong three digits on the one page somebody
 * reads while panicking is the worst available mistake. The text says to call
 * the emergency number in your country, which is true everywhere.
 */
const labourSigns: FatherArticle = {
  slug: "labour-signs",
  published: true,
  hero: {
    src: "/father/labour-signs-hero.jpg",
    alt: {
      en: "A dark curved highway at night with red and white light trails from passing cars.",
      ar: "طريق سريع منحنٍ ليلاً، وخطوط ضوء حمراء وبيضاء من سيارات عابرة.",
    },
    photographer: "Juan Pablo Serrano",
    photographerUrl: "https://www.pexels.com/@juanpphotoandvideo",
    pexelsUrl: "https://www.pexels.com/photo/time-lapse-photography-of-cars-on-road-792815/",
    width: 5015,
    height: 3343,
  },

  title: {
    en: "Signs of labour: when to take her to hospital",
    ar: "علامات المخاض: متى تأخذها إلى المستشفى",
  },
  metaTitle: {
    en: "Signs of Labour and When to Go to Hospital: A Father's Guide | Nawah",
    ar: "علامات المخاض ومتى تذهبان إلى المستشفى: دليل الأب | نواة",
  },
  description: {
    en: "The signs labour has begun, how to time contractions, the point at which you call the hospital, and what changes if it happens before 37 weeks.",
    ar: "علامات بدء المخاض، وكيف تحسب الفترة بين الانقباضات، ومتى تتصلان بالمستشفى، وما الذي يتغيّر إذا حدث ذلك قبل الأسبوع ٣٧.",
  },
  standfirst: {
    en: "One night you will wake up to a single question: is this it, or is it a false alarm? This page answers it with numbers rather than feelings, because at three in the morning that is what is useful.",
    ar: "في ليلة ما ستستيقظ على سؤال واحد: هل هذا هو الوقت، أم إنذار كاذب؟ هذه الصفحة تجيب عليه بأرقام لا بمشاعر، لأن الأرقام هي المفيد في الثالثة فجراً.",
  },

  sections: [
    {
      heading: {
        en: "Signs that labour has begun",
        ar: "علامات بدء المخاض",
      },
      body: [
        {
          en: "Labour rarely announces itself the way films suggest. It usually starts as something ambiguous that builds over hours. The NHS lists five signs, and they do not arrive in a fixed order — she may get two of them, or all five, or the waters may break with nothing else happening at all.",
          ar: "المخاض نادراً ما يبدأ بالطريقة التي تصوّرها الأفلام. غالباً ما يبدأ بشيء غامض يتصاعد عبر ساعات. تذكر هيئة الصحة البريطانية خمس علامات، وهي لا تأتي بترتيب ثابت: قد تظهر عليها علامتان، أو الخمس جميعاً، أو ينزل ماء الرأس دون أن يحدث أي شيء آخر.",
        },
      ],
      bullets: [
        {
          en: "Contractions, or a tightening across the womb. They may feel to her like extreme period pain.",
          ar: "انقباضات، أو تشنّج يشدّ الرحم. قد تصفها بأنها أشبه بألم دورة شهرية شديد.",
        },
        {
          en: "A \"show\" — sticky, jelly-like pink mucus, sometimes with a little blood in it. It may come as one piece or several.",
          ar: "«العلامة» — مخاط وردي لزج يشبه الهلام، وقد يحمل قليلاً من الدم. ينزل دفعة واحدة أو على دفعات.",
        },
        {
          en: "Backache, or a heavy aching feeling low down.",
          ar: "ألم في الظهر، أو شعور بثقل ووجع في أسفل البطن.",
        },
        {
          en: "An urge to go to the toilet, caused by the baby's head pressing down.",
          ar: "رغبة متكرّرة في دخول الحمّام، سببها ضغط رأس الجنين إلى الأسفل.",
        },
        {
          en: "Her waters breaking.",
          ar: "نزول ماء الرأس (السائل الأمنيوسي).",
        },
      ],
      afterBullets: [
        {
          en: "The show is the one that panics people most and means least about timing. Labour can follow it within hours, or several days later. It is a sign the cervix is opening, not a starting gun.",
          ar: "«العلامة» هي أكثر ما يثير الذعر وأقلّها دلالة على التوقيت. قد يبدأ المخاض بعدها بساعات، وقد يتأخّر أياماً. هي دليل على أن عنق الرحم بدأ ينفتح، وليست إشارة انطلاق.",
        },
      ],
      cites: ["nhs-labour-signs"],
    },

    {
      heading: {
        en: "Timing contractions: what the five-minute rule means",
        ar: "حساب الفترة بين الانقباضات: ماذا تعني قاعدة الخمس دقائق",
      },
      body: [
        {
          en: "This is the job that is genuinely yours, and the one most men get subtly wrong. Two different numbers matter and they are easy to confuse.",
          ar: "هذه هي المهمة التي تخصّك أنت فعلاً، وهي التي يخطئ فيها معظم الرجال خطأً دقيقاً. هناك رقمان مختلفان، والخلط بينهما سهل.",
        },
      ],
      bullets: [
        {
          en: "Length: how long one contraction lasts, from the moment the tightening starts to the moment it eases.",
          ar: "المدّة: كم يستمرّ الانقباض الواحد، من لحظة بدء التشنّج إلى لحظة زواله.",
        },
        {
          en: "Gap: the time from the START of one contraction to the START of the next. Not from the end of one to the start of the next — that mistake makes the gap look longer than it is, which is the direction that delays you.",
          ar: "الفاصل: الزمن من بداية انقباض إلى بداية الانقباض التالي. وليس من نهاية واحد إلى بداية التالي — هذا الخطأ يجعل الفاصل يبدو أطول مما هو عليه، وهو الاتجاه الذي يؤخّركما.",
        },
      ],
      afterBullets: [
        {
          en: "As labour establishes, contractions tend to become longer, stronger and more frequent. The threshold to act on is regular contractions arriving every five minutes or more often — at that point the NHS says to call the midwife or maternity unit.",
          ar: "مع ترسّخ المخاض تصبح الانقباضات أطول وأقوى وأكثر تواتراً. الحدّ الذي تتصرّفان عنده هو انقباضات منتظمة تأتي كل خمس دقائق أو أقلّ — عندها تنصح هيئة الصحة البريطانية بالاتصال بالقابلة أو بقسم الولادة.",
        },
        {
          en: "Write the times down, on paper or on your phone. You will not remember them, and the first thing the hospital asks is how far apart they are and how long each one lasts.",
          ar: "دوّن الأوقات، على ورقة أو على هاتفك. لن تتذكّرها، وأول ما سيسألكما عنه المستشفى هو كم الفاصل بينها وكم تستمرّ كل واحدة.",
        },
      ],
      cites: ["nhs-labour-signs", "nhs-stages-of-labour"],
      image: {
        src: "/father/labour-signs-clock.jpg",
        alt: {
          en: "Two hourglasses with beige and black sand on a white surface.",
          ar: "ساعتان رمليتان بالرمل البيج والأسود على سطح أبيض.",
        },
        // Pexels returns this contributor's `photographer` field as the bare
        // string "https://kaboompics.com/". Rendered literally it would print a
        // URL where the reader expects a name, so the studio name is used and
        // the link still points at the Pexels profile the API gave us.
        photographer: "Kaboompics",
        photographerUrl: "https://www.pexels.com/@karola-g",
        pexelsUrl: "https://www.pexels.com/photo/stylish-sand-gourglasses-4397907/",
        width: 6720,
        height: 4480,
      },
    },

    {
      heading: {
        en: "When to call, and when to leave",
        ar: "متى تتصلان، ومتى تتحرّكان",
      },
      body: [
        {
          en: "Calling and leaving are two separate decisions. The call comes first, and it is free — the maternity unit would far rather talk to you about a false alarm than have you sit at home through a real one.",
          ar: "الاتصال والذهاب قراران منفصلان. الاتصال يأتي أولاً ولا يكلّف شيئاً — قسم الولادة يفضّل كثيراً أن يحدّثكما في إنذار كاذب على أن تبقيا في البيت خلال مخاض حقيقي.",
        },
        {
          en: "Call when either of you thinks she is in labour, or when contractions are regular at five minutes apart or closer. Call urgently — not at the next convenient moment — if her waters break, if there is any vaginal bleeding, if the baby is moving less than usual, or if she is less than 37 weeks pregnant and this may be labour.",
          ar: "اتصلا إذا ظنّ أيّ منكما أنها في المخاض، أو إذا صارت الانقباضات منتظمة كل خمس دقائق أو أقلّ. واتصلا فوراً — لا في أول وقت مناسب — إذا نزل ماء الرأس، أو ظهر أيّ نزيف مهبلي، أو صارت حركة الجنين أقلّ من المعتاد، أو كانت في أسبوع أقلّ من ٣٧ وقد يكون هذا مخاضاً.",
        },
      ],
      cites: ["nhs-labour-signs"],
    },

    {
      heading: {
        en: "The latent phase: why waiting at home is not neglect",
        ar: "المرحلة الكامنة: لماذا الانتظار في البيت ليس تقصيراً",
      },
      body: [
        {
          en: "Before established labour there is a latent phase, in which the cervix softens and starts to open. Contractions in this phase are irregular, and it can take many hours, or even days, before labour is established. It is usually the longest part.",
          ar: "قبل المخاض المستقرّ هناك مرحلة كامنة يلين فيها عنق الرحم ويبدأ في الانفتاح. الانقباضات في هذه المرحلة غير منتظمة، وقد تمرّ «ساعات كثيرة، بل أيام» قبل أن يستقرّ المخاض. وهي عادةً أطول مراحله.",
        },
        {
          en: "Established labour is defined as the cervix having dilated to about 4cm with contractions that are stronger and more regular. From there to fully dilated typically takes 8 to 18 hours in a first pregnancy, and 5 to 12 hours in later ones.",
          ar: "يُعرَّف المخاض المستقرّ بأن يكون عنق الرحم قد اتّسع إلى نحو ٤ سنتيمترات مع انقباضات أقوى وأكثر انتظاماً. ومن تلك النقطة إلى الاتّساع الكامل تمرّ عادةً من ٨ إلى ١٨ ساعة في الحمل الأول، ومن ٥ إلى ١٢ ساعة في ما بعده.",
        },
        {
          en: "Knowing this changes how the night feels. Arriving very early usually means being sent home again, so the guidance for the latent phase is to stay home, keep her upright and gently active — which helps the baby move down and the cervix open — and let her eat and drink. A warm bath or shower, breathing exercises and massage may help with the pain.",
          ar: "معرفة هذا تغيّر إحساس تلك الليلة. الوصول مبكّراً جداً ينتهي عادةً بالعودة إلى البيت، لذلك تنصح الإرشادات في المرحلة الكامنة بالبقاء في البيت، وإبقائها منتصبة ومتحرّكة برفق — فذلك يساعد الجنين على النزول وعنق الرحم على الاتّساع — وأن تأكل وتشرب. وقد يخفّف الألمَ حمّام دافئ أو دُش، وتمارين التنفّس، والتدليك.",
        },
      ],
      cites: ["nhs-stages-of-labour"],
    },

    {
      heading: {
        en: "If her waters break",
        ar: "إذا نزل ماء الرأس",
      },
      body: [
        {
          en: "Amniotic fluid is clear and pale, and may be slightly bloodstained at first. It can arrive as a gush or as a slow trickle that is easy to mistake for something else.",
          ar: "السائل الأمنيوسي صافٍ فاتح اللون، وقد يخالطه قليل من الدم في البداية. قد ينزل دفعة واحدة أو تسرّباً بطيئاً يسهل الخلط بينه وبين غيره.",
        },
        {
          en: "Two things make this urgent rather than routine: fluid that is smelly or coloured, and any loss of blood. Either one means telling the midwife or maternity unit immediately. Note the time it happened and what the fluid looked like — you will be asked both.",
          ar: "أمران يجعلان هذا عاجلاً لا روتينياً: سائل ذو رائحة أو لون، وأيّ نزول للدم. أيّ منهما يعني إبلاغ القابلة أو قسم الولادة فوراً. سجّل وقت حدوثه وشكل السائل — ستُسألان عن الاثنين.",
        },
      ],
      cites: ["nhs-labour-signs"],
    },

    {
      heading: {
        en: "Premature labour before 37 weeks",
        ar: "المخاض المبكر قبل الأسبوع ٣٧",
      },
      body: [
        {
          en: "Premature labour is labour that happens before the 37th week. Around 8 in every 100 babies arrive this way, so it is uncommon but not rare.",
          ar: "المخاض المبكر هو ما يحدث قبل الأسبوع السابع والثلاثين. ويولد نحو ٨ من كل ١٠٠ طفل بهذه الطريقة، أي إنه غير شائع لكنه ليس نادراً.",
        },
        {
          en: "Before 37 weeks, the threshold for calling drops. You are not waiting for a five-minute pattern to establish itself.",
          ar: "قبل الأسبوع ٣٧ ينخفض حدّ الاتصال. لستما في انتظار أن ينتظم إيقاع الخمس دقائق.",
        },
      ],
      bullets: [
        {
          en: "Contractions or tightenings that keep coming back.",
          ar: "انقباضات أو تشنّجات تتكرّر.",
        },
        {
          en: "Period-like discomfort.",
          ar: "ألم شبيه بألم الدورة الشهرية.",
        },
        {
          en: "A gush or leak of fluid.",
          ar: "تدفّق أو تسرّب سائل.",
        },
        {
          en: "Lower back pain that is not like her usual back pain.",
          ar: "ألم في أسفل الظهر يختلف عن ألم ظهرها المعتاد.",
        },
      ],
      afterBullets: [
        {
          en: "Any of those, before 37 weeks, means calling the midwife or maternity unit. The same guidance adds that you can call if you are simply unsure or worried about anything — uncertainty is itself a reason to call, not a reason to wait and see.",
          ar: "أيّ من هذه، قبل الأسبوع ٣٧، يعني الاتصال بالقابلة أو بقسم الولادة. وتضيف الإرشادات نفسها أن بإمكانكما الاتصال لمجرّد عدم اليقين أو القلق من أيّ شيء — فالشكّ نفسه سبب للاتصال، لا سبب للانتظار والترقّب.",
        },
      ],
      cites: ["nhs-premature-labour"],
    },

    {
      heading: {
        en: "Your job during labour",
        ar: "دورك أنت أثناء المخاض",
      },
      body: [
        {
          en: "The NHS publishes a list of tips for birth partners. Stripped to what actually gets done on the night, it comes to this.",
          ar: "تنشر هيئة الصحة البريطانية قائمة نصائح لمرافق الولادة. وإذا اختُصرت إلى ما يُنفَّذ فعلاً في تلك الليلة، فهي كالآتي.",
        },
      ],
      bullets: [
        {
          en: "Know the birth plan well enough to speak for it — and expect it to change at the last minute.",
          ar: "اعرف خطة الولادة جيداً بما يكفي لتتحدّث باسمها — وتوقّع أن تتغيّر في اللحظة الأخيرة.",
        },
        {
          en: "Know the route, the journey time, the traffic at that hour, and where you will park. Settle this weeks ahead, not on the night.",
          ar: "اعرف الطريق، ومدّة الرحلة، وحال المرور في تلك الساعة، وأين ستركن السيارة. احسم هذا قبل أسابيع، لا في تلك الليلة.",
        },
        {
          en: "Keep your phone charged and on, and pack your own small bag: charger, toiletries, snacks, a change of clothes.",
          ar: "أبقِ هاتفك مشحوناً وقيد التشغيل، وجهّز حقيبة صغيرة خاصة بك: شاحن، وأدوات نظافة، ومأكولات خفيفة، وملابس للتبديل.",
        },
        {
          en: "Help her move and change position, or lean on you if that is easier. Breathe with her through contractions.",
          ar: "ساعدها على الحركة وتغيير وضعيّتها، أو أن تتّكئ عليك إن كان ذلك أسهل. وتنفّس معها خلال الانقباضات.",
        },
        {
          en: "Speak up. You may need to explain to the midwife or doctor what she needs or wants when she cannot.",
          ar: "تكلّم. قد يلزم أن تشرح للقابلة أو الطبيب ما تحتاجه أو ما تريده حين لا تستطيع هي ذلك.",
        },
        {
          en: "Keep encouraging her — and do not take offence if you are asked to stop talking.",
          ar: "واصِل تشجيعها — ولا تنزعج إذا طُلب منك أن تصمت.",
        },
        {
          en: "Eat and drink yourself, and take a short break when you can. This can run for many hours and you are no use to her depleted.",
          ar: "كُل واشرب أنت أيضاً، وخذ استراحة قصيرة متى أمكن. قد يمتدّ هذا ساعات طويلة، ولا نفع لها منك وأنت منهك.",
        },
      ],
      cites: ["nhs-birth-partner"],
    },
  ],

  redFlags: {
    intro: {
      en: "Do not wait for the next contraction to see how it goes. Any one of these means contacting the maternity unit straight away, at any hour.",
      ar: "لا تنتظرا الانقباض التالي لتريا كيف يسير. أيّ واحد من هذه يعني الاتصال بقسم الولادة فوراً، في أيّ ساعة.",
    },
    items: [
      {
        en: "Her waters have broken, and the fluid is smelly or coloured rather than clear and pale.",
        ar: "نزل ماء الرأس، والسائل ذو رائحة أو لون بدل أن يكون صافياً فاتحاً.",
      },
      {
        en: "Any vaginal bleeding.",
        ar: "أيّ نزيف مهبلي.",
      },
      {
        en: "The baby is moving less than usual, or the usual pattern has changed. Call immediately — do not wait to see if it improves.",
        ar: "حركة الجنين أقلّ من المعتاد، أو تغيّر نمطها المعتاد. اتصلا فوراً — ولا تنتظرا لتريا إن كانت ستتحسّن.",
      },
      {
        en: "She is less than 37 weeks pregnant and may be in labour.",
        ar: "هي في أسبوع أقلّ من ٣٧ وقد تكون في المخاض.",
      },
      {
        en: "Any contraction lasts longer than 2 minutes.",
        ar: "استمرّ أيّ انقباض أكثر من دقيقتين.",
      },
      {
        en: "She is having 6 or more contractions in every 10 minutes.",
        ar: "صارت تأتيها ٦ انقباضات أو أكثر كل ١٠ دقائق.",
      },
      {
        en: "She has a strong urge to push, or you think the baby is coming now. This is an ambulance call — dial the emergency number for your country.",
        ar: "لديها رغبة قويّة في الدفع، أو ترى أن الطفل يخرج الآن. هذه حالة إسعاف — اتصل برقم الطوارئ في بلدك.",
      },
    ],
    cites: ["nhs-labour-signs"],
  },

  faqs: [
    {
      q: {
        en: "Regular contractions started. Does that mean the birth is today?",
        ar: "بدأت انقباضات منتظمة. هل يعني ذلك أن الولادة اليوم؟",
      },
      a: {
        en: "Not necessarily. Established labour begins at around 4cm dilation with stronger, more regular contractions, and from there to fully dilated commonly takes 8 to 18 hours in a first pregnancy. The latent phase before that can run for many hours or even days.",
        ar: "ليس بالضرورة. المخاض المستقرّ يبدأ عند اتّساع نحو ٤ سنتيمترات مع انقباضات أقوى وأكثر انتظاماً، ومن هناك إلى الاتّساع الكامل تمرّ عادةً من ٨ إلى ١٨ ساعة في الحمل الأول. والمرحلة الكامنة قبل ذلك قد تمتدّ ساعات كثيرة بل أياماً.",
      },
      cites: ["nhs-stages-of-labour"],
    },
    {
      q: {
        en: "Her waters broke but there are no contractions. Do we still go?",
        ar: "نزل ماء الرأس لكن لا توجد انقباضات. هل نذهب رغم ذلك؟",
      },
      a: {
        en: "Call regardless. Waters breaking is on the NHS list of reasons to call urgently, with or without contractions, and it becomes more urgent still if the fluid is smelly or coloured or there is any bleeding. The unit decides whether you come in; you do not have to work that out yourselves.",
        ar: "اتصلا في كل الأحوال. نزول ماء الرأس مذكور ضمن أسباب الاتصال العاجل، بانقباضات أو بدونها، ويزداد إلحاحاً إذا كان السائل ذا رائحة أو لون أو رافقه نزيف. القسم هو من يقرّر إن كنتما ستحضران، ولستما مضطرّين لحسم ذلك بأنفسكما.",
      },
      cites: ["nhs-labour-signs"],
    },
    {
      q: {
        en: "How do I know I am not overreacting?",
        ar: "كيف أعرف أنني لا أبالغ في ردّ الفعل؟",
      },
      a: {
        en: "You are allowed to call when you are simply unsure or worried — the NHS guidance says so explicitly. Maternity units field these calls constantly and would rather answer one that turns out to be nothing.",
        ar: "من حقّكما الاتصال لمجرّد عدم اليقين أو القلق — الإرشادات تنصّ على ذلك صراحةً. أقسام الولادة تتلقّى هذه المكالمات باستمرار، وتفضّل أن تردّ على مكالمة تتبيّن أنها لا شيء.",
      },
      cites: ["nhs-premature-labour"],
    },
    {
      q: {
        en: "What should I have ready before the night arrives?",
        ar: "ماذا يجب أن أجهّز قبل أن تأتي تلك الليلة؟",
      },
      a: {
        en: "The route and the parking, a charged phone, and a small bag of your own with a charger, snacks and a change of clothes. The NHS list puts these under \"plan ahead\" and \"be ready\" for a reason: none of them can be arranged once labour has started.",
        ar: "الطريق وموقف السيارة، وهاتف مشحون، وحقيبة صغيرة خاصة بك فيها شاحن ومأكولات خفيفة وملابس للتبديل. تضع القائمة هذه البنود تحت «خطّط مسبقاً» و«كن جاهزاً» لسبب واضح: لا يمكن ترتيب أيّ منها بعد أن يبدأ المخاض.",
      },
      cites: ["nhs-birth-partner"],
    },
  ],

  /**
   * Every clause here was checked against the Flutter tree before it was
   * written. The father weekly view is `_fatherAction` / `fatherBabyDev*` in
   * weekly_content_screen.dart; the alert is father_kick_alerts_screen.dart,
   * fed by NotificationService.sendKickAlert from her kick counter.
   *
   * The contraction timer is deliberately NOT mentioned. It is hers.
   */
  cta: {
    headline: {
      en: "Set the pairing up before week 37, not at 3am",
      ar: "اضبط الاقتران قبل الأسبوع ٣٧، لا في الثالثة فجراً",
    },
    body: {
      en: "Nawah links your account to hers. You get the current week and what it means for you, and the alert from her kick counter arrives on your phone — which matters, because reduced movement is on the list above. Installing an app is not something to be doing on the night.",
      ar: "يربط تطبيق نواة حسابك بحسابها. تحصل على الأسبوع الحالي وما يعنيه لك، ويصل إلى هاتفك تنبيه عدّاد الركلات الذي تسجّله هي — وهذا مهمّ، لأن قلّة الحركة مذكورة في القائمة أعلاه. تحميل تطبيق ليس شيئاً يُفعل في تلك الليلة.",
    },
    button: {
      en: "Get Nawah free",
      ar: "حمّل نواة مجاناً",
    },
  },

  citations: [CITE_LABOUR, CITE_STAGES, CITE_PRETERM, CITE_PARTNER],

  updated: "2026-08-21",
};

/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Article 2 — مزاج زوجتك.
 *
 * Placed first in the hub because it is the only one that applies from the day
 * they find out. It exists to replace the article this audience actually gets
 * served — a list of ways to be nicer to her — with the distinction that
 * matters: ordinary emotional change versus something that needs a doctor.
 */
const herMood: FatherArticle = {
  slug: "her-mood",
  published: true,
  hero: {
    src: "/father/her-mood-hero.jpg",
    alt: {
      en: "Two glasses of tea on a weathered wooden table outdoors.",
      ar: "كوبا شاي على طاولة خشبية قديمة في الهواء الطلق.",
    },
    photographer: "Semanur Çoban",
    photographerUrl: "https://www.pexels.com/@farahmyr",
    pexelsUrl: "https://www.pexels.com/photo/wooden-table-with-two-cups-of-tea-outdoors-38756435/",
    width: 2580,
    height: 1841,
  },
  title: {
    en: "Her mood in pregnancy: what is normal, and when it is depression",
    ar: "مزاج زوجتك في الحمل: ما هو طبيعي، ومتى يكون اكتئاباً",
  },
  metaTitle: {
    en: "Mood Changes in Pregnancy: Normal or Depression? A Father's Guide | Nawah",
    ar: "تقلّبات المزاج في الحمل: طبيعية أم اكتئاب؟ دليل الأب | نواة",
  },
  description: {
    en: "How to tell ordinary emotional change in pregnancy from depression or anxiety that needs treating, and what a husband is actually able to do about it.",
    ar: "كيف تميّز بين تغيّر المزاج الطبيعي في الحمل وبين اكتئاب أو قلق يحتاج علاجاً، وما الذي يستطيع الزوج فعله فعلاً حياله.",
  },
  standfirst: {
    en: "Most advice written for husbands here stops at \"be patient with her\". That is not useless, but it is not the job either. The job is noticing the difference between a hard week and an illness.",
    ar: "معظم ما يُكتب للأزواج في هذا الباب يتوقّف عند «اصبر عليها». هذا ليس عديم الفائدة، لكنه ليس المهمّة. المهمّة أن تلاحظ الفرق بين أسبوع صعب وبين مرض.",
  },
  sections: [
    {
      heading: {
        en: "Why her mood changes in pregnancy",
        ar: "لماذا يتغيّر مزاجها في الحمل",
      },
      body: [
        {
          en: "Some of it is simply the situation. The NHS puts it plainly: pregnancy \"can be a stressful time and can lead to problems with your mental health.\" Her body is doing something enormous, her sleep is worse, and a great deal about the next year is unknown. A person under that load has bad days.",
          ar: "جزء من الأمر هو الظرف نفسه. تقول هيئة الصحة البريطانية ببساطة إن الحمل «قد يكون فترة مُجهِدة وقد يؤدّي إلى مشكلات في الصحة النفسية». جسدها يقوم بعمل هائل، ونومها أسوأ، والكثير مما يخصّ السنة القادمة مجهول. من يحمل هذا العبء تمرّ عليه أيام سيئة.",
        },
        {
          en: "The same guidance notes that some people experience depression or anxiety for the first time during pregnancy, and that others who have had them before may see the symptoms return. So a bad stretch is not automatically \"just hormones\", and treating every low week as inevitable is how a treatable illness gets missed for months.",
          ar: "وتشير الإرشادات نفسها إلى أن بعض الناس يمرّون بالاكتئاب أو القلق لأول مرة أثناء الحمل، وأن من سبق أن أُصيبوا بهما قد تعود عليهم الأعراض. إذاً الفترة السيئة ليست بالضرورة «مجرّد هرمونات»، واعتبار كل أسبوع كئيب أمراً حتمياً هو الطريق إلى إغفال مرض قابل للعلاج شهوراً.",
        },
      ],
      cites: ["nhs-mental-health-pregnancy"],
    },
    {
      heading: {
        en: "The difference between a low week and depression",
        ar: "الفرق بين أسبوع كئيب وبين الاكتئاب",
      },
      body: [
        {
          en: "After the birth, a short spell of low mood is common and \"usually goes away within 2 weeks.\" That is the part people call the baby blues. The line the NHS draws is about persistence: if the symptoms last longer than that, get worse, or make it hard for her to cope, that is when it needs professional help rather than time.",
          ar: "بعد الولادة، من الشائع أن تمرّ فترة قصيرة من انخفاض المزاج، و«تزول عادةً خلال أسبوعين». هذا ما يسمّيه الناس كآبة النفاس. والخطّ الذي ترسمه هيئة الصحة البريطانية يتعلّق بالاستمرار: إذا امتدّت الأعراض أكثر من ذلك، أو ازدادت سوءاً، أو صعّبت عليها التحمّل، فهنا تحتاج مساعدة مختصّة لا مجرّد وقت.",
        },
        {
          en: "One timing detail is worth carrying, because it contradicts the common assumption: symptoms can begin \"while you're pregnant, soon after birth, or up to a year after your baby is born.\" It is not a thing that only happens in the first weeks, and it does not stop being possible once the baby is settled.",
          ar: "وثمّة تفصيل زمني يستحقّ أن تحمله معك، لأنه يناقض الافتراض الشائع: قد تبدأ الأعراض «أثناء الحمل، أو بعد الولادة بقليل، أو حتى بعد عام من ولادة الطفل». ليست شيئاً يحدث في الأسابيع الأولى فقط، ولا تنتفي إمكانيته بعد أن تستقرّ الأمور.",
        },
      ],
      cites: ["nhs-postnatal-depression"],
    },
    {
      heading: {
        en: "Signs worth paying attention to",
        ar: "علامات تستحقّ الانتباه",
      },
      body: [
        {
          en: "These are the symptoms the NHS lists. You are not diagnosing anything — you are noticing a pattern she may be too tired or too ashamed to name.",
          ar: "هذه هي الأعراض التي تذكرها هيئة الصحة البريطانية. أنت لا تشخّص شيئاً — أنت تلاحظ نمطاً قد تكون هي أرهق أو أخجل من أن تسمّيه.",
        },
      ],
      bullets: [
        {
          en: "Persistent low mood, and no longer enjoying things she used to.",
          ar: "انخفاض مستمرّ في المزاج، وفقدان الاستمتاع بأشياء كانت تستمتع بها.",
        },
        {
          en: "Feelings of hopelessness, or of guilt.",
          ar: "شعور باليأس، أو بالذنب.",
        },
        { en: "Anxiety and restlessness.", ar: "قلق وتوتّر لا يهدأ." },
        {
          en: "Trouble sleeping even when she has the chance, and trouble concentrating.",
          ar: "صعوبة في النوم حتى حين تسنح الفرصة، وصعوبة في التركيز.",
        },
        {
          en: "Difficulty bonding with the baby, after the birth.",
          ar: "صعوبة في التواصل العاطفي مع الطفل بعد الولادة.",
        },
      ],
      afterBullets: [
        {
          en: "The guidance is explicit that help is worth seeking \"even if you only have some of the signs.\" A full set is not the entry requirement.",
          ar: "وتنصّ الإرشادات صراحةً على أن طلب المساعدة يستحقّ «حتى إن لم تظهر عليكِ سوى بعض العلامات». ليست القائمة كاملةً شرطاً للدخول.",
        },
      ],
      cites: ["nhs-postnatal-depression"],
    },
    {
      heading: {
        en: "What you can actually do",
        ar: "ما الذي تستطيع فعله فعلاً",
      },
      body: [
        {
          en: "The advice the NHS gives is unglamorous and it is aimed at getting a real clinician involved: talk about the feelings to someone — a friend, a family member, a midwife or a doctor — and be honest with the midwife or GP rather than presenting a tidy version.",
          ar: "النصيحة التي تقدّمها هيئة الصحة البريطانية غير برّاقة، وهدفها إشراك مختصّ حقيقي: أن يُتحدَّث عن المشاعر إلى أحد — صديق أو فرد من العائلة أو قابلة أو طبيب — وأن تكون المصارحة مع القابلة أو الطبيب حقيقية لا نسخة مرتّبة.",
        },
        {
          en: "Translated into your side of it: you are the one who can make the appointment, drive to it, and be in the room. And you are the one who can say the sentence she may not say — that this has been going on for weeks, not days. Being honest with a doctor is much easier when someone else in the room already knows.",
          ar: "وترجمة ذلك إلى جانبك أنت: أنت من يستطيع حجز الموعد، والذهاب به، والحضور في الغرفة. وأنت من يستطيع قول الجملة التي قد لا تقولها هي — أن هذا مستمرّ منذ أسابيع لا أيام. المصارحة مع الطبيب أسهل كثيراً حين يكون في الغرفة من يعرف أصلاً.",
        },
        {
          en: "One thing not to say: that she has nothing to be sad about. It is true and it is useless, and it teaches her that the subject is unwelcome.",
          ar: "وشيء واحد لا يُقال: إنه لا يوجد ما يستدعي حزنها. هذا صحيح وعديم الفائدة، ويعلّمها أن الموضوع غير مرحّب به.",
        },
      ],
      cites: ["nhs-mental-health-pregnancy", "nhs-postnatal-depression"],
    },
  ],
  redFlags: {
    heading: {
      en: "When this stops being something to watch",
      ar: "متى يتوقّف هذا عن كونه أمراً تراقبه",
    },
    intro: {
      en: "Any of these means contacting a doctor now rather than at the next appointment.",
      ar: "أيّ من هذه يعني الاتصال بطبيب الآن، لا في الموعد التالي.",
    },
    items: [
      {
        en: "Thoughts of suicide, of harming herself, or of harming the baby. This is listed by the NHS among the symptoms and it is the one that cannot wait.",
        ar: "أفكار عن الانتحار أو إيذاء النفس أو إيذاء الطفل. هذه مذكورة ضمن الأعراض، وهي التي لا تحتمل الانتظار.",
      },
      {
        en: "Symptoms that have lasted more than two weeks, are getting worse, or are stopping her coping day to day.",
        ar: "أعراض استمرّت أكثر من أسبوعين، أو تزداد سوءاً، أو تمنعها من تدبّر يومها.",
      },
      {
        en: "She is frightened to tell anyone because she thinks the baby could be taken away. The NHS calls that outcome \"very rare\" — the fear itself is a reason to go together, not a reason to stay silent.",
        ar: "أن تخاف من إخبار أحد ظنّاً منها أن الطفل قد يُؤخذ. تصف هيئة الصحة البريطانية هذا الاحتمال بأنه «نادر جداً» — والخوف نفسه سبب للذهاب معاً، لا سبب للصمت.",
      },
    ],
    cites: ["nhs-postnatal-depression"],
  },
  faqs: [
    {
      q: {
        en: "Is it not just hormones?",
        ar: "أليست مجرّد هرمونات؟",
      },
      a: {
        en: "Sometimes. But the NHS records that depression and anxiety can appear for the first time during pregnancy, and that symptoms can start any time up to a year after the birth. \"Just hormones\" is a reasonable first guess and a bad final answer, because it is untestable and it ends the conversation.",
        ar: "أحياناً. لكن هيئة الصحة البريطانية تسجّل أن الاكتئاب والقلق قد يظهران لأول مرة أثناء الحمل، وأن الأعراض قد تبدأ في أيّ وقت حتى عام بعد الولادة. «مجرّد هرمونات» تخمين أوّلي معقول وإجابة نهائية سيئة، لأنها غير قابلة للاختبار ولأنها تُنهي الحديث.",
      },
      cites: ["nhs-mental-health-pregnancy", "nhs-postnatal-depression"],
    },
    {
      q: {
        en: "She refuses to see anyone. What then?",
        ar: "هي ترفض مقابلة أحد. ماذا أفعل؟",
      },
      a: {
        en: "You cannot force it, and pushing usually makes it a fight about control rather than about how she feels. What you can do is remove the obstacles — make the appointment, arrange the day, offer to come in with her — and keep the subject open rather than raising it once and dropping it.",
        ar: "لا تستطيع إجبارها، والضغط يحوّل الأمر عادةً إلى خلاف على السيطرة بدل أن يكون عن شعورها. ما تستطيعه هو إزالة العوائق — احجز الموعد، ورتّب اليوم، واعرض أن تدخل معها — وأبقِ الموضوع مفتوحاً بدل أن تطرحه مرة واحدة ثم تتركه.",
      },
    },
    {
      q: {
        en: "Could I be making it worse?",
        ar: "هل يمكن أن أكون أنا من يزيد الأمر سوءاً؟",
      },
      a: {
        en: "The honest answer is that this page cannot tell you. What the guidance does say is that being able to talk about the feelings to someone close is part of what helps — so the useful question is not whether you are the cause, but whether she can currently say the true version of her week out loud in your house.",
        ar: "الإجابة الصادقة أن هذه الصفحة لا تستطيع إخبارك. لكن ما تقوله الإرشادات هو أن القدرة على الحديث عن المشاعر إلى شخص قريب جزء مما يساعد — فالسؤال المفيد ليس هل أنت السبب، بل هل تستطيع اليوم أن تقول النسخة الحقيقية من أسبوعها بصوت عالٍ في بيتك.",
      },
      cites: ["nhs-mental-health-pregnancy"],
    },
  ],
  cta: {
    headline: {
      en: "See the week she is actually having",
      ar: "اطّلع على الأسبوع الذي تعيشه فعلاً",
    },
    body: {
      en: "Nawah gives the father his own view of the pregnancy week by week, and a shared journal — she chooses what to share, and you see it. It is not a diagnosis and it does not replace a doctor. It is a way of not finding out in month seven that month five was hard.",
      ar: "يمنح تطبيق نواة الأب عرضاً خاصاً به للحمل أسبوعاً بأسبوع، ودفتر يوميات مشتركاً — هي تختار ما تشاركه، وأنت تراه. ليس تشخيصاً ولا يغني عن طبيب. هو وسيلة لألّا تكتشف في الشهر السابع أن الشهر الخامس كان صعباً.",
    },
    button: { en: "Get Nawah free", ar: "حمّل نواة مجاناً" },
  },
  citations: [CITE_MENTAL_PREG, CITE_PND],
  updated: "2026-08-22",
};

/**
 * Article 3 — سونار الأسبوع العشرين.
 *
 * The one appointment a father reliably attends, and the one he most reliably
 * misunderstands: it is a screening scan for eleven specific conditions, not a
 * photo session with an optional sex reveal. Written to be read the night
 * before.
 *
 * No red-flag block. Nothing on this page is time-critical in the way a
 * labour or movement article is, and inventing one would train readers to
 * skip the box on the pages where it matters.
 */
const scan20Weeks: FatherArticle = {
  slug: "scan-20-weeks",
  published: true,
  hero: {
    src: "/father/scan-20-weeks-hero.jpg",
    alt: {
      en: "Close-up of gentle ripples forming on a water surface in daylight.",
      ar: "لقطة قريبة لتموّجات هادئة تتشكّل على سطح الماء في ضوء النهار.",
    },
    photographer: "The Cheap Shot",
    photographerUrl: "https://www.pexels.com/@the-cheap-shot-1904877",
    pexelsUrl: "https://www.pexels.com/photo/close-up-photo-of-water-4021693/",
    width: 3070,
    height: 2046,
  },
  title: {
    en: "The 20-week scan: what it checks, and what to ask",
    ar: "سونار الأسبوع العشرين: ماذا يفحص، وماذا تسأل",
  },
  metaTitle: {
    en: "The 20-Week Scan Explained: What It Checks | Nawah",
    ar: "سونار الأسبوع العشرين: ماذا يفحص وكم يستغرق | نواة",
  },
  description: {
    en: "The 20-week scan checks for signs of 11 specific conditions. What it looks at, what it cannot rule out, how long it takes, and what happens if something is found.",
    ar: "سونار الأسبوع العشرين يفحص علامات ١١ حالة محدّدة. ما الذي ينظر إليه، وما الذي لا يستطيع نفيه، وكم يستغرق، وماذا يحدث إذا وُجد شيء.",
  },
  standfirst: {
    en: "Most fathers arrive at this appointment expecting a picture and a sex reveal. It is a screening scan, it has a specific list, and knowing the list changes what you hear in the room.",
    ar: "معظم الآباء يصلون إلى هذا الموعد وهم يتوقّعون صورة ومعرفة الجنس. لكنه سونار مسح طبّي، وله قائمة محدّدة، ومعرفة القائمة تغيّر ما تسمعه داخل الغرفة.",
  },
  sections: [
    {
      heading: {
        en: "What the 20-week scan is for",
        ar: "الغرض من سونار الأسبوع العشرين",
      },
      body: [
        {
          en: "It checks for signs of 11 different conditions affecting the baby's health and development, and it also looks at growth, at the placenta, and at the blood flow through the uterus. It is a medical examination that happens to produce an image, not an imaging session that happens to be medical.",
          ar: "يفحص علامات إحدى عشرة حالة مختلفة تؤثّر في صحة الجنين ونموّه، وينظر كذلك في النمو، وفي المشيمة، وفي تدفّق الدم عبر الرحم. هو فحص طبّي ينتج عنه صورة، لا جلسة تصوير تصادف أنها طبّية.",
        },
      ],
      cites: ["nhs-20-week-scan"],
    },
    {
      heading: {
        en: "The 11 conditions it looks for",
        ar: "الحالات الإحدى عشرة التي يبحث عنها",
      },
      body: [
        {
          en: "Reading this list is uncomfortable, and it is also the reason the appointment exists. Most scans find none of it.",
          ar: "قراءة هذه القائمة غير مريحة، وهي في الوقت نفسه سبب وجود هذا الموعد. ومعظم الفحوص لا تجد أيّاً منها.",
        },
      ],
      bullets: [
        { en: "Anencephaly", ar: "انعدام الدماغ" },
        { en: "Open spina bifida", ar: "السنسنة المشقوقة المفتوحة" },
        { en: "Cleft lip and palate", ar: "الشفة الأرنبية وشقّ الحنك" },
        { en: "Diaphragmatic hernia", ar: "الفتق الحجابي" },
        { en: "Gastroschisis", ar: "انشقاق البطن" },
        { en: "Exomphalos", ar: "القيلة السرّية" },
        { en: "Serious cardiac abnormalities", ar: "تشوّهات قلبية خطيرة" },
        { en: "Bilateral renal agenesis", ar: "غياب الكليتين" },
        { en: "Severe skeletal dysplasia", ar: "خلل التنسّج الهيكلي الشديد" },
        { en: "Edwards' syndrome", ar: "متلازمة إدواردز" },
        { en: "Patau's syndrome", ar: "متلازمة باتو" },
      ],
      cites: ["nhs-20-week-scan"],
    },
    {
      heading: {
        en: "What the scan cannot rule out",
        ar: "ما الذي لا يستطيع السونار نفيه",
      },
      body: [
        {
          en: "This is the sentence to carry out of the room with you: \"Some conditions can be seen more clearly than others, so the scan may not find everything.\" A clear scan is good news about a specific list. It is not a guarantee, and it does not replace telling the midwife about symptoms later on.",
          ar: "هذه هي الجملة التي تخرج بها من الغرفة: «بعض الحالات تُرى بوضوح أكبر من غيرها، لذا قد لا يجد الفحص كل شيء». الفحص السليم خبر جيد بخصوص قائمة محدّدة. ليس ضماناً، ولا يغني عن إبلاغ القابلة بأيّ أعراض لاحقاً.",
        },
      ],
      cites: ["nhs-20-week-scan"],
    },
    {
      heading: {
        en: "How long it takes, and who can come in",
        ar: "كم يستغرق، ومن يستطيع الدخول",
      },
      body: [
        {
          en: "Roughly 30 minutes, and longer if the baby is moving a lot or lying awkwardly. A long appointment is usually a baby in the wrong position, not a problem found — worth knowing before you spend twenty of those minutes reading the sonographer's face.",
          ar: "نحو ثلاثين دقيقة، وأطول إذا كان الجنين كثير الحركة أو في وضعية صعبة. الموعد الطويل سببه عادةً وضعية الجنين لا اكتشاف مشكلة — ويستحقّ أن تعرف ذلك قبل أن تقضي عشرين من تلك الدقائق تقرأ ملامح المختصّ.",
        },
        {
          en: "You may bring someone with you, but most hospitals do not allow children in the room, and policies differ. Check with the clinic beforehand rather than arriving and finding out.",
          ar: "يمكن أن يرافقها أحد، لكن معظم المستشفيات لا تسمح بدخول الأطفال إلى الغرفة، والسياسات تختلف. تحقّق من العيادة مسبقاً بدل أن تصل فتكتشف ذلك.",
        },
        {
          en: "On the sex: you may be asked whether you want to know. It is a question, not an automatic part of the report, and the two of you should have answered it between yourselves before someone asks it out loud.",
          ar: "أما الجنس: قد تُسألان إن كنتما تريدان معرفته. هو سؤال لا جزء تلقائي من التقرير، ويُفترض أن تكونا قد حسمتماه بينكما قبل أن يطرحه أحد بصوت عالٍ.",
        },
      ],
      cites: ["nhs-20-week-scan"],
    },
    {
      heading: {
        en: "If something is found",
        ar: "إذا وُجد شيء",
      },
      body: [
        {
          en: "You may be offered further scans and tests, such as amniocentesis, and a specialist will explain the results and what they mean for her and for the baby. Nothing is decided in the scan room, and you are not expected to have an answer that day.",
          ar: "قد يُعرض عليكما فحوص وسونارات إضافية، مثل بزل السائل الأمنيوسي، وسيشرح مختصّ النتائج وما تعنيه لها وللجنين. لا يُحسم شيء داخل غرفة السونار، ولا يُنتظر منكما جواب في ذلك اليوم.",
        },
        {
          en: "The practical thing you can do is write down what is actually said, including the words you do not recognise. Under that kind of news almost nobody retains a conversation accurately, and the spelling of one term is the difference between reading about the real condition afterwards and reading about a different one.",
          ar: "والشيء العملي الذي تستطيعه هو تدوين ما يُقال فعلاً، بما في ذلك الكلمات التي لا تعرفها. تحت وقع خبر كهذا لا يكاد أحد يحتفظ بالحديث بدقّة، وحرفٌ واحد في مصطلح هو الفرق بين أن تقرأ لاحقاً عن الحالة الصحيحة أو عن حالة أخرى.",
        },
      ],
      cites: ["nhs-20-week-scan"],
    },
  ],
  faqs: [
    {
      q: {
        en: "Can they always tell the sex at 20 weeks?",
        ar: "هل يستطيعون دائماً تحديد الجنس في الأسبوع العشرين؟",
      },
      a: {
        en: "The NHS says you may be asked if you would like to know — it does not promise an answer. The scan's purpose is the 11-condition list, and the baby's position governs what is visible. Treat it as a possible bonus rather than the point of the appointment.",
        ar: "تقول هيئة الصحة البريطانية إنه قد يُسأل إن كنتما تريدان المعرفة — وهي لا تَعِد بجواب. غرض الفحص هو قائمة الحالات الإحدى عشرة، ووضعية الجنين هي ما يحكم ما يمكن رؤيته. اعتبرها مكسباً محتملاً لا هدف الموعد.",
      },
      cites: ["nhs-20-week-scan"],
    },
    {
      q: {
        en: "The scan was clear. Does that mean the baby is healthy?",
        ar: "كان الفحص سليماً. هل يعني ذلك أن الجنين بخير؟",
      },
      a: {
        en: "It means no signs of those specific conditions were seen. The guidance states outright that the scan \"may not find everything\" and that some conditions show more clearly than others. It is strong reassurance about a defined list, not a clean bill of health for everything.",
        ar: "يعني أنه لم تُرَ علامات لتلك الحالات المحدّدة. وتنصّ الإرشادات صراحةً على أن الفحص «قد لا يجد كل شيء» وأن بعض الحالات تظهر بوضوح أكبر من غيرها. هو طمأنة قوية بخصوص قائمة محدّدة، لا شهادة سلامة شاملة.",
      },
      cites: ["nhs-20-week-scan"],
    },
    {
      q: {
        en: "Should I take time off work for it?",
        ar: "هل آخذ إجازة من العمل من أجله؟",
      },
      a: {
        en: "This page cannot tell you what your employer allows. What it can tell you is that the appointment runs about 30 minutes and can run longer, that results may be discussed on the day, and that it is one of the few appointments where a second person hearing the same sentences has obvious value.",
        ar: "لا تستطيع هذه الصفحة أن تخبرك بما يسمح به عملك. لكن ما تستطيع قوله إن الموعد يستغرق نحو ثلاثين دقيقة وقد يطول، وإن النتائج قد تُناقَش في اليوم نفسه، وإنه أحد المواعيد القليلة التي يكون فيها لوجود شخص ثانٍ يسمع الجُمل نفسها قيمة واضحة.",
      },
      cites: ["nhs-20-week-scan"],
    },
  ],
  cta: {
    headline: {
      en: "Put the appointments where you will both see them",
      ar: "ضَع المواعيد حيث ترَيانها معاً",
    },
    body: {
      en: "Nawah's appointments screen is shared once your accounts are paired, so the scan date is not a message that scrolled away in a chat. The father's view carries the same week and the same dates as hers.",
      ar: "شاشة المواعيد في نواة مشتركة بمجرّد اقتران حسابيكما، فلا يبقى موعد السونار رسالةً ضاعت في مجرى المحادثة. وعرض الأب يحمل الأسبوع نفسه والتواريخ نفسها التي تراها هي.",
    },
    button: { en: "Get Nawah free", ar: "حمّل نواة مجاناً" },
  },
  citations: [CITE_20WEEK],
  updated: "2026-08-22",
};

/**
 * Article 4 — حركة الجنين.
 *
 * ⚠️ THIS ARTICLE ARGUES AGAINST THE OBVIOUS CTA, ON PURPOSE.
 *
 * The commercially convenient piece here would tell fathers to count kicks,
 * because the app ships a kick counter. The NHS says the opposite in as many
 * words: "You do not need to count the number of kicks or movements you feel
 * each day." Writing the convenient version would be selling a feature by
 * contradicting the source cited at the bottom of the same page.
 *
 * So the article says what the guidance says — pattern, not arithmetic — and
 * the CTA claims only the thing that is both true and genuinely ours: the
 * alert reaching the father's phone. It also carries the home-doppler warning,
 * which is the one piece of advice on this page that can prevent a death.
 */
const babyMovements: FatherArticle = {
  slug: "baby-movements",
  published: true,
  hero: {
    src: "/father/baby-movements-hero.jpg",
    alt: {
      en: "Close-up of soft, light-coloured linen fabric showing its weave.",
      ar: "لقطة قريبة لقماش كتّان فاتح ناعم تُظهر نسيجه.",
    },
    photographer: "Engin Akyurt",
    photographerUrl: "https://www.pexels.com/@enginakyurt",
    pexelsUrl: "https://www.pexels.com/photo/gray-textile-closeup-photo-1487713/",
    width: 7680,
    height: 5120,
  },
  title: {
    en: "The baby's movements: what actually matters, and why counting is not it",
    ar: "حركة الجنين: ما الذي يهمّ فعلاً، ولماذا العدّ ليس هو المطلوب",
  },
  metaTitle: {
    en: "Baby Movements in Pregnancy: Pattern, Not Kick Counting | Nawah",
    ar: "حركة الجنين في الحمل: النمط لا عدّ الركلات | نواة",
  },
  description: {
    en: "When movements start, why the NHS says you do not need to count kicks, what a change in pattern means, and why home dopplers are dangerous.",
    ar: "متى تبدأ الحركة، ولماذا تقول هيئة الصحة البريطانية إنه لا حاجة لعدّ الركلات، وماذا يعني تغيّر النمط، ولماذا أجهزة الدوبلر المنزلية خطرة.",
  },
  standfirst: {
    en: "There is no magic number of kicks. There is a pattern, it belongs to this baby and no other, and a change in it is the most time-critical signal in the whole pregnancy.",
    ar: "لا يوجد رقم سحري للركلات. يوجد نمط، وهو خاصّ بهذا الجنين دون غيره، وتغيّره هو أكثر إشارة في الحمل كلّه حساسية للوقت.",
  },
  sections: [
    {
      heading: {
        en: "When the baby's movements start",
        ar: "متى تبدأ حركة الجنين",
      },
      body: [
        {
          en: "\"You should start to feel your baby move between 16 to 24 weeks of pregnancy. If this is your first baby, you might not feel movements until after 20 weeks.\" That is a wide window, and a first-time mother at week 19 who feels nothing is inside it, not behind.",
          ar: "«يُفترض أن تبدأي الشعور بحركة جنينكِ بين الأسبوع ١٦ و٢٤ من الحمل. وإذا كان هذا طفلكِ الأول، فقد لا تشعرين بالحركة إلا بعد الأسبوع ٢٠». هذه نافذة واسعة، والحامل لأول مرة في الأسبوع ١٩ التي لا تشعر بشيء داخل النافذة لا متأخّرة عنها.",
        },
      ],
      cites: ["nhs-movements"],
    },
    {
      heading: {
        en: "Why you do not need to count kicks",
        ar: "لماذا لا حاجة إلى عدّ الركلات",
      },
      body: [
        {
          en: "This is stated by the NHS without hedging: \"You do not need to count the number of kicks or movements you feel each day.\" There is no target number, and there is no threshold below which a day counts as a bad one.",
          ar: "تقول هيئة الصحة البريطانية هذا دون مواربة: «لستِ بحاجة إلى عدّ عدد الركلات أو الحركات التي تشعرين بها كل يوم». لا يوجد رقم مستهدَف، ولا يوجد حدّ يُعدّ اليوم دونه يوماً سيئاً.",
        },
        {
          en: "This matters because counting produces false comfort in both directions. A day that reaches some number is not proof of safety, and an ordinary quiet hour is not proof of danger. What replaces the arithmetic is stated just as plainly: \"The important thing is to get to know your baby's usual pattern of movements from day to day.\"",
          ar: "وهذا مهمّ لأن العدّ ينتج طمأنينة زائفة في الاتجاهين. اليوم الذي يبلغ رقماً ما ليس دليل أمان، والساعة الهادئة العادية ليست دليل خطر. وما يحلّ محلّ الحساب مذكور بالوضوح نفسه: «المهمّ أن تتعرّفي على نمط حركة جنينكِ المعتاد من يوم إلى يوم».",
        },
      ],
      cites: ["nhs-movements"],
    },
    {
      heading: {
        en: "The pattern is the measurement",
        ar: "النمط هو المقياس",
      },
      body: [
        {
          en: "Every baby has its own rhythm — busier at certain hours, quieter at others. Because the reference point is this baby's own normal rather than an average, only the person carrying it can establish it, and only by paying attention over days rather than checking once.",
          ar: "لكل جنين إيقاعه — أنشط في ساعات، وأهدأ في أخرى. ولأن المرجع هو المعتاد الخاصّ بهذا الجنين لا متوسّطاً عاماً، فلا يستطيع تحديده إلا من تحمله، ولا يتحدّد إلا بالانتباه عبر أيام لا بفحصٍ مرة واحدة.",
        },
        {
          en: "Your part is smaller and still useful: do not argue with it. When she says the movements feel different today, the correct response is not to reason her out of it by pointing out that the baby kicked an hour ago. She holds the only copy of the baseline.",
          ar: "ودورك أنت أصغر ومع ذلك مفيد: لا تجادلها فيه. حين تقول إن الحركة تبدو مختلفة اليوم، فالردّ الصحيح ليس أن تقنعها بالعدول عن ذلك بتذكيرها أن الجنين ركل قبل ساعة. هي وحدها تملك نسخة خطّ الأساس.",
        },
      ],
      cites: ["nhs-movements"],
    },
    {
      heading: {
        en: "Do not buy a home doppler",
        ar: "لا تشترِ جهاز دوبلر منزلياً",
      },
      body: [
        {
          en: "The NHS warns that home dopplers are unreliable for checking on a baby — even when a heartbeat is found. The danger is precise and it runs one way: the reassurance of hearing something can be exactly what stops a couple ringing the maternity unit on the night it mattered.",
          ar: "تحذّر هيئة الصحة البريطانية من أن أجهزة الدوبلر المنزلية غير موثوقة للاطمئنان على الجنين — حتى حين يُسمع نبض. والخطر دقيق ويسير في اتّجاه واحد: الطمأنينة الناتجة عن سماع شيءٍ ما قد تكون تحديداً ما يمنع الزوجين من الاتصال بقسم الولادة في الليلة التي كان الاتصال فيها مهمّاً.",
        },
        {
          en: "If you were planning to buy one as a gift, buy something else. A device that can only ever produce a false negative about the thing you are worried about is worse than no device.",
          ar: "وإن كنت تنوي شراء واحد كهديّة، فاشترِ شيئاً آخر. جهاز لا يمكنه أن ينتج إلا نتيجة سلبية كاذبة بخصوص ما يقلقك أسوأ من عدم وجود جهاز.",
        },
      ],
      cites: ["nhs-movements"],
    },
  ],
  redFlags: {
    intro: {
      en: "This is the most time-critical list on this site. Any one of these means calling the midwife or maternity unit immediately.",
      ar: "هذه أكثر قائمة في هذا الموقع حساسية للوقت. أيّ واحد منها يعني الاتصال بالقابلة أو بقسم الولادة فوراً.",
    },
    items: [
      { en: "The baby is moving less than usual.", ar: "الجنين يتحرّك أقلّ من المعتاد." },
      {
        en: "She cannot feel the baby moving any more.",
        ar: "لم تعد تشعر بحركة الجنين.",
      },
      {
        en: "There is a change to the baby's usual pattern of movements.",
        ar: "حدث تغيّر في نمط حركة الجنين المعتاد.",
      },
      {
        en: "\"Do not wait until the next day – call immediately, even if it's the middle of the night.\" Not after a cold drink, not after lying down for an hour, not in the morning.",
        ar: "«لا تنتظري حتى اليوم التالي — اتصلي فوراً، حتى لو كان منتصف الليل». ليس بعد شراب بارد، ولا بعد الاستلقاء ساعة، ولا في الصباح.",
      },
    ],
    cites: ["nhs-movements"],
  },
  faqs: [
    {
      q: {
        en: "So is the kick counter in the app pointless?",
        ar: "إذاً هل عدّاد الركلات في التطبيق بلا فائدة؟",
      },
      a: {
        en: "It is not a medical requirement, and this page will not pretend otherwise — the NHS says counting is not needed. What a log is good for is making a change in pattern visible, and for giving her something concrete to describe on the phone. It is a record, not a test, and a normal-looking log never overrides how the movements actually feel to her.",
        ar: "ليس مطلباً طبّياً، ولن تتظاهر هذه الصفحة بغير ذلك — تقول هيئة الصحة البريطانية إن العدّ غير لازم. ما يصلح له السجلّ هو إظهار تغيّر النمط، ومنحها شيئاً محدّداً تصفه في المكالمة. هو سجلّ لا اختبار، والسجلّ الذي يبدو طبيعياً لا يلغي أبداً ما تشعر به هي فعلاً.",
      },
      cites: ["nhs-movements"],
    },
    {
      q: {
        en: "The baby is quiet today but was busy yesterday. Do we call?",
        ar: "الجنين هادئ اليوم وكان نشطاً أمس. هل نتصل؟",
      },
      a: {
        en: "A change to the usual pattern is on the NHS list of reasons to call immediately, and \"quiet today, busy yesterday\" is a change. The call costs nothing. Waiting to see whether it picks up is exactly the behaviour the guidance tells you not to adopt.",
        ar: "تغيّر النمط المعتاد مذكور ضمن أسباب الاتصال الفوري، و«هادئ اليوم ونشط أمس» تغيّر. المكالمة لا تكلّف شيئاً. أما الانتظار لترَيا إن كانت الحركة ستعود فهو تحديداً السلوك الذي تنهى عنه الإرشادات.",
      },
      cites: ["nhs-movements"],
    },
    {
      q: {
        en: "She has not felt anything yet at 19 weeks. Is that wrong?",
        ar: "لم تشعر بشيء بعد في الأسبوع ١٩. هل هذا خطأ؟",
      },
      a: {
        en: "Movements are expected between 16 and 24 weeks, and with a first baby they may not be felt until after 20 weeks. Week 19 with nothing yet sits inside the normal window. If you are worried anyway, the midwife is the right place to take the worry.",
        ar: "الحركة متوقّعة بين الأسبوع ١٦ و٢٤، ومع الطفل الأول قد لا تُحسّ إلا بعد الأسبوع ٢٠. فالأسبوع ١٩ دون شعور بعد يقع داخل النافذة الطبيعية. وإن كان القلق مستمرّاً رغم ذلك، فالقابلة هي المكان الصحيح لحمله إليه.",
      },
      cites: ["nhs-movements"],
    },
  ],
  cta: {
    headline: {
      en: "The alert reaches your phone, not just hers",
      ar: "التنبيه يصل إلى هاتفك أنت، لا إلى هاتفها فقط",
    },
    body: {
      en: "When she logs a session in Nawah, the alert goes to the paired father's phone. That is the part worth having: not a number, but you knowing on the same night she did. Pair the accounts once and it works from then on.",
      ar: "حين تسجّل هي جلسة في نواة، يصل التنبيه إلى هاتف الأب المقترن. وهذا هو الجزء الذي يستحقّ: ليس رقماً، بل أن تعرف أنت في الليلة نفسها التي عرفت فيها. اقرِن الحسابين مرة واحدة ويعمل بعدها دائماً.",
    },
    button: { en: "Get Nawah free", ar: "حمّل نواة مجاناً" },
  },
  citations: [CITE_MOVEMENTS],
  updated: "2026-08-22",
};

/**
 * Article 5 — ميزانية المولود.
 *
 * ⚠️ NO PRICES, IN ANY CURRENCY. The audience spans Egypt and the GCC, this
 * project has no verified cost data for any of those markets, and a fabricated
 * figure on a page a man is using to plan his spending is worse than no page.
 * The lever the article actually pulls is the list of what a newborn needs at
 * all, which is sourced — most of the money in this category goes on things
 * nobody's guidance asks for.
 *
 * The safety content is not padding. Several items here are cheaper AND
 * correct: no cot bumpers, no pillows, no baby nest, no second-hand mattress.
 */
const babyBudget: FatherArticle = {
  slug: "baby-budget",
  published: true,
  hero: {
    src: "/father/baby-budget-hero.jpg",
    alt: {
      en: "Wicker baskets of different sizes arranged on a plain white wall.",
      ar: "سلال من الخوص بأحجام مختلفة مرتّبة على جدار أبيض بسيط.",
    },
    photographer: "Arina Krasnikova",
    photographerUrl: "https://www.pexels.com/@arina-krasnikova",
    pexelsUrl: "https://www.pexels.com/photo/overhead-view-of-wicker-baskets-5119832/",
    width: 5000,
    height: 3338,
  },
  title: {
    en: "The newborn budget: what the baby actually needs",
    ar: "ميزانية المولود: ما يحتاجه الطفل فعلاً",
  },
  metaTitle: {
    en: "What a Newborn Actually Needs: The Real List | Nawah",
    ar: "ما يحتاجه المولود فعلاً: القائمة الحقيقية | نواة",
  },
  description: {
    en: "The published list of what a newborn needs in the first weeks, the cot and car seat safety standards, and the items that are cheaper to skip because they are not safe.",
    ar: "القائمة المنشورة لما يحتاجه المولود في الأسابيع الأولى، ومعايير سلامة السرير ومقعد السيارة، والأشياء التي تركها أوفر لأنها غير آمنة أصلاً.",
  },
  standfirst: {
    en: "This page carries no prices, because nobody here can verify what things cost in your city. It carries the list instead — and most of what gets spent in this category is on things that appear on no list at all.",
    ar: "هذه الصفحة لا تحمل أسعاراً، لأن لا أحد هنا يستطيع التحقّق من تكلفة الأشياء في مدينتك. تحمل القائمة بدلاً من ذلك — ومعظم ما يُنفَق في هذا الباب يذهب إلى أشياء لا ترد في أيّ قائمة.",
  },
  sections: [
    {
      heading: {
        en: "Clothes for the first weeks",
        ar: "الملابس في الأسابيع الأولى",
      },
      body: [
        {
          en: "The published starting list is short enough to be surprising.",
          ar: "قائمة البداية المنشورة قصيرة إلى حدّ يثير الدهشة.",
        },
      ],
      bullets: [
        { en: "6 stretch suits and 6 vests.", ar: "٦ أفرولات مطّاطية و٦ صدريات داخلية." },
        {
          en: "2 lightweight cardigans, wool or cotton.",
          ar: "٢ كنزة خفيفة، صوف أو قطن.",
        },
        { en: "A shawl or a blanket.", ar: "شال أو بطّانية." },
        {
          en: "For going out in cold weather: a wool or cotton hat, mittens, and socks or bootees.",
          ar: "للخروج في الطقس البارد: قبّعة صوف أو قطن، وقفّازات، وجوارب أو أحذية صغيرة.",
        },
        { en: "A sun hat for warm weather.", ar: "قبّعة شمس للطقس الحارّ." },
      ],
      afterBullets: [
        {
          en: "Newborns also outgrow this size quickly, which is the argument against buying a wardrobe in advance rather than an argument about taste.",
          ar: "كما أن المواليد يتجاوزون هذا المقاس بسرعة، وهذه هي الحجّة ضدّ شراء خزانة كاملة مسبقاً، لا حجّة تتعلّق بالذوق.",
        },
      ],
      cites: ["nhs-what-you-need"],
    },
    {
      heading: {
        en: "Where the baby sleeps",
        ar: "أين ينام الطفل",
      },
      body: [
        {
          en: "For the first months: a crib, a carrycot or a Moses basket. This is the part of the list where the cheap decision and the safe decision are usually the same decision.",
          ar: "في الأشهر الأولى: سرير صغير أو مهد محمول أو سلّة موسى. وهذا هو الجزء من القائمة الذي يكون فيه القرار الأوفر والقرار الأكثر أماناً هما القرار نفسه عادةً.",
        },
      ],
      bullets: [
        {
          en: "The mattress must be firm, not soft, flat, fit the cot with no gaps, and be clean, dry, waterproof and not ripped or torn.",
          ar: "يجب أن تكون المرتبة صلبة لا طريّة، ومستوية، وتملأ السرير بلا فجوات، ونظيفة وجافّة وعازلة للماء وغير ممزّقة.",
        },
        {
          en: "No pillows and no duvets for a baby under one year — the risk named is suffocation.",
          ar: "لا وسائد ولا ألحفة للطفل دون عام — والخطر المذكور هو الاختناق.",
        },
        {
          en: "Use sheets and layers of blankets tucked in firmly below shoulder level, or a baby sleeping bag.",
          ar: "استخدما ملاءات وطبقات بطّانيات مثبّتة جيداً أسفل مستوى الكتفين، أو كيس نوم للأطفال.",
        },
        {
          en: "Baby nests are not suitable to sleep in, because of the danger of suffocation.",
          ar: "أعشاش الأطفال غير صالحة للنوم فيها، بسبب خطر الاختناق.",
        },
        {
          en: "A new cot should meet British safety standard BS EN 716, and the bars should be no more than 6.5cm apart.",
          ar: "ينبغي أن يستوفي السرير الجديد معيار السلامة البريطاني BS EN 716، وألّا تزيد المسافة بين قضبانه على ٦٫٥ سنتيمتر.",
        },
        {
          en: "If you are borrowing or reusing, ideally buy a new mattress even so.",
          ar: "وإذا كنتما تستعيران أو تعيدان الاستخدام، فالأفضل شراء مرتبة جديدة رغم ذلك.",
        },
      ],
      cites: ["nhs-what-you-need"],
    },
    {
      heading: {
        en: "The car seat",
        ar: "مقعد السيارة",
      },
      body: [
        {
          en: "This is the one item on the list where buying the cheapest available option is a genuinely bad idea, and where second-hand carries a specific trap.",
          ar: "هذا هو البند الوحيد في القائمة الذي يكون فيه شراء الأرخص فكرة سيئة فعلاً، والذي يحمل فيه المستعمَل فخّاً محدّداً.",
        },
        {
          en: "It must be suitable for the baby's weight and fitted correctly according to the manufacturer's instructions, and it must conform to United Nations ECE Regulation R44.03 or R44.04, or to the newer i-Size regulation R129.",
          ar: "يجب أن يكون مناسباً لوزن الطفل ومركَّباً بشكل صحيح وفق تعليمات الصانع، وأن يكون مطابقاً للائحة الأمم المتحدة ECE رقم R44.03 أو R44.04، أو للائحة i-Size الأحدث R129.",
        },
        {
          en: "On second-hand seats the rule is narrow: only accept one from someone you know, never from a shop, because you cannot verify whether it has been in a crash. A seat that has been in a collision can look untouched and no longer work.",
          ar: "أما المقاعد المستعملة فالقاعدة ضيّقة: لا تقبل واحداً إلا من شخص تعرفه، ولا من متجر أبداً، لأنك لا تستطيع التحقّق مما إذا كان قد تعرّض لحادث. والمقعد الذي تعرّض لاصطدام قد يبدو سليماً تماماً ولا يعود يؤدّي وظيفته.",
        },
      ],
      cites: ["nhs-what-you-need"],
    },
    {
      heading: {
        en: "Carrying the baby",
        ar: "حمل الطفل",
      },
      body: [
        {
          en: "If you use a sling or carrier, the published check is the T.I.C.K.S. rule: tight; in view at all times; close enough to kiss; keep the chin off the chest; and supported back.",
          ar: "إذا استخدمتما حمّالة أو حاملاً، فالفحص المنشور هو قاعدة T.I.C.K.S: مشدودة؛ والطفل مرئي في كل وقت؛ وقريب بما يكفي لتقبيله؛ وذقنه بعيدة عن صدره؛ وظهره مسنود.",
        },
        {
          en: "The chin item is the one that gets missed, and it is the one that matters most: a newborn whose chin is folded onto the chest can have its airway closed without making any noise about it.",
          ar: "وبند الذقن هو الذي يُغفَل، وهو الأهمّ: المولود الذي تنطبق ذقنه على صدره قد ينسدّ مجرى هوائه دون أن يُصدر صوتاً على ذلك.",
        },
      ],
      cites: ["nhs-what-you-need"],
    },
  ],
  faqs: [
    {
      q: {
        en: "Why does this page not give any prices?",
        ar: "لماذا لا تعطي هذه الصفحة أيّ أسعار؟",
      },
      a: {
        en: "Because we have not verified what any of this costs in Cairo, Riyadh, Dubai or anywhere else, and a made-up number on a page someone is using to plan their spending is worse than an honest gap. The list is the part that transfers between markets.",
        ar: "لأننا لم نتحقّق من تكلفة أيّ من هذا في القاهرة أو الرياض أو دبي أو غيرها، ورقمٌ مُختلَق في صفحة يستخدمها أحدهم لتخطيط إنفاقه أسوأ من فجوة صادقة. القائمة هي الجزء الذي ينتقل بين الأسواق.",
      },
    },
    {
      q: {
        en: "What about second-hand in general?",
        ar: "وماذا عن المستعمَل عموماً؟",
      },
      a: {
        en: "Two items carry named cautions: buy a new mattress even when reusing a cot, and take a car seat only from someone you know. Beyond those two, the guidance does not warn people off used baby equipment.",
        ar: "بندان يحملان تحذيرات صريحة: اشتريا مرتبة جديدة حتى عند إعادة استخدام سرير، ولا تأخذا مقعد سيارة إلا من شخص تعرفانه. وفيما عدا هذين، لا تحذّر الإرشادات من معدّات الأطفال المستعملة.",
      },
      cites: ["nhs-what-you-need"],
    },
    {
      q: {
        en: "Everyone says we need far more than this.",
        ar: "الجميع يقول إننا نحتاج أكثر من هذا بكثير.",
      },
      a: {
        en: "They may be right about comfort. They are describing preferences, though, not a published requirement — and it is worth being able to tell which of the two you are buying, particularly for the items that arrive before the baby does.",
        ar: "قد يكونون محقّين بخصوص الراحة. لكنهم يصفون تفضيلات لا متطلّبات منشورة — ويستحقّ أن تكون قادراً على التمييز بين الاثنين وأنت تشتري، خصوصاً في الأشياء التي تصل قبل أن يصل الطفل.",
      },
    },
  ],
  cta: {
    headline: {
      en: "Put the list somewhere you both edit it",
      ar: "ضَعا القائمة في مكان تعدّلانه معاً",
    },
    body: {
      en: "Nawah has a baby budget the father can open and edit, not only view. Agreeing what is on the list before the shopping starts is most of the argument avoided.",
      ar: "في نواة ميزانية للمولود يستطيع الأب فتحها وتعديلها، لا الاطّلاع عليها فقط. والاتفاق على ما في القائمة قبل أن يبدأ الشراء هو معظم الخلاف متفادى.",
    },
    button: { en: "Get Nawah free", ar: "حمّل نواة مجاناً" },
  },
  citations: [CITE_BABYNEEDS],
  updated: "2026-08-22",
};

/**
 * Article 6 — حقيبة المستشفى.
 *
 * The NHS checklist has a section headed "Suggestions for your birth partner",
 * which is unusual enough to be the spine of the article: most bag lists in
 * this language address the mother only, and the father turns up having packed
 * nothing for a stay that can run into a second day.
 */
const hospitalBag: FatherArticle = {
  slug: "hospital-bag",
  published: true,
  hero: {
    src: "/father/hospital-bag-hero.jpg",
    alt: {
      en: "An open, almost empty vintage suitcase on a pavement in low sun.",
      ar: "حقيبة سفر قديمة مفتوحة وشبه فارغة على رصيف في ضوء شمس منخفض.",
    },
    photographer: "M.Emin BİLİR",
    photographerUrl: "https://www.pexels.com/@travelerchitect",
    pexelsUrl: "https://www.pexels.com/photo/books-in-suitcase-on-pavement-18048278/",
    width: 6006,
    height: 4004,
  },
  title: {
    en: "The hospital bag: the father's list",
    ar: "حقيبة المستشفى: قائمة الأب",
  },
  metaTitle: {
    en: "Hospital Bag Checklist for the Father | Nawah",
    ar: "قائمة حقيبة المستشفى للأب | نواة",
  },
  description: {
    en: "What the birth partner packs for himself, when the bag should be ready, and why the published advice is to divide it into two bags rather than one.",
    ar: "ماذا يحزم مرافق الولادة لنفسه، ومتى يجب أن تكون الحقيبة جاهزة، ولماذا تنصح الإرشادات بتقسيمها إلى حقيبتين لا واحدة.",
  },
  standfirst: {
    en: "Almost every hospital bag list in Arabic is addressed to her. The published NHS checklist has a section for the birth partner, and it exists because a labour can run past twenty-four hours with you in the same shirt.",
    ar: "تكاد كل قائمة لحقيبة المستشفى بالعربية تكون موجّهة إليها. أما القائمة المنشورة فتضمّ قسماً لمرافق الولادة، وهو موجود لأن المخاض قد يمتدّ إلى ما بعد أربع وعشرين ساعة وأنت في القميص نفسه.",
  },
  sections: [
    {
      heading: {
        en: "When the bag should be ready",
        ar: "متى يجب أن تكون الحقيبة جاهزة",
      },
      body: [
        {
          en: "\"It might be a good idea to get your hospital bag packed at least 3 weeks ahead of the due date.\" Three weeks ahead of the due date is roughly week 37 — which is also the week before which labour counts as premature, so the two deadlines land in the same place and are easy to remember together.",
          ar: "«قد يكون من الجيد تجهيز حقيبة المستشفى قبل موعد الولادة المتوقّع بثلاثة أسابيع على الأقل». وثلاثة أسابيع قبل الموعد المتوقّع تعني نحو الأسبوع ٣٧ — وهو أيضاً الأسبوع الذي يُعدّ المخاض قبله مبكّراً، فيقع الموعدان في المكان نفسه ويسهل تذكّرهما معاً.",
        },
      ],
      cites: ["nhs-hospital-bag"],
    },
    {
      heading: {
        en: "Two bags, not one",
        ar: "حقيبتان لا واحدة",
      },
      body: [
        {
          en: "The published advice is to divide the packing: one bag for labour and delivery, one for after the baby arrives. This is a practical instruction aimed at you, since you will be the one carrying both and then finding things in them under fluorescent light while somebody is in pain.",
          ar: "النصيحة المنشورة هي تقسيم الحزم: حقيبة للمخاض والولادة، وأخرى لما بعد وصول الطفل. وهذه تعليمة عملية موجّهة إليك أنت، لأنك من سيحمل الاثنتين ثم يبحث فيهما تحت ضوء أبيض بينما هناك من يتألّم.",
        },
      ],
      cites: ["nhs-hospital-bag"],
    },
    {
      heading: {
        en: "Your own bag",
        ar: "حقيبتك أنت",
      },
      body: [
        {
          en: "This is the list the guidance gives specifically for the birth partner. It is short, and almost nobody packs it.",
          ar: "هذه هي القائمة التي تقدّمها الإرشادات لمرافق الولادة تحديداً. قصيرة، ولا يكاد أحد يحزمها.",
        },
      ],
      bullets: [
        { en: "A change of clothes.", ar: "ملابس للتبديل." },
        {
          en: "Toothbrush, toothpaste and deodorant.",
          ar: "فرشاة أسنان ومعجون ومزيل عرق.",
        },
        { en: "Phone and charger.", ar: "هاتف وشاحن." },
        { en: "A camera, if you want one.", ar: "كاميرا، إن أردت." },
        { en: "Snacks and drinks.", ar: "مأكولات خفيفة ومشروبات." },
        {
          en: "Swimwear, if she is planning to use a birth pool and you may need to be in it with her.",
          ar: "ملابس سباحة، إن كانت تنوي استخدام حوض ولادة وقد تحتاج إلى النزول معها.",
        },
        { en: "Any medication you take.", ar: "أيّ دواء تتناوله." },
        { en: "Glasses or contact lenses.", ar: "نظارة أو عدسات لاصقة." },
        {
          en: "Spare change, for parking and vending machines.",
          ar: "نقود فكّة، لموقف السيارات وآلات البيع.",
        },
      ],
      afterBullets: [
        {
          en: "The last one looks trivial until the car park barrier does not take a card at four in the morning.",
          ar: "البند الأخير يبدو تافهاً إلى أن يرفض حاجز الموقف البطاقة في الرابعة فجراً.",
        },
      ],
      cites: ["nhs-hospital-bag"],
    },
    {
      heading: {
        en: "Her bag and the baby's bag",
        ar: "حقيبتها وحقيبة الطفل",
      },
      body: [
        {
          en: "She will pack these, and you should know what is in them, because you are the one who will be asked to find something. Hers covers the birth plan and notes, loose clothing for labour, a dressing gown, slippers, front-opening nightwear, changes of clothes, socks, disposable underwear, nursing bras, breast pads, maternity pads, a wash bag, towels, snacks and a water bottle, medication, glasses, and a spare bag for laundry.",
          ar: "هي من ستحزم هاتين، وعليك أن تعرف ما فيهما، لأنك أنت من سيُطلب منه العثور على شيء. حقيبتها تشمل خطة الولادة والأوراق، وملابس فضفاضة للمخاض، وروب، وشبشب، وملابس نوم تُفتح من الأمام، وملابس للتبديل، وجوارب، وملابس داخلية للاستعمال مرة واحدة، وحمّالات للرضاعة، وضمادات للصدر، وفوط نفاسية، وحقيبة أدوات نظافة، ومناشف، ومأكولات خفيفة وزجاجة ماء، ودواء، ونظارة، وكيساً إضافياً للملابس المتّسخة.",
        },
        {
          en: "The baby's: bodysuits and sleepsuits, an outfit for going home, a hat and scratch mittens, socks or booties, nappies, cotton wool or wipes, muslin squares, a blanket or shawl — and the car seat, which is the one item that cannot be improvised on the day and without which you may not be able to leave.",
          ar: "وحقيبة الطفل: صدريات وأفرولات نوم، وملابس للعودة إلى البيت، وقبّعة وقفّازات تمنع الخدش، وجوارب أو أحذية صغيرة، وحفّاضات، وقطن طبّي أو مناديل مبلّلة، وقطع شاش قطنية، وبطّانية أو شال — ومقعد السيارة، وهو البند الوحيد الذي لا يمكن تدبيره في اليوم نفسه والذي قد لا تستطيعا المغادرة بدونه.",
        },
      ],
      cites: ["nhs-hospital-bag"],
    },
  ],
  faqs: [
    {
      q: {
        en: "Is the car seat really needed to leave?",
        ar: "هل مقعد السيارة لازم فعلاً للمغادرة؟",
      },
      a: {
        en: "It appears on the published list of what to bring for the baby, and separate guidance requires a car seat suitable for the baby's weight and correctly fitted. Local hospital policy varies, so confirm with the clinic — but it is not the thing to discover on the day.",
        ar: "يرد ضمن القائمة المنشورة لما يُحضَر للطفل، وتشترط إرشادات منفصلة مقعداً مناسباً لوزن الطفل ومركَّباً بشكل صحيح. وسياسة المستشفيات تختلف محلّياً، فتأكّدا من العيادة — لكنه ليس ما يُكتشف في اليوم نفسه.",
      },
      cites: ["nhs-hospital-bag", "nhs-what-you-need"],
    },
    {
      q: {
        en: "How long should I pack for?",
        ar: "لكم يوم أحزم؟",
      },
      a: {
        en: "The guidance does not name a number of nights, which is itself the answer: it is not predictable. The bag list includes three changes of clothes for her and a change plus toiletries for you, which is sized for more than a single afternoon.",
        ar: "لا تحدّد الإرشادات عدد ليالٍ، وهذا في ذاته هو الجواب: الأمر غير قابل للتنبّؤ. وقائمة الحقيبة تشمل ثلاث بدلات ملابس لها، وبدلة وأدوات نظافة لك، وهو حجم يفوق ظهيرة واحدة.",
      },
      cites: ["nhs-hospital-bag"],
    },
  ],
  cta: {
    headline: {
      en: "Tick your half of the list off in the app",
      ar: "أنجِز نصفك من القائمة داخل التطبيق",
    },
    body: {
      en: "Nawah's hospital bag list opens on the father's side too, so your bag is not the one nobody was tracking. Pack it at week 37 and stop thinking about it.",
      ar: "قائمة حقيبة المستشفى في نواة تُفتح من جهة الأب أيضاً، فلا تكون حقيبتك هي التي لم يتابعها أحد. احزمها في الأسبوع ٣٧ وتوقّف عن التفكير فيها.",
    },
    button: { en: "Get Nawah free", ar: "حمّل نواة مجاناً" },
  },
  citations: [CITE_BAG, CITE_BABYNEEDS],
  updated: "2026-08-22",
};

/**
 * Article 7 — قلق الأب واكتئابه.
 *
 * ⚠️ The number in here is load-bearing and it is NOT the one in circulation.
 * Search results repeat "1 in 10 dads get postnatal depression" everywhere;
 * the two pages carrying it that we tried both returned 403, so it is not
 * used. What is used is the NHS Best Start in Life wording we did open:
 * "Up to 1 in 5 women and 1 in 10 men develop mental health problems such as
 * depression or anxiety during pregnancy, or in the first year after
 * childbirth." Different claim, different scope, actually verified.
 *
 * ⚠️ The CTA must not imply Nawal treats anything. It is an AI chat feature in
 * a pregnancy app, and presenting it as a substitute for care on a page about
 * suicidal ideation would be indefensible. The article sends the reader to a
 * doctor; the CTA claims only that the app treats the father as a participant.
 */
const fathersMentalHealth: FatherArticle = {
  slug: "fathers-mental-health",
  published: true,
  hero: {
    src: "/father/fathers-mental-health-hero.jpg",
    alt: {
      en: "An empty chair beside a wooden cabinet in a dim room with tall windows.",
      ar: "كرسيّ فارغ بجانب خزانة خشبية في غرفة خافتة الإضاءة ذات نوافذ عالية.",
    },
    photographer: "Nothing Ahead",
    photographerUrl: "https://www.pexels.com/@ian-panelo",
    pexelsUrl: "https://www.pexels.com/photo/an-armchair-and-wooden-cabinet-near-windows-7930485/",
    width: 6000,
    height: 3964,
  },
  title: {
    en: "The father's own head: the part nobody asks about",
    ar: "رأس الأب نفسه: الجزء الذي لا يسأل عنه أحد",
  },
  metaTitle: {
    en: "Depression and Anxiety in New Fathers | Nawah",
    ar: "الاكتئاب والقلق عند الآباء الجدد | نواة",
  },
  description: {
    en: "Fathers and partners can develop depression and anxiety during pregnancy and the first year. What the published figures say, the signs, and where to take it.",
    ar: "الآباء والشركاء قد يُصابون بالاكتئاب والقلق أثناء الحمل وفي السنة الأولى. ماذا تقول الأرقام المنشورة، وما العلامات، وإلى أين تذهب بها.",
  },
  standfirst: {
    en: "Every appointment in nine months is about her and about the baby, correctly. The consequence is that nobody in the system ever asks you a question, and a man can go a year assuming that means there is nothing to ask.",
    ar: "كل موعد في تسعة أشهر يدور حولها وحول الجنين، وهذا صحيح. والنتيجة أن لا أحد في المنظومة يوجّه إليك سؤالاً، فيمضي الرجل عاماً وهو يفترض أن ذلك يعني أنه لا يوجد ما يُسأل عنه.",
  },
  sections: [
    {
      heading: {
        en: "What the published figures say",
        ar: "ماذا تقول الأرقام المنشورة",
      },
      body: [
        {
          en: "The NHS states: \"Up to 1 in 5 women and 1 in 10 men develop mental health problems such as depression or anxiety during pregnancy, or in the first year after childbirth.\"",
          ar: "تقول هيئة الصحة البريطانية: «ما يصل إلى واحدة من كل خمس نساء، وواحد من كل عشرة رجال، يُصابون بمشكلات في الصحة النفسية مثل الاكتئاب أو القلق أثناء الحمل، أو في السنة الأولى بعد الولادة».",
        },
        {
          en: "Note the scope, because it is wider than the phrase people usually repeat. It covers depression and anxiety, it covers pregnancy as well as after the birth, and it runs for a full year. It is not a statement about the first fortnight.",
          ar: "لاحظ النطاق، فهو أوسع من العبارة التي يردّدها الناس عادةً. يشمل الاكتئاب والقلق، ويشمل الحمل كما يشمل ما بعد الولادة، ويمتدّ سنة كاملة. وليس حديثاً عن الأسبوعين الأولين.",
        },
        {
          en: "Separately, the page on postnatal depression says in as many words that \"Fathers and partners can also have depression after having a baby.\" It is a recognised thing with a name, not a description of being tired.",
          ar: "وبشكل منفصل، تقول صفحة اكتئاب ما بعد الولادة صراحةً إن «الآباء والشركاء قد يُصابون أيضاً بالاكتئاب بعد إنجاب طفل». هو أمر معروف وله اسم، لا وصف لكونك متعباً.",
        },
      ],
      cites: ["nhs-your-mental-health", "nhs-postnatal-depression"],
    },
    {
      heading: {
        en: "The signs",
        ar: "العلامات",
      },
      body: [
        {
          en: "The listed symptoms are not gendered, and they are worth reading against your own last month rather than in the abstract.",
          ar: "الأعراض المذكورة ليست خاصة بجنس دون آخر، ويستحقّ أن تقرأها في ضوء شهرك الأخير أنت لا في المطلق.",
        },
      ],
      bullets: [
        {
          en: "Low mood that persists, and no longer enjoying things.",
          ar: "انخفاض مزاج مستمرّ، وفقدان الاستمتاع بالأشياء.",
        },
        { en: "Hopelessness, or guilt.", ar: "يأس، أو شعور بالذنب." },
        { en: "Anxiety and restlessness.", ar: "قلق وتوتّر لا يهدأ." },
        {
          en: "Not sleeping, or not being able to concentrate.",
          ar: "عدم النوم، أو عدم القدرة على التركيز.",
        },
        {
          en: "Difficulty bonding with the baby.",
          ar: "صعوبة في التواصل العاطفي مع الطفل.",
        },
      ],
      afterBullets: [
        {
          en: "It is worth getting help \"even if you only have some of the signs\" — that phrasing is the NHS's, and it exists precisely because people wait until they qualify on every line.",
          ar: "ويستحقّ طلب المساعدة «حتى إن لم تظهر عليك سوى بعض العلامات» — والصياغة صياغة الهيئة نفسها، وهي موجودة تحديداً لأن الناس ينتظرون حتى تنطبق عليهم كل البنود.",
        },
      ],
      cites: ["nhs-postnatal-depression"],
    },
    {
      heading: {
        en: "Where to take it",
        ar: "إلى أين تذهب بها",
      },
      body: [
        {
          en: "The named routes are a GP, a midwife or a health visitor. That is a low bar deliberately — you are not required to have a diagnosis, or a crisis, or a tidy explanation, before you are allowed to raise it.",
          ar: "الجهات المذكورة هي طبيب الأسرة أو القابلة أو زائرة الصحة. وهذا حدّ منخفض عن قصد — لا يُشترط أن يكون لديك تشخيص أو أزمة أو تفسير مرتّب قبل أن يُسمح لك بطرح الأمر.",
        },
        {
          en: "Symptoms can begin during the pregnancy, soon after the birth, or up to a year after. If you are reading this eight months in and assuming the window has closed, it has not.",
          ar: "قد تبدأ الأعراض أثناء الحمل، أو بعد الولادة بقليل، أو حتى بعد عام. وإن كنت تقرأ هذا بعد ثمانية أشهر وتفترض أن النافذة أُغلقت، فهي لم تُغلق.",
        },
      ],
      cites: ["nhs-postnatal-depression"],
    },
    {
      heading: {
        en: "The small version, on the day itself",
        ar: "النسخة الصغيرة، في اليوم نفسه",
      },
      body: [
        {
          en: "Not everything here is an illness. Some of it is a man who has not eaten since yesterday. The birth-partner guidance ends on exactly that instruction — have plenty of snacks and drinks to keep your own energy levels up, and take a short break when you can.",
          ar: "ليس كل ما هنا مرضاً. بعضه رجل لم يأكل منذ الأمس. وتنتهي إرشادات مرافق الولادة بهذه التعليمة بالذات — احرص على ما يكفي من الطعام والشراب لتحافظ على طاقتك أنت، وخذ استراحة قصيرة متى أمكن.",
        },
        {
          en: "It reads like a footnote and it is in the official list for a reason. Depleted is not a character trait, and it is not a form of loyalty either.",
          ar: "تبدو كحاشية، وهي في القائمة الرسمية لسبب. الإنهاك ليس سمة شخصية، وليس شكلاً من أشكال الوفاء أيضاً.",
        },
      ],
      cites: ["nhs-birth-partner"],
    },
  ],
  redFlags: {
    heading: {
      en: "Get help today, not at some better moment",
      ar: "اطلب المساعدة اليوم، لا في لحظة أفضل",
    },
    intro: {
      en: "These are not things to sit with until the baby is older.",
      ar: "هذه ليست أموراً تُحتمَل إلى أن يكبر الطفل.",
    },
    items: [
      {
        en: "Thoughts of suicide, or of harming yourself, or of harming the baby. These appear on the NHS symptom list, and they are the point at which this stops being something to monitor.",
        ar: "أفكار عن الانتحار أو إيذاء نفسك أو إيذاء الطفل. ترد هذه في قائمة الأعراض، وهي النقطة التي يتوقّف عندها الأمر عن كونه شيئاً تراقبه.",
      },
      {
        en: "Symptoms that have lasted more than a couple of weeks, are getting worse, or are making it hard to cope.",
        ar: "أعراض استمرّت أكثر من أسبوعين، أو تزداد سوءاً، أو تجعل تدبّر الأمور صعباً.",
      },
      {
        en: "If you are in crisis now, contact the emergency number in your country or go to the nearest emergency department. Do not wait for an appointment.",
        ar: "إن كنت في أزمة الآن، فاتصل برقم الطوارئ في بلدك أو توجّه إلى أقرب قسم طوارئ. لا تنتظر موعداً.",
      },
    ],
    cites: ["nhs-postnatal-depression"],
  },
  faqs: [
    {
      q: {
        en: "I did not give birth. Can this really apply to me?",
        ar: "أنا لم ألد. هل ينطبق هذا عليّ فعلاً؟",
      },
      a: {
        en: "The NHS puts men in the same sentence as women when giving the figure, and states separately that fathers and partners can have depression after a baby. It is recognised in the guidance itself, not an analogy someone drew.",
        ar: "تضع هيئة الصحة البريطانية الرجال في الجملة نفسها مع النساء عند ذكر الرقم، وتنصّ منفصلةً على أن الآباء والشركاء قد يُصابون بالاكتئاب بعد الطفل. الأمر معترف به في الإرشادات ذاتها، لا تشبيهاً وضعه أحد.",
      },
      cites: ["nhs-your-mental-health", "nhs-postnatal-depression"],
    },
    {
      q: {
        en: "She is the one struggling. Is it not selfish to bring this up?",
        ar: "هي من تعاني. أليس من الأنانية أن أطرح هذا؟",
      },
      a: {
        en: "The guidance treats both as ordinary and treatable rather than as a competition, and one of the listed risk contexts for either parent is the other parent struggling. Getting yourself seen is not a withdrawal from her care.",
        ar: "تتعامل الإرشادات مع الحالتين بوصفهما أمراً عادياً قابلاً للعلاج لا منافسة، وأحد سياقات الخطر المذكورة لأيّ من الوالدين هو معاناة الآخر. وأن تعرض نفسك على مختصّ ليس انسحاباً من رعايتها.",
      },
      cites: ["nhs-your-mental-health"],
    },
    {
      q: {
        en: "Can I talk to Nawal about this instead?",
        ar: "هل أتحدّث إلى نوال عن هذا بدلاً من ذلك؟",
      },
      a: {
        en: "No — not instead. Nawal is a chat feature in a pregnancy app. It is not a clinician, it cannot assess you, and nothing it says should stand between you and a GP on this subject. If it is easier to type something at 2am than to say it to a person, that is fine as a first step and only as a first step.",
        ar: "لا — ليس بدلاً من ذلك. نوال ميزة محادثة داخل تطبيق حمل. ليست مختصّاً، ولا تستطيع تقييمك، ولا ينبغي لشيء تقوله أن يقف بينك وبين طبيب في هذا الموضوع. وإن كان كتابة شيء في الثانية فجراً أسهل من قوله لإنسان، فلا بأس بذلك كخطوة أولى، وكخطوة أولى فقط.",
      },
    },
  ],
  cta: {
    headline: {
      en: "An app that has a side for you at all",
      ar: "تطبيق له جهة لك أنت أصلاً",
    },
    body: {
      en: "Nawah runs a father's mode: your own view of the week, the shared journal, the alerts. It is not care and it does not pretend to be — but going through nine months as a registered participant rather than a spectator is not nothing, and it is where noticing usually starts.",
      ar: "في نواة وضعٌ للأب: عرضك أنت للأسبوع، ودفتر اليوميات المشترك، والتنبيهات. ليس رعاية ولا يدّعي ذلك — لكن أن تمرّ بتسعة أشهر بوصفك مشاركاً مسجَّلاً لا متفرّجاً ليس بلا قيمة، ومن هناك عادةً يبدأ الانتباه.",
    },
    button: { en: "Get Nawah free", ar: "حمّل نواة مجاناً" },
  },
  citations: [CITE_MENTAL, CITE_PND, CITE_PARTNER],
  updated: "2026-08-22",
};

/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Every article, in reading order. Order matters: it is what the hub lists and
 * what prev/next walks, so a new article is inserted where it belongs rather
 * than appended by default.
 *
 * The order is the pregnancy's, not the writing order. Mood applies from the
 * day they find out; the scan is week 20; movements begin around then and stay
 * relevant to the end; the budget is a second-trimester job; the bag is week
 * 37; labour is term. The father's own mental health goes last because it is
 * the only one whose window runs a year past the birth.
 */
export const fatherArticles: FatherArticle[] = [
  herMood,
  scan20Weeks,
  babyMovements,
  babyBudget,
  hospitalBag,
  labourSigns,
  fathersMentalHealth,
];

export function publishedArticles(): FatherArticle[] {
  return fatherArticles.filter((a) => a.published);
}

export function getArticle(slug: string): FatherArticle | undefined {
  return publishedArticles().find((a) => a.slug === slug);
}
