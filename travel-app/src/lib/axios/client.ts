// 2. Create axios instance with interceptor (axiosConfig.ts)
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ENDPOINT_API_URL,
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { handleSessionExpired } = useAuthStore.getState();
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);

export default apiClient;