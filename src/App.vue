<script setup lang="ts">
import { initializeAuth } from "@/api/api";

initializeAuth();
</script>

<template>
  <router-view />
  <Toast />
</template>

<style scoped></style>
