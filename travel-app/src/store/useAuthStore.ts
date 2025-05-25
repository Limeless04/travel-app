import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authClient } from "../lib/axios/client";

export interface User {
  id: number;
  username: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
  statusCode: number | null;
  isSessionExpiredModalOpen: boolean; 
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean }>;
  clearMessages: () => void;
  showSessionExpiredModal: () => void; 
  hideSessionExpiredModal: () => void; 
  handleSessionExpired: () => void; 
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      message: null,
      statusCode: null, 
      isSessionExpiredModalOpen: false,
      login: async (email: string, password: string) => {
        set({ loading: true, error: null, message: null });
        try {
          const res = await authClient.post(
           "/signin",
            { email, password }
          );

         
          const userData = res.data.user || res.data;

          set({
            isAuthenticated: true,
            user: {
              id: userData.id,
              username: userData.username,
              email: userData.email,
              token: res.data.access_token, // Make sure 'access_token' is correct
            },
            loading: false,
            message: "Login successful!",
            statusCode: res.status, 
          });
          return { success: true };
        } catch (error: any) {
          console.error("Login error:", error);
          set({
            error:
              error.response?.data?.error ||
              "Login failed. Please try again.",
              message: error.response?.data?.message || null,
            loading: false,
            isAuthenticated: false,
            user: null, 
             statusCode: error.status || null, // Capture the status code if available
          });
          return { success: false };
        }
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          message: 'You have been logged out.',
        });
      },
      register: async (username: string, email: string, password: string) => {
        set({ loading: true, error: null, message: null }); // Clear previous errors/messages
        try {
          const res = await authClient.post(
            '/signup',
            { username, email, password }
          );

          // You might want to automatically log in after registration, or just show a success message
          set({
            loading: false,
            message: res.data.message || 'Registration successful! Please log in.', // Assuming API sends a message
            error: null,
          });
          return { success: true };
        } catch (error: any) {
          console.error("Registration error:", error); 
          set({
            error: error.response?.data?.error || 'Registration failed. Please try again.',
            message: error.response?.data?.message || null,
            statusCode: error.response?.status || null, // Capture the status code if available
            loading: false,
            isAuthenticated: false, 
            user: null, 
          });
          return { success: false };
        }
      },
      clearMessages: () => {
        set({ error: null, message: null });
      },
       showSessionExpiredModal: () => {
        set({ isSessionExpiredModalOpen: true });
      },
      
      hideSessionExpiredModal: () => {
        set({ isSessionExpiredModalOpen: false });
      },
      
      handleSessionExpired: () => {
        // Clear user data and show modal
        set({
          user: null,
          isAuthenticated: false,
          isSessionExpiredModalOpen: true,
          error: 'Your session has expired. Please log in again.',
        });
      },
    }),
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => sessionStorage),
       partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
