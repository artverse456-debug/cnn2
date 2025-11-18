import Link from "next/link";
import { creatorGroups, featuredChallenges, topGroups } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";
import { SearchInput } from "@/components/SearchInput";
import { FilterBar } from "@/components/FilterBar";
import { ChallengeCard } from "@/components/ChallengeCard";
import { CreatorGroupSpotlightCard } from "@/components/CreatorGroupSpotlightCard";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <SectionHeader title="Explore Creator" description="Filtere nach Kategorie, Budget oder Challenge" />
      <SearchInput />
      <FilterBar />
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-10">
          <section className="rounded-[32px] border border-white/5 bg-white/5 p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Creator Groups</p>
                <h2 className="text-3xl font-semibold text-white">Geschlossene Communities</h2>
                <p className="text-white/60">Mitgliedschaften mit Feed, Rewards und direkten Drops.</p>
              </div>
            </div>
            <div className="mt-6 space-y-5">
              {creatorGroups.map((group) => (
                <div key={group.id} className="rounded-3xl border border-white/5 bg-black/30 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <img src={group.creator.avatar} alt={group.creator.name} className="h-14 w-14 rounded-2xl object-cover" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">{group.creator.category}</p>
                        <h3 className="text-xl font-semibold text-white">{group.title}</h3>
                        <p className="text-sm text-white/60">von {group.creator.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/60">€{group.price}/Monat</p>
                      <Link
                        href={`/creators/${group.creator.id}/groups`}
                        className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
                      >
                        Zur Gruppe
                      </Link>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/70">{group.description}</p>
                  {group.feed[0] && (
                    <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Post-Vorschau</p>
                      <p className="mt-2 text-base text-white">{group.feed[0].content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Creator Spotlights</p>
            <div className="space-y-4">
              {topGroups.map((group) => (
                <CreatorGroupSpotlightCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-4 rounded-3xl border border-white/5 bg-black/30 p-6 text-white/70">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Challenges</p>
            <p className="text-sm">Öffentliche Briefings bleiben verfügbar – aber ohne Feed.</p>
          </div>
          <div className="space-y-4 opacity-80">
            {featuredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} compact />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
