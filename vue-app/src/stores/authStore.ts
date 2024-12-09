// src/stores/authStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {AppRoutes} from "@/router";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isAuthenticated = ref(false);
    const toast =  useToast()
    const router = useRouter()

    const login = async (email, password) => {

        console.log(email, password);
        if (email === 'test@mail.ru' && password === '123') {
            user.value = { email };
            toast.add({
                severity: 'success',
                summary: 'Успешный вход',
                life: 3000
            })
            isAuthenticated.value = true;
            await router.push({name: AppRoutes.HOME});
        } else {
            toast.add({
                severity: 'error',
                summary: 'Неверные учетные данные',
                life: 3000
            })
            return
        }
    };

    const logout = () => {
        user.value = null;
        isAuthenticated.value = false;
         router.push({name: AppRoutes.AUTH});
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
