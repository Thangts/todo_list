//frontend/src/services/auth.api.ts
import api from "./api";
import { AuthResponse } from "../types/auth.types";

export const registerApi = async (username: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>("/api/auth/register", { username, email, password });
    return res.data;
};

export const loginApi = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/api/auth/login", { email, password });
    return res.data;
};
