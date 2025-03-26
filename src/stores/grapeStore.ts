import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { GrapeService } from "w-list-api";
import { type Grape, type GrapeRequest } from "wlist-types";
import { checkData } from "w-list-utils";
import { handleError } from "@/helper/handleError.ts";
import { useToast } from "primevue/usetoast";

export const useGrapeStore = defineStore("grape", () => {
  const grapes = ref<Grape[]>([]);
  const selectedGrape = ref<Grape | null>(null);
  const loading = ref(false);
  const toast = useToast();

  const grapeOptions = computed(() => {
    return grapes.value.map((grape) => ({
      value: grape.id,
      label: grape.name,
    }));
  });

  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const getGrapeNameById = (grapeId: number): string | null =>
    grapes.value.find((c: Grape) => c.id === grapeId)?.name ?? null;

  const fetchGrapes = async () => {
    setLoading(true);

    try {
      const data = await GrapeService.getAll();
      checkData(data);
      grapes.value = data;
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const createGrape = async (grapeData: GrapeRequest) => {
    setLoading(true);

    try {
      const newGrape = await GrapeService.create(grapeData);
      grapes.value.push(newGrape);
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const updateGrape = async (id: number, grapeData: GrapeRequest) => {
    setLoading(true);
    try {
      const updatedGrape = await GrapeService.update(id, grapeData);
      const index = grapes.value.findIndex((grape) => grape.id === id);
      if (index !== -1) {
        grapes.value[index] = updatedGrape;
      }
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const deleteGrape = async (id: number) => {
    setLoading(true);

    try {
      await GrapeService.delete(id);
      grapes.value = grapes.value.filter((grape) => grape.id !== id);
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedGrape = () => {
    selectedGrape.value = null;
  };

  return {
    grapes,
    grapeOptions,
    selectedGrape,
    loading,
    fetchGrapes,
    createGrape,
    updateGrape,
    deleteGrape,
    clearSelectedGrape,
    getGrapeNameById,
  };
});
