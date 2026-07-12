import api from "./axiosInstance";

export const reportsApi = {
  fuelEfficiency: () => api.get("/reports/fuel-efficiency"),
  utilization: () => api.get("/reports/utilization"),
  cost: () => api.get("/reports/cost"),
  roi: () => api.get("/reports/roi"),
  exportCsv: (type) =>
    api.get("/reports/export", { params: { type: "csv", report: type }, responseType: "blob" }),
};
