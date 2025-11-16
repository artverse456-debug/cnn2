"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "Alle" },
  { id: "design", label: "Design" },
  { id: "music", label: "Music" },
  { id: "video", label: "Video" }
];

export function FilterBar() {
  const { activeFilter, setActiveFilter } = useDashboardStore();

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition",
            activeFilter === filter.id
              ? "border-primary bg-primary/20 text-white"
              : "border-white/10 text-white/60 hover:text-white"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
