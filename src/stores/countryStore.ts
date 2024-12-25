// src/stores/countryStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import CountryService from "@/service/CountryService";
import type { Country, CountryRequest } from "@/types/country";

export const useCountryStore = defineStore("country", () => {
  const countries = ref<Country[]>([]);
  const selectedCountry = ref<Country | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCountries = async () => {
    loading.value = true;
    error.value = null;

    try {
      countries.value = await CountryService.getAllCountries();
    } catch (err) {
      error.value = "Ошибка при получении стран. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchCountryById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      selectedCountry.value = await CountryService.getCountryById(id);
    } catch (err) {
      error.value = "Ошибка при получении страны. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createCountry = async (countryData: CountryRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const newCountry = await CountryService.createCountry(countryData);
      countries.value.push(newCountry);
    } catch (err) {
      error.value = "Ошибка при создании страны. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateCountry = async (id: number, countryData: CountryRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const updatedCountry = await CountryService.updateCountry(
        id,
        countryData,
      );
      const index = countries.value.findIndex((country) => country.id === id);
      if (index !== -1) {
        countries.value[index] = updatedCountry;
      }
    } catch (err) {
      error.value = "Ошибка при обновлении страны. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteCountry = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await CountryService.deleteCountry(id);
      countries.value = countries.value.filter((country) => country.id !== id);
    } catch (err) {
      error.value = "Ошибка при удалении страны. Попробуйте еще раз.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const clearSelectedCountry = () => {
    selectedCountry.value = null;
  };

  return {
    countries,
    selectedCountry,
    loading,
    error,
    fetchCountries,
    fetchCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
    clearSelectedCountry,
  };
});
