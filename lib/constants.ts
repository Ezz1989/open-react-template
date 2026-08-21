/**
 * Shared app-wide constants.
 *
 * PLAY_STORE_URL was previously duplicated in four components. It must track
 * `applicationId` in android/app/build.gradle.kts — if the package ID ever
 * changes again, this is the only place the landing page needs updating.
 */
export const PLAY_PACKAGE_ID = "com.nawahapp";

/**
 * 🔗 MEMO — GOOGLE PLAY LINK IS LIVE BUT NOT YET RESOLVABLE
 *
 * Verified 2026-08-11: this URL returns HTTP 404. The package id is correct;
 * the listing simply is not public yet, because the app sits on the INTERNAL
 * TESTING track only. Every visitor who taps "Get it on Google Play" today
 * lands on a Play error page.
 *
 * It begins resolving by itself once the app is published to production
 * (launch tracker step P15). No code change is needed then — but RE-CHECK the
 * URL after publishing, and consider hiding or labelling the button until then
 * if the site is being actively promoted.
 *
 * Used by HeroSection.tsx and CtaSection.tsx.
 */
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE_ID}`;

/**
 * 🔗 MEMO — APP STORE LINK DOES NOT EXIST YET
 *
 * There is no iOS build. The App Store badge in CtaSection.tsx is deliberately
 * rendered as a non-interactive <span class="btn-store-soon"> reading
 * "Coming soon to App Store" / "قريباً على آب ستور" — a badge linking to a
 * non-existent app misleads users and is the kind of claim store review
 * penalises.
 *
 * WHEN THE iOS APP SHIPS (launch tracker step P18):
 *   1. Add:  export const APP_STORE_URL = "https://apps.apple.com/app/id<APPLE_ID>";
 *   2. In CtaSection.tsx swap the <span> for <a href={APP_STORE_URL}> and drop
 *      the `btn-store-soon` class.
 *   3. In lib/content.ts change cta.appStoreSmall from "Coming soon to" to
 *      "Download on", and "قريباً على" to "حمّل من".
 *   4. Consider adding the badge to HeroSection.tsx too — today it carries only
 *      the Play button.
 */
export const APP_STORE_URL: string | null = null;

/**
 * Canonical public host. `babynawah.vercel.app` still resolves and MUST keep
 * working — the shipped Android build hardcodes it as the password-reset
 * redirect (`../lib/features/auth/forgot_password_screen.dart`) — but
 * nawahapp.net is the public-facing domain used on the Play listing, so it is
 * the one every canonical/hreflang/sitemap URL is built from.
 */
export const SITE_URL = "https://www.nawahapp.net";

/**
 * The languages the site publishes a *separate URL* for.
 *
 * ⚠️ This is not the same thing as the `LangProvider` toggle on the marketing
 * page. That toggle swaps copy client-side at a single URL, which means
 * Googlebot only ever sees English there. Verified at Google Search Central
 * (developers.google.com/search/docs/specialty/international/localized-versions):
 * "Google doesn't use hreflang or the HTML lang attribute to detect the
 * language of a page; instead, we use algorithms to determine the language."
 *
 * So a language only becomes indexable when its text is server-rendered at its
 * own URL. That is what `/en/...` and `/ar/...` exist for.
 */
export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

/** BCP-47 codes for hreflang. `ar` is left unregioned deliberately: the
 *  audience spans EG + the GCC and we do not publish per-country variants. */
export const HREFLANG: Record<Locale, string> = { en: "en", ar: "ar" };

/** Which locale answers `x-default` — the version Google serves when no
 *  language/region matches the visitor's browser setting. Arabic is the
 *  primary audience, so Arabic is the fallback. */
export const X_DEFAULT_LOCALE: Locale = "ar";

export const DIR: Record<Locale, "ltr" | "rtl"> = { en: "ltr", ar: "rtl" };

/**
 * 🔗 UTM-TAGGED PLAY LINKS — the only measurement layer this project has.
 *
 * `pubspec.yaml` carries no Meta SDK, no Snapchat SDK and no MMP, so paid
 * social cannot attribute an install. Play Console's
 * "User acquisition → Acquisition reports → Tracked channels (UTM)" reads the
 * utm_* parameters off the store-listing URL and is therefore the whole
 * attribution story. See `../docs/AD_PLAN_150USD.md` §3.
 *
 * Play Console Help (answer/9859173) recommends setting utm_source,
 * utm_medium, utm_campaign, utm_id and utm_source_platform; any parameter left
 * off is reported as "(not set)".
 *
 * ⚠️ Never hand-write a Play URL in a component. Every link must come through
 * here or it lands in the untracked "Play Store (Organic)" bucket and the
 * article that earned the install becomes invisible.
 */
export interface PlayUtm {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  id?: string;
}

export function playStoreUrl(utm?: PlayUtm): string {
  if (!utm) return PLAY_STORE_URL;
  const params = new URLSearchParams({
    id: PLAY_PACKAGE_ID,
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    utm_source_platform: "web",
  });
  if (utm.content) params.set("utm_content", utm.content);
  if (utm.id) params.set("utm_id", utm.id);
  return `https://play.google.com/store/apps/details?${params.toString()}`;
}

/** Every guide article shares one campaign so Play Console can report the
 *  articles as a single channel, with `utm_content` naming the month. */
export function guidePlayUrl(locale: Locale, month: number): string {
  return playStoreUrl({
    source: "nawahapp.net",
    medium: "organic_article",
    campaign: "pregnancy_guide",
    content: `${locale}_month_${month}`,
  });
}

/**
 * The father series, deliberately a SEPARATE campaign from `pregnancy_guide`.
 *
 * The two series are judged on different things. The month articles exist to
 * capture head-term search traffic, so sessions are a fair measure of them.
 * The father articles exist to convert one worried reader into an install, so
 * the only number that means anything is store clicks per session — and that
 * comparison is impossible if both series report into one campaign bucket.
 */
export function fatherPlayUrl(locale: Locale, slug: string): string {
  return playStoreUrl({
    source: "nawahapp.net",
    medium: "organic_article",
    campaign: "father_guide",
    content: `${locale}_father_${slug}`,
  });
}
