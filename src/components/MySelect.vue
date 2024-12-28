<template>
  <div class="input-container">
    <div class="text-l">{{ label }}</div>
    <Select
      :id="id"
      filter
      :modelValue="modelValue"
      @update:modelValue="handleChange"
      :options="options"
      showClear
      placeholder="Выберите"
    >
      <template #value="slotProps">
        <div
          v-if="slotProps.value"
          class="flex items-center gap-2 justify-between w-full"
        >
          <div>{{ slotProps.value.name }}</div>
          <div class="font-semibold">{{ slotProps.value.count }}</div>
          <!-- Отображение count -->
        </div>
        <span v-else>{{ slotProps.placeholder }}</span>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-2 justify-between w-full">
          <div>{{ slotProps.option.name }}</div>
          <div class="font-semibold">{{ slotProps.option.count }}</div>
          <!-- Отображение count -->
        </div>
      </template>
    </Select>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import type { WineFilter } from "@/types/wine.ts";

const props = defineProps<{
  id: string;
  modelValue: number | undefined; // Идентификатор выбранного фильтра
  options: WineFilter[]; // Массив объектов WineFilter
  label: string;
}>();

const emit = defineEmits<{
  (e: "update", value: WineFilter): void; // Эмитим только ID
}>();

const handleChange = (selectedOption: WineFilter) => {
  // Эмитим ID выбранного объекта
  emit("update", selectedOption);
};
</script>
