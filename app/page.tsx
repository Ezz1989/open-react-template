import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeatureGrid } from "@/components/FeatureGrid";
import { DualJourney } from "@/components/DualJourney";
import { NawalSection } from "@/components/NawalSection";
import { BabyNamesSection } from "@/components/BabyNamesSection";
import { PlannersSection } from "@/components/PlannersSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeatureGrid />
        <DualJourney />
        <NawalSection />
        <BabyNamesSection />
        <PlannersSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
