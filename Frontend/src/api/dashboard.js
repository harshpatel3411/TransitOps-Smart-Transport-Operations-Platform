import api from "./axiosInstance";

export const dashboardApi = {
  kpis: () => api.get("/dashboard/kpis"),
};
