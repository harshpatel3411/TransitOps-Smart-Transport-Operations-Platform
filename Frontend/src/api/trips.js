import api from "./axiosInstance";

export const tripsApi = {
  list: (params) => api.get("/trips", { params }),
  create: (payload) => api.post("/trips", payload),
  dispatch: (id) => api.put(`/trips/${id}/dispatch`),
  complete: (id, payload) => api.put(`/trips/${id}/complete`, payload),
  cancel: (id) => api.put(`/trips/${id}/cancel`),
};
