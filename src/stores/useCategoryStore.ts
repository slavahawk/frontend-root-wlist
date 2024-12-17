import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/helper/handleError.ts";
import { checkData } from "@/helper/checkData.ts";
import type { Category } from "@/types/category.ts";
import { CategoryService } from "@/service/CategoryService.ts";

export const useCategoryStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);
  const isLoad = ref(false);
  const toast = useToast();

  const getCategories = async () => {
    isLoad.value = true;
    try {
      const data = await CategoryService.getAll();

      checkData(data);

      toast.add({
        severity: "success",
        summary: "Категории получены",
        life: 3000,
      });
      categories.value = data;
      return data;
    } catch (error) {
      handleError(error, toast);
    } finally {
      isLoad.value = false;
    }
  };

  return {
    categories,
    isLoad,
    getCategories,
  };
});
