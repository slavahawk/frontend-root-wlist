<template>
  <form @submit.prevent="submitForm">
    <div class="field">
      <label for="name">Имя</label>
      <InputText id="name" v-model="grape.name" required />
    </div>

    <div class="flex justify-end">
      <Button type="submit" label="Сохранить" />
      <Button
        label="Отмена"
        @click="$emit('cancel')"
        class="p-button-secondary"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Grape } from "@/types/grape";

const props = defineProps<{ grape: Grape | null }>();
const grape = ref({ name: "" });

interface Emit {
  (e: "save", val: Grape): void;
}

const emit = defineEmits<Emit>();

watch(
  () => props.grape,
  (newValue) => {
    if (newValue) {
      grape.value = { ...newValue }; // Копируем данные для редактирования
    } else {
      grape.value = { name: "" }; // Очищаем данные для новой записи
    }
  },
  { immediate: true },
);

const submitForm = () => {
  emit("save", grape.value); // Эмитируем событие сохранения
};
</script>

<style scoped>
/* Ваши стили */
</style>
