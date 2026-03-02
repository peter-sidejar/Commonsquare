import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { WhySection } from "@/components/landing/problem-section";
import { InsightBridgeSection } from "@/components/landing/insight-bridge-section";
import { HowItWorksSection } from "@/components/landing/solution-section";
import { CompassPreviewSection } from "@/components/landing/compass-preview-section";
import { DebatePreviewSection } from "@/components/landing/debate-preview-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WhySection />
        <InsightBridgeSection />
        <HowItWorksSection />
        <CompassPreviewSection />
        <DebatePreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
