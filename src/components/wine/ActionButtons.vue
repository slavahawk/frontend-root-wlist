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
import { defineProps, defineEmits } from "vue";
import type { Wine } from "@/types/wine.ts";

const props = defineProps<{
  wine: Wine;
  edit: (wine: Wine) => void;
  delete: (id: number) => void;
}>();

const emit = defineEmits<{
  (e: "edit", wine: Wine): void;
  (e: "delete", id: number): void;
}>();

const editWine = () => {
  emit("edit", props.wine);
};

const deleteWine = () => {
  emit("delete", props.wine.id);
};
</script>
