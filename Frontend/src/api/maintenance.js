import api from "./axiosInstance";

export const maintenanceApi = {
  list: (params) => api.get("/maintenance", { params }),
  create: (payload) => api.post("/maintenance", payload),
  close: (id, payload) => api.put(`/maintenance/${id}/close`, payload),
};
