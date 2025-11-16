"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { DashboardCard } from "@/components/DashboardCard";
import { rewards, fanActivity, featuredChallenges } from "@/lib/data";
import { useDashboardStore } from "@/store/useDashboardStore";
import { RewardCard } from "@/components/RewardCard";
import { Timeline } from "@/components/Timeline";

export default function FanDashboard() {
  const { fanPoints, adjustFanPoints } = useDashboardStore();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <SectionHeader
        title="Fan Dashboard"
        description="Sammle Punkte, tausche Rewards und verfolge deine Geschichte"
        action={<span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">{fanPoints} Punkte</span>}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <DashboardCard title="Aktive Challenges" subtitle="missions">
          {featuredChallenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
              <div>
                <p className="text-white">{challenge.title}</p>
                <p className="text-xs text-white/50">Reward: {challenge.reward}</p>
              </div>
              <button className="text-sm text-primary-light" onClick={() => adjustFanPoints(40)}>
                Teilnahme
              </button>
            </div>
          ))}
        </DashboardCard>
        <DashboardCard title="Rewards" subtitle="store">
          <div className="grid gap-4 md:grid-cols-2">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Historie" subtitle="timeline">
        <Timeline items={fanActivity} />
      </DashboardCard>
    </div>
  );
}
