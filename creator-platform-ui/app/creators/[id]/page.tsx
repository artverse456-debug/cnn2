import { notFound } from "next/navigation";
import { creators } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";
import { ChallengeCard } from "@/components/ChallengeCard";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function CreatorDetail({ params }: { params: { id: string } }) {
  const creator = creators.find((item) => item.id === params.id) ?? notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <img src={creator.avatar} alt={creator.name} className="h-32 w-32 rounded-3xl object-cover" />
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">{creator.category}</p>
            <h1 className="text-4xl font-semibold text-white">{creator.name}</h1>
            <p className="mt-4 text-white/70">{creator.bio}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
              <span>{formatNumber(creator.followers)} Follower</span>
              <span>{creator.highlights.length} Highlights</span>
              <span>{creator.challenges.length} Challenges</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 p-4 text-center text-white/70">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Abo</p>
            <p className="text-2xl font-semibold text-white">{formatCurrency(creator.price, "EUR")}</p>
            <p className="text-xs text-white/50">pro Monat</p>
            <button className="mt-4 w-full rounded-full bg-primary/80 px-4 py-2 text-sm font-semibold text-white">
              Unterstützen
            </button>
          </div>
        </div>
      </div>
      <SectionHeader title="Challenges & Rewards" description="Wähle deine nächste Mission" />
      <div className="grid gap-6 md:grid-cols-2">
        {creator.challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}
