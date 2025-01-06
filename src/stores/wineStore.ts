// src/stores/wineStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import WineService from "@/service/WineService";
import type {
  CreateWineRequest,
  Wine,
  WineFilters,
  WineRequest,
  WineRequestSearch,
  WineResponses,
} from "@/types/wine";
import { useToast } from "primevue/usetoast";

export const useWineStore = defineStore("wine", () => {
  const wines = ref<WineResponses>();
  const winesFilter = ref<WineFilters>();
  const winesSearch = ref<WineResponses>();
  const selectedWine = ref<Wine | null>(null);
  const loading = ref(false);
  const loadingSearch = ref(false);
  const error = ref<string | null>(null);
  const errorSearch = ref<string | null>(null);
  const toast = useToast();

  const fetchWines = async (requestParams: WineRequest) => {
    loading.value = true;
    error.value = null;

    try {
      wines.value = await WineService.getAllWines(requestParams);
    } catch (err) {
      error.value = "Ошибка при получении вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchWinesSearch = async (params: WineRequestSearch) => {
    loadingSearch.value = true;
    errorSearch.value = null;

    try {
      winesSearch.value = await WineService.getWineSearch(params);
    } catch (err) {
      error.value = "Ошибка при получении вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loadingSearch.value = false;
    }
  };

  const fetchWinesFilter = async () => {
    loading.value = true;
    error.value = null;

    try {
      winesFilter.value = await WineService.getWineFilters();
    } catch (err) {
      error.value = "Ошибка при получении вин. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchWineById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      selectedWine.value = await WineService.getWineById(id);
    } catch (err) {
      error.value = "Ошибка при получении вина. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createWine = async (wineData: CreateWineRequest, image: File) => {
    loading.value = true;
    error.value = null;

    try {
      const newWine = await WineService.createWine(wineData, image);
      wines.value._embedded.rootWineResponseList.push(newWine);
      wines.value.page.totalElements++;
    } catch (err) {
      error.value = "Ошибка при создании вина. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateWine = async (id: number, wineData: CreateWineRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const updatedWine = await WineService.updateWine(id, wineData);
      const index = wines.value?._embedded.rootWineResponseList.findIndex(
        (wine) => wine.id === id,
      );
      if (index !== -1) {
        wines.value._embedded.rootWineResponseList[index] = updatedWine;
      }
    } catch (err) {
      error.value = "Ошибка при обновлении вина. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateWineImageAction = async (id: number, image: File) => {
    loading.value = true;
    error.value = null;

    try {
      await WineService.updateWineImage(id, image);
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: `Изображение вина под ID ${id} обновлено`,
        life: 3000,
      });
    } catch (err) {
      error.value = "Ошибка при обновлении изображения. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteWine = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await WineService.deleteWine(id);
      toast.add({
        severity: "success",
        summary: "Удалено",
        detail: `Вино под ID ${id} удалено`,
        life: 3000,
      });
    } catch (err) {
      error.value = "Ошибка при удалении вина. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const clearSelectedWine = () => {
    selectedWine.value = null;
  };

  return {
    wines,
    winesFilter,
    selectedWine,
    loading,
    error,
    fetchWines,
    fetchWinesFilter,
    fetchWineById,
    createWine,
    updateWine,
    deleteWine,
    clearSelectedWine,
    winesSearch,
    fetchWinesSearch,
    loadingSearch,
    errorSearch,
    updateWineImageAction,
  };
});
