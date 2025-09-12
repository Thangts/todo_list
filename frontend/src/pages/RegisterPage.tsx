import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await api.post("/api/auth/register", { username, email, password });
            navigate("/login"); // đăng ký xong redirect login
        } catch (err: any) {
            setError(err.response?.data?.message || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Register</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: 10, borderRadius: 6, background: "#3b82f6", color: "white", border: "none" }}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
            <div style={{ marginTop: 12, fontSize: 14, textAlign: "center" }}>
                Already have an account? <Link to="/login" style={{ color: "#3b82f6" }}>Login</Link>
            </div>
        </div>
    );
}
