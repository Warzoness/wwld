// src/lib/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api", // ✅ luôn đi qua rewrite
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // không cần gửi cookie sang backend
});

