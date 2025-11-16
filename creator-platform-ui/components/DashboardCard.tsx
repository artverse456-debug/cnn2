import { ReactNode } from "react";

export function DashboardCard({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-white/5 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">{subtitle}</p>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
        </div>
        {action}
      </div>
      <div className="mt-6 space-y-4 text-white/80">{children}</div>
    </section>
  );
}
