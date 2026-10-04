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
      // Temporary (307) on purpose: when iOS goes live this becomes a
      // device-aware link, and a 308 would stay cached in browsers.
      {
        source: "/play",
        destination:
          "https://play.google.com/store/apps/details?id=com.nawahapp&utm_source=nawahapp.net&utm_medium=shortlink&utm_campaign=play&utm_source_platform=web",
        permanent: false,
      },
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
