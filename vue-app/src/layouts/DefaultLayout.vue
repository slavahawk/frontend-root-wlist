<template>
  <div>
    <Menubar :model="menuItems">
      <template #item="{ item }">
        <RouterLink
            :to="{ name: item.routeName }"
            class="menu-link"
            active-class="active-link"
        >
          {{ item.label }}
        </RouterLink>
      </template>
      <template #end>
        <div>
          <Button :label="exit.label" @click="exit.command" class="exit-button" />
        </div>
      </template>
    </Menubar>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menubar } from "primevue";
import { RouterLink, useRoute } from "vue-router";
import { AppRoutes } from "@/router";
import { useAuthStore } from "@/stores/authStore";

interface MenuItem {
  label: string;
  routeName: string;
}

const authStore = useAuthStore();
const route = useRoute(); // Получаем текущий маршрут

const menuItems: MenuItem[] = [
  {
    label: 'Вина',
    routeName: AppRoutes.HOME,
  },
  {
    label: 'Хуина',
    routeName: AppRoutes.ABOUT,
  },
];

const exit: MenuItem = {
  label: 'Выход',
  command: () => authStore.logout(),
};
</script>

<style scoped lang="scss">
.content {
  padding: 20px;
}

.menu-link {
  text-decoration: none; /* Убираем подчеркивание ссылки */
  padding: 10px 15px; /* Добавляем отступы для ссылок */
  border-radius: 4px; /* Скругление углов */
  transition: background-color 0.3s, color 0.3s; /* Плавный переход для фона и цвета */
}

.menu-link:hover {
  background-color: rgba(0, 123, 255, 0.1); /* Цвет фона при наведении */
  color: #007bff; /* Цвет текста при наведении */
}

.active-link {
  background-color: #007bff; /* Цвет активной ссылки */
  color: white; /* Цвет текста активной ссылки */
}

.exit-button {
  background-color: #dc3545; /* Цвет кнопки выхода */
  color: white; /* Цвет текста кнопки выхода */
  border: none; /* Убираем границу */
}

.exit-button:hover {
  background-color: #c82333; /* Цвет фона кнопки выхода при наведении */
}
</style>
