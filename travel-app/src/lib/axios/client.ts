// 2. Create axios instance with interceptor (axiosConfig.ts)
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // For general endpoints
});

// Auth-specific client
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/auth", // For auth endpoints
});

// Request interceptor to add token
const addAuthToken = (config: any) => {
  const { user } = useAuthStore.getState();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
};

// Add interceptors to both clients
[apiClient, authClient].forEach((client) => {
  client.interceptors.request.use(addAuthToken, (error) =>
    Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const { handleSessionExpired } = useAuthStore.getState();
        handleSessionExpired();
      }
      return Promise.reject(error);
    }
  );
});

export { apiClient, authClient };
