<script setup lang="ts">
import { useLayout } from "@/layout/composables/layout";
import AppConfigurator from "./AppConfigurator.vue";
import { AppRoutes, RoutePath } from "@/router";
import { useAuthStore } from "@/stores/authStore.ts";
import Logo from "@/assets/images/svg/Logo.vue";
import { storeToRefs } from "pinia";

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const { logout } = useAuthStore();
const { isLoad } = storeToRefs(useAuthStore());
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button
        class="layout-menu-button layout-topbar-action"
        @click="toggleMenu"
      >
        <i class="pi pi-bars"></i>
      </button>
      <router-link :to="RoutePath.Dashboard" class="layout-topbar-logo">
        <Logo />
        <span>W-List</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button
          type="button"
          class="layout-topbar-action"
          @click="toggleDarkMode"
        >
          <i
            :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"
          ></i>
        </button>
        <div class="relative">
          <button
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeout',
              hideOnOutsideClick: true,
            }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button>
          <AppConfigurator />
        </div>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-scalein',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeout',
          hideOnOutsideClick: true,
        }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button
            type="button"
            class="layout-topbar-action"
            @click="$router.push({ name: AppRoutes.COMMON })"
          >
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
          <Button
            :loading="isLoad"
            type="button"
            @click="logout()"
            icon="pi pi-sign-out"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>
