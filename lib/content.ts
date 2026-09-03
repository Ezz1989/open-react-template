export const content = {
  en: {
    nav: {
      home: "Home",
      features: "Features",
      journey: "Journey",
      nawal: "Nawal",
      names: "Names",
      // The menu that holds both guides. Renamed from "Articles" 2026-08-22:
      // everything under it is a guide, so "Articles > Pregnancy guide" named
      // the same thing twice in two different words.
      articles: "Guides",
      guide: "Mother's guide",
      fatherGuide: "Father's guide",
      about: "About us",
      mother: "Mother",
      father: "Father",
    },

    // Sits between the hero and the feature grid. The guide is the only part
    // of this site a search engine can rank, so the homepage has to hand it
    // real link equity rather than burying it in the footer.
    guidePromo: {
      eyebrow: "Free to read, no app needed",
      headlineA: "Nine months,",
      headlineB: "nine guides.",
      sub: "What changes each month, what counts as normal, and when to call a doctor. Written from WHO and ACOG guidance, with every source linked.",
      cta: "Read the pregnancy guide",
      note: "Month 1 is live. The rest are on the way.",
    },

    hero: {
      badge: "Made for two. Arabic and English.",
      headlineA: "Every week,",
      headlineB: "the two of you.",
      sub: "Pregnancy isn't a chart to fill in. It's forty weeks of small choices and a few frightening ones. Nawah is there with both of you, in Arabic and English, the whole way.",
      stat1Num: "40",
      stat1Label: "weeks, nothing skipped",
      stat2Num: "2,400+",
      stat2Label: "Arabic, Turkish, Persian names",
      stat3Num: "3 a.m.",
      stat3Label: "Nawal is awake",
      scrubHint: "Scrub through your journey →",
      weekLabel: "week",
    },

    weeks: {
      4: { fruit: "Poppy seed", size: "0.2 cm", trimester: "T1", note: "The neural tube is forming. That's the beginning of the spine. Of everything, really." },
      8: { fruit: "Raspberry", size: "1.6 cm", trimester: "T1", note: "Tiny fingers. Tiny toes. There's a heartbeat now — ask your doctor to let you listen." },
      12: { fruit: "Lime", size: "5.4 cm", trimester: "T1", note: "First trimester done. Miscarriage risk drops sharply from here. You can exhale a little." },
      16: { fruit: "Avocado", size: "11.6 cm", trimester: "T2", note: "She can make faces now. Scowls, half-smiles. That part still gets us." },
      20: { fruit: "Banana", size: "16.4 cm", trimester: "T2", note: "Halfway. The first kicks are days away — maybe already here, if you weren't sure that's what you felt." },
      24: { fruit: "Corn", size: "30 cm", trimester: "T2", note: "Her inner ear works. She's learning the sound of your voice, both of you." },
      28: { fruit: "Eggplant", size: "37.6 cm", trimester: "T3", note: "Eyes open and close. Light filters through. Third trimester — the homestretch begins." },
      32: { fruit: "Jicama", size: "42.4 cm", trimester: "T3", note: "Practicing breathing. Practicing swallowing. Getting ready for air." },
      36: { fruit: "Papaya", size: "47.4 cm", trimester: "T3", note: "Plump. Organs ready. Four weeks — maybe fewer." },
      40: { fruit: "Watermelon", size: "51 cm", trimester: "T3", note: "You made it. She's ready. Write something down before it gets very loud." },
    },

    features: {
      eyebrow: "Everything, in one app",
      headlineA: "Medical where it matters,",
      headlineB: "gentle everywhere else.",
      sub: "ACOG-aligned — the same prenatal playbook your doctor uses. Just softer, in Arabic and English, with nothing you'd need to Google at 3 a.m.",
      cards: [
        { title: "Kick counter", desc: "Tap as you feel them. History by week, so you'll know her rhythm before she has a name." },
        { title: "Contraction timer", desc: "Intervals and duration to the second. Plain guidance for when it's time to pack the car." },
        { title: "Vitals & nutrition", desc: "Weight, blood pressure, and what she actually needs this week — in servings you can picture." },
        { title: "Symptom log", desc: "30+ symptoms your doctor can read at the next visit. No more \"I think it was… Tuesday?\"" },
        { title: "Mood check-in", desc: "Heavy · Low · Okay · Warm · Radiant. One tap. That's the whole feature." },
        { title: "Appointments", desc: "The ACOG prenatal schedule, pre-loaded. Lab orders surface the week you need them." },
      ],
    },

    journey: {
      mother: {
        eyebrow: "For the mother",
        headlineA: "You grow a person.",
        headlineB: "We handle the notes.",
        bullets: [
          "What's happening inside, week by week — no textbook voice",
          "Kick counter, contraction timer, mood tap (one second)",
          "Vitals, symptoms, nutrition — the full picture for your doctor",
          "Every prenatal visit mapped out, lab orders included",
          "SOS + one-tap call to whoever you trust most",
        ],
      },
      father: {
        eyebrow: "For the father",
        headlineA: "Show up.",
        headlineB: "Not as a visitor.",
        bullets: [
          "The same week-by-week — written for the dad you want to be",
          "Hospital bag split three ways: mother, baby, you",
          "Baby budget in EGP, SAR, AED, USD — no \"how much should I expect?\" anxiety",
          "Leave her a note she'll find at 4 a.m. when she can't sleep",
          "Weekly prompts, so you don't have to think of the right thing to ask",
        ],
      },
    },

    nawal: {
      eyebrow: "Nawal, the companion",
      headlineA: "A friend who's read every pregnancy book,",
      headlineB: "and doesn't get impatient.",
      sub: "Nawal knows your week, your symptoms, your last appointment. Ask anything — is this cramp normal, what should I cook tonight, do I need to worry. She won't diagnose. But she won't leave.",
      tryLabel: "Try her — she's answering live.",
      greeting: "Hi. I'm Nawal. What's on your mind this week?",
      thinking: "Nawal is thinking…",
      suggestions: [
        "What can she hear this week?",
        "Why am I this tired?",
        "What should my partner actually do?",
      ],
      inputPlaceholder: "Ask anything about your pregnancy…",
      continueCta: "Continue in the app — she'll remember the rest.",
      fallbackReplies: {
        hear: "By week 24, her inner ear is fully formed. She's been hearing your heartbeat and muffled voices for weeks now. Try reading out loud — both of you. She'll know the sound of you by birth.",
        tired: "Your body is building a placenta and doubling blood volume. Fatigue in the first trimester is honest work. Iron and protein help; naps help more. If you're bone-tired past week 14, mention it at your next visit.",
        partner: "Small specifics beat grand gestures. Refill her water before she asks. Come to the 20-week scan. Take over dinner on clinic days. The app has a weekly prompt for this.",
        default: "That's exactly the kind of thing Nawal handles best in the app, where she has your full week and symptom history. Download to keep the conversation going.",
      },
    },

    names: {
      eyebrow: "Baby names",
      headlineA: "Find the name",
      headlineB: "that feels like home.",
      sub: "2,400 names. Arabic, Turkish, Persian, modern. Meaning, root, and script. Tap the heart — both of you, separately. The names you both chose float to the top.",
      originChips: ["Arabic", "Turkish", "English", "Persian", "Modern"],
      savedLabel: "You've saved:",
      seeds: [
        { ar: "رامي", en: "Rami", meaning: "The skilled archer", origin: "Arabic", gender: "M", num: "#77" },
        { ar: "ليلى", en: "Layla", meaning: "Night, dark beauty", origin: "Arabic", gender: "F", num: "#12" },
        { ar: "يوسف", en: "Yousef", meaning: "God will add", origin: "Arabic", gender: "M", num: "#04" },
        { ar: "نور", en: "Noor", meaning: "Light", origin: "Arabic", gender: "U", num: "#21" },
        { ar: "زين", en: "Zein", meaning: "Grace, beauty", origin: "Arabic", gender: "M", num: "#55" },
        { ar: "مريم", en: "Mariam", meaning: "Beloved, wished-for child", origin: "Arabic", gender: "F", num: "#01" },
      ],
    },

    planners: {
      eyebrow: "Planning, together",
      headlineA: "Prepare together.",
      headlineB: "No spreadsheets.",
      tabs: { bag: "Hospital bag", budget: "Baby budget", journal: "Journal" },
      bag: {
        packedFormat: "{packed} of {total} packed",
        progressNote: "A little each week. You'll be ready before week 36.",
        items: [
          { label: "Comfortable loose nightgown", group: "M", checked: true },
          { label: "Nursing bra", group: "M", checked: true },
          { label: "Front-opening top", group: "M", checked: false },
          { label: "Warm socks (2–3 pairs)", group: "M", checked: false },
          { label: "Newborn onesies", group: "B", checked: false },
          { label: "Swaddle blankets", group: "B", checked: false },
        ],
        groupLabels: { M: "Mother", B: "Baby", F: "Father" },
      },
      budget: {
        totalEyebrow: "Total estimated",
        currencyEyebrow: "Currency",
        spentLabel: "Spent:",
        remainingLabel: "Remaining:",
        items: [
          { label: "Hospital delivery", amount: 98000, checked: true },
          { label: "Anesthesia / epidural", amount: 24500, checked: true },
          { label: "Pediatrician first visit", amount: 4900, checked: true },
          { label: "Crib or bassinet", amount: 14700, checked: false },
          { label: "Stroller", amount: 22000, checked: false },
          { label: "Nursing chair", amount: 18500, checked: false },
        ],
      },
      journal: {
        privacyNote: "Private by default. Share the ones you want her to find.",
        newEntryLabel: "+ New entry",
        entries: [
          { wk: 10, who: "Partner", title: "How are you", date: "8/4/2026", shared: false },
          { wk: 9, who: "You", title: "Love you", date: "2/4/2026", shared: true },
          { wk: 9, who: "Partner", title: "Tiny kicks today", date: "1/4/2026", shared: false },
        ],
        sharedLabel: "Shared",
        privateLabel: "Private",
      },
    },

    cta: {
      eyebrow: "Ready?",
      headlineA: "A whole new person is on the way.",
      headlineB: "So are the two of you.",
      sub: "Free to download. Arabic and English from the first moment. For families across Egypt, the Gulf, and wherever you're reading this.",
      downloadSmall: "Get it on",
      downloadBig: "Google Play",
      appStoreSmall: "Coming soon to",
      appStoreBig: "App Store",
    },

    resetPassword: {
      eyebrow: "Account recovery",
      title: "Set a new password",
      sub: "Enter a new password for your Nawah account. Once it's saved, open the app and sign in.",
      newLabel: "New password",
      newPlaceholder: "At least 8 characters",
      confirmLabel: "Confirm new password",
      confirmPlaceholder: "Type it again",
      submit: "Update password",
      submitting: "Updating…",
      successTitle: "You're all set.",
      successSub: "Your password is updated. Open Nawah and sign in.",
      invalidTitle: "This link isn't valid anymore.",
      invalidSub: "It may have expired or already been used. Request a new one from the app — tap Forgot password again.",
      errorMismatch: "Passwords don't match.",
      errorShort: "Password must be at least 8 characters.",
      errorGeneric: "Something went wrong. Please try again.",
      openApp: "Open the Nawah app",
    },

    legal: {
      back: "Back to Nawah",
    },

    privacy: {
      eyebrow: "Legal",
      title: "Privacy Policy",
      updated: "Last updated 11 August 2026",
      intro:
        "Nawah holds some of the most private information there is — how a pregnancy is going, how you feel about it, what you write down at 3am. This page says plainly what we store, who else can see it, and how to get rid of it.",
      sections: [
        {
          heading: "What we collect",
          body: [
            "Account details: your email address, display name, and whether you signed up as a mother or a father. If you sign in with Google, we receive your email and name from Google — nothing else.",
            "Pregnancy and health information you enter: last menstrual period, due date, week-by-week logs, symptoms, moods, kick counts, contraction timings, vitals, appointments, baby names, hospital bag and budget lists, and journal entries.",
            "Messages you send to Nawal, the in-app assistant.",
            "Technical information: crash reports, and anonymous usage events such as which screens are opened.",
          ],
        },
        {
          heading: "Health data, specifically",
          body: [
            "Symptoms, moods, kick counts, contractions, vitals and your due date are health information. We treat them as the most sensitive data in the app.",
            "We do not sell health data. We do not use it to target advertising. It is never shared with advertisers.",
          ],
        },
        {
          heading: "Who else can see it",
          body: [
            "Your partner, only if you link accounts — and journal entries only when you mark them as shared. Everything else stays yours.",
            "Service providers who process data on our behalf: Supabase (database and sign-in), Google Firebase (crash reporting and notifications), PostHog (anonymous usage analytics), Google AdMob (advertising in the free version), RevenueCat (subscriptions), and Groq (which processes messages you send to Nawal so it can reply).",
            "We do not sell your personal information to anyone.",
          ],
        },
        {
          heading: "Nawal, the assistant",
          body: [
            "Nawal is software, not a doctor, nurse or midwife. It gives general information only and can be wrong. Nothing it says is medical advice, and it must never replace your own doctor.",
            "Messages you send are processed by Groq to generate a reply. Do not send information you would not want processed by a third party.",
          ],
        },
        {
          heading: "Advertising",
          body: [
            "The free version shows ads through Google AdMob. In the EEA and UK you are asked for consent before any personalised advertising, and you can decline.",
            "Premium removes ads entirely.",
          ],
        },
        {
          heading: "Where it is stored, and for how long",
          body: [
            "Data is stored on Supabase infrastructure in the EU (eu-west-2). We keep it while your account exists.",
            "When you delete your account, your data is deleted — see the account deletion page for exactly what goes and what is briefly retained.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You can access, correct, export or delete your information at any time. Deletion is available inside the app under Profile, and by email if you cannot reach the app.",
            "If you are in a jurisdiction with data protection law — including the EU/UK GDPR and Egypt's PDPL — those rights apply to you and we will honour them.",
          ],
        },
        {
          heading: "Children",
          body: [
            "Nawah is not intended for children under 13, and we do not knowingly collect their information.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "If this policy changes in a way that matters, we will say so in the app rather than quietly editing this page.",
          ],
        },
      ],
      contactHeading: "Questions",
      contactBody: "Write to nawahapp@outlook.com and a person will answer.",
      contactEmail: "nawahapp@outlook.com",
    },

    deleteAccount: {
      eyebrow: "Your data",
      title: "Delete your account",
      updated: "Last updated 11 August 2026",
      intro:
        "You can delete your Nawah account and everything in it, at any time, without asking anyone's permission.",
      inAppHeading: "In the app — fastest",
      inAppSteps: [
        "Open Nawah and go to Profile.",
        "Tap Delete Account.",
        "Confirm. That is it — the deletion runs immediately.",
      ],
      emailHeading: "By email — if you can't open the app",
      emailBody:
        "Write to nawahapp@outlook.com from the email address on the account, with the subject \"Delete my account\". We will confirm your identity and delete it.",
      contactEmail: "nawahapp@outlook.com",
      deletedHeading: "What gets deleted",
      deletedItems: [
        "Your profile, name and sign-in details",
        "Your pregnancy record, due date and weekly logs",
        "Symptoms, moods, vitals, kick sessions and contraction timings",
        "Appointments, journal entries, baby names, hospital bag and budget lists",
        "The link to your partner's account",
        "Your Nawal conversation history",
      ],
      keptHeading: "What is kept, briefly",
      keptItems: [
        "Anonymous, aggregated usage counts that are no longer linked to you and cannot identify you.",
        "Records we are legally required to hold, such as a purchase receipt for tax purposes, kept only as long as the law requires.",
        "Routine encrypted backups, which are overwritten on a rolling basis within 30 days.",
      ],
      timingHeading: "How long it takes",
      timingBody:
        "Deletion from the live database is immediate. Backups cycle out within 30 days. Once it is done it cannot be undone — there is no restore.",
      partnerHeading: "If your accounts are linked",
      partnerBody:
        "Deleting your account removes the link. Your partner keeps their own account and their own entries; they lose access to anything of yours they could previously see.",
    },

    footer: {
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Delete account", href: "/delete-account" },
        { label: "nawahapp@outlook.com", href: "mailto:nawahapp@outlook.com" },
        { label: "Instagram", href: "https://www.instagram.com/nawahapp.nett/" },
        { label: "TikTok", href: "https://www.tiktok.com/@nawah596" },
      ],
      copyright: "© 2026 Nawah. Made in MENA, for MENA.",
    },
  },

  ar: {
    nav: {
      home: "الرئيسية",
      features: "المميزات",
      journey: "الرحلة",
      nawal: "نوال",
      names: "الأسماء",
      // "الأدلة" was the literal rendering of "Guides" and read wrong — دليل
      // carries the sense of proof/evidence as readily as guidebook, so the
      // plural landed closer to "the evidence". إرشادات is the ordinary word
      // for guidance material. Owner's call, 2026-08-23.
      // ⚠️ Hamza-under-alef (إ), not a bare alef. The project's locale linter
      // folds hamza carriers before matching, so a bare ا would pass the check
      // and still be misspelled on screen.
      articles: "إرشادات",
      guide: "دليل الأم",
      fatherGuide: "دليل الأب",
      about: "من نحن",
      mother: "الأم",
      father: "الأب",
    },

    guidePromo: {
      eyebrow: "اقرأيه مجاناً، بدون تطبيق",
      headlineA: "تسعة أشهر،",
      headlineB: "تسعة أدلة.",
      sub: "ما الذي يتغيّر كل شهر، وما الطبيعي، ومتى تتصلين بالطبيب. مكتوب من إرشادات منظمة الصحة العالمية والكلية الأمريكية لأطباء النساء، وكل مصدر مذكور برابطه.",
      cta: "اقرأي دليل الحمل",
      note: "الشهر الأول متاح الآن، والبقية في الطريق.",
    },

    hero: {
      badge: "مصنوع للاثنين معاً · بالعربية والإنجليزية",
      headlineA: "كل أسبوع،",
      headlineB: "بين يديكما.",
      sub: "الحمل ليس جدولاً طبياً تملؤه. هو أربعون أسبوعاً من القرارات الصغيرة، وبضع لحظات مرعبة. نواة تمشي معكما كل خطوة، بالعربية والإنجليزية، إلى النهاية.",
      stat1Num: "٤٠",
      stat1Label: "أسبوعاً لا يفوتكم منها شيء",
      stat2Num: "+٢٤٠٠",
      stat2Label: "اسم بالعربية والفارسية والتركية",
      stat3Num: "٣ فجراً",
      stat3Label: "نوال مستيقظة",
      scrubHint: "← تصفّحي رحلتك",
      weekLabel: "أسبوع",
    },

    weeks: {
      4: { fruit: "حبّة خشخاش", size: "٠٫٢ سم", trimester: "الأول", note: "الأنبوب العصبي يتكوّن الآن. هذه بداية العمود الفقري. بداية كل شيء، حقيقةً." },
      8: { fruit: "توتة", size: "١٫٦ سم", trimester: "الأول", note: "أصابع صغيرة. أصابع قدم صغيرة. هناك نبض قلب الآن — اطلبي من الطبيب أن يسمعكما إيّاه." },
      12: { fruit: "ليمونة", size: "٥٫٤ سم", trimester: "الأول", note: "انتهى الثلث الأول. خطر الإجهاض ينخفض بوضوح من هنا. يمكنكِ التنفّس قليلاً." },
      16: { fruit: "أفوكادو", size: "١١٫٦ سم", trimester: "الثاني", note: "تستطيع الآن أن تصنع تعابير وجهٍ. تجهّم، ابتسامة نصفية. هذه اللحظة ما زالت تأسرنا." },
      20: { fruit: "موزة", size: "١٦٫٤ سم", trimester: "الثاني", note: "منتصف الطريق. الركلات الأولى بعد أيام — أو ربما شعرتِ بها دون أن تتأكّدي." },
      24: { fruit: "ذرة", size: "٣٠ سم", trimester: "الثاني", note: "أذنها الداخلية تعمل. تتعلّم صوتكما، أنتِ وهو." },
      28: { fruit: "باذنجانة", size: "٣٧٫٦ سم", trimester: "الثالث", note: "عيناها تفتحان وتغلقان. النور يصلها. بدأ الثلث الأخير — وبدأ العدّ التنازلي." },
      32: { fruit: "جيكاما", size: "٤٢٫٤ سم", trimester: "الثالث", note: "تتدرّب على التنفّس. على البلع. تستعدّ للهواء." },
      36: { fruit: "بابايا", size: "٤٧٫٤ سم", trimester: "الثالث", note: "ممتلئة. الأعضاء جاهزة. أربعة أسابيع — أو أقلّ." },
      40: { fruit: "بطيخة", size: "٥١ سم", trimester: "الثالث", note: "وصلتِ. هي جاهزة. اكتبي شيئاً قبل أن يصبح العالم صاخباً." },
    },

    features: {
      eyebrow: "كل شيء في تطبيق واحد",
      headlineA: "طبّيّ حيث يجب،",
      headlineB: "حنون في كل ما سواه.",
      sub: "موجّه حسب بروتوكولات ACOG — نفس الدليل الذي يعتمده طبيبك. لكن بلغة أهدأ، بالعربية والإنجليزية، ودون حاجة للبحث في جوجل الساعة الثالثة فجراً.",
      cards: [
        { title: "عدّاد الركلات", desc: "اضغطي مع كل ركلة. التطبيق يحفظ إيقاعها قبل أن تعرفي اسمها." },
        { title: "مؤقّت الطلق", desc: "الفواصل والمدّة بالثانية. إرشادات واضحة متى تحزمان السيارة." },
        { title: "الفحوصات والتغذية", desc: "الوزن، الضغط، وما يحتاجه الجنين فعلاً هذا الأسبوع — بكمّيات تستطيعين تصوّرها." },
        { title: "سجلّ الأعراض", desc: "أكثر من ٣٠ عرَضاً يقرؤها طبيبك في الزيارة القادمة. لا 'أعتقد كان يوم الثلاثاء…' بعد اليوم." },
        { title: "حالة المزاج", desc: "ثقيل · منخفض · جيّد · دافئ · مشرق. ضغطة واحدة. هذه هي الميزة كلّها." },
        { title: "المواعيد", desc: "جدول الزيارات كاملاً حسب ACOG. طلبات التحاليل تظهر في أسبوعها تماماً." },
      ],
    },

    journey: {
      mother: {
        eyebrow: "للأم",
        headlineA: "أنتِ تصنعين إنساناً.",
        headlineB: "نحن نتكفّل بالتفاصيل.",
        bullets: [
          "ما يحدث في الداخل، أسبوعاً بأسبوع — دون صوت الكتاب المدرسي",
          "عدّاد ركلات، مؤقّت طلق، ضغطة مزاج تأخذ ثانية واحدة",
          "فحوصات، أعراض، تغذية — الصورة الكاملة لطبيبك",
          "كل زيارة طبية مرسومة، مع طلبات التحاليل",
          "اتصال طوارئ، وزرّ مباشر لمن تثقين به أكثر",
        ],
      },
      father: {
        eyebrow: "للأب",
        headlineA: "احضر.",
        headlineB: "ليس كزائر.",
        bullets: [
          "نفس الأسبوع بأسبوع — مكتوبٌ للأب الذي تريد أن تكونه",
          "حقيبة المستشفى مقسّمة ثلاثة: الأم، الطفل، أنت",
          "ميزانية الطفل بالجنيه، الريال، الدرهم، الدولار — دون قلق 'كم سيكلّف هذا؟'",
          "اترك لها رسالة تجدها الرابعة فجراً حين لا تستطيع النوم",
          "تنبيهات أسبوعية، حتى لا تفكّر في السؤال المناسب لتطرحه",
        ],
      },
    },

    nawal: {
      eyebrow: "نوال، رفيقتك",
      headlineA: "صديقة قرأت كلّ كتب الحمل،",
      headlineB: "ولا تنفد صبرها.",
      sub: "نوال تعرف أسبوعك، أعراضك، آخر زيارة لك. اسأليها عن أيّ شيء — هل هذا الألم طبيعي، ماذا أطبخ الليلة، هل عليّ أن أقلق. لن تشخّص. لكنها لن تختفي.",
      tryLabel: "جرّبيها — إنها تجيب الآن مباشرة.",
      greeting: "أهلاً. أنا نوال. ما الذي يشغلكِ هذا الأسبوع؟",
      thinking: "نوال تفكّر…",
      suggestions: [
        "ماذا تسمع الآن؟",
        "لماذا أشعر بهذا التعب؟",
        "ماذا يستطيع شريكي أن يفعل حقاً؟",
      ],
      inputPlaceholder: "اسأليني أيّ شيء عن حملك…",
      continueCta: "أكملي في التطبيق — ستتذكّر الباقي.",
      fallbackReplies: {
        hear: "منذ الأسبوع الرابع والعشرين، أذنها الداخلية تعمل بشكل كامل. تسمع نبض قلبك وأصوات البيت منذ أسابيع. جرّبي القراءة بصوت مرتفع — الاثنان معاً. ستعرفكما بالصوت قبل أن تراكما.",
        tired: "جسدك يبني مشيمة، ويضاعف حجم الدم. التعب في الثلث الأول عملٌ صادق. الحديد والبروتين يساعدان، والقيلولة تساعد أكثر. إن استمرّ الإرهاق بعد الأسبوع الرابع عشر، اذكريه للطبيب.",
        partner: "التفاصيل الصغيرة أفضل من المبادرات الكبيرة. املأ كأس الماء قبل أن تطلب. احضر فحص الأسبوع العشرين. تولَّ العشاء في أيام الزيارات الطبية. التطبيق فيه تذكير أسبوعي لذلك.",
        default: "هذا بالضبط ما تجيده نوال في التطبيق، حيث تعرف أسبوعك وسجلّ أعراضك. نزّلي التطبيق لتكملي الحديث.",
      },
    },

    names: {
      eyebrow: "أسماء المولود",
      headlineA: "الاسم الذي يشعر",
      headlineB: "كأنه البيت.",
      sub: "٢٤٠٠ اسم. عربية، تركية، فارسية، حديثة. المعنى، الجذر، والخطّ. اضغطا القلب كلٌّ على حدة — الأسماء التي أحبّها الاثنان ترتفع إلى الأعلى.",
      originChips: ["عربي", "تركي", "إنجليزي", "فارسي", "حديث"],
      savedLabel: "حفظتما:",
      seeds: [
        { ar: "رامي", en: "Rami", meaning: "الراجل الرامي بالسهام", origin: "عربي", gender: "M", num: "#77" },
        { ar: "ليلى", en: "Layla", meaning: "الليل وجماله الداكن", origin: "عربي", gender: "F", num: "#12" },
        { ar: "يوسف", en: "Yousef", meaning: "الله يزيد", origin: "عربي", gender: "M", num: "#04" },
        { ar: "نور", en: "Noor", meaning: "الضياء", origin: "عربي", gender: "U", num: "#21" },
        { ar: "زين", en: "Zein", meaning: "الحُسن والجمال", origin: "عربي", gender: "M", num: "#55" },
        { ar: "مريم", en: "Mariam", meaning: "المحبوبة، الطفلة المُنتظَرة", origin: "عربي", gender: "F", num: "#01" },
      ],
    },

    planners: {
      eyebrow: "التخطيط معاً",
      headlineA: "حضّرا معاً،",
      headlineB: "بلا جداول Excel.",
      tabs: { bag: "حقيبة المستشفى", budget: "ميزانية الطفل", journal: "المفكّرة" },
      bag: {
        packedFormat: "{packed} من {total} جاهز",
        progressNote: "قليلاً كل أسبوع. ستكونين جاهزة قبل الأسبوع ٣٦.",
        items: [
          { label: "قميص نوم فضفاض مريح", group: "M", checked: true },
          { label: "حمّالة رضاعة", group: "M", checked: true },
          { label: "بلوزة مفتوحة من الأمام", group: "M", checked: false },
          { label: "جوارب دافئة (٢-٣ أزواج)", group: "M", checked: false },
          { label: "ملابس مولود داخلية", group: "B", checked: false },
          { label: "قماط (٢-٣)", group: "B", checked: false },
        ],
        groupLabels: { M: "الأم", B: "الطفل", F: "الأب" },
      },
      budget: {
        totalEyebrow: "التكلفة المقدّرة",
        currencyEyebrow: "العملة",
        spentLabel: "صُرف:",
        remainingLabel: "متبقّي:",
        items: [
          { label: "الولادة في المستشفى", amount: 98000, checked: true },
          { label: "التخدير / إبرة الظهر", amount: 24500, checked: true },
          { label: "أوّل زيارة لطبيب الأطفال", amount: 4900, checked: true },
          { label: "سرير المولود", amount: 14700, checked: false },
          { label: "عربة الأطفال", amount: 22000, checked: false },
          { label: "كرسي الرضاعة", amount: 18500, checked: false },
        ],
      },
      journal: {
        privacyNote: "خاصّة بشكل افتراضي. شاركا ما تريدان أن يقرأه الآخر.",
        newEntryLabel: "+ تدوينة جديدة",
        entries: [
          { wk: 10, who: "الشريك", title: "كيف حالك", date: "٨/٤/٢٠٢٦", shared: false },
          { wk: 9, who: "أنتِ", title: "أحبّك", date: "٢/٤/٢٠٢٦", shared: true },
          { wk: 9, who: "الشريك", title: "ركلات صغيرة اليوم", date: "١/٤/٢٠٢٦", shared: false },
        ],
        sharedLabel: "مُشتركة",
        privateLabel: "خاصّة",
      },
    },

    cta: {
      eyebrow: "مستعدّان؟",
      headlineA: "إنسانٌ جديد في الطريق.",
      headlineB: "وأنتما كذلك.",
      sub: "مجاني. بالعربية والإنجليزية من اللحظة الأولى. للعائلات في مصر، والخليج، وأينما كنتما تقرآن هذا.",
      downloadSmall: "تحميل من",
      downloadBig: "جوجل بلاي",
      appStoreSmall: "قريباً على",
      appStoreBig: "آب ستور",
    },

    resetPassword: {
      eyebrow: "استعادة الحساب",
      title: "اختاري كلمة مرور جديدة",
      sub: "أدخلي كلمة مرور جديدة لحسابك في نواة. بعد الحفظ، افتحي التطبيق وسجّلي دخولك.",
      newLabel: "كلمة المرور الجديدة",
      newPlaceholder: "٨ أحرف على الأقل",
      confirmLabel: "تأكيد كلمة المرور",
      confirmPlaceholder: "اكتبيها مرة أخرى",
      submit: "تحديث كلمة المرور",
      submitting: "جارٍ التحديث…",
      successTitle: "تمّ بنجاح.",
      successSub: "تم تحديث كلمة المرور. افتحي تطبيق نواة وسجّلي دخولك.",
      invalidTitle: "هذا الرابط لم يعد صالحاً.",
      invalidSub: "قد تكون صلاحيته انتهت أو تم استخدامه. اطلبي رابطاً جديداً من التطبيق — اضغطي على 'نسيت كلمة المرور' مجدداً.",
      errorMismatch: "كلمتا المرور غير متطابقتين.",
      errorShort: "يجب أن تكون كلمة المرور ٨ أحرف على الأقل.",
      errorGeneric: "حدث خطأ. حاولي مرة أخرى.",
      openApp: "افتحي تطبيق نواة",
    },

    legal: {
      back: "العودة إلى نواة",
    },

    privacy: {
      eyebrow: "قانوني",
      title: "سياسة الخصوصية",
      updated: "آخر تحديث ١١ أغسطس ٢٠٢٦",
      intro:
        "نواة يحتفظ بأكثر المعلومات خصوصية — كيف يسير الحمل، وكيف تشعرين، وما تكتبينه في الثالثة فجراً. هذه الصفحة تقول بوضوح ما الذي نخزّنه، ومن يستطيع رؤيته، وكيف تحذفينه.",
      sections: [
        {
          heading: "ما الذي نجمعه",
          body: [
            "بيانات الحساب: بريدك الإلكتروني، والاسم الظاهر، وما إذا كنتِ سجّلتِ كأم أو كأب. إذا سجّلتِ الدخول عبر جوجل، نستلم منه بريدك واسمك فقط، ولا شيء غير ذلك.",
            "معلومات الحمل والصحة التي تدخلينها: تاريخ آخر دورة، موعد الولادة المتوقع، السجلات الأسبوعية، الأعراض، الحالة المزاجية، عدّاد الركلات، توقيت الانقباضات، المؤشرات الحيوية، المواعيد، أسماء الطفل، قائمة حقيبة المستشفى والميزانية، ومدوّناتك اليومية.",
            "الرسائل التي ترسلينها إلى نوال، المساعِدة داخل التطبيق.",
            "معلومات تقنية: تقارير الأعطال، وأحداث استخدام مجهولة الهوية مثل الشاشات التي تُفتح.",
          ],
        },
        {
          heading: "البيانات الصحية تحديداً",
          body: [
            "الأعراض والحالة المزاجية وعدّاد الركلات والانقباضات والمؤشرات الحيوية وموعد الولادة كلها معلومات صحية، ونتعامل معها باعتبارها أكثر البيانات حساسية في التطبيق.",
            "لا نبيع البيانات الصحية، ولا نستخدمها لاستهدافك بالإعلانات، ولا تُشارَك مع المعلنين إطلاقاً.",
          ],
        },
        {
          heading: "من يستطيع رؤيتها",
          body: [
            "شريكك، فقط إذا ربطتما الحسابين — والمدوّنات اليومية فقط حين تحدّدينها كمشتركة. ما عدا ذلك يبقى لكِ وحدك.",
            "مزوّدو خدمات يعالجون البيانات نيابةً عنّا: Supabase (قاعدة البيانات وتسجيل الدخول)، وGoogle Firebase (تقارير الأعطال والإشعارات)، وPostHog (تحليلات استخدام مجهولة)، وGoogle AdMob (الإعلانات في النسخة المجانية)، وRevenueCat (الاشتراكات)، وGroq (يعالج رسائلك إلى نوال ليردّ عليها).",
            "لا نبيع معلوماتك الشخصية لأي جهة.",
          ],
        },
        {
          heading: "نوال، المساعِدة",
          body: [
            "نوال برنامج، وليست طبيبة أو ممرضة أو قابلة. تعطي معلومات عامة فقط وقد تخطئ. لا شيء تقوله يُعدّ استشارة طبية، ولا يجوز أن يحلّ محل طبيبتك.",
            "الرسائل التي ترسلينها تُعالَج عبر Groq لتوليد الرد. لا ترسلي معلومات لا ترغبين في أن تعالجها جهة خارجية.",
          ],
        },
        {
          heading: "الإعلانات",
          body: [
            "النسخة المجانية تعرض إعلانات عبر Google AdMob. في الاتحاد الأوروبي والمملكة المتحدة يُطلب إذنك قبل أي إعلان مخصّص، ويمكنك الرفض.",
            "النسخة المدفوعة تزيل الإعلانات تماماً.",
          ],
        },
        {
          heading: "أين تُخزَّن، ولكم من الوقت",
          body: [
            "تُخزَّن البيانات على بنية Supabase في الاتحاد الأوروبي (eu-west-2)، ونحتفظ بها ما دام حسابك قائماً.",
            "عند حذف حسابك تُحذف بياناتك — راجعي صفحة حذف الحساب لمعرفة ما يُحذف بالضبط وما يُحتفظ به لفترة قصيرة.",
          ],
        },
        {
          heading: "حقوقك",
          body: [
            "يمكنك الاطلاع على معلوماتك أو تصحيحها أو تصديرها أو حذفها في أي وقت. الحذف متاح داخل التطبيق من صفحة الحساب، وعبر البريد الإلكتروني إن تعذّر عليك الوصول للتطبيق.",
            "إذا كنتِ في بلد لديه قانون لحماية البيانات — بما في ذلك اللائحة الأوروبية والبريطانية وقانون حماية البيانات المصري — فهذه الحقوق تنطبق عليك وسنحترمها.",
          ],
        },
        {
          heading: "الأطفال",
          body: [
            "نواة ليس مخصّصاً لمن هم دون الثالثة عشرة، ولا نجمع معلوماتهم عن قصد.",
          ],
        },
        {
          heading: "التغييرات",
          body: [
            "إذا تغيّرت هذه السياسة بشكل يهمّك، سنخبرك داخل التطبيق بدل تعديل هذه الصفحة بصمت.",
          ],
        },
      ],
      contactHeading: "أسئلة",
      contactBody: "اكتبي إلى nawahapp@outlook.com وسيردّ عليك إنسان.",
      contactEmail: "nawahapp@outlook.com",
    },

    deleteAccount: {
      eyebrow: "بياناتك",
      title: "حذف حسابك",
      updated: "آخر تحديث ١١ أغسطس ٢٠٢٦",
      intro: "يمكنك حذف حسابك في نواة وكل ما فيه، في أي وقت، دون إذن من أحد.",
      inAppHeading: "من التطبيق — الأسرع",
      inAppSteps: [
        "افتحي نواة واذهبي إلى صفحة الحساب.",
        "اضغطي على حذف الحساب.",
        "أكّدي. هذا كل شيء — يبدأ الحذف فوراً.",
      ],
      emailHeading: "بالبريد الإلكتروني — إن تعذّر فتح التطبيق",
      emailBody:
        "اكتبي إلى nawahapp@outlook.com من البريد المسجّل في الحساب، وليكن العنوان «حذف حسابي». سنتحقق من هويتك ثم نحذفه.",
      contactEmail: "nawahapp@outlook.com",
      deletedHeading: "ما الذي يُحذف",
      deletedItems: [
        "ملفك الشخصي واسمك وبيانات تسجيل الدخول",
        "سجلّ الحمل وموعد الولادة والسجلات الأسبوعية",
        "الأعراض والحالة المزاجية والمؤشرات الحيوية وجلسات الركلات وتوقيت الانقباضات",
        "المواعيد والمدوّنات وأسماء الطفل وقائمة حقيبة المستشفى والميزانية",
        "الرابط مع حساب شريكك",
        "سجلّ محادثاتك مع نوال",
      ],
      keptHeading: "ما يُحتفظ به لفترة قصيرة",
      keptItems: [
        "أعداد استخدام مجمّعة ومجهولة لم تعد مرتبطة بك ولا يمكن التعرّف عليك من خلالها.",
        "سجلات يلزمنا القانون بحفظها، كإيصال شراء لأغراض ضريبية، وللمدة التي يفرضها القانون فقط.",
        "نسخ احتياطية مشفّرة تُستبدل دورياً خلال ٣٠ يوماً.",
      ],
      timingHeading: "كم يستغرق",
      timingBody:
        "الحذف من قاعدة البيانات الحيّة فوري، والنسخ الاحتياطية تنتهي دورتها خلال ٣٠ يوماً. وبعد تمامه لا يمكن التراجع عنه — لا توجد استعادة.",
      partnerHeading: "إذا كان الحسابان مرتبطين",
      partnerBody:
        "حذف حسابك يلغي الارتباط. يحتفظ شريكك بحسابه وبمدخلاته، ويفقد الوصول إلى أي شيء يخصّك كان يراه من قبل.",
    },

    footer: {
      links: [
        { label: "الخصوصية", href: "/privacy" },
        { label: "حذف الحساب", href: "/delete-account" },
        { label: "nawahapp@outlook.com", href: "mailto:nawahapp@outlook.com" },
        { label: "إنستجرام", href: "https://www.instagram.com/nawahapp.nett/" },
        { label: "تيك توك", href: "https://www.tiktok.com/@nawah596" },
      ],
      copyright: "© ٢٠٢٦ نواة. صُنعت في المنطقة، للمنطقة.",
    },
  },
} as const;
