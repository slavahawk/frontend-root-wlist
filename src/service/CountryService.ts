import { api } from "@/api/api";
import type { Country, CountryRequest } from "@/types/country";

const CountryService = {
  async getCountryById(id: number): Promise<Country> {
    try {
      const response = await api.get<Country>(`/countries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении страны с ID ${id}:`, error);
      throw error;
    }
  },

  async updateCountry(
    id: number,
    countryData: CountryRequest,
  ): Promise<Country> {
    try {
      const response = await api.put<Country>(`/countries/${id}`, countryData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении страны с ID ${id}:`, error);
      throw error;
    }
  },

  async deleteCountry(id: number): Promise<void> {
    try {
      await api.delete(`/countries/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении страны с ID ${id}:`, error);
      throw error;
    }
  },

  async createCountry(countryData: CountryRequest): Promise<Country> {
    try {
      const response = await api.post<Country>("/countries", countryData);
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании страны:", error);
      throw error;
    }
  },

  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await api.get<Country[]>("/countries");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении стран:", error);
      throw error;
    }
  },
};

export default CountryService;
