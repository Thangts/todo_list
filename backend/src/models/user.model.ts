// backend/src/models/user.model.ts
export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

// Optional: các hàm helper trực tiếp với database
import pool from "../config/db";

// Lấy user theo email
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return (res.rowCount ?? 0) > 0 ? res.rows[0] : null;
};

// Tạo user mới
export const createUser = async (username: string, email: string, password: string): Promise<IUser> => {
  const res = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  // ép rowCount tránh TS cảnh báo
  if ((res.rowCount ?? 0) === 0) throw new Error("Failed to create user");
  return res.rows[0];
};

// Lấy user theo id
export const findUserById = async (id: number): Promise<IUser | null> => {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0 ? res.rows[0] : null;
};
