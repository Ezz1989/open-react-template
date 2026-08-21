import type { Locale } from "./constants";
import type { Localized } from "./guide-content";

/**
 * The About page.
 *
 * Lives at /ar/about and /en/about rather than under the marketing route
 * group, for the same reason the guide does: the homepage swaps languages
 * client-side at a single URL, so its Arabic is invisible to a crawler. An
 * About page is one of the strongest trust signals a site has, and on YMYL
 * health content Google weighs "background about the author or the site that
 * publishes it". It only counts if it can be read in the language the audience
 * reads.
 *
 * VOICE
 * -----
 * The spine of this page is one distinction: support is not the same as
 * sharing. She is inside the pregnancy; he is beside it. That is a distance,
 * not a failing, which is why software can narrow it and why no amount of
 * effort alone closes it.
 *
 * Two rules that must survive any edit:
 *
 * 1. Nobody is blamed. Not the father, not the mother, not the family. The
 *    father is half the audience and the entire differentiator, and copy that
 *    makes him look foolish costs more than it earns.
 * 2. The app narrows the distance. It never closes it. A reader who has lived
 *    this will forgive a modest claim and never forgive an inflated one.
 */

export interface AboutBlock {
  /** Optional section heading. Omitted for the opening narrative blocks. */
  heading?: Localized;
  paragraphs: Localized[];
  /** Rendered larger and in the display face. Used for the thesis lines. */
  emphasis?: boolean;
}

export interface AboutPromise {
  title: Localized;
  body: Localized;
}

export const ABOUT_META: {
  title: Localized;
  metaTitle: Localized;
  description: Localized;
  kicker: Localized;
} = {
  title: { en: "The small seed everything grows from", ar: "البذرة الصغيرة التي يبدأ منها كل شيء" },
  metaTitle: {
    en: "About Nawah — Why We Built It | Nawah",
    ar: "من نحن — لماذا بنينا نواة | نواة",
  },
  description: {
    en: "We watched my sister go through her pregnancy surrounded by people, and still alone in one specific way. Support is not the same as sharing. That is why Nawah exists.",
    ar: "رأينا أختي تمرّ بحملها محاطة بالجميع، ووحيدة رغم ذلك بطريقة واحدة. الدعم شيء والمشاركة شيء آخر. لهذا وُجدت نواة.",
  },
  kicker: { en: "About us", ar: "من نحن" },
};

/** The opening: her moment, before any mention of the company. */
export const ABOUT_OPENING: AboutBlock[] = [
  {
    paragraphs: [
      {
        en: "The moment you see the two lines, everything changes.",
        ar: "في اللحظة التي ترين فيها الخطّين، يتغيّر كل شيء.",
      },
      {
        en: "Joy, fear, and a thousand questions with nobody obvious to ask.",
        ar: "فرح، وخوف، وألف سؤال لا تعرفين لمن توجّهينها.",
      },
      {
        en: "So you open your phone. You find translated words in a voice that isn't yours, and apps written for a woman who lives somewhere else, whose life is not your life.",
        ar: "تفتحين هاتفكِ وتبحثين. تجدين كلاماً مترجماً بلغة لا تشبهكِ، وتطبيقات كُتبت لامرأة تعيش في مكان آخر، وحياتها ليست حياتكِ.",
      },
    ],
  },
];

/** The founding story. The heart of the page. */
export const ABOUT_STORY: AboutBlock[] = [
  {
    heading: { en: "Why we built it", ar: "لماذا بنيناه" },
    paragraphs: [
      {
        en: "We watched my sister go through her pregnancy.",
        ar: "رأينا أختي تمرّ بحملها.",
      },
      {
        en: "She was never alone. The house was full, hands everywhere, her husband beside her the entire way.",
        ar: "لم تكن وحدها يوماً. البيت مليء، والأيدي ممدودة، وزوجها بجانبها لا يفارقها.",
      },
      {
        en: "And she was still exhausted and anxious.",
        ar: "ومع ذلك، كانت مرهقة وقلقة.",
      },
      {
        en: "It took us a while to understand why.",
        ar: "وتأخّرنا قليلاً حتى فهمنا السبب.",
      },
    ],
  },
  {
    emphasis: true,
    paragraphs: [
      {
        en: "Support is not the same as sharing.",
        ar: "الدعم شيء، والمشاركة شيء آخر.",
      },
    ],
  },
  {
    paragraphs: [
      {
        en: "He held her when she was frightened. But the fear stayed hers alone.",
        ar: "كان يحتضنها حين تخاف. لكن الخوف بقي خوفها وحدها.",
      },
      {
        en: "The first time the baby moved, she gasped. He was in the next room. The joy reached him as news, not as a feeling.",
        ar: "وحين تحرّك الطفل لأول مرة، ارتجفت من الفرح، وكان هو في الغرفة المجاورة. وصلته الفرحة خبراً، لا شعوراً.",
      },
      {
        en: "She carries the journey inside her body. He stands beside her, loving her from the outside.",
        ar: "هي تحمل الرحلة في جسدها. وهو يقف بجانبها، يحبّها من الخارج.",
      },
      {
        en: "That distance is nobody's fault. It is simply how it is. But it does not have to stay that wide.",
        ar: "هذه المسافة ليست ذنب أحد. هكذا هي الأمور. لكنها لا يجب أن تبقى بهذا الاتساع.",
      },
    ],
  },
  {
    emphasis: true,
    paragraphs: [
      {
        en: "So we asked ourselves: what if we could close it?",
        ar: "فسألنا أنفسنا: ماذا لو استطعنا تقريبها؟",
      },
    ],
  },
  {
    paragraphs: [
      {
        en: "Not to replace him. To connect him.",
        ar: "لا لنحلّ محلّه، بل لنوصله بها.",
      },
      {
        en: "Let the kick reach his phone the second it happens. Let him wake up knowing what week they are in, and what her body is doing today. Give him something to say, something to do, and a moment to share.",
        ar: "أن تصل الركلة إلى هاتفه في اللحظة ذاتها. أن يستيقظ فيعرف في أي أسبوع هما، وما الذي يمرّ به جسدها اليوم. أن يجد ما يقوله، وما يفعله، ولحظة يشاركها إياها.",
      },
      {
        en: "We built Nawah to turn pregnancy from something she goes through alone into something they go through together.",
        ar: "بنينا نواة لتتحوّل الرحلة من شيء تمرّ به وحدها إلى شيء يمرّان به معاً.",
      },
      {
        en: "That is the whole app. Every feature in it serves that one sentence.",
        ar: "هذا هو التطبيق كله. وكل ميزة فيه تخدم هذه الجملة الواحدة.",
      },
    ],
  },
];

/**
 * The father section. This is the differentiator, so it is the longest block
 * on the page, and every claim below is checked against the shipped app rather
 * than written as marketing:
 *
 *   own weekly view    → lib/features/father_dashboard/
 *   kick alerts        → father_kick_alerts_screen.dart + send-kick-alert
 *   hospital bag       → hospital_bag_screen.dart
 *   budget by currency → baby_budget_screen.dart (EGP, SAR, AED, USD)
 *   note she finds     → journal_entries with is_shared
 *
 * If a feature is ever removed from the app, the matching line here goes too.
 */
export const ABOUT_FATHER: {
  heading: Localized;
  intro: Localized[];
  points: AboutPromise[];
  close: Localized;
} = {
  heading: {
    en: "And the father gets a real place, not a back seat",
    ar: "وللأب مكان حقيقي، لا مقعد في الخلف",
  },
  intro: [
    {
      en: "Most pregnancy apps give the father one page called \"tips for your partner,\" then forget him.",
      ar: "معظم تطبيقات الحمل تعطي الأب صفحة واحدة عنوانها «نصائح للزوج»، ثم تنساه.",
    },
    {
      en: "We give him the whole app.",
      ar: "نحن نعطيه التطبيق كاملاً.",
    },
  ],
  points: [
    {
      title: { en: "His own week", ar: "أسبوعه هو" },
      body: {
        en: "The same week you are living, written for him, in his language. He opens the app in the morning and knows what is happening inside you today.",
        ar: "نفس الأسبوع الذي تعيشينه، مكتوب له وبلغته. يفتح التطبيق في الصباح فيعرف ما الذي يحدث اليوم داخلكِ.",
      },
    },
    {
      title: { en: "He knows before you have to ask", ar: "يعرف قبل أن تطلبي" },
      body: {
        en: "When you log the baby's kicks, an alert reaches his phone. He is not asking whether the baby moved today. He already knows.",
        ar: "حين تسجّلين ركلات الطفل، يصله تنبيه على هاتفه. لا يسأل «هل تحرّك اليوم؟» بل يعرف.",
      },
    },
    {
      title: { en: "Something to do, not something to say", ar: "شيء يفعله، لا شيء يقوله" },
      body: {
        en: "The hospital bag splits three ways: yours, the baby's, his. The baby budget in his own currency.",
        ar: "حقيبة المستشفى مقسّمة ثلاثة: لكِ، للطفل، له. وميزانية الطفل بعملته هو.",
      },
    },
    {
      title: { en: "Words for when he has none", ar: "كلمات حين تعجز الكلمات" },
      body: {
        en: "He leaves you a note you will find at 4 a.m. And weekly prompts, so he never goes quiet just because he did not know where to start.",
        ar: "يترك لكِ رسالة تجدينها في الرابعة فجراً. وأسئلة أسبوعية جاهزة، فلا يقف صامتاً لأنه لم يعرف من أين يبدأ.",
      },
    },
  ],
  close: {
    en: "In Nawah the father is not a guest at his wife's pregnancy. He is half the journey.",
    ar: "الأب في نواة ليس ضيفاً على حمل زوجته. هو نصف الرحلة.",
  },
};

export const ABOUT_PROMISES: { heading: Localized; items: AboutPromise[] } = {
  heading: { en: "What we promise you", ar: "ما نَعِدُكِ به" },
  items: [
    {
      title: { en: "You will find your own language here", ar: "أن تجدي لغتكِ" },
      body: {
        en: "Simple, warm Arabic. Written first, not translated afterwards.",
        ar: "عربية بسيطة، دافئة، مكتوبة من البداية لا مترجمة.",
      },
    },
    {
      title: { en: "We will be there at 3 a.m.", ar: "أن نكون معكِ في الثالثة فجراً" },
      body: {
        en: "Nawal is awake. Ask her anything, any hour, with no waiting for morning.",
        ar: "نوال مستيقظة. تسألينها في أي وقت، ولا تنتظرين الصباح.",
      },
    },
    {
      title: { en: "He will be there, present", ar: "أن يكون بجانبكِ حاضراً" },
      body: {
        en: "He will know what week you are in without you having to explain it.",
        ar: "يعرف في أي أسبوع أنتما، دون أن تشرحي له.",
      },
    },
    {
      title: { en: "We will tell you the truth", ar: "أن نقول لكِ الحقيقة" },
      body: {
        en: "Every fact in our guide has a source, and the date we last checked it.",
        ar: "كل معلومة في دليلنا لها مصدر، ومكتوب متى راجعناه.",
      },
    },
  ],
};

export const ABOUT_NAME: AboutBlock = {
  heading: { en: "Our name says what we believe", ar: "واسمنا يقول ما نؤمن به" },
  paragraphs: [
    {
      en: "A seed is small, but it is the centre. The whole fruit grows out of it.",
      ar: "النواة صغيرة، لكنها القلب. منها تبدأ الثمرة كلها.",
    },
    {
      en: "Your child is that seed. And the two of you grow around it.",
      ar: "طفلكما نواة. وأنتما تكبران حوله.",
    },
  ],
};

export const ABOUT_MOTTO: Localized = {
  en: "Become each other's centre.",
  ar: "كونوا مركز بعضكم.",
};

export const ABOUT_CTA: { body: Localized; button: Localized } = {
  body: {
    en: "Nawah is free, in Arabic and English, for both of you.",
    ar: "نواة مجاني، بالعربية والإنجليزية، لكما معاً.",
  },
  button: { en: "Get Nawah on Google Play", ar: "حمّلوا نواة من جوجل بلاي" },
};

/** Locale-aware helper so the page never reaches into a Localized by hand. */
export function pick(v: Localized, locale: Locale): string {
  return v[locale];
}
