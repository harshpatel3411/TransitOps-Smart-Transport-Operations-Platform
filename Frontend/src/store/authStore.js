import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null, // { id, name, email, role: 'Fleet Manager' | 'Driver' | 'Safety Officer' | 'Financial Analyst' }
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await authApi.login(email, password);
          const payload = res?.data?.data ?? res?.data ?? {};
          const { token, user } = payload;

          if (!token) {
            set({ loading: false });
            return false;
          }

          set({ token, user, loading: false });
          return true;
        } catch (err) {
          set({ loading: false });
          return false;
        }
      },

      register: async (payload) => {
        set({ loading: true });
        try {
          await authApi.register(payload);
          set({ loading: false });
          return true;
        } catch (err) {
          set({ loading: false });
          return false;
        }
      },

      fetchMe: async () => {
        try {
          const res = await authApi.me();
          const payload = res?.data?.data ?? res?.data ?? {};
          set({ user: payload?.user ?? payload ?? null });
        } catch (err) {
          // handled by axios interceptor (401 -> logout)
        }
      },

      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "transitops-auth", // localStorage key
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
