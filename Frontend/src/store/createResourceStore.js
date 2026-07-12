import { create } from "zustand";
import { toast } from "react-toastify";

/**
 * Builds a zustand store for a CRUD resource.
 * resourceApi must expose: list(params), and optionally create, update, remove.
 */
export function createResourceStore(resourceApi, { successLabel = "Item" } = {}) {
  return create((set, get) => ({
    items: [],
    loading: false,
    error: null,

    fetch: async (params) => {
      set({ loading: true, error: null });
      try {
        const res = await resourceApi.list(params);
        set({ items: res.data?.data || res.data || [], loading: false });
      } catch (err) {
        set({ loading: false, error: err.message });
      }
    },

    create: async (payload) => {
      if (!resourceApi.create) return null;
      try {
        const res = await resourceApi.create(payload);
        const created = res.data?.data || res.data;
        set({ items: [created, ...get().items] });
        toast.success(`${successLabel} created.`);
        return created;
      } catch (err) {
        return null; // error toast already shown by axios interceptor
      }
    },

    update: async (id, payload) => {
      if (!resourceApi.update) return null;
      try {
        const res = await resourceApi.update(id, payload);
        const updated = res.data?.data || res.data;
        set({
          items: get().items.map((it) => (it.id === id ? { ...it, ...updated } : it)),
        });
        toast.success(`${successLabel} updated.`);
        return updated;
      } catch (err) {
        return null;
      }
    },

    remove: async (id) => {
      if (!resourceApi.remove) return false;
      try {
        await resourceApi.remove(id);
        set({ items: get().items.filter((it) => it.id !== id) });
        toast.success(`${successLabel} deleted.`);
        return true;
      } catch (err) {
        return false;
      }
    },
  }));
}
