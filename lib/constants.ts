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
