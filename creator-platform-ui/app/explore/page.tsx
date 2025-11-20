import Link from "next/link";
import { creatorGroups, topGroups } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";
import { SearchInput } from "@/components/SearchInput";
import { FilterBar } from "@/components/FilterBar";
import { CreatorGroupSpotlightCard } from "@/components/CreatorGroupSpotlightCard";
import { MiniChallengeCard, type MiniChallenge } from "@/components/MiniChallengeCard";

const miniChallenges: MiniChallenge[] = [
  {
    id: "mc-1",
    title: "Shorts Remix Battle",
    icon: "🎬",
    timeLeft: "2T 6H",
    entries: 128,
  },
  {
    id: "mc-2",
    title: "#CreatorPulse Fit",
    icon: "💪",
    timeLeft: "5T",
    entries: 86,
  },
  {
    id: "mc-3",
    title: "Streetstyle Drop",
    icon: "🧢",
    entries: 203,
  },
  {
    id: "mc-4",
    title: "Weekend Vlog Mini",
    icon: "📹",
    timeLeft: "11H",
    entries: 57,
  },
];

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
              {creatorGroups.map((group) => {
                const postPreview = group.feed[0];

                return (
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

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Mitglieder</p>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-white">
                          <p className="text-2xl font-semibold">{group.members.toLocaleString()}</p>
                          <p className="text-sm text-white/70">Ø {group.avgMonthlyPoints.toLocaleString()} Punkte/Monat</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Über die Gruppe</p>
                        <p className="mt-2 text-sm text-white/70">{group.description}</p>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Aktivität</p>
                        <p className="mt-2 text-sm text-white/70">Letzte {group.recentPosts} Posts im Feed</p>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Gruppenregeln</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-white/70">
                          {group.rules.map((rule) => (
                            <li key={rule}>{rule}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Belohnungen</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {group.rewards.map((reward) => (
                            <span key={reward} className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-sm text-white">
                              {reward}
                            </span>
                          ))}
                        </div>
                      </div>

                      {postPreview && (
                        <div className="md:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Post-Vorschau</p>
                          <p className="mt-2 text-base text-white">{postPreview.content}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-6" aria-labelledby="creator-spotlights-heading">
            <p id="creator-spotlights-heading" className="text-sm uppercase tracking-[0.3em] text-white/60">
              Creator Spotlights
            </p>
            <div className="space-y-4">
              {topGroups.map((group) => (
                <CreatorGroupSpotlightCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-4 rounded-3xl border border-white/5 bg-black/30 p-6 text-white/70">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Challenges</p>
            <p className="text-sm">Öffentliche Briefings bleiben verfügbar – aber ohne Feed.</p>
          </div>
          <div className="space-y-3 opacity-90">
            {miniChallenges.map((challenge) => (
              <MiniChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
