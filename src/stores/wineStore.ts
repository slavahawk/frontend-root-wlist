import { ref } from "vue";
import { defineStore } from "pinia";
import { WineService } from "w-list-api";
import { handleError } from "@/helper/handleError.ts";
import { useToast } from "primevue/usetoast";
import type {
  SearchWineRequest,
  CreateWineRequest,
  Wine,
  WineFilter,
  WineRequest,
  WineResponse,
} from "wlist-types";
import { checkData } from "w-list-utils";

export const useWineStore = defineStore("wine", () => {
  const wines = ref<WineResponse>();
  const winesFilter = ref<WineFilter>();
  const winesSearch = ref<WineResponse>();
  const selectedWine = ref<Wine | null>(null);
  const loading = ref(false);
  const loadingSearch = ref(false);
  const toast = useToast();

  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const setLoadingSearch = (state: boolean) => {
    loadingSearch.value = state;
  };

  const fetchWines = async (requestParams: WineRequest) => {
    setLoading(true);

    try {
      const data = await WineService.getAll(requestParams);
      checkData(data);
      wines.value = data;
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const fetchWinesSearch = async (params: SearchWineRequest) => {
    setLoadingSearch(true);

    try {
      const data = await WineService.search(params);
      checkData(data);
      winesSearch.value = data;
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoadingSearch(false);
    }
  };

  const fetchWinesFilter = async () => {
    setLoading(true);

    try {
      const data = await WineService.getFilter();
      checkData(data);
      winesFilter.value = data;
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const createWine = async (wineData: CreateWineRequest, image: File) => {
    setLoading(true);

    try {
      const data = await WineService.create(wineData, image);
      checkData(data);
      wines.value._embedded.rootWineResponseList.unshift(data);
      wines.value.page.totalElements++;
      toast.add({
        severity: "success",
        summary: "Вино создано",
        life: 3000,
      });
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const updateWine = async (id: number, wineData: CreateWineRequest) => {
    setLoading(true);

    try {
      const data = await WineService.update(id, wineData);
      checkData(data);
      const index = wines.value?._embedded.rootWineResponseList.findIndex(
        (wine) => wine.id === id,
      );
      if (index !== -1) {
        wines.value._embedded.rootWineResponseList[index] = data;
      }

      toast.add({
        severity: "success",
        summary: "Успех",
        detail: `Обновлено ${data?.name}`,
        life: 3000,
      });
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const updateWineImageAction = async (id: number, image: File) => {
    setLoading(true);

    try {
      const data = await WineService.updateImage(id, image);
      checkData(data);
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: `Изображение вина под ID ${id} обновлено`,
        life: 3000,
      });
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const deleteWine = async (id: number) => {
    setLoading(true);

    try {
      const data = await WineService.delete(id);
      if (data.status === 204) {
        toast.add({
          severity: "success",
          summary: "Удалено",
          detail: `Вино под ID ${id} удалено`,
          life: 3000,
        });
      }
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
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
    fetchWines,
    fetchWinesFilter,
    createWine,
    updateWine,
    deleteWine,
    clearSelectedWine,
    winesSearch,
    fetchWinesSearch,
    loadingSearch,
    updateWineImageAction,
  };
});
