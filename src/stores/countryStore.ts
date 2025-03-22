import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { CountryService, type Country, type CountryRequest } from "w-list-api";
import { handleError } from "@/helper/handleError.ts";
import { useToast } from "primevue/usetoast";
import { checkData } from "@/helper/checkData.ts";

export const useCountryStore = defineStore("country", () => {
  const countries = ref<Country[]>([]);
  const selectedCountry = ref<Country | null>(null);
  const loading = ref(false);
  const toast = useToast();

  const countriesOptions = computed(() => {
    return countries.value.map((country) => ({
      value: country.id,
      label: country.name,
    }));
  });

  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const getCountryNameById = (countryId: number): string | null =>
    countries.value.find((c: Country) => c.id === countryId)?.name ?? null;

  const fetchCountries = async () => {
    setLoading(true);

    try {
      const data = await CountryService.getAll();
      checkData(data);
      countries.value = data;
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const createCountry = async (countryData: CountryRequest) => {
    setLoading(true);

    try {
      const data = await CountryService.create(countryData);
      checkData(data);
      countries.value.unshift(data);
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const updateCountry = async (id: number, countryData: CountryRequest) => {
    setLoading(true);

    try {
      const data = await CountryService.update(id, countryData);
      checkData(data);
      const index = countries.value.findIndex((country) => country.id === id);
      if (index !== -1) {
        countries.value[index] = data;
      }
      return data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const deleteCountry = async (id: number) => {
    setLoading(true);

    try {
      const data = await CountryService.delete(id);
      checkData(data);
      countries.value = countries.value.filter((country) => country.id !== id);
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedCountry = () => {
    selectedCountry.value = null;
  };

  return {
    countries,
    selectedCountry,
    loading,
    fetchCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    clearSelectedCountry,
    countriesOptions,
    getCountryNameById,
  };
});
