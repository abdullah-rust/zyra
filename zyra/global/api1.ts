import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/user",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response.data?.message === "TOKEN_EXPIRED"
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Axios: Token expired, refreshing silently...");

        // Refresh token API call
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        return api(originalRequest);
      } catch (refreshError) {
        console.error("🚨 Axios: Refresh failed, redirecting to login.");

        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/welcome";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
