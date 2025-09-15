// src/lib/apiClient.ts
import axios from "axios";
import { backendUrl } from "./consts/const";



export const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});