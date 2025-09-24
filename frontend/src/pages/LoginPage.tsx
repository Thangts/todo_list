// frontend/src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); setLoading(true);
        try {
            const res = await api.post("/api/auth/login", { email, password }, { withCredentials: true });
            const { user, accessToken } = res.data;
            setAuth(user, accessToken);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Đăng nhập thất bại");
        } finally { setLoading(false); }
    };

    return (
        <div style={{ maxWidth: 480, margin: "80px auto", padding: 20, background: "white", borderRadius: 8 }}>
            <h2 style={{ textAlign: "center", marginBottom: 18 }}>Đăng nhập</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: "1px solid #e5e7eb" }} />
                <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: "1px solid #e5e7eb" }} />
                <button type="submit" disabled={loading} style={{ padding: 10, borderRadius: 6, background: "#3b82f6", color: "white", border: "none" }}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
            {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
            <div style={{ marginTop: 14, textAlign: "center", fontSize: 14 }}>
                Chưa có tài khoản? <Link to="/register" style={{ color: "#3b82f6" }}>Đăng ký</Link>
            </div>
        </div>
    );
}
