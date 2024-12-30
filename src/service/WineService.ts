import { api } from "@/api/api";
import type {
  Wine,
  CreateWineRequest,
  WineResponses,
  WineFilters,
  WineRequest,
  WineRequestFilter,
} from "@/types/wine";

const WineService = {
  async getAllWines(requestParams: WineRequest): Promise<WineResponses> {
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

  async getWineFilters(requestParams: WineRequestFilter): Promise<WineFilters> {
    try {
      const response = await api.get<WineFilters>("/wines/filters", {
        params: requestParams,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении фильтров:", error);
      throw error;
    }
  },

  async getWineSearch(name: string): Promise<Wine[]> {
    try {
      const response = await api.get<Wine[]>("/wines/search", {
        params: { name },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при поиске вин:", error);
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

  async createWine(wineData: CreateWineRequest, image: File): Promise<Wine> {
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("request", JSON.stringify(wineData));

      const response = await api.post<Wine>("/wines", formData);
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
