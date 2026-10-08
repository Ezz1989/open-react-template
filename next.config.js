/** @type {import('next').NextConfig} */
const nextConfig = {
  // babynawah.vercel.app must keep serving (the shipped Android build uses it
  // for password resets), but Google indexed it as the homepage's canonical
  // instead of www.nawahapp.net. noindex on that host only; links still work.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "babynawah.vercel.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  async redirects() {
    return [
      // Short share link: nawahapp.net/play → Play listing, tagged so installs
      // show up under "Tracked channels (UTM)" instead of organic.
      // Temporary (307) so a later change isn't stuck in browser caches.
      {
        source: "/play",
        destination:
          "https://play.google.com/store/apps/details?id=com.nawahapp&utm_source=nawahapp.net&utm_medium=shortlink&utm_campaign=play&utm_source_platform=web",
        permanent: false,
      },
      // Bio links are device-aware: Apple devices → App Store, everyone else
      // → Play. Redirects are checked in order, so the iOS rule must come
      // first. "Macintosh" is in the list because iPad Safari sends a Mac user
      // agent; Android never does. 307 so browsers don't cache one store.
      // Apple campaign link (pt = Nawah's provider token, same for every
      // campaign); shows in App Store Connect → Analytics → Campaigns once a
      // campaign passes 5 first-time downloads.
      ...["tiktok", "instagram", "facebook", "x"].map((p) => ({
        source: `/${p}`,
        has: [{ type: "header", key: "user-agent", value: ".*(iPhone|iPad|iPod|Macintosh).*" }],
        destination: `https://apps.apple.com/app/apple-store/id6817668758?pt=129537733&ct=${p}_bio&mt=8`,
        permanent: false,
      })),
      // Everyone else: Play, one utm_source per platform so Play's UTM report
      // can tell them apart (utm_medium=organic keeps them apart from paid).
      ...["tiktok", "instagram", "facebook", "x"].map((p) => ({
        source: `/${p}`,
        destination: `https://play.google.com/store/apps/details?id=com.nawahapp&utm_source=${p}&utm_medium=organic&utm_campaign=bio_sep26`,
        permanent: false,
      })),
      // Origin pages removed 2026-10-06 (user: no name origin anywhere on the
      // site except the hub's one sentence). Permanent, so Google moves their
      // ranking onto the hub instead of dropping it.
      { source: "/:lang(ar|en)/names/origin/:origin", destination: "/:lang/names", permanent: true },
      // The Facebook Page has no username, only a numeric id.
      {
        source: "/fb",
        destination: "https://www.facebook.com/profile.php?id=61593761370296",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
