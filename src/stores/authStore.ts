import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { AppRoutes } from "@/router";
import { AuthService } from "@/service/AuthService.ts";
import { handleError } from "@/helper/handleError.ts";
import type { User } from "@/types/user.ts";
import { checkData } from "@/helper/checkData.ts";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoad = ref(false);
  const isAuthenticated = ref(false);
  const toast = useToast();
  const router = useRouter();

  // Load authentication state from localStorage on mount
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    isAuthenticated.value = true;
  }

  const login = async (email: string, password: string) => {
    isLoad.value = true;
    try {
      const data = await AuthService.auth({ email, password });

      checkData(data, "User data not found in response");

      if (!data.success) {
        isAuthenticated.value = false;
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        toast.add({
          severity: "error",
          summary: "Ваш токен устарел",
          life: 3000,
        });
        await router.push({ name: AppRoutes.LOGIN });
        return;
      }

      isAuthenticated.value = true;
      localStorage.setItem("accessToken", data.details.accessToken);
      localStorage.setItem("refreshToken", data.details.refreshToken);
      toast.add({
        severity: "success",
        summary: "Успешный вход",
        life: 3000,
      });
      await router.push({ name: AppRoutes.INVITATION });
    } catch (error) {
      handleError(error, toast);
    } finally {
      isLoad.value = false;
    }
  };

  const register = async (body: {
    email: string;
    password: string;
    shopName: string;
  }) => {
    isLoad.value = true;
    try {
      const data = await AuthService.register(body);
      checkData(data, "User data not found in response");
      toast.add({
        severity: "success",
        summary: "Регистрация успешна",
        life: 3000,
      });
      await login(body.email, body.password);
    } catch (error) {
      handleError(error, toast);
    } finally {
      isLoad.value = false;
    }
  };

  const logout = async () => {
    isLoad.value = true;
    try {
      await AuthService.logout(localStorage.getItem("refreshToken"));
      isAuthenticated.value = false;
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      toast.add({
        severity: "success",
        summary: "Успешный выход",
        life: 3000,
      });
      await router.push({ name: AppRoutes.LOGIN });
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
    checkAuth,
  };
});
