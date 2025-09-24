// frontend/src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface Props { children: React.ReactNode; }

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { user } = useAuthStore();
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

export default ProtectedRoute;
