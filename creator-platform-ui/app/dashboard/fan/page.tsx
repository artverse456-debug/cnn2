"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { DashboardCard } from "@/components/DashboardCard";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Timeline } from "@/components/Timeline";
import { useAuthStore } from "@/store/useAuthStore";

const memberGroups = [
  { id: "group-1", name: "Neon Render Lab", creator: "Mila Ray", totalPoints: 4820 },
  { id: "group-2", name: "Analog Cine Guild", creator: "Leo Stone", totalPoints: 4510 },
  { id: "group-3", name: "Loop Society", creator: "Ava Kai", totalPoints: 4395 },
];

const redeemedRewards = [
  { id: "redeemed-1", action: "Backstage Badge", timestamp: "12. Mai 2025", delta: -260 },
  { id: "redeemed-2", action: "Limited Merch Capsule", timestamp: "04. Mai 2025", delta: -180 },
  { id: "redeemed-3", action: "1:1 Mentor Session", timestamp: "20. April 2025", delta: -420 },
];

export default function FanDashboard() {
  const { fanPoints } = useDashboardStore();
  const profile = useAuthStore((state) => state.profile);

  const dummyProfile = {
    role: "fan" as const,
    name: "Max Mustermann",
    points_balance: 3200,
    groups: memberGroups,
    stats: {
      redeemed: redeemedRewards.length,
    },
  };

  const profileToUse = profile ?? dummyProfile;
  const pointsBalance = profileToUse.points_balance ?? profileToUse.points ?? fanPoints;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <SectionHeader
        title="Fan Dashboard"
        description="Sammle Punkte, tausche Rewards und verfolge deine Geschichte"
        action={<span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">{pointsBalance} Punkte</span>}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <DashboardCard title="Deine Gruppen" subtitle="community">
          {memberGroups.map((group) => (
            <div key={group.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
              <div>
                <p className="text-white">{group.name}</p>
                <p className="text-xs text-white/50">
                  Creator: {group.creator} · {group.totalPoints} Gesamtpunkte
                </p>
              </div>
              <button className="text-sm text-primary-light">Zur Gruppe</button>
            </div>
          ))}
        </DashboardCard>
        <DashboardCard title="Deine Punkte" subtitle="score">
          <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">Aktueller Stand</p>
            <p className="mt-3 text-4xl font-semibold">{pointsBalance} Punkte</p>
            <p className="mt-2 text-sm text-white/70">Basierend auf deinen Challenges, Gruppen und Rewards.</p>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Eingelöste Rewards" subtitle="timeline">
        <Timeline items={redeemedRewards} />
      </DashboardCard>
    </div>
  );
}
