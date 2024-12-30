<template>
  <div class="input-container">
    <div class="text-l">{{ label }}</div>
    <Select
      :modelValue="modelValue"
      @update:modelValue="updateModelValue"
      :options="options"
      option-label="name"
      option-value="id"
      showClear
      filter
      placeholder="Выберите"
    />
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

defineProps({
  modelValue: {
    type: [String, Number, Object],
    required: true,
  },
  label: String,
  options: Array,
});

const emit = defineEmits(["update:modelValue", "change"]);

// Функция для обновления значения
const updateModelValue = (value) => {
  emit("update:modelValue", value);
  emit("change", value);
};
</script>

<style scoped>
.input-container {
  margin-bottom: 16px;
}
</style>
