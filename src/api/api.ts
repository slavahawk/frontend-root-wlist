import axios from "axios";
import { AuthService } from "@/service/AuthService.ts";
import router, { AppRoutes } from "@/router";

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: "https://api.w-list.ru",
});

// Функция для установки токенов в заголовки
const setAuthHeader = (token: string) => {
  if (!token) {
    delete api.defaults.headers.common["Authorization"];
  }
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Функция для получения нового accessToken
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("Refresh token is not available");
  }

  try {
    const response = await AuthService.refresh(refreshToken);

    if (response && response.details && response.details.accessToken) {
      localStorage.setItem("accessToken", response.details.accessToken);
      setAuthHeader(response.details.accessToken);
      return response;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw error; // Пробрасываем ошибку, чтобы перехватчик мог обработать её
  }
};

api.interceptors.request.use((config) => {
  if (config.headers && localStorage.getItem("accessToken")) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Проверяем, получили ли мы статус 401 и не пытались ли уже обновить токен
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Обновляем токен
        await refreshAccessToken();

        // Обновите заголовки запроса с новым токеном, например:
        // originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Повторяем оригинальный запрос с обновленным токеном
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Could not refresh token:", refreshError);
        // Перенаправляем на страницу входа
        await router.push({ name: AppRoutes.LOGIN });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Установка токенов при загрузке приложения
const initializeAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    setAuthHeader(accessToken);
  }
};

export { api, initializeAuth };
