import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    phone: string;
    isLoggedIn: boolean;
    login: (phone: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            phone: "",
            isLoggedIn: false,
            login: (phone) => set({ phone, isLoggedIn: true }),
            logout: () => set({ phone: "", isLoggedIn: false }),
        }),
        {
            name: "auth-store", // key in localStorage
        }
    )
);
