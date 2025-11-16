"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { DashboardCard } from "@/components/DashboardCard";
import { featuredChallenges, rewards } from "@/lib/data";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatCurrency } from "@/lib/utils";

export default function CreatorDashboard() {
  const { creatorBalance, adjustCreatorBalance } = useDashboardStore();
  const [newReward, setNewReward] = useState("");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <SectionHeader
        title="Creator Dashboard"
        description="Verwalte Challenges, Rewards und Abo-Preise"
        action={<span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">Saldo: {formatCurrency(creatorBalance, "EUR")}</span>}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <DashboardCard
          title="Neue Challenge"
          subtitle="launch"
          action={<button className="rounded-full bg-primary/80 px-4 py-2 text-sm font-semibold">Publish</button>}
        >
          <label className="text-sm text-white/70">
            Titel
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2" placeholder="z.B. Hologram Moodboard" />
          </label>
          <label className="text-sm text-white/70">
            Beschreibung
            <textarea className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2" rows={3} placeholder="Was sollen Fans einreichen?" />
          </label>
        </DashboardCard>
        <DashboardCard title="Rewards" subtitle="boost" action={<span className="text-sm text-white/60">{rewards.length} aktiv</span>}>
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                <div>
                  <p className="text-white">{reward.title}</p>
                  <p className="text-xs text-white/50">{reward.points} pts · {reward.stock} verfügbar</p>
                </div>
                <button className="text-sm text-primary-light">Bearbeiten</button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={newReward}
              onChange={(e) => setNewReward(e.target.value)}
              className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-2"
              placeholder="Neuer Reward"
            />
            <button
              onClick={() => {
                if (!newReward) return;
                setNewReward("");
              }}
              className="rounded-2xl bg-white/10 px-4 py-2 text-sm"
            >
              Speichern
            </button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <DashboardCard title="Abo Preis" subtitle="pricing">
          <p className="text-3xl font-semibold text-white">€24 <span className="text-base text-white/60">pro Monat</span></p>
          <input type="range" min={5} max={80} defaultValue={24} className="w-full" />
          <p className="text-sm text-white/60">Passe deinen Preis live an. Alle Updates sind rein UI-basiert.</p>
        </DashboardCard>
        <DashboardCard title="Gewinner auswählen" subtitle="winners">
          {featuredChallenges.slice(0, 2).map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
              <div>
                <p className="text-white">{challenge.title}</p>
                <p className="text-xs text-white/50">{challenge.entries} Einreichungen</p>
              </div>
              <button className="rounded-full border border-white/20 px-4 py-2 text-xs">Pick winner</button>
            </div>
          ))}
        </DashboardCard>
      </div>

      <DashboardCard title="Auszahlungen" subtitle="payouts">
        <p className="text-white/70">Du kannst jederzeit eine Auszahlung triggern.</p>
        <div className="flex flex-wrap gap-4">
          {[200, 500, 1200].map((amount) => (
            <button
              key={amount}
              onClick={() => adjustCreatorBalance(-amount)}
              className="rounded-2xl border border-white/10 px-6 py-3 text-sm text-white"
            >
              {formatCurrency(amount, "EUR")}
            </button>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
