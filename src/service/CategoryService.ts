import { api } from "@/api/api.ts";
import type { Category } from "@/types/category.ts";

export class CategoryService {
  static async getAll(): Promise<Category[]> {
    try {
      const { data } = await api.get("/categories");
      return data;
    } catch (error) {
      console.error("Ошибка получения категорий", error);
      throw new Error("Ошибка получения категорий");
    }
  }
}
