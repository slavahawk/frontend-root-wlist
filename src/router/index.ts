import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { api, initializeAuth } from "@/api/api.ts";

export enum AppRoutes {
  DASHBOARD = "Dashboard",
  LOGIN = "Login",
  REG = "Reg",
  INVITATION = "Invitation",
  INVITATION_CONFIRM = "InvitationConfirm",
  COMMON = "Common",
  WINE = "Wine",
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.DASHBOARD]: "/",
  [AppRoutes.LOGIN]: "/auth/login",
  [AppRoutes.REG]: "/auth/reg",
  [AppRoutes.INVITATION]: "/invitation",
  [AppRoutes.INVITATION_CONFIRM]: "/invitation/:token/confirm",
  [AppRoutes.COMMON]: "/common",
  [AppRoutes.WINE]: "/wine",
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: RoutePath.Dashboard,
          name: AppRoutes.DASHBOARD,
          component: () => import("@/views/Dashboard.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: RoutePath.Invitation,
          name: AppRoutes.INVITATION,
          component: () => import("@/views/Invitation/Invitation.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: RoutePath.Invitation,
          name: AppRoutes.INVITATION,
          component: () => import("@/views/Invitation/Invitation.vue"),
          meta: { requiresAuth: true },
        },

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
      ],
    },
    {
      path: RoutePath.InvitationConfirm,
      name: AppRoutes.INVITATION_CONFIRM,
      component: () => import("@/views/Invitation/Confirm.vue"),
      meta: { requiresAuth: false },
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
      path: RoutePath.Reg,
      name: AppRoutes.REG,
      component: () => import("@/views/pages/auth/Reg.vue"),
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
      console.log("noAuth");
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
