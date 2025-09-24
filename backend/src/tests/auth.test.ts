//backend/src/tests/auth.test.ts
import request from "supertest";
import app from "../app";
import pool from "../config/db";

const testUser = { username: "tester", email: "tester@example.com", password: "123456" };

beforeAll(async () => {
  await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
});

afterAll(async () => {
  await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
  await pool.end();
});

describe("Auth API", () => {
  let accessToken: string;
  const agent = request.agent(app);

  it("should register a new user", async () => {
    const res = await agent.post("/api/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    accessToken = res.body.accessToken;
  });

  it("should login", async () => {
    const res = await agent.post("/api/auth/login").send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    accessToken = res.body.accessToken;
  });

  it("should get /me", async () => {
    const res = await agent.get("/api/auth/me").set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should refresh token", async () => {
    const res = await agent.post("/api/auth/refresh");
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("logout", async () => {
    const res = await agent.post("/api/auth/logout");
    expect(res.status).toBe(200);
  });
});
