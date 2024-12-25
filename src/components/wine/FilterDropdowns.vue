<template>
  <div class="flex flex-wrap items-center gap-2">
    <Dropdown
      class="w-full md:w-56"
      id="category"
      v-model="params.category"
      :options="categoryOptions"
      optionLabel="label"
      optionValue="value"
      showClear
      placeholder="Выберите категорию"
      @change="onFilterChange"
    />
    <Dropdown
      class="w-full md:w-56"
      id="colour"
      v-model="params.colour"
      :options="colourOptions"
      optionLabel="label"
      optionValue="value"
      showClear
      placeholder="Выберите цвет"
      @change="onFilterChange"
    />
    <Dropdown
      class="w-full md:w-56"
      id="sugarType"
      v-model="params.sugarType"
      :options="sugarTypeOptions"
      optionLabel="label"
      optionValue="value"
      showClear
      placeholder="Выберите тип сахара"
      @change="onFilterChange"
    />
    <Dropdown
      class="w-full md:w-56"
      id="country"
      v-model="params.countryId"
      :options="countryOptions"
      optionLabel="label"
      optionValue="value"
      showClear
      placeholder="Выберите страну"
      @change="onFilterChange"
    />
    <Dropdown
      class="w-full md:w-56"
      id="region"
      v-model="params.regionId"
      :options="regionOptions"
      optionLabel="label"
      optionValue="value"
      showClear
      placeholder="Выберите регион"
      @change="onFilterChange"
    />
    <Dropdown
      class="w-full md:w-56"
      id="grape"
      v-model="params.grapeId"
      :options="grapeOptions"
      optionLabel="label"
      optionValue="value"
      showClear
      placeholder="Выберите виноград"
      @change="onFilterChange"
    />
    <InputText
      class="w-full md:w-56"
      v-model="params.vintage"
      placeholder="Год урожая"
      @change="onFilterChange"
    />
    <InputText
      class="w-full md:w-56"
      v-model="params.bottleVolume"
      placeholder="Объем бутылки"
      @change="onFilterChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  params: {
    category: string | undefined;
    colour: string | undefined;
    sugarType: string | undefined;
    countryId: number | undefined;
    regionId: number | undefined;
    grapeId: number | undefined;
    vintage: string | undefined;
    bottleVolume: string | undefined;
  };
  categoryOptions: Array<{ label: string; value: string }>;
  colourOptions: Array<{ label: string; value: string }>;
  sugarTypeOptions: Array<{ label: string; value: string }>;
  countryOptions: Array<{ label: string; value: number }>;
  regionOptions: Array<{ label: string; value: number }>;
  grapeOptions: Array<{ label: string; value: number }>;
}>();

const emit = defineEmits<{
  (e: "change"): void;
}>();

const onFilterChange = () => {
  emit("change");
};
</script>

<style scoped>
/* Ваши стили для FilterDropdowns */
</style>
