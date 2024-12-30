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

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  wine: Object,
  edit: Function,
  delete: Function,
});

const editWine = () => {
  props.edit(props.wine);
};

const deleteWine = () => {
  props.delete(props.wine.id);
};
</script>
