<template>
  <div>
    <div class="flex justify-between mb-4">
      <h2>Сорта винограда</h2>
      <Button
        label="Добавить новый сорт"
        icon="pi pi-plus"
        @click="openCreateDialog"
      />
    </div>

    <DataTable
      v-if="!loading"
      :value="grapes"
      dataKey="id"
      :loading="loading"
      selectionMode="single"
      @selection-change="onSelectionChange"
    >
      <Column field="name" header="Имя" sortable></Column>
      <Column header="Действия">
        <template #body="{ data }">
          <div class="flex gap-2 flex-wrap">
            <Button icon="pi pi-pencil" @click="editGrape(data)" />
            <Button
              icon="pi pi-trash"
              @click="confirmDeleteGrape(data.id)"
              class="p-button-danger"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="isDialogVisible"
      header="Редактирование винограда"
      :modal="true"
      @hide="resetForm"
    >
      <GrapeForm
        :grape="selectedGrape"
        @save="saveGrape"
        @cancel="isDialogVisible = false"
      />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useGrapeStore } from "@/stores/grapeStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import GrapeForm from "./GrapeForm.vue";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

const { fetchGrapes, deleteGrape, updateGrape, createGrape } = useGrapeStore();
const { grapes, loading } = storeToRefs(useGrapeStore());
const toast = useToast();

const isDialogVisible = ref(false);
const selectedGrape = ref(null);

// Загрузка данных о винограде при инициализации
onMounted(fetchGrapes);

// Обработчик изменения выбора
const onSelectionChange = (selection) => {
  selectedGrape.value = selection;
};

// Функция для удаления винограда с подтверждением
const confirmDeleteGrape = (id) => {
  if (confirm("Вы уверены, что хотите удалить этот сорт винограда?")) {
    deleteGrape(id).then(() => {
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Сорт винограда удален",
        life: 3000,
      });
      fetchGrapes(); // Перезагружаем данные
    });
  }
};

// Функция для редактирования винограда
const editGrape = (data) => {
  selectedGrape.value = data;
  isDialogVisible.value = true;
};

// Функция для создания нового сорта винограда
const openCreateDialog = () => {
  selectedGrape.value = null; // Сбросить выбранный сорт перед открытием
  isDialogVisible.value = true; // Показать диалог
};

// Функция для сохранения изменений
const saveGrape = async (grape) => {
  if (grape.id) {
    await updateGrape(grape.id, grape);
  } else {
    await createGrape(grape);
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Новый сорт винограда создан",
      life: 3000,
    });
  }
  isDialogVisible.value = false;
  await fetchGrapes(); // Обновляем список винограда после изменения
};

// Функция для сброса формы
const resetForm = () => {
  selectedGrape.value = null;
};
</script>

<style scoped>
/* Ваши стили */
</style>
