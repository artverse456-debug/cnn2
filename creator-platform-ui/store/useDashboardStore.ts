import { create } from "zustand";

export type DashboardState = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  creatorBalance: number;
  fanPoints: number;
  adjustCreatorBalance: (delta: number) => void;
  adjustFanPoints: (delta: number) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  activeFilter: "groups",
  creatorBalance: 12400,
  fanPoints: 880,
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  adjustCreatorBalance: (delta) =>
    set((state) => ({ creatorBalance: Math.max(0, state.creatorBalance + delta) })),
  adjustFanPoints: (delta) =>
    set((state) => ({ fanPoints: Math.max(0, state.fanPoints + delta) }))
}));
