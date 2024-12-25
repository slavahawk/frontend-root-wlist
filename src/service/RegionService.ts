import { api } from "@/api/api";
import type { Region, RegionRequest } from "@/types/region";

const RegionService = {
  async getRegionById(id: number): Promise<Region> {
    try {
      const response = await api.get<Region>(`/regions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении региона с ID ${id}:`, error);
      throw error;
    }
  },

  async updateRegion(id: number, regionData: RegionRequest): Promise<Region> {
    try {
      const response = await api.put<Region>(`/regions/${id}`, regionData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении региона с ID ${id}:`, error);
      throw error;
    }
  },

  async deleteRegion(id: number): Promise<void> {
    try {
      await api.delete(`/regions/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении региона с ID ${id}:`, error);
      throw error;
    }
  },

  async createRegion(regionData: RegionRequest): Promise<Region> {
    try {
      const response = await api.post<Region>("/regions", regionData);
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании региона:", error);
      throw error;
    }
  },

  async getAllRegions(): Promise<Region[]> {
    try {
      const response = await api.get<Region[]>("/regions");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении регионов:", error);
      throw error;
    }
  },
};

export default RegionService;
