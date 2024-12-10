import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {AppRoutes} from "@/router";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isAuthenticated = ref(false);
    const toast = useToast();
    const router = useRouter();

    // Загружаем состояние аутентификации из localStorage при монтировании
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        user.value = JSON.parse(storedUser);
        isAuthenticated.value = true;
    }

    const login = async (email, password) => {
        if (!email || !password) {
            toast.add({
                severity: 'error',
                summary: 'Пожалуйста, заполните все поля',
                life: 3000
            });
            return;
        }

        if (email === 'test@mail.ru' && password === '123') {
            user.value = { email };
            isAuthenticated.value = true;
            localStorage.setItem('user', JSON.stringify(user.value));
            toast.add({
                severity: 'success',
                summary: 'Успешный вход',
                life: 3000
            });
            await router.push({ name: AppRoutes.DASHBOARD });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Неверные учетные данные',
                life: 3000
            });
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
