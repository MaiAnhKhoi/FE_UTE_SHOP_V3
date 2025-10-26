"use client";
import { useState, useCallback } from "react";
import { authAPI } from "../config/api";

// ======================
// API response generic
// ======================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// ======================
// User Type
// ======================
export interface User {
  id: string | number;
  email: string;
  name: string;
  [key: string]: any;
}

// ======================
// Auth Response chuẩn hóa cho FE
// ======================
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: User;
    [key: string]: any;
  };
}

// ======================
// Token Manager
// ======================
export const tokenManager = {
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("authToken", token);
  },
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  },
  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("authToken");
  },
  hasToken(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("authToken");
  },
};

// ======================
// User Manager
// ======================
export const userManager = {
  setUser(user: User): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
  removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("user");
  },
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("authToken") && !!localStorage.getItem("user");
  },
};

// ======================
// Auth Service
// ======================
export const authService = {
  async register(userData: Record<string, any>): Promise<AuthResponse> {
    const response = (await authAPI.register(userData)) as ApiResponse<any>;

    if (response.success) {
      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    }

    throw new Error(response.message || "Đăng ký thất bại");
  },

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    const response = (await authAPI.verifyOTP({ email, otp })) as ApiResponse<{
      token?: string;
      user: User;
    }>;

    if (response.success && response.data) {
      if (response.data.token) tokenManager.setToken(response.data.token);
      if (response.data.user) userManager.setUser(response.data.user);

      return {
        success: response.success,
        message: response.message,
        data: {
          token: response.data.token,
          user: response.data.user,
        },
      };
    }

    throw new Error(response.message || "Xác thực OTP thất bại");
  },

  async resendOTP(email: string): Promise<AuthResponse> {
    const response = (await authAPI.resendOTP(email)) as ApiResponse<any>;

    if (response.success) {
      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    }

    throw new Error(response.message || "Gửi lại OTP thất bại");
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = (await authAPI.login({ email, password })) as ApiResponse<{
      token?: string;
      user: User;
    }>;

    if (response.success && response.data) {
      if (response.data.token) tokenManager.setToken(response.data.token);
      if (response.data.user) userManager.setUser(response.data.user);

      return {
        success: response.success,
        message: response.message,
        data: {
          token: response.data.token,
          user: response.data.user,
        },
      };
    }

    throw new Error(response.message || "Đăng nhập thất bại");
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const token = tokenManager.getToken();
      if (token) {
        await authAPI.logout(token);
      }
    } catch {
      // ignore lỗi BE, vẫn xóa local
    } finally {
      tokenManager.removeToken();
      userManager.removeUser();
    }

    return { success: true, message: "Đăng xuất thành công" };
  },

  async getProfile(): Promise<AuthResponse> {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error("Chưa đăng nhập");
    }

    const response = (await authAPI.getProfile(token)) as ApiResponse<
      User | { user: User }
    >;

    if (response.success && response.data) {
      // chuẩn hóa data trả về
      const normalizedUser =
        "user" in response.data
          ? (response.data.user as User)
          : (response.data as User);

      userManager.setUser(normalizedUser);

      return {
        success: response.success,
        message: response.message,
        data: {
          user: normalizedUser,
        },
      };
    }

    throw new Error(
      response.message || "Không lấy được thông tin người dùng"
    );
  },

  isAuthenticated(): boolean {
    return userManager.isLoggedIn();
  },

  getCurrentToken(): string | null {
    return tokenManager.getToken();
  },

  getCurrentUser(): User | null {
    return userManager.getUser();
  },
};

// ======================
// useAuth Hook
// ======================
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => userManager.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const res = await authService.login(email, password);
        setUser(res.data?.user || null);
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (userData: Record<string, any>): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const res = await authService.register(userData);
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyOTP = useCallback(
    async (email: string, otp: string): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const res = await authService.verifyOTP(email, otp);
        setUser(res.data?.user || null);
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    verifyOTP,
  };
};

const authModule = {
  tokenManager,
  userManager,
  authService,
  useAuth,
};

export default authModule;
