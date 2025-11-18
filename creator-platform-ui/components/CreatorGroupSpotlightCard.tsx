import Link from "next/link";
import type { CreatorGroupSpotlight } from "@/lib/types";

export function CreatorGroupSpotlightCard({ group }: { group: CreatorGroupSpotlight }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 text-white">
      <div className="flex items-center gap-4">
        <img src={group.avatar} alt={group.title} className="h-14 w-14 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white">{group.title}</h3>
          <p className="text-sm text-white/60">von {group.creator}</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">{group.price}</span>
      </div>
      <p className="mt-4 text-sm text-white/70">{group.description}</p>
      <div className="mt-4">
        <Link
          href={`/groups/${group.id}`}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
        >
          Zur Gruppe
        </Link>
      </div>
    </div>
  );
}
