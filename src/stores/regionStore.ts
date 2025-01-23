import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  RegionService,
  type Region,
  type CreateRegionRequest,
  type UpdateRegionRequest,
} from "w-list-api";

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

  const getRegionNameById = (regionId: number): string | null =>
    regions.value.find((c: Region) => c.id === regionId)?.name ?? null;

  const fetchRegions = async () => {
    loading.value = true;
    error.value = null;

    try {
      regions.value = await RegionService.getAll();
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
      selectedRegion.value = await RegionService.getById(id);
    } catch (err) {
      error.value = "Ошибка при получении региона. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createRegion = async (regionData: CreateRegionRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const newRegion = await RegionService.create(regionData);
      regions.value.push(newRegion);
    } catch (err) {
      error.value = "Ошибка при создании региона. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateRegion = async (id: number, regionData: UpdateRegionRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const updatedRegion = await RegionService.update(id, regionData);
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
      await RegionService.delete(id);
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
    getRegionNameById,
  };
});
