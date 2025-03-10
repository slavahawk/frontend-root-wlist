<template>
  <Drawer v-model:visible="isVisible" header=" " position="full">
    <WineCard
      :img="wine.originalImagePath"
      :name="wine.name"
      :alcohol-by-volume="wine.alcoholByVolume"
      :interesting-facts="wine.interestingFacts"
      :organoleptic="wine.organoleptic"
      :vintage="vintage(wine.vintage)"
      :grapes="getGrapeNameById(wine.grapeIds)"
      :sugar-type="getSugarTypeLabelByValue(wine.sugarType)"
      :country="getCountryNameById(wine.countryId)"
      :category="getCategoryLabelByValue(wine.category)"
      :colour="getColourLabelByValue(wine.colour)"
      :region="getRegionNameById(wine.regionId)"
    />
  </Drawer>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from "vue";
import {
  type Wine,
  getColourLabelByValue,
  getCategoryLabelByValue,
  getSugarTypeLabelByValue,
} from "w-list-api";
import { WineCard } from "w-list-components";
import { vintage } from "w-list-utils";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";

const { getRegionNameById } = useRegionStore();
const { getCountryNameById } = useCountryStore();
const { getGrapeNameById } = useGrapeStore();
const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
}>();

const props = defineProps<{
  show: boolean;
  wine: Wine; // Определите более точный тип для объекта вина
}>();

watchEffect(() => {
  console.log(props.wine?.interestingFacts);
});
const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});
</script>

<style scoped></style>
