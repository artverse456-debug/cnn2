import { ReactNode } from "react";

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-white/70">{description}</p>}
      </div>
      {action}
    </div>
  );
}
