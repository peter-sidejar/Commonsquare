import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { LandingWhy } from "@/components/landing/why";
import { LandingBridge } from "@/components/landing/bridge";
import { LandingHow } from "@/components/landing/how";
import { LandingCompass } from "@/components/landing/compass-section";
import { LandingDebate } from "@/components/landing/debate-preview";
import { LandingTopicOfDay } from "@/components/landing/topic-of-day";
import { LandingFinalCTA } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="bg-paper text-ink">
      <LandingNav />
      <LandingHero />
      <LandingTopicOfDay />
      <LandingWhy />
      <LandingBridge />
      <LandingHow />
      <LandingCompass />
      <LandingDebate />
      <LandingFinalCTA />
      <LandingFooter />
    </main>
  );
}
