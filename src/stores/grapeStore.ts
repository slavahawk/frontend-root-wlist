import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { type Grape, type GrapeRequest, GrapeService } from "w-list-api";

export const useGrapeStore = defineStore("grape", () => {
  const grapes = ref<Grape[]>([]);
  const selectedGrape = ref<Grape | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const grapeOptions = computed(() => {
    return grapes.value.map((grape) => ({
      value: grape.id,
      label: grape.name,
    }));
  });

  const getGrapeNameById = (grapeId: number): string | null =>
    grapes.value.find((c: Grape) => c.id === grapeId)?.name ?? null;

  const fetchGrapes = async () => {
    loading.value = true;
    error.value = null;

    try {
      grapes.value = await GrapeService.getAll();
    } catch (err) {
      error.value = "Ошибка при получении винограда. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchGrapeById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      selectedGrape.value = await GrapeService.getById(id);
    } catch (err) {
      error.value = "Ошибка при получении винограда. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createGrape = async (grapeData: GrapeRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const newGrape = await GrapeService.create(grapeData);
      grapes.value.push(newGrape);
    } catch (err) {
      error.value = "Ошибка при создании винограда. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateGrape = async (id: number, grapeData: GrapeRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const updatedGrape = await GrapeService.update(id, grapeData);
      const index = grapes.value.findIndex((grape) => grape.id === id);
      if (index !== -1) {
        grapes.value[index] = updatedGrape;
      }
    } catch (err) {
      error.value = "Ошибка при обновлении винограда. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteGrape = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await GrapeService.delete(id);
      grapes.value = grapes.value.filter((grape) => grape.id !== id);
    } catch (err) {
      error.value = "Ошибка при удалении винограда. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
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
    error,
    fetchGrapes,
    fetchGrapeById,
    createGrape,
    updateGrape,
    deleteGrape,
    clearSelectedGrape,
    getGrapeNameById,
  };
});
