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
const PLATFORMS = new Set(["tiktok", "instagram", "facebook", "x"]);
const APPLE = /iPhone|iPad|iPod|Macintosh/;
const BOT = /bot|crawler|spider|facebookexternalhit|preview|headless/i;

export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!PLATFORMS.has(platform)) return new NextResponse("Not found", { status: 404 });

  const ua = req.headers.get("user-agent") ?? "";
  const store = APPLE.test(ua) ? "app_store" : "play";
  // Same campaign tags as the old config redirects, so store reports stay continuous.
  const destination =
    store === "app_store"
      ? `https://apps.apple.com/app/apple-store/id6817668758?pt=129537733&ct=${platform}_bio&mt=8`
      : `https://play.google.com/store/apps/details?id=com.nawahapp&utm_source=${platform}&utm_medium=organic&utm_campaign=bio_sep26`;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (key) {
    after(() =>
      fetch("https://eu.i.posthog.com/i/v0/e/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: key,
          event: "bio_link_click",
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
