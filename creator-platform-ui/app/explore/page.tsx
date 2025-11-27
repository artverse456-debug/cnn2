"use client";

import Link from "next/link";
import { useState } from "react";
import { creatorGroups } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";
import { SearchInput } from "@/components/SearchInput";
import { FilterBar } from "@/components/FilterBar";
import { MiniChallengeCard, type MiniChallenge } from "@/components/MiniChallengeCard";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";

type TopCreator = {
  id: string;
  name: string;
  avatar: string;
  category: string;
  followers?: number;
  members?: number;
  points?: number;
};

const creatorMiniChallenges: MiniChallenge[] = [
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

const platformMiniChallenges: MiniChallenge[] = [
  {
    id: "pmc-1",
    title: "Kommentiere 3 Beiträge",
    icon: "💬",
    points: 20,
    actionLabel: "Abschließen",
  },
  {
    id: "pmc-2",
    title: "Like 5 Posts",
    icon: "❤️",
    points: 10,
    actionLabel: "Abschließen",
  },
  {
    id: "pmc-3",
    title: "Schau dir 1 Gruppenfeed an",
    icon: "👀",
    points: 12,
    actionLabel: "Abschließen",
  },
  {
    id: "pmc-4",
    title: "Teile einen Beitrag",
    icon: "📤",
    points: 8,
    actionLabel: "Abschließen",
  },
];

const topCreators: TopCreator[] = [
  {
    id: "tc-1",
    name: "Mila Ray",
    avatar: "https://i.pravatar.cc/160?img=47",
    category: "Immersive Design",
    followers: 420000,
    points: 1960,
  },
  {
    id: "tc-2",
    name: "Leo Stone",
    avatar: "https://i.pravatar.cc/160?img=12",
    category: "Cinematic Story",
    followers: 305000,
    points: 1740,
  },
  {
    id: "tc-3",
    name: "Ava Kai",
    avatar: "https://i.pravatar.cc/160?img=32",
    category: "Audio Reactor",
    followers: 510000,
    points: 1885,
  },
  {
    id: "tc-4",
    name: "Noa Flux",
    avatar: "https://i.pravatar.cc/160?img=65",
    category: "Visual Synth",
    followers: 284000,
    points: 1620,
  },
];

export default function ExplorePage() {
  const { activeFilter } = useDashboardStore();
  const applyPointChange = useAuthStore((state) => state.applyPointChange);
  const [completedMiniChallenges, setCompletedMiniChallenges] = useState<Set<string>>(new Set());
  const allChallenges = [...creatorMiniChallenges, ...platformMiniChallenges];

  const hasFollowersData = topCreators.some((creator) => typeof creator.followers === "number");
  const hasMembersData = topCreators.some((creator) => typeof creator.members === "number");
  const hasPointsData = topCreators.some((creator) => typeof creator.points === "number");

  const getRankValue = (creator: TopCreator) => {
    if (hasFollowersData) return creator.followers ?? 0;
    if (hasMembersData) return creator.members ?? 0;
    if (hasPointsData) return creator.points ?? 0;
    return 0;
  };

  const getMetricLabel = (creator: TopCreator) => {
    if (hasFollowersData && creator.followers !== undefined) {
      return `${creator.followers.toLocaleString()} Follower`;
    }

    if (hasMembersData && creator.members !== undefined) {
      return `${creator.members.toLocaleString()} Mitglieder`;
    }

    if (hasPointsData && creator.points !== undefined) {
      return `${creator.points.toLocaleString()} Punkte`;
    }

    return undefined;
  };

  const sortedTopCreators = [...topCreators].sort((a, b) => getRankValue(b) - getRankValue(a));
  const topThreeCreators =
    hasFollowersData || hasMembersData || hasPointsData
      ? sortedTopCreators.slice(0, 3)
      : topCreators.slice(0, 3);

  const handleMiniChallenge = async (challenge: MiniChallenge) => {
    if (completedMiniChallenges.has(challenge.id)) return;

    setCompletedMiniChallenges((prev) => {
      const updated = new Set(prev);
      updated.add(challenge.id);
      return updated;
    });

    try {
      await applyPointChange?.(challenge.points ?? 1, "challenge", {
        challengeId: challenge.id,
        title: challenge.title,
      });
    } catch (error) {
      console.error("Failed to reward challenge points", error);
      setCompletedMiniChallenges((prev) => {
        const updated = new Set(prev);
        updated.delete(challenge.id);
        return updated;
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <SectionHeader title="Explore Creator" description="Filtere nach Kategorie, Budget oder Challenge" />
      <SearchInput />
      <FilterBar />
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-10">
          {(activeFilter === "groups" || activeFilter === "all") && (
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
          )}

          {activeFilter === "all" && (
            <section className="rounded-[32px] border border-white/5 bg-white/5 p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Top Creator</p>
                  <h2 className="text-3xl font-semibold text-white">Top 3 Communities</h2>
                  <p className="text-white/60">Ranking nach Followern, Mitgliedern oder Punkten.</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {topThreeCreators.map((creator, index) => {
                  const metricLabel = getMetricLabel(creator);

                  return (
                    <div key={creator.id} className="rounded-3xl border border-white/5 bg-black/30 p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sm font-semibold text-white/70">
                            #{index + 1}
                          </span>
                          <div className="flex items-center gap-3">
                            <img src={creator.avatar} alt={creator.name} className="h-14 w-14 rounded-2xl object-cover" />
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{creator.category}</p>
                              <h3 className="text-xl font-semibold text-white">{creator.name}</h3>
                              {metricLabel && <p className="text-sm text-white/60">{metricLabel}</p>}
                              <p className="text-sm text-white/60">Top Creator</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          {creator.points !== undefined && (
                            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
                              {creator.points} Punkte
                            </div>
                          )}
                          <Link
                            href={`/creators/${creator.id}/groups`}
                            className="rounded-2xl border border-primary/40 bg-primary/80 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary/60 hover:bg-primary"
                          >
                            Zur Gruppe
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activeFilter === "challenges" && (
            <section className="rounded-[32px] border border-white/5 bg-white/5 p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Challenges</p>
                  <h2 className="text-3xl font-semibold text-white">Creator & Plattform Aufgaben</h2>
                  <p className="text-white/60">Alle öffentlichen Briefings und Mini-Challenges auf einen Blick.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {allChallenges.map((challenge) => (
                  <MiniChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onAction={handleMiniChallenge}
                    completed={completedMiniChallenges.has(challenge.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {activeFilter === "top-creators" && (
            <section className="rounded-[32px] border border-white/5 bg-white/5 p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Top Creator</p>
                  <h2 className="text-3xl font-semibold text-white">Ranking nach Impact</h2>
                  <p className="text-white/60">Leaderboard mit Punkten, Followern und Creator-Kategorien.</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {topCreators.map((creator, index) => (
                  <div key={creator.id} className="rounded-3xl border border-white/5 bg-black/30 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sm font-semibold text-white/70">
                          #{index + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <img src={creator.avatar} alt={creator.name} className="h-14 w-14 rounded-2xl object-cover" />
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">{creator.category}</p>
                            <h3 className="text-xl font-semibold text-white">{creator.name}</h3>
                            {getMetricLabel(creator) && <p className="text-sm text-white/60">{getMetricLabel(creator)}</p>}
                            <p className="text-sm text-white/60">Top Creator</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        {creator.points !== undefined && (
                          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
                            {creator.points} Punkte
                          </div>
                        )}
                        <Link
                          href={`/creators/${creator.id}/groups`}
                          className="rounded-2xl border border-primary/40 bg-primary/80 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary/60 hover:bg-primary"
                        >
                          Zur Gruppe
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-4 rounded-3xl border border-white/5 bg-black/30 p-6 text-white/70">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Challenges</p>
            <p className="text-sm">Öffentliche Briefings bleiben verfügbar – aber ohne Feed.</p>
          </div>
          <div className="space-y-3 opacity-90">
            <div className="space-y-3">
              {creatorMiniChallenges.map((challenge) => (
                <MiniChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onAction={handleMiniChallenge}
                  completed={completedMiniChallenges.has(challenge.id)}
                />
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Plattform Mini-Challenges</p>
              {platformMiniChallenges.map((challenge) => (
                <MiniChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onAction={handleMiniChallenge}
                  completed={completedMiniChallenges.has(challenge.id)}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
