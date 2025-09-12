import api from "./api";
import { AuthResponse, ProfileResponse, LogoutResponse } from "../types/auth.types";

export const registerApi = async (username: string, password: string) => {
    const res = await api.post<AuthResponse>(
        "http://localhost:4000/api/auth/register", // ✅ URL đầy đủ
        { username, password },
        { withCredentials: true }                  // ✅ để cookie set được
    );
    return res.data;
};

export const loginApi = async (username: string, password: string) => {
    const res = await api.post<AuthResponse>(
        "http://localhost:4000/api/auth/login",
        { username, password },
        { withCredentials: true }
    );
    return res.data;
};
