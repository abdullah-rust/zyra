import axios from "axios";

const api = axios.create({
  baseURL: "/api/user",
  withCredentials: true,
});

export default api;
