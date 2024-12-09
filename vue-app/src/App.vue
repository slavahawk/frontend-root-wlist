<script setup lang="ts">
import {RouterView, useRoute} from 'vue-router'
import {computed} from "vue";
import { Toast } from 'primevue';


const route = useRoute()
const layout = computed(() => route.meta.layout)

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
  <Suspense>
      <div>
        <component :is="layout">
          <router-view />
        </component>
      </div>
  </Suspense>
  <Toast />
  <Button
      label="Toggle Dark Mode"
      @click="toggleDarkMode()"
      class="fixed-button"
  />
</template>

<style scoped>
.fixed-button {
  position: fixed;
  bottom: 20px; /* Отступ от нижнего края */
  right: 20px; /* Отступ от правого края */
  z-index: 1000; /* Убедитесь, что кнопка выше других элементов */
}
</style>
