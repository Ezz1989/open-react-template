import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { WeekJourney } from "@/components/WeekJourney";
import { PartnerSync } from "@/components/PartnerSync";
import { FeaturesBento } from "@/components/FeaturesBento";
import { ArabicStrip } from "@/components/ArabicStrip";
import { ScreenshotsMarquee } from "@/components/ScreenshotsMarquee";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WeekJourney />
        <PartnerSync />
        <FeaturesBento />
        <ArabicStrip />
        <ScreenshotsMarquee />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
