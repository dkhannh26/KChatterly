import axios from "axios";

// prefer explicit env var so we can control URL in Docker/production
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "/api");

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, //send cookies with req
});
