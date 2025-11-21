"use client";

import { useState } from "react";
import { RewardCard } from "@/components/RewardCard";
import { creatorGroups, rewards as rewardCatalog } from "@/lib/data";
import { Feed } from "@/components/groups/Feed";
import { RewardsModal } from "@/components/groups/RewardsModal";
import { useGroupMembershipStore } from "@/store/useGroupMembershipStore";

type CreatorGroupPageProps = {
  params: { id: string };
};

export default function CreatorGroupPage({ params }: CreatorGroupPageProps) {
  const group = creatorGroups.find((item) => item.creator.id === params.id);
  const { joinedGroups, joinGroup, leaveGroup } = useGroupMembershipStore();
  const [showRewards, setShowRewards] = useState(false);

  if (!group) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
          Keine Creator Group für dieses Profil gefunden.
        </div>
      </div>
    );
  }

  const isMember = joinedGroups.includes(group.id);
  const rewardDetails =
    group.rewards.length > 0
      ? group.rewards.map((rewardTitle, index) => {
          const fallback = rewardCatalog[index % rewardCatalog.length];

          return {
            ...fallback,
            id: `${group.id}-reward-${index}`,
            title: rewardTitle,
            description: fallback.description
          };
        })
      : rewardCatalog;

  const activityPreview = group.feed.slice(0, 3);
  const extendedDescription = `${group.description} Diese Gruppe enthält zusätzliche Deep-Dives, Dateien und Feedback-Loops, bevor du beitrittst.`;

  const handleMembership = () => {
    if (isMember) {
      leaveGroup(group.id);
    } else {
      joinGroup(group.id);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <section className="rounded-[32px] border border-white/5 bg-white/5 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={group.creator.avatar} alt={group.creator.name} className="h-20 w-20 rounded-2xl object-cover" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">{group.creator.category}</p>
              <h1 className="text-3xl font-semibold text-white">{group.title}</h1>
              <p className="text-white/70">von {group.creator.name}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 px-6 py-4 text-center">
            <p className="text-sm text-white/60">Monatlich</p>
            <p className="text-3xl font-semibold text-white">€{group.price}</p>
            <button
              type="button"
              onClick={handleMembership}
              className="mt-3 w-full rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              {isMember ? "Verlassen" : "Beitreten"}
            </button>
          </div>
        </div>
        <p className="mt-6 text-base text-white/80">{group.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {group.perks.map((perk) => (
            <span key={perk} className="rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
              {perk}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Über die Gruppe</p>
          <p className="mt-3 text-base text-white/80">{extendedDescription}</p>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Vorteile</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(group.perks.length ? group.perks : ["Livestreams", "Feedback", "Preset-Downloads"]).map((perk) => (
              <span key={perk} className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-sm text-white">
                {perk}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Belohnungen</p>
              <p className="text-sm text-white/60">Direkt verfügbar vor dem Beitritt</p>
            </div>
            <button
              type="button"
              onClick={() => setShowRewards(true)}
              className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
            >
              Alle Rewards
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {rewardDetails.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Gruppenregeln</p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-white/70">
            {(group.rules.length ? group.rules : ["Regeln folgen nach Join", "Bleib respektvoll", "Keine Spam-Posts"]).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Letzte 3 Posts</p>
          {activityPreview.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {activityPreview.map((post) => (
                <div key={post.id} className="rounded-2xl border border-white/5 bg-black/30 p-4">
                  <p className="text-sm font-semibold text-white">{post.author}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{post.role}</p>
                  <p className="mt-2 text-sm text-white/70">{post.content.slice(0, 120)}{post.content.length > 120 ? "…" : ""}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-white/5 bg-black/30 p-4 text-sm text-white/70">Noch keine Posts – Updates folgen.</div>
          )}
        </div>
      </section>

      {isMember ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-white">Group Feed</h2>
            <button
              type="button"
              onClick={() => setShowRewards(true)}
              className="rounded-2xl border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:border-white/60"
            >
              Rewards anzeigen
            </button>
          </div>
          <Feed posts={group.feed} />
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-black/30 p-8 text-center text-white/70">
          Tritt der Gruppe bei, um den geschlossenen Feed und Rewards zu sehen.
        </div>
      )}

      <RewardsModal open={showRewards} onClose={() => setShowRewards(false)} />
    </div>
  );
}
