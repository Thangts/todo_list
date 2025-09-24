// frontend/src/components/Navbar.tsx
import React, { useState } from "react";
import { useAuthStore } from "../store/auth.store";

interface FilterPayload {
    category: string;
    priority: string;
}

interface NavbarProps {
    onApplyFilters?: (filters: FilterPayload) => void;
    onOpenAdd?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onApplyFilters, onOpenAdd }) => {
    const { user, logout } = useAuthStore();
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");

    return (
        <div className="navbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="title">To-Do List</div>
            </div>

            <div className="controls">
                <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Tất cả danh mục</option>
                    <option value="general">Chung</option>
                    <option value="work">Công việc</option>
                    <option value="personal">Cá nhân</option>
                    <option value="shopping">Mua sắm</option>
                    <option value="study">Học tập</option>
                </select>

                <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="">Tất cả mức độ</option>
                    <option value="high">Cao</option>
                    <option value="medium">Trung bình</option>
                    <option value="low">Thấp</option>
                </select>

                <button className="btn" onClick={() => onApplyFilters?.({ category, priority })}>
                    Hiện task
                </button>

                <button className="btn" onClick={() => onOpenAdd?.()}>
                    Thêm task
                </button>
            </div>

            <div className="user-area">
                {user ? (
                    <>
                        <div className="small">{user.username}</div>
                        <button className="btn btn-sm" onClick={logout}>
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <div className="small">Chưa đăng nhập</div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
