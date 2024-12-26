<script setup lang="ts">
import AppTopbar from "./AppTopbar.vue";
import { useGrapeStore } from "@/stores/grapeStore.ts";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";

const { fetchGrapes } = useGrapeStore();
const { fetchCountries } = useCountryStore();
const { fetchRegions } = useRegionStore();

Promise.all([fetchGrapes(), fetchCountries(), fetchRegions()]);
</script>

<template>
  <div class="layout-wrapper">
    <app-topbar></app-topbar>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
    </div>
    <div class="layout-mask animate-fadein"></div>
  </div>
  <Toast />
</template>
