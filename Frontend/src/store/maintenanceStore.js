import { create } from "zustand";
import { toast } from "react-toastify";
import { maintenanceApi } from "../api/maintenance";

export const useMaintenanceStore = create((set, get) => ({
  items: [],
  loading: false,

  fetch: async (params) => {
    set({ loading: true });
    try {
      const res = await maintenanceApi.list(params);
      set({ items: res.data?.data || res.data || [], loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  createLog: async (payload) => {
    try {
      const res = await maintenanceApi.create(payload);
      const created = res.data?.data || res.data;
      set({ items: [created, ...get().items] });
      toast.success("Maintenance log opened — vehicle moved to In Shop.");
      return created;
    } catch (err) {
      return null;
    }
  },

  closeLog: async (id, payload) => {
    try {
      const res = await maintenanceApi.close(id, payload);
      const updated = res.data?.data || res.data;
      set({ items: get().items.map((m) => (m.id === id ? { ...m, ...updated } : m)) });
      toast.success("Maintenance log closed — vehicle restored.");
      return true;
    } catch (err) {
      return false;
    }
  },
}));
