import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  RegionService,
  type Region,
  type CreateRegionRequest,
  type UpdateRegionRequest,
} from "w-list-api";
import { handleError } from "@/helper/handleError.ts";
import { useToast } from "primevue/usetoast";
import { checkData } from "@/helper/checkData.ts";

export const useRegionStore = defineStore("region", () => {
  const regions = ref<Region[]>([]);
  const selectedRegion = ref<Region | null>(null);
  const loading = ref(false);
  const toast = useToast();

  const regionOptions = computed(() =>
    regions.value.map((region) => ({
      value: region.id,
      label: region.name,
    })),
  );

  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const getRegionNameById = (regionId: number): string | null =>
    regions.value.find((region) => region.id === regionId)?.name ?? null;

  const fetchRegions = async (countryId?: number, name?: string) => {
    setLoading(true);
    try {
      const data = await RegionService.getAll(countryId, name);
      checkData(data);
      regions.value = data;
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionById = async (id: number) => {
    setLoading(true);
    try {
      const data = await RegionService.getById(id);
      checkData(data);
      selectedRegion.value = data;
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const createRegion = async (regionData: CreateRegionRequest) => {
    setLoading(true);
    try {
      const data = await RegionService.create(regionData);
      checkData(data);
      regions.value.push(data);
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const updateRegion = async (id: number, regionData: UpdateRegionRequest) => {
    setLoading(true);
    try {
      const data = await RegionService.update(id, regionData);
      checkData(data);
      const index = regions.value.findIndex((region) => region.id === id);
      if (index !== -1) {
        regions.value[index] = data;
      }
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const deleteRegion = async (id: number) => {
    setLoading(true);
    try {
      const data = await RegionService.delete(id);
      checkData(data);
      regions.value = regions.value.filter((region) => region.id !== id);
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
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
    fetchRegions,
    fetchRegionById,
    createRegion,
    updateRegion,
    deleteRegion,
    clearSelectedRegion,
    getRegionNameById,
  };
});
