import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/user", // Same origin proxy
  withCredentials: true, // Cookies automatically send/receive karne ke liye
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
