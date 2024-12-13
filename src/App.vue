<script setup lang="ts">
import { initializeAuth } from "@/api/api.ts";

initializeAuth();
</script>

<template>
  <router-view />
  <Toast />
</template>

<style scoped></style>
