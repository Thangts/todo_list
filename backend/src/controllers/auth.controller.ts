// backend/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

// ----------------- REGISTER -----------------
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.register({
      username,
      email,
      password,
    });

    // Gửi refresh token qua httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.status(201).json({ user, accessToken });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Registration failed" });
  }
};

// ----------------- LOGIN -----------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.login({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user, accessToken });
  } catch (err: any) {
    res.status(401).json({ message: err.message || "Invalid credentials" });
  }
};

// ----------------- LOGOUT -----------------
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Logout failed" });
  }
};

// ----------------- REFRESH TOKEN -----------------
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const { user, accessToken, newRefreshToken } =
      await AuthService.refresh(refreshToken);

    // set lại cookie refresh mới
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user, accessToken });
  } catch (err: any) {
    res.status(401).json({ message: err.message || "Invalid refresh token" });
  }
};

// ----------------- ME -----------------
export const me = async (req: Request, res: Response) => {
  try {
    // req.user được gắn từ middleware requireAuth
    const user = (req as any).user;
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ message: "Cannot fetch user info" });
  }
};
