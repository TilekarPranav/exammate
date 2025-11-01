import { create } from "zustand";
import axios from "axios";

const URL = import.meta.env.CLIENT_URL || "http://localhost:5000";

const API_URL =
  import.meta.env.MODE === "development"
    ? `${URL}/api/auth`
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  init: async () => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        await useAuthStore.getState().checkAuth();
      } catch {
        // ignore, checkAuth will set correct state
      }
    }
  },

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_URL}/logout`);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: "Error logging out" });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/verify-email`, { code });

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get(`${API_URL}/check-auth`);
      if (res.data.user) {
        set({
          user: res.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          isCheckingAuth: false,
        });
      }
    } catch {
      set({ isAuthenticated: false, user: null, isCheckingAuth: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: res.data.message, isLoading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Error sending reset password email",
        isLoading: false,
      });
      throw err;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(
        `${API_URL}/reset-password/${token}`,
        { password }
      );
      set({ message: res.data.message, isLoading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message || "Error resetting password",
        isLoading: false,
      });
      throw err;
    }
  },
}));
