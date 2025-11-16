import type { Reward } from "@/lib/types";

export function RewardCard({ reward }: { reward: Reward }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/80">
      <p className="text-lg font-semibold text-white">{reward.title}</p>
      <p className="text-white/60">{reward.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-white/60">
        <span>{reward.points} Punkte</span>
        <span>noch {reward.stock}</span>
      </div>
      <button className="mt-4 w-full rounded-full border border-white/20 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 hover:border-primary">
        Einlösen
      </button>
    </div>
  );
}
