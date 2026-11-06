/**
 * Per-week baby size for /[lang]/tools/weeks-months/<n> (2026-11-06), so each week page carries a sourced fact
 * of its own instead of arithmetic only (WEBSITE_PLAN_2026-11 §1c).
 *
 * Mirrors the app exactly: `../lib/core/utils/baby_size.dart` (lengths + comparison ladder) and the MSA `ar` /
 * `en` ARB strings (babySize*, babySizeLengthCm). Length = the figure on that week's NHS page (fetched by the app
 * team 2026-10-22). Weeks 1–3 and 41+ have no NHS page → null, nothing shown (no number without a source).
 */

const NHS_CM = [
  0.2, 0.2, 0.6, 1.0, 1.6, 2.2, 3.0, 4.1, 5.4, 7.4, 8.5, 10.1, 11.6, 12.0, 14.2, 15.3, // weeks 4–19
  25.6, 26.7, 27.8, 28.9, 30.0, 34.6, 35.6, 36.6, 37.6, 38.6, 39.9, 41.1, 42.4, //       weeks 20–32 (head to heel from 20)
  43.7, 45.0, 46.2, 47.4, 48.6, 49.8, 50.7, 51.2, //                                      weeks 33–40
];

/** [last week of the slot, ar, en] — same thresholds as babySizeForWeek(). */
const LADDER: [number, string, string][] = [
  [5, "بذرة الطماطم", "Poppy seed"],
  [6, "حبة بازلاء", "Sweet pea"],
  [8, "توت أحمر", "Raspberry"],
  [10, "فراولة", "Strawberry"],
  [12, "ليمون أخضر", "Lime"],
  [14, "ليمون", "Lemon"],
  [16, "أفوكادو", "Avocado"],
  [18, "فلفل حلو", "Bell pepper"],
  [19, "موزة", "Banana"],
  [22, "بابايا", "Papaya"],
  [24, "ذرة", "Corn"],
  [26, "خس", "Lettuce"],
  [28, "قرنبيط", "Cauliflower"],
  [30, "كرنب", "Cabbage"],
  [32, "كوسة", "Squash"],
  [34, "أناناس", "Pineapple"],
  [36, "شمّام", "Honeydew"],
  [38, "بطيخ", "Watermelon"],
  [40, "قرع", "Pumpkin"],
];

const NHS_WEEKS = "https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy";

export interface WeekSize {
  cm: number;
  item: { ar: string; en: string };
  /** The NHS page the length comes from (same URL rule as the app's MedicalSources.nhsWeek). */
  nhsUrl: string;
}

export function weekSize(week: number): WeekSize | null {
  if (week < 4 || week > 40) return null;
  const [, ar, en] = LADDER.find(([last]) => week <= last)!;
  const trimester = week <= 12 ? "1st" : week <= 27 ? "2nd" : "3rd";
  return { cm: NHS_CM[week - 4], item: { ar, en }, nhsUrl: `${NHS_WEEKS}/${trimester}-trimester/week-${week}/` };
}

/**
 * "Your baby this week" — one line per band, same bands as the app's babyDevelopmentForWeek().
 * Arabic = Gemini #56 (2026-11-06): the app's MSA lines rewritten to plural address for the website, facts and
 * numbers unchanged (ALT AI/prompts/02-website-articles/done/56_*). English = the app's en ARB.
 * Sources shown with it on the page: the NHS week page, MedlinePlus and Cleveland Clinic (as cited in the app).
 */
const DEVELOPMENT: [number, string, string][] = [
  [4, "انغرست البويضة المخصّبة في جدار الرحم، وبدأ الانقسام الخلوي السريع لتكوين أساس طفلكم.", "The fertilized egg has settled into your womb. Cells are dividing fast as your baby begins to grow."],
  [6, "بدأ قلب طفلكم في النبض، والأنبوب العصبي، الذي سيصبح الدماغ والحبل الشوكي، في طور التكوين.", "Your baby's heart is beginning to beat. The neural tube, which becomes the brain and spinal cord, is forming."],
  [8, "تتكوّن أصابع اليدين والقدمين الصغيرة، والقلب ينبض. يبلغ طول طفلكم حوالي ١٫٦ سم.", "Tiny fingers and toes are forming and the heart is beating. Your baby is about 1.6 cm long."],
  [12, "اكتملت جميع الأعضاء الحيوية، وينخفض خطر الإجهاض بشكل ملحوظ. يستطيع طفلكم فتح أصابعه وإغلاقها وثني أصابع قدميه.", "All vital organs are formed. The risk of miscarriage drops significantly. Your baby can open and close fingers and curl toes."],
  [16, "قد يستطيع طفلكم سماع صوتكم. يتحوّل الهيكل العظمي من غضاريف إلى عظام صلبة.", "Your baby may be able to hear your voice. The skeleton is hardening from cartilage to bone."],
  [20, "وصلتم إلى منتصف الرحلة! طفلكم يستطيع البلع وتتكوّن لديه براعم التذوّق، وهو نشيط جدًا، يتقلّب ويركل.", "You're halfway there. Your baby can swallow, is growing taste buds, and is busy turning, rolling, and kicking."],
  [24, "محطة مهمّة: يستطيع طفلكم البقاء على قيد الحياة خارج الرحم بدعم طبي، وينمو دماغه بسرعة كبيرة.", "A big milestone: with medical care, your baby could now survive outside the womb. The brain is growing fast."],
  [28, "أصبح طفلكم قادرًا على فتح جفنيه وإغلاقهما، وبدأت رئتاه بإنتاج مادة يحتاجها للتنفس بعد الولادة.", "Your baby's eyelids can now open and close. The lungs are starting to make surfactant, which helps them breathe after birth."],
  [32, "يتمرّن طفلكم على حركات التنفّس. معظم الأجهزة الداخلية مكتملة النمو. يكتسب حوالي ٢٥٠ جرامًا أسبوعيًا.", "Your baby is practicing breathing movements, and most organs are ready. They are gaining about 250 g a week."],
  [36, "يكتسب طفلكم الدهون ليبقى دافئًا، ورئتاه قاربتا على اكتمال النمو. الولادة الآن ما زالت ولادة مبكرة، وكل أسبوع إضافي يفيده.", "Your baby is putting on fat for warmth and the lungs are nearly mature. A baby born now is still preterm, so every extra week helps."],
  [38, "دخل طفلكم مرحلة تمام الحمل المبكر، وقد يكون رأسه قد نزل في حوض الأم. يبدأ تمام الحمل الكامل من الأسبوع ٣٩.", "Your baby is early term, and their head may have moved down into your pelvis. Full term starts at 39 weeks."],
  [42, "طفلكم جاهز تمامًا ليرحب بالعالم. كل يوم يضيف له المزيد من الوزن والقوة.", "Your baby is fully ready for the world. Every day adds a little more weight and strength."],
];

export const DEV_HEADING = { ar: "طفلكم هذا الأسبوع", en: "Your baby this week" };

export function weekDevelopment(week: number): { ar: string; en: string } {
  const [, ar, en] = DEVELOPMENT.find(([last]) => week <= last) ?? DEVELOPMENT[DEVELOPMENT.length - 1];
  return { ar, en };
}
