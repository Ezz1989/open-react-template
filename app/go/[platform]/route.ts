import { after, NextRequest, NextResponse } from "next/server";

/**
 * Bio links (nawahapp.net/tiktok|instagram|facebook|x, rewritten here in
 * next.config.js): send the visitor to the right store and count the tap.
 *
 * Apple devices → App Store, everyone else → Play. "Macintosh" is in the list
 * because iPad Safari sends a Mac user agent; Android never does. 307 so
 * browsers don't cache one store.
 *
 * Each tap becomes a `bio_link_click` event in the same PostHog EU project as
 * the app and site, sent after the redirect so it adds no delay. Link-preview
 * crawlers are kept but flagged `is_bot`, so filter them out when counting.
 */
// Links the app itself sends: same store pick, their own campaign tags and event, so they are not counted as
// bio taps. "share" = the link inside cards shared from the app (1.0.8 share sheet "Copy link"). "invite" = the
// link in the partner-invite message (app 1.0.9+, NEXTBUILD R9): shows whether the partner even taps it, and
// utm_source=partner_invite reaches profiles.install_referrer on Android.
const APP_LINKS: Record<string, { ct: string; utm: string; event: string }> = {
  share: { ct: "app_share", utm: "utm_source=app_share&utm_medium=referral&utm_campaign=share_card", event: "share_link_click" },
  invite: { ct: "partner_invite", utm: "utm_source=partner_invite&utm_medium=referral&utm_campaign=pair_invite", event: "invite_link_click" },
  // The QR code in the home page's download section (nawahapp.net/qr), scanned from a computer screen.
  qr: { ct: "web_qr", utm: "utm_source=nawahapp.net&utm_medium=qr&utm_campaign=home&utm_source_platform=web", event: "qr_scan" },
  // Home page «حمِّلوا تطبيق الحمل» pills (A2, 2026-11-06): one link that picks the store by device. Same tags as
  // homePlayUrl(where) / appStoreUrl(`web_${where}`), so both stores keep a single "home" campaign.
  ...Object.fromEntries(
    ["nav", "hero", "download"].map((where) => [
      `home_${where}`,
      {
        ct: `web_${where}`,
        utm: `utm_source=nawahapp.net&utm_medium=website&utm_campaign=home&utm_content=${where}&utm_source_platform=web`,
        event: "home_download_click",
      },
    ]),
  ),
};
const PLATFORMS = new Set(["tiktok", "instagram", "facebook", "x", ...Object.keys(APP_LINKS)]);
const APPLE = /iPhone|iPad|iPod|Macintosh/;
const BOT = /bot|crawler|spider|facebookexternalhit|preview|headless/i;

export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!PLATFORMS.has(platform)) return new NextResponse("Not found", { status: 404 });

  const ua = req.headers.get("user-agent") ?? "";
  const store = APPLE.test(ua) ? "app_store" : "play";
  // Same campaign tags as the old config redirects, so store reports stay continuous.
  const app = APP_LINKS[platform];
  const destination =
    store === "app_store"
      ? `https://apps.apple.com/app/apple-store/id6817668758?pt=129537733&ct=${app ? app.ct : `${platform}_bio`}&mt=8`
      : `https://play.google.com/store/apps/details?id=com.nawahapp&${app ? app.utm : `utm_source=${platform}&utm_medium=organic&utm_campaign=bio_sep26`}`;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (key) {
    after(() =>
      fetch("https://eu.i.posthog.com/i/v0/e/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: key,
          event: app ? app.event : "bio_link_click",
          distinct_id: crypto.randomUUID(),
          properties: {
            platform,
            store,
            country: req.headers.get("x-vercel-ip-country"),
            is_bot: BOT.test(ua),
            $process_person_profile: false,
          },
        }),
      }).catch(() => {}), // analytics must never break the redirect
    );
  }

  return NextResponse.redirect(destination, 307);
}
