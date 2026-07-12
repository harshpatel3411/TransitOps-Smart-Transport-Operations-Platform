import api from "./axiosInstance";

export const vehiclesApi = {
  list: (params) => api.get("/vehicles", { params }),
  available: () => api.get("/vehicles/available"),
  get: (id) => api.get(`/vehicles/${id}`),
  create: (payload) => api.post("/vehicles", payload),
  update: (id, payload) => api.put(`/vehicles/${id}`, payload),
  remove: (id) => api.delete(`/vehicles/${id}`),
  totalCost: (id) => api.get(`/vehicles/${id}/total-cost`),
};
