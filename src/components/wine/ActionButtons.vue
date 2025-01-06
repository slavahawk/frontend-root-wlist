<template>
  <div class="flex">
    <Button
      icon="pi pi-eye"
      variant="text"
      @click="emit('view')"
      v-tooltip.bottom="`Посмотреть`"
    />
    <Button
      icon="pi pi-pencil"
      variant="text"
      @click="emit('edit')"
      v-tooltip.bottom="`Редактировать вино`"
    />
    <Button
      icon="pi pi-image"
      variant="text"
      @click="emit('editImage')"
      v-tooltip.bottom="`Изменить изображение`"
    />
    <Button
      icon="pi pi-trash"
      @click="$emit('delete')"
      variant="text"
      class="p-button-danger"
      v-tooltip.bottom="`Удалить вино`"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits<{
  (e: "view"): void;
  (e: "edit"): void;
  (e: "editImage"): void;
  (e: "delete", id: number): void;
}>();
</script>
