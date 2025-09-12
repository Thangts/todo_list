// backend/src/services/auth.service.ts
import bcrypt from "bcryptjs";
import pool from "../config/db";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.util";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

// ----------------- REGISTER -----------------
export async function register({ username, email, password }: RegisterInput) {
  // Kiểm tra email đã tồn tại
  const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (existing.rows.length > 0) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới
  const res = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username, email",
    [username, email, hashedPassword]
  );

  const user = res.rows[0];

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
}

// ----------------- LOGIN -----------------
export async function login({ email, password }: LoginInput) {
  const res = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  const user = res.rows[0];
  if (!user) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: { id: user.id, username: user.username, email: user.email },
    accessToken,
    refreshToken,
  };
}

// ----------------- REFRESH -----------------
export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const res = await pool.query("SELECT * FROM users WHERE id=$1", [payload.id]);
  const user = res.rows[0];
  if (!user) throw new Error("User not found");

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return {
    user: { id: user.id, username: user.username, email: user.email },
    accessToken,
    newRefreshToken,
  };
}
