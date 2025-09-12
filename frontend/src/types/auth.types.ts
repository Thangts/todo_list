// Thông tin user
export interface User {
    id: number;
    username: string;
}

// Response khi đăng ký / đăng nhập
export interface AuthResponse {
    user: User;
    accessToken?: string; // nếu backend trả về
    message?: string;
}

// Response khi logout
export interface LogoutResponse {
    message: string;
}

// Response cho /me
export interface ProfileResponse {
    user: User;
}
