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
 * THE P4 TOPIC-CLUSTER ARTICLES — standalone SEO articles that are neither a
 * pregnancy month nor a father event.
 *
 * WHY A THIRD CONTENT TYPE INSTEAD OF FORCING ONE OF THE OTHER TWO
 * ------------------------------------------------------------------------
 * `GuideMonth` is indexed by gestational month; `FatherArticle` is indexed by
 * a father-facing event and always addresses him. Neither index fits a topic
 * like صيام الحامل or تكلفة الولادة — these aren't tied to a month, and most
 * aren't father-voiced. Reusing `Section`/`RedFlags`/`Faq`/`Citation`/
 * `GuideCta`/`GuideImage`/`Localized` from guide-content.ts rather than
 * redeclaring them, since the shape of a paragraph or a citation doesn't
 * change with the content type — only `cluster`/`slug` as the new index does.
 *
 * Generated via `scripts/articles/make_gemini_prompt.js` (paste into Gemini,
 * JSON back), then hand-verified against the citation rule in
 * `docs/ARTICLE_PATTERN.md` §5 before being written here — see each entry's
 * `verifiedNote` for what was checked or changed from the raw Gemini draft.
 */
export interface Article {
  /** Which of the 11 clusters in `scripts/articles/clusters.js` this is. */
  cluster: string;
  /** URL segment. */
  slug: string;
  published: boolean;

  hero: GuideImage;

  /** Block 1 of the structure per `docs/ARTICLE_PATTERN.md` §3. */
  eyebrow: Localized;
  title: Localized;
  metaTitle: Localized;
  description: Localized;
  standfirst: Localized;

  sections: Section[];
  redFlags?: RedFlags;
  faqs: Faq[];
  cta: GuideCta;
  citations: Citation[];

  /** ISO date. */
  updated: string;

  /** Not shown to readers — a record of what verification changed from the
   *  raw Gemini draft, for the next person who touches this file. */
  verifiedNote?: string;
}

export const ARTICLES: Article[] = [
  {
    cluster: "fasting",
    slug: "fasting-during-pregnancy",
    published: true,

    hero: {
      src: "/articles/fasting-hero.jpg",
      alt: {
        ar: "إبريق ماء صافٍ بجانب طبق من اللوز، على خلفية داكنة هادئة",
        en: "A clear glass pitcher of water beside a bowl of almonds on a calm dark background",
      },
      photographer: "cottonbro studio",
      photographerUrl: "https://www.pexels.com/@cottonbro",
      pexelsUrl: "https://www.pexels.com/photo/a-pitcher-with-water-beside-a-ceramic-bowl-6802639/",
      width: 6240,
      height: 4160,
    },

    eyebrow: {
      ar: "صحة الحامل",
      en: "Pregnancy health",
    },
    title: {
      ar: "صيام الحامل: الدليل الطبي الشامل لسلامتكِ",
      en: "Fasting While Pregnant: A Complete Medical Guide to Your Safety",
    },
    metaTitle: {
      ar: "صيام الحامل: الدليل الطبي الشامل لسلامتكِ",
      en: "Fasting While Pregnant: A Complete Medical Guide to Your Safety",
    },
    description: {
      ar: "دليل طبي حول صيام الحامل: تأثيره على الترطيب وسكر الدم، والحالات التي توصي الأبحاث فيها بتجنبه، والعلامات التي تستدعي كسر الصيام فورًا.",
      en: "A medical guide to fasting during pregnancy: effects on hydration and blood sugar, who research says should avoid it, and the warning signs that mean breaking the fast right away.",
    },
    standfirst: {
      ar: "تعرفي على تأثير الصيام على سكر الدم والترطيب، واكتشفي العلامات التي تستدعي كسر الصيام فورًا للحفاظ على سلامتكِ وسلامة طفلكِ.",
      en: "Learn how fasting affects blood sugar and hydration during pregnancy, and the warning signs that mean you should break your fast right away to protect yourself and your baby.",
    },

    sections: [
      {
        heading: {
          ar: "الموقف الطبي من صيام الحامل",
          en: "The medical picture on fasting during pregnancy",
        },
        body: [
          {
            ar: "نطرح هنا الصورة الطبية حول صيام الحامل. أما مسألة الوجوب الديني أو الإعفاء من الصيام فهي سؤال يوجه لمرجعيتكِ الدينية الخاصة، وليس لهذا المقال. لا يقدم هذا المقال أي فتاوى دينية.",
            en: "This article covers the medical picture only. Whether you are religiously required or exempted from fasting is a question for your own religious authority, not for this article. Nothing here is a religious ruling.",
          },
          {
            ar: "من الناحية الطبية، تختلف التوصيات باختلاف حالتكِ الصحية الفردية ووجود أي أمراض مزمنة مثل السكري. راقبي حركة طفلكِ وتغييرات جسمكِ يوميًا، واستشيري طبيبكِ لتقييم وضعكِ الخاص قبل اتخاذ القرار.",
            en: "Medically, the guidance depends on your individual health and whether you have a chronic condition such as diabetes. Track your baby's movement and your own body's changes daily, and ask your doctor to assess your specific case before you decide.",
          },
        ],
      },
      {
        heading: {
          ar: "تأثير صيام الحامل على الترطيب وسكر الدم",
          en: "How fasting affects hydration and blood sugar during pregnancy",
        },
        body: [
          {
            ar: "يؤثر الانقطاع عن الطعام والشراب لساعات طويلة على جسمكِ. الجفاف يسبب أعراضًا مثل الدوار والشعور بالتعب، وفي حالاته الشديدة قد يصل إلى تسارع في ضربات القلب أو التنفس. لذلك يجب عليكِ شرب كميات وفيرة من الماء بين الإفطار والسحور.",
            en: "Going without food or water for long hours affects your body. Dehydration causes symptoms like dizziness and fatigue, and in severe cases can progress to a rapid heartbeat or rapid breathing. Drink plenty of water between iftar and suhoor.",
          },
          {
            ar: "أما خطر انخفاض سكر الدم أثناء الصيام فهو موثق بشكل خاص لدى الحوامل المصابات بسكري الحمل أو السكري من النوع الأول، حيث رصدت الأبحاث زيادة في نوبات هبوط السكر خلال الساعات الأخيرة من الصيام لدى هذه الفئة تحديدًا.",
            en: "The risk of low blood sugar during a fast is specifically documented in pregnant women with gestational diabetes or type 1 diabetes — research found an increase in hypoglycemia episodes in the last hours of fasting in this group specifically.",
          },
        ],
        cites: ["medlineplus-dehydration", "pmc-ramadan-diabetes-pregnancy"],
      },
      {
        heading: {
          ar: "احتياج الحامل من السعرات في الثلث الأخير",
          en: "A pregnant woman's calorie needs in the third trimester",
        },
        body: [
          {
            ar: "يحتاج جسمكِ في الثلث الأخير من الحمل طاقة أكبر لدعم نمو طفلكِ السريع. تشير مصادر طبية موثوقة إلى أن الحامل تحتاج في هذه المرحلة إلى نحو ٢٤٠٠ سعرة حرارية يوميًا للحفاظ على نمو صحي، وهو ما يجعل الصيام لساعات طويلة أكثر إرهاقًا وتحديًا لكِ في هذا الثلث تحديدًا.",
            en: "Your body needs more energy in the third trimester to support your baby's rapid growth. Reliable medical sources put a pregnant woman's needs at around 2,400 calories a day at this stage, which is what makes long fasting hours more exhausting specifically in this trimester.",
          },
        ],
        cites: ["medlineplus-nutrition-third-trimester"],
      },
      {
        heading: {
          ar: "الحالات الطبية التي تستدعي الحذر من صيام الحامل",
          en: "Medical conditions that call for caution around fasting in pregnancy",
        },
        body: [
          {
            ar: "التوصية الطبية الموثقة الأوضح تخص الحوامل المصابات بسكري الحمل أو السكري من النوع الأول: الأبحاث الطبية تنصح هذه الفئة تحديدًا بعدم الصيام، لارتفاع خطر هبوط السكر الحاد أثناء ساعات الصيام الأخيرة.",
            en: "The clearest documented medical recommendation concerns women with gestational or type 1 diabetes: research specifically advises this group against fasting, because of the elevated risk of severe hypoglycemia in the last hours of the fast.",
          },
          {
            ar: "بالنسبة لأي حالة صحية أخرى، سواء فقر دم أو قيء مستمر أو أي مرض مزمن يستدعي دواءً منتظمًا نهارًا، فالقرار يعود لطبيبكِ المتابع لحالتكِ.",
            en: "For any other condition — anemia, persistent vomiting, or any chronic illness that needs regular daytime medication — the decision belongs to the doctor following your specific case.",
          },
        ],
        cites: ["pmc-ramadan-diabetes-pregnancy"],
      },
    ],

    redFlags: {
      intro: {
        ar: "اتصلي بطبيبكِ فورًا إذا شعرتِ بأي مما يلي أثناء الصيام:",
        en: "Contact your doctor immediately during a fast if you notice any of the following:",
      },
      items: [
        {
          ar: "الشعور بالعطش الشديد، أو ملاحظة تحول لون البول للداكن جدًا.",
          en: "Severe thirst, or urine that has turned very dark.",
        },
        {
          ar: "الشعور بالدوار المستمر، أو الضعف، أو نوبات الصداع الشديدة.",
          en: "Persistent dizziness, weakness, or severe headache episodes.",
        },
        {
          ar: "ملاحظة نقص ملحوظ أو تغير في حركة طفلكِ المعتادة.",
          en: "A noticeable drop or change in your baby's usual movement.",
        },
        {
          ar: "الشعور بالإعياء المفاجئ أو التعب الشديد خلال ساعات النهار.",
          en: "Sudden faintness or severe fatigue during daylight hours.",
        },
      ],
    },

    cta: {
      headline: {
        ar: "تابعي جسمكِ أثناء الصيام مع نواة",
        en: "Track your body through a fast with Nawah",
      },
      body: {
        ar: "تابعي كميات الماء التي تشربينها بين الإفطار والسحور وسجلي أي أعراض جديدة تشعرين بها باستخدام أداة تتبع الأعراض في تطبيق نواة.",
        en: "Track how much water you drink between iftar and suhoor, and log any new symptom you notice, using the symptom tracker in the Nawah app.",
      },
      button: {
        ar: "جربي نواة",
        en: "Try Nawah",
      },
    },

    faqs: [
      {
        q: {
          ar: "هل يؤثر صيام الحامل على وزن الجنين؟",
          en: "Does fasting while pregnant affect the baby's weight?",
        },
        a: {
          ar: "لا توجد أدلة قوية من مصادر موثوقة تثبت أن الصيام في حمل صحي غير مصاب بالسكري يقلل وزن الطفل بشكل مباشر، لكن من الضروري مراقبة حركة الجنين يوميًا واستشارة الطبيب.",
          en: "There is no strong evidence from reliable sources that fasting in a healthy, non-diabetic pregnancy directly reduces a baby's weight, but daily fetal-movement monitoring and a doctor's advice remain essential.",
        },
      },
      {
        q: {
          ar: "كيف أتجنب الجفاف أثناء صيام الحامل؟",
          en: "How do I avoid dehydration while fasting during pregnancy?",
        },
        a: {
          ar: "اشربي كميات وفيرة من الماء بين الإفطار والسحور، وانتبهي لعلامات الجفاف المبكرة مثل الدوار والتعب وتغير لون البول.",
          en: "Drink plenty of water between iftar and suhoor, and watch for early dehydration signs like dizziness, fatigue, and darker urine.",
        },
      },
      {
        q: {
          ar: "هل يمكن لمصابة سكري الحمل الصيام؟",
          en: "Can a woman with gestational diabetes fast?",
        },
        a: {
          ar: "التوصية الطبية الموثقة هي عدم الصيام لمصابات سكري الحمل أو السكري من النوع الأول، لارتفاع خطر هبوط السكر الحاد، وخاصة في الساعات الأخيرة من اليوم. استشيري طبيبكِ المتابع لحالتكِ قبل أي قرار.",
          en: "The documented medical recommendation is against fasting for women with gestational or type 1 diabetes, given the elevated risk of severe hypoglycemia, especially in the day's final hours. Consult the doctor following your case before deciding.",
        },
      },
    ],

    citations: [
      {
        id: "medlineplus-dehydration",
        org: "MedlinePlus",
        title: { en: "Dehydration", ar: "الجفاف" },
        url: "https://medlineplus.gov/dehydration.html",
        retrieved: "2026-09-15",
      },
      {
        id: "medlineplus-nutrition-third-trimester",
        org: "MedlinePlus",
        title: {
          en: "Eating right during pregnancy",
          ar: "التغذية السليمة أثناء الحمل",
        },
        url: "https://medlineplus.gov/ency/patientinstructions/000584.htm",
        retrieved: "2026-09-15",
      },
      {
        id: "pmc-ramadan-diabetes-pregnancy",
        org: "PMC / NCBI",
        title: {
          en: "Ramadan Fasting and Maternal and Fetal Outcomes in Pregnant Women with Diabetes Mellitus: Literature Review",
          ar: "صيام رمضان والنتائج على الأم والجنين لدى الحوامل المصابات بداء السكري: مراجعة أدبية",
        },
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9263982/",
        retrieved: "2026-09-15",
      },
    ],

    updated: "2026-09-15",

    verifiedNote:
      "Raw Gemini draft cited yourhealth.leicestershospitals.nhs.uk (fetched — unrelated PDF, dropped) " +
      "and tommys.org (not an approved body, 403 on fetch anyway, dropped). Replaced with MedlinePlus " +
      "(dehydration symptoms, third-trimester calorie figure) and one PMC/NCBI literature review " +
      "(diabetes-specific hypoglycemia finding). Removed unsourced UTI/blood-clot claims, the blanket " +
      "'no evidence of harm' framing, the +200kcal figure (traced to Tommy's; MedlinePlus states ~2400 " +
      "total kcal instead), and re-scoped the blood-sugar-drop claim to the diabetic population the " +
      "source actually covers. Anemia/hyperemesis kept only as 'ask your doctor', not asserted as fact.",
  },

  {
    cluster: "postpartum",
    slug: "postpartum-recovery",
    published: true,

    hero: {
      src: "/articles/postpartum-hero.jpg",
      alt: {
        ar: "لقطة مقرّبة لملاءات بيضاء متجعّدة على سرير، بإضاءة طبيعية هادئة",
        en: "A close-up of crumpled white bedsheets in soft, natural light",
      },
      photographer: "Cup of Couple",
      photographerUrl: "https://www.pexels.com/@cup-of-couple",
      pexelsUrl: "https://www.pexels.com/photo/overhead-shot-of-a-white-blanket-7303685/",
      width: 5657,
      height: 3771,
    },

    eyebrow: { ar: "الأربعين", en: "The forty days" },
    title: {
      ar: "الأربعين (فترة النفاس): دليلكِ لأسابيع التعافي",
      en: "The Forty Days: Your Guide to Postpartum Recovery",
    },
    metaTitle: {
      ar: "الأربعين (فترة النفاس): دليلكِ لأسابيع التعافي",
      en: "The Forty Days: Your Guide to Postpartum Recovery",
    },
    description: {
      ar: "دليل لتعافيكِ الجسدي والنفسي بعد الولادة: النزيف، العناية بالعجان والثدي، والفرق بين كآبة الأمومة واكتئاب ما بعد الولادة.",
      en: "A guide to your physical and emotional recovery after birth: bleeding, caring for stitches and your breasts, and the difference between the baby blues and postpartum depression.",
    },
    standfirst: {
      ar: "جسدكِ يحتاج أسابيع ليتعافى، ومشاعركِ تستحق الانتباه بقدر جسدكِ. إليكِ ما هو متوقع، وما الذي يستدعي الاتصال بطبيبكِ فورًا.",
      en: "Your body needs weeks to recover, and your feelings deserve as much attention as your body does. Here's what's expected, and what means calling your doctor right away.",
    },

    sections: [
      {
        heading: { ar: "النزيف بعد الولادة", en: "Bleeding after birth" },
        body: [
          {
            ar: "يبدأ جسمكِ بالتعافي فور الولادة. ستلاحظين نزول دم يشبه الدورة الشهرية الغزيرة، يستمر متقطعًا حتى نحو ستة أسابيع. يتغيّر لون الدم تدريجيًا من الأحمر الداكن إلى البني، ثم يقل حتى يتوقف.",
            en: "Your body starts recovering right after birth. You'll notice bleeding like a heavy period, continuing on and off for up to around six weeks. The blood gradually shifts from dark red to brown, then lightens and tapers off until it stops.",
          },
          {
            ar: "خلال هذه الفترة قد تشعرين أيضًا بألم في منطقة العجان إذا خضعتِ لخياطة — اغسليها يوميًا للمساعدة على منع الالتهاب. وستشعرين بامتلاء وثقل في ثدييكِ حين يبدأ إنتاج الحليب الفعلي في الأيام الأولى.",
            en: "During this time you may also feel pain around the perineum if you had stitches — bathe them daily to help prevent infection. Your breasts will feel full and tender once your milk properly comes in during the first few days.",
          },
        ],
        cites: ["medlineplus-postpartum-care"],
      },
      {
        heading: {
          ar: "كآبة الأمومة واكتئاب ما بعد الولادة",
          en: "Baby blues and postpartum depression",
        },
        body: [
          {
            ar: "من الشائع أن تشعري بالحزن أو القلق أو التهيّج لبضعة أيام بعد الولادة — وهو ما يُعرف بكآبة الأمومة، ويزول عادة خلال أسبوعين دون علاج.",
            en: "It's common to feel low, anxious, or irritable for a few days after birth — this is the baby blues, and it usually passes within two weeks without treatment.",
          },
          {
            ar: "أما إذا استمرت هذه المشاعر أكثر من ذلك، أو ازدادت سوءًا، أو صار من الصعب عليكِ تدبّر يومكِ، فهذا يشير إلى اكتئاب ما بعد الولادة — حالة مختلفة تمامًا، وقابلة للعلاج، تحتاج مساعدة مختصة. لا تحمّلي نفسكِ فوق طاقتها انتظارًا لأن يزول الأمر وحده.",
            en: "If these feelings last longer than that, get worse, or make it hard to cope day to day, that points to postpartum depression — a different, treatable condition that needs professional help. Don't push yourself to wait it out alone.",
          },
        ],
        cites: ["medlineplus-postpartum-care"],
      },
    ],

    redFlags: {
      intro: {
        ar: "اتصلي بطبيبكِ أو القابلة فورًا إذا لاحظتِ أيًا مما يلي:",
        en: "Contact your doctor or midwife right away if you notice any of the following:",
      },
      items: [
        {
          ar: "نزيف مفاجئ أو غزير، خصوصًا مع شعوركِ بالدوار.",
          en: "Sudden or heavy bleeding, especially if you feel dizzy.",
        },
        {
          ar: "حمّى أو قشعريرة أو ألم في البطن، خصوصًا مع إفرازات مهبلية كريهة الرائحة.",
          en: "Fever, chills, or tummy pain — especially with foul-smelling vaginal discharge.",
        },
        { ar: "صداع شديد أو مستمر.", en: "A severe or ongoing headache." },
        { ar: "ضيق في التنفس أو ألم في الصدر.", en: "Shortness of breath or chest pain." },
        { ar: "ألم أو احمرار أو تورّم في ربلة الساق.", en: "Pain, redness, or swelling in your calf." },
        {
          ar: "أفكار عن إيذاء نفسكِ أو طفلكِ.",
          en: "Thoughts of harming yourself or your baby.",
        },
      ],
      cites: ["nhs-cuh-postnatal-symptoms"],
    },

    cta: {
      headline: { ar: "تابعي أسابيعكِ بعد الولادة مع نواة", en: "Track your weeks after birth with Nawah" },
      body: {
        ar: "سجّلي أعراضكِ ومزاجكِ يوميًا عبر أداة تتبع الأعراض في نواة، لتلاحظي أي تغيّر يستحق مشاركته مع طبيبكِ.",
        en: "Log your symptoms and mood day by day with Nawah's symptom tracker, so you notice any change worth raising with your doctor.",
      },
      button: { ar: "جربي نواة", en: "Try Nawah" },
    },

    faqs: [
      {
        q: { ar: "متى يجب أن أقلق من النزيف بعد الولادة؟", en: "When should I worry about postpartum bleeding?" },
        a: {
          ar: "إذا كان النزيف مفاجئًا وغزيرًا خصوصًا مع دوار، أو صاحبته حمّى أو رائحة كريهة، فاتصلي بطبيبكِ فورًا. النزيف الخفيف المتناقص تدريجيًا على مدى أسابيع أمر متوقع.",
          en: "If the bleeding is sudden and heavy — especially with dizziness — or comes with fever or a bad smell, call your doctor right away. Light bleeding that gradually tapers off over several weeks is expected.",
        },
        cites: ["nhs-cuh-postnatal-symptoms"],
      },
      {
        q: {
          ar: "هل كآبة الأمومة نفس اكتئاب ما بعد الولادة؟",
          en: "Is the baby blues the same as postpartum depression?",
        },
        a: {
          ar: "لا. كآبة الأمومة أخف وتزول عادة خلال أسبوعين دون علاج. أما اكتئاب ما بعد الولادة فهو أطول وأشد وطأة، ويحتاج إلى مساعدة طبية مختصة.",
          en: "No. The baby blues are milder and usually pass within two weeks without treatment. Postpartum depression lasts longer and hits harder, and needs professional medical help.",
        },
        cites: ["medlineplus-postpartum-care"],
      },
    ],

    citations: [
      {
        id: "medlineplus-postpartum-care",
        org: "MedlinePlus",
        title: { en: "Postpartum care", ar: "الرعاية بعد الولادة" },
        url: "https://medlineplus.gov/postpartumcare.html",
        retrieved: "2026-09-16",
      },
      {
        id: "nhs-cuh-postnatal-symptoms",
        org: "NHS (Cambridge University Hospitals)",
        title: {
          en: "Postnatal signs and symptoms and who to call",
          ar: "الأعراض بعد الولادة ومتى تتصلين",
        },
        url: "https://www.cuh.nhs.uk/rosie-hospital/maternity/after-birth/signs-and-symptoms-and-who-to-call/",
        retrieved: "2026-09-16",
      },
    ],

    updated: "2026-09-16",

    verifiedNote:
      "Raw Gemini draft cited a dead medlineplus.gov/cesareansection... no — this is the postpartum " +
      "entry: draft's two sources (medlineplus-postpartumcare, nhs after-the-birth/your-body) both " +
      "fetched and confirmed for bleeding duration and blues-vs-PPD framing. Trimmed to 2 citations " +
      "per the 2026-09-16 cap (docs/ARTICLE_PATTERN.md §5): dropped the separate after-the-birth/your-" +
      "body and post-natal-depression/overview URLs, replaced the draft's unconfirmed 'baby blues starts " +
      "day 3' claim (not stated on the NHS PND page) with the general timing the source does confirm, " +
      "and replaced the draft's invented redFlags thresholds (soaked pad in an hour, 38°C) with the real " +
      "ones from the CUH Rosie Hospital postnatal-symptoms page.",
  },

  {
    cluster: "csection",
    slug: "c-section-vs-vaginal-birth",
    published: true,

    hero: {
      src: "/articles/csection-hero.jpg",
      alt: {
        ar: "غرفة مستشفى قديمة هادئة بأسرّة فارغة وإضاءة خافتة",
        en: "A dim, quiet vintage hospital room with empty beds",
      },
      photographer: "Odin Reyna",
      photographerUrl: "https://www.pexels.com/@odin-reyna-383507",
      pexelsUrl: "https://www.pexels.com/photo/empty-hospital-beds-8410648/",
      width: 6016,
      height: 4016,
    },

    eyebrow: { ar: "قرار الولادة", en: "The birth decision" },
    title: {
      ar: "قيصري أم طبيعي: الفروق الطبية ومسار التعافي",
      en: "C-Section or Vaginal Birth: The Medical Differences and Recovery Path",
    },
    metaTitle: {
      ar: "قيصري أم طبيعي: الفروق الطبية ومسار التعافي",
      en: "C-Section or Vaginal Birth: The Medical Differences and Recovery Path",
    },
    description: {
      ar: "مقارنة طبية محايدة بين الولادة القيصرية والطبيعية: الأسباب الطبية لكل خيار، مسار التعافي، والمخاطر التي يناقشها معكِ طبيبكِ.",
      en: "A neutral medical comparison of c-section and vaginal birth: the medical reasons behind each, the recovery path, and the risks your doctor will discuss with you.",
    },
    standfirst: {
      ar: "لا يوجد خيار \"أفضل\" بإطلاق — يوجد خيار يناسب وضعكِ الصحي. إليكِ الفروق الطبية الفعلية بين الطريقتين، من الأسباب إلى التعافي.",
      en: "There's no absolute \"better\" option — only the one that fits your specific health situation. Here are the real medical differences between the two, from reasons to recovery.",
    },

    sections: [
      {
        heading: { ar: "أسباب اللجوء إلى الولادة القيصرية", en: "Reasons for a c-section" },
        body: [
          {
            ar: "يُتّخذ قرار الولادة بناءً على سلامتكِ وسلامة طفلكِ، وقد تتغيّر خطتكِ الأصلية لأسباب طبية تستدعي التدخل. من الحالات التي قد تستدعي قيصرية: أن يكون الجنين في وضعية مقعدية لم يتمكّن الطبيب من تدويرها، أو أن تكون المشيمة منخفضة وتغطي عنق الرحم (المشيمة المنزاحة)، أو أن يمرّ الجنين بضائقة أثناء المخاض، أو أن يكون الحمل بتوأم أو أكثر، أو أن يكون حجم الجنين كبيرًا بما يصعّب الولادة الطبيعية.",
            en: "The decision is made around your safety and your baby's, and your original plan can change for medical reasons that call for intervention. Situations that can call for a c-section include: the baby in a breech position that couldn't be turned, a low-lying placenta covering the cervix (placenta praevia), the baby going into distress during labour, carrying twins or more, or the baby being too large for a straightforward vaginal delivery.",
          },
        ],
        cites: ["medlineplus-cesarean-delivery"],
      },
      {
        heading: { ar: "مسار التعافي: قيصري مقابل طبيعي", en: "Recovery: c-section vs vaginal birth" },
        body: [
          {
            ar: "يختلف مسار التعافي بوضوح بين الطريقتين. بعد الولادة القيصرية، يستغرق بقاؤكِ في المستشفى عادة يومًا أو يومين، وقد تحتاجين إلى التمهّل في أسابيعكِ الأولى — القيادة والتمارين الرياضية والعلاقة الزوجية غالبًا لا تُستأنف قبل نحو ستة أسابيع. تعافي الولادة القيصرية يأخذ وقتًا أطول عمومًا من تعافي الولادة الطبيعية، لأنها جراحة كبرى في البطن.",
            en: "Recovery clearly differs between the two. After a c-section, your hospital stay is usually one or two days, and you'll likely need to take it easy in the first weeks — driving, exercise, and sex are generally not resumed before around six weeks. Recovering from a c-section generally takes longer than recovering from a vaginal birth, since it's major abdominal surgery.",
          },
          {
            ar: "يبقى قرار قيصري أم طبيعي دائمًا قرارًا يُحسم بالتشاور مع طبيبكِ المتابع، بناءً على وضعكِ الصحي الدقيق — لا وفق تفضيل عام لطريقة على أخرى.",
            en: "Whether you have a c-section or a vaginal birth is always decided together with the doctor following your specific case — not by a general preference for one method over the other.",
          },
        ],
        cites: ["nhs-caesarean-recovery"],
      },
    ],

    redFlags: {
      intro: {
        ar: "اتصلي بطبيبكِ فورًا إذا لاحظتِ أيًا مما يلي بعد الولادة:",
        en: "Contact your doctor right away if you notice any of the following after birth:",
      },
      items: [
        {
          ar: "حمّى أو قشعريرة مع ألم أو احمرار حول جرح القيصرية.",
          en: "Fever or chills with pain or redness around the c-section wound.",
        },
        {
          ar: "نزيف مفاجئ أو غزير، خصوصًا مع شعوركِ بالدوار.",
          en: "Sudden or heavy bleeding, especially if you feel dizzy.",
        },
        { ar: "ضيق في التنفس أو ألم في الصدر.", en: "Shortness of breath or chest pain." },
        { ar: "ألم أو تورّم أو احمرار في ربلة الساق.", en: "Pain, swelling, or redness in your calf." },
      ],
      cites: ["medlineplus-cesarean-delivery"],
    },

    cta: {
      headline: { ar: "جهّزي أسئلتكِ لطبيبكِ مع نواة", en: "Get your questions ready for your doctor with Nawah" },
      body: {
        ar: "تابعي تطوّر حملكِ أسبوعًا بأسبوع في نواة، ودوّني أسئلتكِ عن قرار الولادة لمناقشتها في زيارتكِ القادمة.",
        en: "Track your pregnancy week by week in Nawah, and jot down your questions about the birth decision to bring to your next visit.",
      },
      button: { ar: "جربي نواة", en: "Try Nawah" },
    },

    faqs: [
      {
        q: { ar: "هل يمكنني طلب ولادة قيصرية دون سبب طبي؟", en: "Can I request a c-section without a medical reason?" },
        a: {
          ar: "ناقشي أسباب رغبتكِ مع طبيبكِ. يفضّل الأطباء عمومًا تجنّب الجراحة الكبرى دون حاجة طبية واضحة، نظرًا لمخاطرها ومسار تعافيها الأطول.",
          en: "Talk through your reasons with your doctor. Doctors generally prefer to avoid major surgery without a clear medical need, given its risks and longer recovery path.",
        },
      },
      {
        q: {
          ar: "هل يمكنني الولادة الطبيعية بعد قيصرية سابقة؟",
          en: "Can I have a vaginal birth after a previous c-section?",
        },
        a: {
          ar: "هذا ممكن للكثير من النساء، وتعتمد الإمكانية على سبب الجراحة السابقة ونوع الشق الجراحي في رحمكِ — ناقشي الأمر مع طبيبكِ المتابع مبكرًا في حملكِ.",
          en: "This is possible for many women, and depends on the reason for the earlier surgery and the type of incision in your uterus — discuss it with the doctor following your case, early in your pregnancy.",
        },
      },
    ],

    citations: [
      {
        id: "medlineplus-cesarean-delivery",
        org: "MedlinePlus",
        title: { en: "Cesarean delivery", ar: "الولادة القيصرية" },
        url: "https://medlineplus.gov/cesareandelivery.html",
        retrieved: "2026-09-16",
      },
      {
        id: "nhs-caesarean-recovery",
        org: "NHS",
        title: { en: "Caesarean section — recovery", ar: "الولادة القيصرية — التعافي" },
        url: "https://www.nhs.uk/conditions/caesarean-section/recovery/",
        retrieved: "2026-09-16",
      },
    ],

    updated: "2026-09-16",

    verifiedNote:
      "Raw Gemini draft cited medlineplus.gov/cesareansection.html (404, dead) alongside " +
      "medlineplus.gov/childbirth.html (live but doesn't cover this article's claims). Replaced both " +
      "with medlineplus.gov/cesareandelivery.html, fetched and confirmed for reasons, risks and the " +
      "recovery-time comparison. Added nhs.uk/conditions/caesarean-section/recovery/ (fetched, confirmed " +
      "1-2 day stay and ~6-week return to driving/exercise/sex) as the 2nd citation per the 2-citation " +
      "cap. VBAC FAQ answer softened to drop the specific 'low-transverse incision' detail rather than " +
      "add a 3rd citation (medlineplus VBAC page) just for one FAQ line.",
  },

  {
    cluster: "gender_prediction",
    slug: "baby-gender-prediction-myths",
    published: true,

    hero: {
      src: "/articles/gender-prediction-hero.jpg",
      alt: {
        ar: "يدان تطويان ملابس أطفال ملوّنة بعناية على طاولة بيضاء",
        en: "A pair of hands carefully folding colourful baby clothes on a white table",
      },
      photographer: "Sarah Chai",
      photographerUrl: "https://www.pexels.com/@sarah-chai",
      pexelsUrl: "https://www.pexels.com/photo/unrecognizable-woman-folding-baby-clothes-7282430/",
      width: 6000,
      height: 4000,
    },

    eyebrow: { ar: "خرافات شائعة", en: "Common myths" },
    title: {
      ar: "تحديد جنس الجنين: الطرق الموثوقة والخرافات الشائعة",
      en: "Predicting Your Baby's Sex: What's Reliable and What's a Myth",
    },
    metaTitle: {
      ar: "تحديد جنس الجنين: الطرق الموثوقة والخرافات الشائعة",
      en: "Predicting Your Baby's Sex: What's Reliable and What's a Myth",
    },
    description: {
      ar: "تعرّفي على الطرق الطبية الموثوقة لمعرفة جنس جنينكِ، ولماذا لا تستند طرق شعبية شائعة كشكل البطن ونبض القلب إلى أي أساس علمي.",
      en: "Learn the medically reliable ways to find out your baby's sex, and why popular folk methods like belly shape and heart rate have no scientific basis.",
    },
    standfirst: {
      ar: "تنتشر خرافات كثيرة حول تحديد جنس الجنين، لكن طريقتين فقط تعتمدان على أساس طبي موثوق.",
      en: "Plenty of myths circulate about predicting a baby's sex — only two methods actually rest on reliable medical evidence.",
    },

    sections: [
      {
        heading: {
          ar: "شكل البطن ونبض القلب: هل يكشفان جنس الجنين؟",
          en: "Belly shape and heart rate: do they reveal the sex?",
        },
        body: [
          {
            ar: "يعتقد كثيرون أن بروز البطن للأمام يعني ولدًا، وأن اتساعه للعرض يعني بنتًا — وهذا غير صحيح طبيًا. يعتمد شكل بطنكِ على قوة عضلاتكِ ووزنكِ ووضعية الجنين، لا على نوعه.",
            en: "Many believe a belly that points forward means a boy, and one that spreads wide means a girl — this isn't medically true. Your belly's shape depends on your muscle tone, weight, and the baby's position, not their sex.",
          },
          {
            ar: "بالمثل، لا علاقة بين سرعة نبض قلب الجنين ونوعه؛ يتغيّر معدل النبض باستمرار حسب نشاطه الحركي في تلك اللحظة، لا حسب كونه ولدًا أو بنتًا.",
            en: "Likewise, there's no link between fetal heart rate and sex — heart rate simply changes with how active the baby is at that moment, not with whether it's a boy or a girl.",
          },
        ],
      },
      {
        heading: {
          ar: "الجدول الصيني وطرق شعبية أخرى",
          en: "The Chinese gender chart and other folk methods",
        },
        body: [
          {
            ar: "يعتمد الجدول الصيني على عمركِ وشهر حدوث الحمل ليتوقّع نوع الجنين، وهو مخصص للتسلية فقط ولا يستند إلى أي أساس علمي أو طبي موثوق. الأمر نفسه ينطبق على تفسير الوحام أو ملامح الوجه أو غيرها من العلامات الشعبية — لا رابط طبي مثبت بينها وبين نوع الجنين.",
            en: "The Chinese gender chart predicts sex based on your age and the month of conception — it's for entertainment only and has no scientific or medical basis. The same goes for reading cravings, facial changes, or other folk signs: none have a proven medical link to the baby's sex.",
          },
        ],
      },
      {
        heading: { ar: "السونار: الطريقة الأكثر شيوعًا", en: "Ultrasound: the most common method" },
        body: [
          {
            ar: "يمكن لطبيبكِ عادة تحديد جنس الجنين خلال سونار الأسبوع العشرين، الذي يُجرى عادة بين الأسبوعين ١٨ و٢١ من الحمل. الغرض الأساسي من هذا الفحص هو متابعة نمو الجنين وأعضائه؛ تحديد الجنس جزء إضافي منه إن رغبتِ في معرفته.",
            en: "Your doctor can usually tell your baby's sex during the 20-week scan, typically done between weeks 18 and 21. The scan's main purpose is checking the baby's growth and organs — sex identification is an extra part of it, if you want to know.",
          },
        ],
        cites: ["nhs-20-week-scan"],
      },
      {
        heading: {
          ar: "فحص الحمض النووي غير الجراحي (NIPT)",
          en: "Non-invasive prenatal testing (NIPT)",
        },
        body: [
          {
            ar: "يمكنكِ أيضًا معرفة جنس الجنين عبر فحص دم غير جراحي متاح من الأسبوع العاشر من الحمل. يحلّل هذا الفحص المادة الوراثية للجنين في دمكِ، ويُستخدم أساسًا لتقييم احتمال بعض الحالات الصبغية، مع تحديد الجنس كجزء من نتائجه.",
            en: "You can also learn the baby's sex through a non-invasive blood test available from as early as week 10. It analyses the baby's genetic material in your blood, and while its main purpose is screening for certain chromosomal conditions, sex determination is part of what it reports.",
          },
        ],
        cites: ["medlineplus-cfdna-screening"],
      },
    ],

    cta: {
      headline: { ar: "تابعي تطوّر جنينكِ بمعلومات موثوقة", en: "Follow your baby's development with reliable information" },
      body: {
        ar: "حمّلي تطبيق نواة لمتابعة حملكِ أسبوعًا بأسبوع، بمعلومات طبية موثوقة تغنيكِ عن الخرافات الشائعة.",
        en: "Get the Nawah app to follow your pregnancy week by week, with reliable medical information instead of common myths.",
      },
      button: { ar: "جربي نواة", en: "Try Nawah" },
    },

    faqs: [
      {
        q: { ar: "هل تكشف اشتهاءات الحمل عن جنس الجنين؟", en: "Do pregnancy cravings reveal the baby's sex?" },
        a: {
          ar: "لا توجد علاقة طبية مثبتة بين نوع الطعام الذي تشتهينه وجنس طفلكِ؛ ترتبط الرغبة الشديدة في الطعام غالبًا بتغيّرات الهرمونات خلال الحمل.",
          en: "There's no proven medical link between what you crave and your baby's sex — strong cravings are generally tied to hormonal changes during pregnancy.",
        },
      },
      {
        q: { ar: "متى يمكنني معرفة جنس الجنين بشكل مؤكد؟", en: "When can I know my baby's sex for certain?" },
        a: {
          ar: "يمكن تحديده بدقة عالية عبر فحص الحمض النووي غير الجراحي من الأسبوع العاشر، أو عبر سونار الأسبوع العشرين بين الأسبوعين ١٨ و٢١.",
          en: "It can be identified with high accuracy through non-invasive prenatal testing from week 10, or through the 20-week scan between weeks 18 and 21.",
        },
        cites: ["medlineplus-cfdna-screening", "nhs-20-week-scan"],
      },
    ],

    citations: [
      {
        id: "nhs-20-week-scan",
        org: "NHS",
        title: { en: "20-week screening scan", ar: "سونار الأسبوع العشرين" },
        url: "https://www.nhs.uk/pregnancy/your-pregnancy-care/20-week-scan/",
        retrieved: "2026-09-16",
      },
      {
        id: "medlineplus-cfdna-screening",
        org: "MedlinePlus",
        title: { en: "Prenatal cell-free DNA screening", ar: "فحص الحمض النووي الجنيني الحر قبل الولادة" },
        url: "https://www.medlineplus.gov/lab-tests/prenatal-cell-free-dna-screening/",
        retrieved: "2026-09-16",
      },
    ],

    updated: "2026-09-16",

    verifiedNote:
      "Raw Gemini draft cited medlineplus.gov/genetics/understanding/testing/nipt/, which timed out on " +
      "every fetch attempt — swapped for medlineplus.gov/lab-tests/prenatal-cell-free-dna-screening/, " +
      "fetched and confirmed for both sex determination and the week-10 timing. Corrected the 20-week-" +
      "scan window from the draft's '18-20 weeks' to the NHS page's actual '18 to 21 weeks'. Dropped the " +
      "draft's specific 'success rate equals a coin flip' claim about the Chinese gender chart — not a " +
      "figure either source states, and the general 'no scientific basis' framing carries the same point " +
      "without inventing a statistic.",
  },
];

export function resolveArticle(cluster: string, slug: string): Article | null {
  return ARTICLES.find((a) => a.cluster === cluster && a.slug === slug && a.published) ?? null;
}
