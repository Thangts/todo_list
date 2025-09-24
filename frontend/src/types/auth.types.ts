export interface User { id: number; username: string; email?: string; }
export interface AuthResponse { user: User; accessToken?: string; message?: string; }
export interface LogoutResponse { message: string; }
export interface ProfileResponse { user: User; }
