//backend/src/services/auth.service.ts
import bcrypt from "bcryptjs";
import pool from "../config/db";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.util";

interface RegisterInput { username: string; email: string; password: string; }
interface LoginInput { email: string; password: string; }

export async function register({ username, email, password }: RegisterInput) {
  const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
  if (existing.rows.length > 0) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, 10);
  const res = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username, email",
    [username, email, hashed]
  );

  const user = res.rows[0];
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
}

export async function login({ email, password }: LoginInput) {
  const res = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  const user = res.rows[0];
  if (!user) throw new Error("Invalid email or password");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid email or password");

  const payload = { id: user.id, username: user.username, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { user: payload, accessToken, refreshToken };
}

export async function refresh(token: string) {
  const payload = verifyRefreshToken(token);
  const res = await pool.query("SELECT id, username, email FROM users WHERE id=$1", [payload.id]);
  const user = res.rows[0];
  if (!user) throw new Error("User not found");
  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  return { user, accessToken, newRefreshToken };
}
