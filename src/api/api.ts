import type { AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import {useToast} from "primevue/usetoast";

// Создаем экземпляр axios с базовым URL
const api = axios.create({
    baseURL: "https://api.w-list.ru",
});

// Интерцептор для обработки запросов
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: token,
        };
    }
    return config;
});

// Интерцептор для обработки ответов
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const toast = useToast()

        // Логируем информацию об ошибке
        console.error('API Error:', {
            message: error.message,
            response: error.response,
            config: error.config,
        });

        // Отображаем ошибку с помощью PrimeVue Toast

        toast.add({
            severity: 'error',
            summary: 'Ошибка API',
            detail: error.message || 'Произошла ошибка при выполнении запроса.',
            life: 3000
        });

        return Promise.reject(error);
    }
);
export default api;
