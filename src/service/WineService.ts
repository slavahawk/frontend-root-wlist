import { api } from "@/api/api";
import type { Wine, CreateWineRequest, WineResponses } from "@/types/wine";

const WineService = {
  async getAllWines(requestParams: any): Promise<WineResponses> {
    try {
      const response = await api.get<WineResponses>("/wines", {
        params: requestParams,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении вин:", error);
      throw error;
    }
  },

  async getWineById(id: number): Promise<Wine> {
    try {
      const response = await api.get<Wine>(`/wines/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении вина с ID ${id}:`, error);
      throw error;
    }
  },

  async createWine(wineData: CreateWineRequest): Promise<Wine> {
    try {
      const response = await api.post<Wine>("/wines", wineData);
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании вина:", error);
      throw error;
    }
  },

  async updateWine(id: number, wineData: CreateWineRequest): Promise<Wine> {
    try {
      const response = await api.put<Wine>(`/wines/${id}`, wineData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении вина с ID ${id}:`, error);
      throw error;
    }
  },

  async deleteWine(id: number): Promise<void> {
    try {
      await api.delete(`/wines/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении вина с ID ${id}:`, error);
      throw error;
    }
  },
};

export default WineService;
