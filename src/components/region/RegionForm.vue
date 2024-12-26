<template>
  <form @submit.prevent="submitForm">
    {{ region }}
    <div class="field">
      <label for="name">Название</label>
      <InputText id="name" v-model="region.name" required />
    </div>

    <div class="field">
      <label for="countryId">Страна</label>
      {{ countriesOptions }}
      <Dropdown
        id="countryId"
        v-model="region.countryId"
        :options="countriesOptions"
        optionLabel="name"
        placeholder="Выберите страну"
        required
      />
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
import { defineProps, ref, watch } from "vue";
import type { Region } from "@/types/region";
import { storeToRefs } from "pinia";
import { useCountryStore } from "@/stores/countryStore.ts";

const props = defineProps<{ region: Region | null }>();
const region = ref({ name: "", countryId: null }); // добавьте countryId для страны

const { countriesOptions } = storeToRefs(useCountryStore());

interface Emit {
  (e: "save", val: Region): void;
}

const emit = defineEmits<Emit>();

// Отслеживание изменений в выбранном регионе для предзаполнения формы
watch(
  () => props.region,
  (newValue) => {
    if (newValue) {
      region.value = { ...newValue }; // Копируем данные для редактирования
    } else {
      region.value = { name: "", countryId: null }; // Очищаем данные для новой записи
    }
  },
  { immediate: true },
);

const submitForm = () => {
  emit("save", region.value); // Эмитируем событие сохранения
};
</script>

<style scoped>
/* Ваши стили */
</style>
