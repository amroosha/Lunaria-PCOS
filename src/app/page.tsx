import { AppointmentQuestions } from "@/components/site/AppointmentQuestions";
import { FoodsToAvoid } from "@/components/site/FoodsToAvoid";
import { Hero } from "@/components/site/Hero";
import { MealPlan } from "@/components/site/MealPlan";
import { PcosExplainer } from "@/components/site/PcosExplainer";
import { AskBanner, SafetyNote, SourcesSection } from "@/components/site/SafetyAndSources";
import { SiteShell } from "@/components/site/SiteShell";
import { SymptomMap } from "@/components/site/SymptomMap";
import { TopicCards } from "@/components/site/TopicCards";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <SiteShell>
      <main>
        <Hero />
        <div className="hairline mx-auto max-w-5xl" />
        <PcosExplainer />
        <SymptomMap />
        <TopicCards />
        <MealPlan />
        <FoodsToAvoid />
        <AppointmentQuestions />
        <SafetyNote />
        <AskBanner />
        <SourcesSection />
      </main>
    </SiteShell>
  );
}
