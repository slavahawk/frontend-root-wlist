// src/stores/regionStore.ts
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import RegionService from "@/service/RegionService";
import type { Region, RegionRequest } from "@/types/region";

export const useRegionStore = defineStore("region", () => {
  const regions = ref<Region[]>([]);
  const selectedRegion = ref<Region | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const regionOptions = computed(() => {
    return regions.value.map((region) => ({
      value: region.id,
      label: region.name,
    }));
  });

  const fetchRegions = async () => {
    loading.value = true;
    error.value = null;

    try {
      regions.value = await RegionService.getAllRegions();
    } catch (err) {
      error.value = "Ошибка при получении регионов. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchRegionById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      selectedRegion.value = await RegionService.getRegionById(id);
    } catch (err) {
      error.value = "Ошибка при получении региона. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createRegion = async (regionData: RegionRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const newRegion = await RegionService.createRegion(regionData);
      regions.value.push(newRegion);
    } catch (err) {
      error.value = "Ошибка при создании региона. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateRegion = async (id: number, regionData: RegionRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const updatedRegion = await RegionService.updateRegion(id, regionData);
      const index = regions.value.findIndex((region) => region.id === id);
      if (index !== -1) {
        regions.value[index] = updatedRegion;
      }
    } catch (err) {
      error.value = "Ошибка при обновлении региона. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteRegion = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await RegionService.deleteRegion(id);
      regions.value = regions.value.filter((region) => region.id !== id);
    } catch (err) {
      error.value = "Ошибка при удалении региона. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const clearSelectedRegion = () => {
    selectedRegion.value = null;
  };

  return {
    regions,
    regionOptions,
    selectedRegion,
    loading,
    error,
    fetchRegions,
    fetchRegionById,
    createRegion,
    updateRegion,
    deleteRegion,
    clearSelectedRegion,
  };
});
