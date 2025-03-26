<template>
  <form @submit.prevent="submitForm">
    <div class="field">
      <label for="name">Имя</label>
      <InputText id="name" v-model="country.name" required />
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
import type { Country } from "wlist-types";

const props = defineProps<{ country: Country | null }>();
const country = ref({ name: "" });

interface Emit {
  (e: "save", val: Country): void;
}

const emit = defineEmits<Emit>();

watch(
  () => props.country,
  (newValue) => {
    if (newValue) {
      country.value = { ...newValue }; // Копируем данные для редактирования
    } else {
      country.value = { name: "" }; // Очищаем данные для новой записи
    }
  },
  { immediate: true },
);

const submitForm = () => {
  emit("save", country.value); // Эмитируем событие сохранения
};
</script>

<style scoped>
/* Ваши стили */
</style>
