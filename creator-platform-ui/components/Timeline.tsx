import type { FanActivity } from "@/lib/types";

export function Timeline({ items }: { items: FanActivity[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4">
          <div className="h-full w-1 rounded-full bg-primary/30" />
          <div>
            <p className="text-white">{item.action}</p>
            <p className="text-xs text-white/60">{item.timestamp}</p>
          </div>
          <span className={`ml-auto text-sm ${item.delta > 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {item.delta > 0 ? "+" : ""}
            {item.delta} pts
          </span>
        </li>
      ))}
    </ul>
  );
}
