//backend/src/models/user.model.ts
export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

import pool from "../config/db";

export const findUserByEmail = async (email: string) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0] ?? null;
};

export const findUserById = async (id: number) => {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0] ?? null;
};

export const createUser = async (username: string, email: string, password: string) => {
  const res = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username, email",
    [username, email, password]
  );
  return res.rows[0];
};
