import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {AppRoutes} from "@/router";
import {AuthService} from "@/service/AuthService.ts";
import {handleError} from "@/helper/handleError.ts";
import type {User} from "@/types/user.ts";

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isLoad=  ref(false)
    const isAuthenticated = ref(false);
    const toast = useToast();
    const router = useRouter();


    // Загружаем состояние аутентификации из localStorage при монтировании
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        user.value = JSON.parse(storedUser);
        isAuthenticated.value = true;
    }

    const login = async (email: string, password: string) => {
        isLoad.value = true;
        try {
            const data = await AuthService.auth({ email, password });
            if (!data) {
                throw new Error('User data not found in response');
            }
            user.value = data;
            isAuthenticated.value = true;
            localStorage.setItem('user', JSON.stringify(data));
            toast.add({
                severity: 'success',
                summary: 'Успешный вход',
                life: 3000
            });
            await router.push({ name: AppRoutes.DASHBOARD });
        } catch (error) {
            handleError(error); // Используйте функцию для обработки ошибок
        } finally {
            isLoad.value = false;
        }
    };


    const logout = () => {
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('user');
        router.push({ name: AppRoutes.AUTH });
    };

    const checkAuth = () => {
        return isAuthenticated.value;
    };

    return {
        user,
        isAuthenticated,
        login,
        logout,
        checkAuth,
    };
});


// import { defineStore } from 'pinia';
//
// export const useAuthStore = defineStore('auth', {
//     state: () => ({
//         isLoad: false,
//         user: null,
//     }),
//     actions: {
//         async authenticate(email: string, password: string) {
//             this.isLoad = true; // Устанавливаем флаг загрузки в true
//             try {
//                 const response = await AuthService.auth({ email, password });
//                 this.user = response.user; // Предполагается, что ответ содержит пользователя
//             } catch (error) {
//                 console.error('Failed to authenticate:', error);
//                 // Обработка ошибок (например, показать уведомление)
//             } finally {
//                 this.isLoad = false; // Устанавливаем флаг загрузки в false
//             }
//         },
//     },
// });
