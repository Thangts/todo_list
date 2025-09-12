import { create } from "zustand";

interface User {
    id: number;
    username: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    getToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    setAuth: (user, token) => set({ user, token }),
    logout: () => set({ user: null, token: null }),
    getToken: () => get().token,
}));

// helper để dùng ngoài store
export const getAuthStore = () => useAuthStore.getState();
