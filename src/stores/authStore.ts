import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { AppRoutes } from "@/router";
import { AuthService } from "@/service/AuthService.ts";
import { handleError } from "@/helper/handleError.ts";
import type { User } from "@/types/user.ts";
import {checkData} from "@/helper/checkData.ts";

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isLoad = ref(false);
    const isAuthenticated = ref(false);
    const toast = useToast();
    const router = useRouter();

    // Load authentication state from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        user.value = JSON.parse(storedUser);
        isAuthenticated.value = true;
    }

    const login = async (email: string, password: string) => {
        isLoad.value = true;
        try {
            const data = await AuthService.auth({ email, password });

            checkData(data, 'User data not found in response')

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
            handleError(error, toast);
        } finally {
            isLoad.value = false;
        }
    };

    const register = async (body: { email: string, password: string, role: string, shopId: number }) => {
        isLoad.value = true;
        try {
            const data = await AuthService.register(body);

            checkData(data, 'User data not found in response')

            user.value = data;
            isAuthenticated.value = true;
            localStorage.setItem('user', JSON.stringify(data));
            toast.add({
                severity: 'success',
                summary: 'Регистрация успешна',
                life: 3000
            });
            await router.push({ name: AppRoutes.DASHBOARD });
        } catch (error) {
            handleError(error, toast);
        } finally {
            isLoad.value = false;
        }
    };

    const logout = async () => {
        isLoad.value = true;
        try {
            const storedUser = localStorage.getItem('user');
            const userData = storedUser ? JSON.parse(storedUser) : null;

            if (userData && userData.refreshToken) {
                await AuthService.logout(userData.refreshToken);
            }

            user.value = null;
            isAuthenticated.value = false;
            localStorage.removeItem('user');
            toast.add({
                severity: 'success',
                summary: 'Успешный выход',
                life: 3000
            });
            await router.push({ name: AppRoutes.LOGIN });
        } catch (error) {
            handleError(error, toast);
        } finally {
            isLoad.value = false;
        }
    };

    const refresh = async () => {
        isLoad.value = true;
        try {
            const storedUser = localStorage.getItem('user');
            const userData = storedUser ? JSON.parse(storedUser) : null;

            checkData(userData, 'No refresh token found')

            const refreshedUser = await AuthService.refresh(userData.refreshToken);
            user.value = refreshedUser;
            localStorage.setItem('user', JSON.stringify(refreshedUser));
            toast.add({
                severity: 'success',
                summary: 'Токен обновлен',
                life: 3000
            });
        } catch (error) {
            handleError(error, toast);
        } finally {
            isLoad.value = false;
        }
    };

    const checkAuth = () => {
        return isAuthenticated.value;
    };

    return {
        user,
        isLoad,
        isAuthenticated,
        login,
        register,
        logout,
        refresh,
        checkAuth,
    };
});
