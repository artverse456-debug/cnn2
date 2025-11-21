import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import type { GroupCard } from "@/lib/types";

export function CreatorCard({ group }: { group: GroupCard }) {
  return (
    <div className="group rounded-3xl border border-white/5 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-white/10">
      <div className="flex items-center gap-4">
        <img src={group.avatar} alt={group.title} className="h-16 w-16 rounded-2xl object-cover" />
        <div>
          <p className="text-lg font-semibold text-white">{group.title}</p>
          <p className="text-sm text-white/60">{group.creator}</p>
        </div>
        <span className="ml-auto rounded-full bg-primary/15 px-3 py-1 text-xs text-primary-light">
          {group.priceLabel}
        </span>
      </div>
      <p className="mt-4 text-sm text-white/70">{group.description}</p>
      <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/60">
        <span className="rounded-full border border-white/10 px-3 py-1">
          {formatNumber(group.members)} Mitglieder
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          Ø {formatNumber(group.avgMonthlyPoints)} Punkte/Fan
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-white/60">
        <p>Fanclub mit Rewards & Points</p>
        <Link href={`/creators/${group.id}`} className="text-primary-light">
          Gruppe ansehen →
        </Link>
      </div>
    </div>
  );
}
