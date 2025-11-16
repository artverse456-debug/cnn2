import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Creator } from "@/lib/types";

export function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="group rounded-3xl border border-white/5 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-white/10">
      <div className="flex items-center gap-4">
        <img src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-2xl object-cover" />
        <div>
          <p className="text-lg font-semibold text-white">{creator.name}</p>
          <p className="text-sm text-white/60">{creator.category}</p>
        </div>
        <span className="ml-auto rounded-full bg-primary/15 px-3 py-1 text-xs text-primary-light">
          {formatCurrency(creator.price, "EUR")}/Monat
        </span>
      </div>
      <p className="mt-4 text-sm text-white/70">{creator.bio}</p>
      <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/60">
        {creator.highlights.map((item) => (
          <span key={item} className="rounded-full border border-white/10 px-3 py-1">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-white/60">
        <p>{formatNumber(creator.followers)} Follower</p>
        <Link href={`/creators/${creator.id}`} className="text-primary-light">
          Profil öffnen →
        </Link>
      </div>
    </div>
  );
}
