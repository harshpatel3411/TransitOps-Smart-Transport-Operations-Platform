import { createResourceStore } from "./createResourceStore";
import { vehiclesApi } from "../api/vehicles";
import { create } from "zustand";

export const useVehiclesStore = createResourceStore(vehiclesApi, { successLabel: "Vehicle" });

// Extra slice for the "available vehicles" dropdown list, kept separate so
// it doesn't fight with the full filtered table list above.
export const useAvailableVehiclesStore = create((set) => ({
  items: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const res = await vehiclesApi.available();
      set({ items: res.data?.data || res.data || [], loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
}));
