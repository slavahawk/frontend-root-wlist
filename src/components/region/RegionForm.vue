<template>
  <form @submit.prevent="submitForm">
    <div class="field">
      <label for="name">Название</label>
      <InputText id="name" v-model="region.name" required />
    </div>

    <div class="field">
      <label for="countryId">Страна</label>
      <Select
        id="countryId"
        v-model="selectedCountryId"
        :options="countriesOptions"
        optionLabel="label"
        optionValue="value"
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
const region = ref<Region>({ name: "", countryId: null }); // Делаем типизацию

// Получаем список стран из хранилища
const { countriesOptions } = storeToRefs(useCountryStore());

// Состояние для выбора страны, инициализируем его null
const selectedCountryId = ref<number | null>(null);

interface Emit {
  (e: "save", val: Region): void;
}

const emit = defineEmits<Emit>();

// Отслеживание изменений в выбранном регионе для предзаполнения формы
watch(
  () => props.region,
  (newValue) => {
    if (newValue) {
      region.value = { ...newValue };
      // Устанавливаем id страны, если country доступна
      selectedCountryId.value = newValue.country?.id || null;
    } else {
      region.value = { name: "", countryId: null };
      selectedCountryId.value = null; // Сбросить выбор страны для новой записи
    }
  },
  { immediate: true },
);

const submitForm = () => {
  region.value.countryId = selectedCountryId.value; // Устанавливаем countryId перед отправкой
  emit("save", region.value); // Эмитируем событие сохранения
};
</script>

<style scoped>
/* Ваши стили */
</style>
