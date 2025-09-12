// backend/src/tests/auth.test.ts
import request from "supertest";
import app from "../app"; // file app.ts nơi khởi tạo express
import pool from "../config/db";
import { IUser } from "../models/user.model";

// Dữ liệu test
const testUser = {
  username: "tester",
  email: "tester@example.com",
  password: "123456",
};

beforeAll(async () => {
  // Xoá tất cả user test trước khi chạy
  await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
});

afterAll(async () => {
  // Xoá user test sau khi chạy xong
  await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
  await pool.end();
});

describe("Auth API", () => {
  let accessToken: string;
  const agent = request.agent(app); // dùng agent để giữ cookie refresh token

  it("should register a new user", async () => {
    const res = await agent
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.email).toBe(testUser.email);

    accessToken = res.body.accessToken;
    expect(accessToken).toBeDefined();
  });

  it("should login with correct credentials", async () => {
    const res = await agent
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.accessToken).toBeDefined();

    accessToken = res.body.accessToken;
  });

  it("should reject login with wrong password", async () => {
    const res = await agent
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpass",
      });

    expect(res.status).toBe(401);
  });

  it("should get current user with /me", async () => {
    const res = await agent
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should refresh token", async () => {
    const res = await agent.post("/api/auth/refresh");
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("should logout and clear cookie", async () => {
    const res = await agent.post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });
});
