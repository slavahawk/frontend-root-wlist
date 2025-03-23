<template>
  <div class="filter">
    <div class="flex items-center justify-between mb-4">
      <div class="text-2xl">Фильтры</div>
      <Button
        :icon="`pi ${filterState ? 'pi-filter-slash' : 'pi-filter'}`"
        variant="text"
        @click="$emit('toggleMenu')"
        v-tooltip.bottom="`${filterState ? 'Скрыть' : 'Раскрыть'} фильтры`"
      />
      <Button
        label="Сбросить фильтры"
        icon="pi pi-times"
        size="small"
        variant="text"
        @click="resetFilters"
      />
    </div>
    <div>
      <FilterSelect
        label="Категории"
        v-model="localParams.category"
        :options="winesFilter?.category"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Цвет"
        v-model="localParams.colour"
        :options="winesFilter?.colour"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Тип сахара"
        v-model="localParams.sugarType"
        :options="winesFilter?.sugarType"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Страна"
        v-model="localParams.countryId"
        :options="winesFilter?.country"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Регион"
        v-model="localParams.regionId"
        :options="winesFilter?.region"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Виноград"
        v-model="localParams.grapeId"
        :options="winesFilter?.grapes"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Год урожая"
        v-model="localParams.vintage"
        :options="winesFilter?.vintage"
        @change="emitParamsChange"
      />
      <FilterSelect
        label="Объем бутылки"
        v-model="localParams.bottleVolume"
        :options="winesFilter?.bottleVolume"
        @change="emitParamsChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import FilterSelect from "@/components/wine/FilterSelect.vue";
import type { WineFilters } from "w-list-api";

const props = defineProps<{
  initialParams: object;
  winesFilter: WineFilters;
  filterState: boolean;
}>();

const emit = defineEmits(["reset", "paramsChange", "toggleMenu"]);

// Создаем локальный параметр на основе начального параметра
const localParams = reactive({ ...props.initialParams });

// Эмитим изменение параметров
const emitParamsChange = () => {
  emit("paramsChange", localParams); // Эмитим измененные параметры
};

const resetFilters = () => {
  Object.keys(localParams).forEach((key) => {
    localParams[key] = undefined;
  });
  emit("reset");
};
</script>
