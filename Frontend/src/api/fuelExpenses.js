import api from "./axiosInstance";

export const fuelLogsApi = {
  list: (params) => api.get("/fuel-logs", { params }),
  create: (payload) => api.post("/fuel-logs", payload),
};

export const expensesApi = {
  list: (params) => api.get("/expenses", { params }),
  create: (payload) => api.post("/expenses", payload),
};
