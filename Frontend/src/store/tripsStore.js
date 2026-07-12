import { create } from "zustand";
import { toast } from "react-toastify";
import { tripsApi } from "../api/trips";

export const useTripsStore = create((set, get) => ({
  items: [],
  loading: false,

  fetch: async (params) => {
    set({ loading: true });
    try {
      const res = await tripsApi.list(params);
      set({ items: res.data?.data || res.data || [], loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  createTrip: async (payload) => {
    try {
      const res = await tripsApi.create(payload);
      const created = res.data?.data || res.data;
      set({ items: [created, ...get().items] });
      toast.success("Trip created as Draft.");
      return created;
    } catch (err) {
      return null;
    }
  },

  dispatchTrip: async (id) => {
    try {
      const res = await tripsApi.dispatch(id);
      const updated = res.data?.data || res.data;
      set({ items: get().items.map((t) => (t.id === id ? { ...t, ...updated } : t)) });
      toast.success("Trip dispatched.");
      return true;
    } catch (err) {
      return false;
    }
  },

  completeTrip: async (id, payload) => {
    try {
      const res = await tripsApi.complete(id, payload);
      const updated = res.data?.data || res.data;
      set({ items: get().items.map((t) => (t.id === id ? { ...t, ...updated } : t)) });
      toast.success("Trip completed.");
      return true;
    } catch (err) {
      return false;
    }
  },

  cancelTrip: async (id) => {
    try {
      const res = await tripsApi.cancel(id);
      const updated = res.data?.data || res.data;
      set({ items: get().items.map((t) => (t.id === id ? { ...t, ...updated } : t)) });
      toast.success("Trip cancelled.");
      return true;
    } catch (err) {
      return false;
    }
  },
}));
