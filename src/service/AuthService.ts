import { api } from "@/api/api.ts";

interface AuthResponse {
  success: boolean;
  details: { accessToken: string; refreshToken: string };
}

export class AuthService {
  static async auth(body: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const { data } = await api.post("/auth", body);
      return data;
    } catch (error) {
      console.error("Неверный логин или пароль:", error);
      throw new Error("Неверный логин или пароль");
    }
  }

  static async register(body: {
    email: string;
    password: string;
    shopName: string;
  }): Promise<{ details: []; success: boolean }> {
    try {
      const { data } = await api.post("/auth/register", body);
      return data;
    } catch (error) {
      console.error("Ошибка регистрации, ваш email уже занят:", error);
      throw new Error("Ошибка регистрации, ваш email уже занят");
    }
  }

  static async refresh(refreshToken: string): Promise<AuthResponse> {
    try {
      const { data } = await api.post("/auth/refresh", { refreshToken });
      return data;
    } catch (error) {
      console.error("Refresh token error:", error);
      throw new Error("Token refresh failed");
    }
  }

  static async logout(refreshToken: string): Promise<void> {
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }
  }

  static async resetPassword(body: {
    token: string;
    newPassword: string;
  }): Promise<{
    success: boolean;
    details: {};
  }> {
    try {
      const { data } = await api.post("/auth/reset-password", body);
      return data;
    } catch (error) {
      console.error("Ошибка смены пароля:", error);
      throw new Error("Ошибка смены пароля");
    }
  }

  static async forgotPassword(email: string): Promise<{
    success: boolean;
    details: {};
  }> {
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      return data;
    } catch (error) {
      console.error("Ошибка сброса пароля:", error);
      throw new Error("Ошибка сброса пароля");
    }
  }
}
