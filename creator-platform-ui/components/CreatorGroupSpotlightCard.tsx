import Link from "next/link";
import type { CreatorGroupSpotlight } from "@/lib/types";

export function CreatorGroupSpotlightCard({ group }: { group: CreatorGroupSpotlight }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-black/30 p-5 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <img src={group.avatar} alt={group.title} className="h-14 w-14 rounded-2xl object-cover" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Creator Group</p>
            <p className="truncate text-lg font-semibold text-white">{group.title}</p>
            <p className="text-sm text-white/60">von {group.creator}</p>
          </div>
        </div>
        <div className="flex flex-col items-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left sm:items-end sm:text-right">
          <span className="text-xs text-white/50">Monatlich</span>
          <span className="text-base font-semibold text-white">{group.price}</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-white/70 [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis">
        {group.description}
      </p>
      <div className="mt-5">
        <Link
          href={`/creators/${group.id}/groups`}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
        >
          Gruppe ansehen
        </Link>
      </div>
    </div>
  );
}
