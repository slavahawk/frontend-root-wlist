import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { api, initializeAuth } from "@/api/api.ts";

export enum AppRoutes {
  LOGIN = "Login",
  COMMON = "Common",
  WINE = "Wine",
  GRAPE = "Grape",
  REGION = "Region",
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.LOGIN]: "/auth/login",
  [AppRoutes.COMMON]: "/common",
  [AppRoutes.WINE]: "/",
  [AppRoutes.GRAPE]: "/grape",
  [AppRoutes.REGION]: "/region",
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: RoutePath.Common,
          name: AppRoutes.COMMON,
          component: () => import("@/views/Common.vue"),
          meta: { requiresAuth: true },
        },

        {
          path: RoutePath.Wine,
          name: AppRoutes.WINE,
          component: () => import("@/views/wine/Wine.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: RoutePath.Grape,
          name: AppRoutes.GRAPE,
          component: () => import("@/views/grape/Grape.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: RoutePath.Region,
          name: AppRoutes.REGION,
          component: () => import("@/views/region/Region.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: () => import("@/views/pages/NotFound.vue"),
    },

    {
      path: RoutePath.Login,
      name: AppRoutes.LOGIN,
      component: () => import("@/views/pages/auth/Login.vue"),
    },
    {
      path: "/auth/access",
      name: "accessDenied",
      component: () => import("@/views/pages/auth/Access.vue"),
    },
    {
      path: "/auth/error",
      name: "error",
      component: () => import("@/views/pages/auth/Error.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // Обновляем состояние аутентификации
  authStore.checkAuth();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      delete api.defaults.headers.common["Authorization"]; // Удаляем заголовок Authorization
      next({ name: AppRoutes.LOGIN });
    } else {
      initializeAuth();
      next();
    }
  } else {
    next();
  }
});

export default router;
