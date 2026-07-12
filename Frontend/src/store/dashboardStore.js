import { create } from "zustand";
import { dashboardApi } from "../api/dashboard";

export const useDashboardStore = create((set) => ({
  kpis: null,
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const res = await dashboardApi.kpis();
      set({ kpis: res.data?.data || res.data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
}));
