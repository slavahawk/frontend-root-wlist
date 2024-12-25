// src/stores/grapeStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import GrapeService from "@/service/GrapeService";
import type { Grape, GrapeRequest } from "@/types/grape";

export const useGrapeStore = defineStore("grape", () => {
  const grapes = ref<Grape[]>([]);
  const selectedGrape = ref<Grape | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchGrapes = async () => {
    loading.value = true;
    error.value = null;

    try {
      grapes.value = await GrapeService.getAllGrapes();
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
      selectedGrape.value = await GrapeService.getGrapeById(id);
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
      const newGrape = await GrapeService.createGrape(grapeData);
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
      const updatedGrape = await GrapeService.updateGrape(id, grapeData);
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
      await GrapeService.deleteGrape(id);
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
    selectedGrape,
    loading,
    error,
    fetchGrapes,
    fetchGrapeById,
    createGrape,
    updateGrape,
    deleteGrape,
    clearSelectedGrape,
  };
});
