<script setup lang="ts">
import {useAuthStore} from "@/stores/authStore";
import {onBeforeUnmount, onMounted} from "vue";

const authStore = useAuthStore();

const refreshInterval = 15 * 60 * 1000; // Обновление каждые 15 минут

onMounted(() => {

  if (authStore.checkAuth()) {
     authStore.refresh();
  }

  const intervalId = setInterval(() => {
    authStore.refresh();
  }, refreshInterval);

  // Очистите интервал при размонтировании компонента
  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  <router-view />
  <Toast/>
</template>

<style scoped></style>
