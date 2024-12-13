import { api } from "@/api/api.ts";

export class CategoryService {
  static async getCategories(): Promise<any> {
    try {
      const { data } = await api.get("/categories");
      return data;
    } catch (error) {
      console.error("Ошибка получения категорий", error);
      throw new Error("Ошибка получения категорий");
    }
  }
}
