<template>
  <div class="flex gap-2 flex-wrap">
    <Button
      icon="pi pi-pencil"
      variant="text"
      @click="editWine"
      v-tooltip.bottom="`Редактировать вино`"
    />
    <Button
      icon="pi pi-trash"
      @click="deleteWine"
      variant="text"
      class="p-button-danger"
      v-tooltip.bottom="`Удалить вино`"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete", id: number): void;
}>();

const editWine = () => {
  emit("edit");
};

const deleteWine = () => {
  emit("delete");
};
</script>
