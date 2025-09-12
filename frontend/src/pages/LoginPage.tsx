import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/api/auth/login", { email, password });
            const { user, accessToken } = res.data;

            // lưu user và token vào store
            setAuth(user, accessToken);

            // redirect về trang chính
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: 10, borderRadius: 6, background: "#3b82f6", color: "white", border: "none" }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

            <div style={{ marginTop: 12, fontSize: 14, textAlign: "center" }}>
                Don't have an account? <Link to="/register" style={{ color: "#3b82f6" }}>Register</Link>
            </div>
        </div>
    );
}
