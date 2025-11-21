import Link from "next/link";
import type { Challenge } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ChallengeCard({ challenge, compact }: { challenge: Challenge; compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm text-white/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{challenge.title}</p>
          <p className="text-xs text-white/60">{challenge.reward}</p>
        </div>
        <span className="rounded-full border border-primary/20 px-3 py-1 text-xs text-primary-light">
          {challenge.badgeLabel ?? formatCurrency(challenge.price, "EUR")}
        </span>
      </div>
      <p className="mt-4 text-white/70">{challenge.description}</p>
      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
          {challenge.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-white/50">
        <p>{challenge.entriesLabel ?? `${challenge.entries} Einsendungen`}</p>
        <Link href={`/challenges/${challenge.id}`} className="text-primary-light">
          {challenge.linkLabel ?? "Details"}
        </Link>
      </div>
    </div>
  );
}
