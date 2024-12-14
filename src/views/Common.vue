<template>
  <div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="font-semibold text-xl mb-4">Сбросить пароль</div>
        <ResetPasswordForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ResetPasswordForm from "@/components/form/ResetPasswordForm.vue";
</script>

<style scoped></style>
