import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'


export enum LayoutEnum {
  AUTH_LAYOUT = 'AuthLayout',
  DEFAULT_LAYOUT = 'DefaultLayout'
}

export enum AppRoutes {
  HOME = 'Home',
  AUTH = 'Auth',
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.HOME]: '/',
  [AppRoutes.AUTH]: '/auth',
}

const routes = [
  {
    path: RoutePath.Home,
    name: AppRoutes.HOME,
    component: HomeView,
    meta: { layout: LayoutEnum.DEFAULT_LAYOUT }
  },
  {
    path: RoutePath.Auth,
    name: AppRoutes.AUTH,
    component: () => import('@/views/AuthView.vue'),
    meta: { layout: LayoutEnum.AUTH_LAYOUT }
  },
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
