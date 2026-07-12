import { createResourceStore } from "./createResourceStore";
import { driversApi } from "../api/drivers";
import { create } from "zustand";

export const useDriversStore = createResourceStore(driversApi, { successLabel: "Driver" });

export const useAvailableDriversStore = create((set) => ({
  items: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const res = await driversApi.available();
      set({ items: res.data?.data || res.data || [], loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
}));
