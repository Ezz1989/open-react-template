// Tell Bing (and every other IndexNow engine: they share submissions) which URLs are new or changed.
// Run AFTER a deploy is live:
//   node scripts/indexnow.mjs            → every URL in the live sitemap
//   node scripts/indexnow.mjs <url> …    → only those URLs
// Protocol (fetched 2026-11-06): https://www.indexnow.org/documentation — key file at the site root
// (public/<KEY>.txt), up to 10,000 URLs per POST; 200 = submitted, 202 = received, key check pending.
// Google does not use IndexNow; for Google, the sitemap in Search Console is the channel.

const HOST = "www.nawahapp.net";
const KEY = "95658a24294dc68e162421291886a972";

const args = process.argv.slice(2);
const urls = args.length
  ? args
  : [...(await (await fetch(`https://${HOST}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://www.bing.com/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
});
console.log(`IndexNow ${res.status} · ${urls.length} URLs ${await res.text()}`);
if (res.status !== 200 && res.status !== 202) process.exit(1);
