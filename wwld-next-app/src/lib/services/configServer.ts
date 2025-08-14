import axios from "axios";
import { backendUrl } from "../consts/const";

const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});


