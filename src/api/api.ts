import type {AxiosError, AxiosResponse} from 'axios';
import axios from 'axios';
import {useAuthStore} from "@/stores/authStore";

// Создаем экземпляр axios с базовым URL
const api = axios.create({
    baseURL: "https://api.w-list.ru",
});

// Интерцептор для обработки запросов
axios.interceptors.response.use(
    response => response,
    async error => {
        const { response } = error;
        const authStore = useAuthStore();
        if (response && response.status === 401) {
            // Попробовать обновить токен
            try {
                await authStore.refresh();
                // Повторить оригинальный запрос с новым токеном
                const originalRequest = error.config;
                return axios(originalRequest);
            } catch (refreshError) {
                // Если обновление токена не удалось, вы можете выполнить выход
                await authStore.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Логируем информацию об ошибке
        console.error('API Error:', {
            message: error.message,
            response: error.response,
            config: error.config,
        });
        return Promise.reject(error);
    }
);
export default api;
