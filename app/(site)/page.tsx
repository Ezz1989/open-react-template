import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { GuidePromo } from "@/components/GuidePromo";
import { FeatureGrid } from "@/components/FeatureGrid";
import { DualJourney } from "@/components/DualJourney";
import { NawalSection } from "@/components/NawalSection";
import { BabyNamesSection } from "@/components/BabyNamesSection";
import { PlannersSection } from "@/components/PlannersSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import { PLAY_STORE_URL, SITE_URL } from "@/lib/constants";

/**
 * Organization and WebSite entity markup.
 *
 * Separate from the per-article Article schema. This tells Google that a thing
 * called Nawah exists, what it publishes, and where else it appears. Without
 * it the guide articles are loose pages by an unknown publisher, which is a
 * weak position for health content where trust is weighted heavily.
 *
 * `sameAs` is the part that does the work: it links this domain to profiles
 * that already exist, so the Play listing and the TikTok account corroborate
 * the site rather than sitting unconnected to it.
 */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "Nawah",
      alternateName: "نواة",
      url: SITE_URL,
      logo: `${SITE_URL}/nawah-logo-dark.png`,
      description:
        "Arabic pregnancy companion app for mothers and fathers, built for the GCC and Egypt.",
      sameAs: [PLAY_STORE_URL, "https://www.tiktok.com/@nawah596"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "Nawah",
      inLanguage: ["ar", "en"],
      publisher: { "@id": `${SITE_URL}#org` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main>
        {/* DualJourney sits directly under the hero: the hero promises "every
            week, the two of you" and this is the section that shows what "the
            two of you" actually means. Putting the feature grid between them
            broke that hand-off. */}
        <HeroSection />
        <DualJourney />
        <GuidePromo />
        <FeatureGrid />
        <NawalSection />
        <BabyNamesSection />
        <PlannersSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
