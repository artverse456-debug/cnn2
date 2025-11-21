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
          title="CreatorPulse Radar"
          description="CreatorPulse Radar zeigt Aktivität, Gruppengrößen und Reward-Einlösungen der letzten 30 Tage."
          action={<Link href="/explore" className="text-primary-light">Alle Gruppen & Creator ansehen</Link>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard label="Eingelöste Rewards (30d)" value="€ 82.4K" trend={<span className="text-xs text-emerald-400">+18%</span>} />
          <StatCard label="Premium-Fans mit Point-Boost" value="12.4K" trend={<span className="text-xs text-emerald-400">+9%</span>} />
          <StatCard label="Ø Reward-Wert" value="€ 42" trend={<span className="text-xs text-rose-300">-3%</span>} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-6 px-4">
        <SectionHeader
          title="Beliebte Gruppen & Creator"
          description="Öffentliche Fanclubs mit Free- und Premium-Beitritten, die Points und Rewards steuern."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-16">
        <SectionHeader
          title="Neueste Aktivitäten und Fan-Möglichkeiten"
          description="Engagement-Aktionen, Punktboosts und neue Rewards, die Creator für ihre Gruppen live stellen."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featuredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </section>
    </div>
  );
}
