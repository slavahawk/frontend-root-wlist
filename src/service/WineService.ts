import { api } from "@/api/api";
import type {
  Wine,
  CreateWineRequest,
  WineResponses,
  WineFilters,
  WineRequest,
  WineRequestSearch,
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

  async getWineFilters(): Promise<WineFilters> {
    try {
      const response = await api.get<WineFilters>("/wines/filters");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении фильтров:", error);
      throw error;
    }
  },

  async getWineSearch(params: WineRequestSearch): Promise<Wine[]> {
    try {
      const response = await api.get<Wine[]>("/wines/search", {
        params,
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

      // Append the image file if provided
      if (image) {
        formData.append("image", image, image.name); // Including the file name
      }

      // Append the JSON request data
      formData.append(
        "request",
        new Blob([JSON.stringify(wineData)], { type: "application/json" }),
      );

      // Send the POST request
      const response = await api.post<Wine>("/wines", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data", // Content-Type could be omitted, FormData will handle it
        },
      });

      // Return the created wine data
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
