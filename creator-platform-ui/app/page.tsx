import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { creators, featuredChallenges } from "@/lib/data";
import { CreatorCard } from "@/components/CreatorCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { StatCard } from "@/components/StatCard";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="space-y-16 py-12">
      <Hero />
      <section className="mx-auto max-w-6xl space-y-6 px-4">
        <SectionHeader
          title="Creator Economy Radar"
          description="Echte Daten simuliert mit Dummy-Inhalten für diese Demo."
          action={<Link href="/explore" className="text-primary-light">Alle Creator</Link>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard label="Umsatz (30d)" value="€ 82.4K" trend={<span className="text-xs text-emerald-400">+18%</span>} />
          <StatCard label="Aktive Fans" value="12.4K" trend={<span className="text-xs text-emerald-400">+9%</span>} />
          <StatCard label="Ø Challenge Preis" value="€ 42" trend={<span className="text-xs text-rose-300">-3%</span>} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-6 px-4">
        <SectionHeader title="Trending Creator" description="Jede Woche kuratiert" />
        <div className="grid gap-6 md:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-16">
        <SectionHeader title="Live Challenges" description="Experimentiere mit kreativen Briefings" />
        <div className="grid gap-6 md:grid-cols-3">
          {featuredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </section>
    </div>
  );
}
