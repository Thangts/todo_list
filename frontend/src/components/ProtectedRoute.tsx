import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface Props {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        // chưa login → redirect login
        return <Navigate to="/login" replace />;
    }

    // đã login → render children
    return <>{children}</>;
}
