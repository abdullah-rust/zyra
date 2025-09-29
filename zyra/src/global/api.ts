import axios from "axios";

export const api = axios.create({
  baseURL: "/api/user",
  withCredentials: true,
});

export const api2 = axios.create({
  baseURL: "/api/chat",
  withCredentials: true,
});
