import { ReactNode } from "react";

export function StatCard({ label, value, trend }: { label: string; value: string; trend?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
      <p className="text-sm text-white/60">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
        {trend}
      </div>
    </div>
  );
}
