"use client";

import { useState } from "react";

export function SearchInput({ placeholder }: { placeholder?: string }) {
  const [value, setValue] = useState("");
  return (
    <label className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
      <span className="text-white/60">🔍</span>
      <input
        className="flex-1 bg-transparent placeholder:text-white/40 focus:outline-none"
        placeholder={placeholder ?? "Suche Creator oder Challenges"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {value && (
        <button onClick={() => setValue("")} className="text-xs text-white/50">
          Clear
        </button>
      )}
    </label>
  );
}
