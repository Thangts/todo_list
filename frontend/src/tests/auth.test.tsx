import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { useAuthStore } from "../store/auth.store";

// Mock store để không gọi API thật
jest.mock("../store/auth.store");

const mockLogin = jest.fn();
const mockRegister = jest.fn();

beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
        login: mockLogin,
        register: mockRegister,
        logout: jest.fn(),
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Auth Pages", () => {
    test("renders login form", () => {
        render(<LoginPage />);
        expect(screen.getByText(/Đăng nhập/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tên đăng nhập/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
    });

    test("calls login on form submit", async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText(/Tên đăng nhập/i), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByLabelText(/Mật khẩu/i), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Đăng nhập/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
        });
    });

    test("renders register form", () => {
        render(<RegisterPage />);
        expect(screen.getByText(/Đăng ký/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tên đăng nhập/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
    });

    test("calls register on form submit", async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByLabelText(/Tên đăng nhập/i), {
            target: { value: "newuser" },
        });
        fireEvent.change(screen.getByLabelText(/Mật khẩu/i), {
            target: { value: "password456" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Đăng ký/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith("newuser", "password456");
        });
    });
});
