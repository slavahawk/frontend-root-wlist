import axios from "axios";
import { AuthService } from "@/service/AuthService.ts";
import router, { AppRoutes } from "@/router";

const API_URL = "https://api.w-list.ru";

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  else delete config.headers.Authorization;
  return config;
});

let isRefreshing = false; // Переменная для отслеживания процесса обновления токена
let subscribers = []; // Массив для хранения подписчиков, ожидающих обновления токена

// Функция для добавления подписчика
function subscribeTokenRefresh(callback) {
  subscribers.push(callback);
}

// Функция для уведомления подписчиков об обновлении токена
function onRefreshed(accessToken) {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = []; // Очищаем список подписчиков
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Проверяем, истек ли токен доступа
    if (error.response.status === 401) {
      if (isRefreshing) {
        // Если токен уже обновляется, подписываемся на обновление
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((accessToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true; // Устанавливаем флаг, чтобы обозначить, что идет процесс обновления токена

      try {
        const response = await AuthService.refresh(
          localStorage.getItem("refreshToken"),
        );

        // Обновляем токены в localStorage
        localStorage.setItem("accessToken", response.details.accessToken);
        localStorage.setItem("refreshToken", response.details.refreshToken);

        // Обновляем заголовки по умолчанию
        api.defaults.headers["Authorization"] =
          `Bearer ${response.details.accessToken}`;

        // Уведомляем всех подписчиков о новом токене
        onRefreshed(response.details.accessToken);

        // Обновляем заголовок оригинального запроса
        originalRequest.headers["Authorization"] =
          `Bearer ${response.details.accessToken}`;

        return api(originalRequest); // Повторный запрос с обновленным токеном
      } catch (err) {
        // Обработка ошибки, например, выход из системы
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        await router.push({ name: AppRoutes.LOGIN });
        return Promise.reject(err);
      } finally {
        isRefreshing = false; // Сбрасываем флаг обновления
      }
    }

    return Promise.reject(error);
  },
);

// Установка токенов при загрузке приложения
const initializeAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    if (!accessToken) delete api.defaults.headers.common["Authorization"];
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
};

export { api, initializeAuth };
