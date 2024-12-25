import { api } from "@/api/api";
import type { Grape, GrapeRequest } from "@/types/grape";

const GrapeService = {
  async getGrapeById(id: number): Promise<Grape> {
    try {
      const response = await api.get<Grape>(`/grapes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении винограда с ID ${id}:`, error);
      throw error;
    }
  },

  async updateGrape(id: number, grapeData: GrapeRequest): Promise<Grape> {
    try {
      const response = await api.put<Grape>(`/grapes/${id}`, grapeData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении винограда с ID ${id}:`, error);
      throw error;
    }
  },

  async deleteGrape(id: number): Promise<void> {
    try {
      await api.delete(`/grapes/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении винограда с ID ${id}:`, error);
      throw error;
    }
  },

  async createGrape(grapeData: GrapeRequest): Promise<Grape> {
    try {
      const response = await api.post<Grape>("/grapes", grapeData);
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании винограда:", error);
      throw error;
    }
  },

  async getAllGrapes(): Promise<Grape[]> {
    try {
      const response = await api.get<Grape[]>("/grapes");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении винограда:", error);
      throw error;
    }
  },
};

export default GrapeService;
