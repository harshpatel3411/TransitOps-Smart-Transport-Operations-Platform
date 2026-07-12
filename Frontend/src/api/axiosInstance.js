import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

// Backend runs on a different port (3000) than the frontend (5173).
// This only works if the Express backend has CORS enabled for
// http://localhost:5173 — see README.md for the exact snippet.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling -> toast popup for any kind of problem
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong. Please try again.";

    if (error.code === "ECONNABORTED") {
      message = "Request timed out. Check that the backend server is running.";
    } else if (error.message === "Network Error") {
      message =
        "Can't reach the server at " +
        BASE_URL +
        ". Is the backend running on port 3000, and is CORS enabled for this origin?";
    } else if (error.response) {
      const { status, data } = error.response;
      message = data?.message || data?.error || message;

      if (status === 401) {
        message = message || "Your session has expired. Please log in again.";
        useAuthStore.getState().logout();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      } else if (status === 403) {
        message = message || "You don't have permission to do that.";
      } else if (status === 404) {
        message = message || "That resource couldn't be found.";
      } else if (status === 409) {
        message = message || "That value already exists (duplicate entry).";
      } else if (status >= 500) {
        message = "Server error. Please try again in a moment.";
      }
    }

    toast.error(message, { toastId: message });
    return Promise.reject(error);
  }
);

export default api;
