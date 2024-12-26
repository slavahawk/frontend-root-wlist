<script setup lang="ts">
import { initializeAuth } from "@/api/api";

initializeAuth();
</script>

<template>
  <Suspense>
    <router-view />
  </Suspense>
  <Toast />
</template>

<style scoped></style>
