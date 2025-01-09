import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { CountryService, type Country, type CountryRequest } from "w-list-api";

export const useCountryStore = defineStore("country", () => {
  const countries = ref<Country[]>([]);
  const selectedCountry = ref<Country | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const countriesOptions = computed(() => {
    return countries.value.map((country) => ({
      value: country.id,
      label: country.name,
    }));
  });

  const fetchCountries = async () => {
    loading.value = true;
    error.value = null;

    try {
      countries.value = await CountryService.getAll();
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
      selectedCountry.value = await CountryService.getById(id);
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
      const newCountry = await CountryService.create(countryData);
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
      const updatedCountry = await CountryService.update(id, countryData);
      const index = countries.value.findIndex((country) => country.id === id);
      if (index !== -1) {
        countries.value[index] = updatedCountry;
      }
    } catch (err) {
      error.value = "Ошибка при обновлении страны. Попробуйте еще раз.";
    } finally {
      loading.value = false;
    }
  };

  const deleteCountry = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await CountryService.delete(id);
      countries.value = countries.value.filter((country) => country.id !== id);
    } catch (err) {
      error.value = "Ошибка при удалении страны. Попробуйте еще раз.";
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
    countriesOptions,
  };
});
