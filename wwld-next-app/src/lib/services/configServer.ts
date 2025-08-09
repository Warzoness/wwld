import axios from "axios";

const backendBaseURL = "https://wwld-production.up.railway.app";

const apiClient = axios.create({
  baseURL: backendBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


