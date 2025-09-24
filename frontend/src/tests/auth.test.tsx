// frontend/src/tests/auth.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { useAuthStore } from "../store/auth.store";

// Mock store để không gọi Zustand thật
jest.mock("../store/auth.store");

const mockSetAuth = jest.fn();
const mockLogout = jest.fn();
const mockGetToken = jest.fn();

beforeEach(() => {
  (useAuthStore as unknown as jest.Mock).mockReturnValue({
    user: null,
    token: null,
    setAuth: mockSetAuth,
    logout: mockLogout,
    getToken: mockGetToken,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Auth Pages", () => {
  test("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  test("submits login form", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalled(); // gọi setAuth sau login thành công
    });
  });

  test("renders register form", () => {
    render(<RegisterPage />);
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  test("submits register form", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalled(); // gọi setAuth sau register thành công
    });
  });
});
