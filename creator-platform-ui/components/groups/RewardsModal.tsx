"use client";

import { rewards } from "@/lib/data";

type RewardsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RewardsModal({ open, onClose }: RewardsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#05050a] p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Rewards</p>
            <h3 className="text-2xl font-semibold text-white">Unlockbare Drops</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/50"
          >
            Schließen
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {rewards.map((reward) => (
            <div key={reward.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{reward.points} Punkte</p>
              <h4 className="mt-2 text-lg font-semibold text-white">{reward.title}</h4>
              <p className="mt-2 text-sm text-white/70">{reward.description}</p>
              <button className="mt-4 w-full rounded-2xl bg-white/90 py-2 text-sm font-semibold text-black hover:bg-white">
                Einlösen
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
