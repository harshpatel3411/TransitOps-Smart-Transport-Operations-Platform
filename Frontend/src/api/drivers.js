import api from "./axiosInstance";

export const driversApi = {
  list: (params) => api.get("/drivers", { params }),
  available: () => api.get("/drivers/available"),
  create: (payload) => api.post("/drivers", payload),
  update: (id, payload) => api.put(`/drivers/${id}`, payload),
  remove: (id) => api.delete(`/drivers/${id}`),
};
