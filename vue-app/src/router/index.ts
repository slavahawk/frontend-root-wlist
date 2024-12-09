import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useAuthStore} from "@/stores/authStore.ts";


export enum LayoutEnum {
  AUTH_LAYOUT = 'AuthLayout',
  DEFAULT_LAYOUT = 'DefaultLayout'
}

export enum AppRoutes {
  HOME = 'Home',
  AUTH = 'Auth',
  ABOUT = 'About',
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.HOME]: '/',
  [AppRoutes.AUTH]: '/auth',
  [AppRoutes.ABOUT]: '/about',
}

const routes = [
  {
    path: RoutePath.Auth,
    name: AppRoutes.AUTH,
    component: () => import('@/views/AuthView.vue'),
    meta: { layout: LayoutEnum.AUTH_LAYOUT, requiresAuth: false }
  },
  {
    path: RoutePath.Home,
    name: AppRoutes.HOME,
    component: HomeView,
    meta: { layout: LayoutEnum.DEFAULT_LAYOUT, requiresAuth: true }
  },
  {
    path: RoutePath.About,
    name: AppRoutes.ABOUT,
    component: () => import('@/views/AboutView.vue'),
    meta: { layout: LayoutEnum.DEFAULT_LAYOUT, requiresAuth: true }
  },
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // Обновляем состояние аутентификации
  authStore.checkAuth();


  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: AppRoutes.AUTH });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
