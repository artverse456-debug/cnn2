import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { featuredChallenges, popularGroups } from "@/lib/data";
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
          description="Live-Überblick über Rewards, Gruppenaktivität und verteilte Fanpunkte in CreatorPulse."
          action={<Link href="/explore" className="text-primary-light">Alle Gruppen & Creator ansehen</Link>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard label="Eingelöste Rewards (30 Tage)" value="€ 12.8K" trend={<span className="text-xs text-emerald-400">+12%</span>} />
          <StatCard label="Aktive Gruppen (öffentlich & Premium)" value="482" trend={<span className="text-xs text-emerald-400">+8%</span>} />
          <StatCard label="FANPUNKTE VERTEILT (30 Tage)" value="1.2M" trend={<span className="text-xs text-rose-300">-3%</span>} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-6 px-4">
        <SectionHeader
          title="Beliebte Gruppen & Creator"
          description="Fanclubs mit Punkten, Reward-Drops und Abo-Boosts – die aktivsten Gruppen des Monats."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {popularGroups.map((group) => (
            <CreatorCard key={group.id} group={group} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-16">
        <SectionHeader
          title="Neueste Aktivitäten und Fan-Möglichkeiten"
          description="Aktivitäten, die Fans sofort Punkte, neue Rewards oder automatische Boosts bringen."
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
