import type { ReactNode } from "react";

export type MiniChallenge = {
  id: string;
  title: string;
  icon: ReactNode;
  timeLeft?: string;
  entries?: number;
  points?: number;
  actionLabel?: string;
};

export function MiniChallengeCard({
  challenge,
  onAction,
  completed,
}: {
  challenge: MiniChallenge;
  onAction?: (challenge: MiniChallenge) => void;
  completed?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-lg">
            {challenge.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{challenge.title}</p>
            {challenge.timeLeft && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Noch {challenge.timeLeft}</p>
            )}
          </div>
        </div>
        {(challenge.entries || challenge.points) && (
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary-light">
            {challenge.entries ? `${challenge.entries} Einsendungen` : `${challenge.points} Punkte`}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          <span>Aktiv</span>
        </div>
        <button
          className="rounded-xl border border-primary/30 bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:border-primary/50 hover:bg-primary/80 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/60"
          onClick={() => onAction?.(challenge)}
          disabled={completed}
        >
          {completed ? "Abgeschlossen" : challenge.actionLabel ?? "Teilnehmen"}
        </button>
      </div>
    </div>
  );
}
