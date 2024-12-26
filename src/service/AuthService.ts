import type { AuthRequest, AuthResponse, RegRequest } from "@/types/auth";
import { api, API_URL } from "@/api/api";
import axios from "axios";

const AuthService = {
  async login(authData: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        API_URL + "/auth",
        authData,
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при входе в систему:", error);
      throw error; // Пробрасываем ошибку дальше
    }
  },

  async register(registrationData: RegRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        registrationData,
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error;
    }
  },

  async resetPassword(body: { token: string; newPassword: string }): Promise<{
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
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (error) {
      console.error("Ошибка при запросе сброса пароля:", error);
      throw error;
    }
  },
};

export default AuthService;
