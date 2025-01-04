<template>
  <div>
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl">Страны</h2>
      <Button
        label="Добавить новую страну"
        icon="pi pi-plus"
        @click="openCreateDialog"
      />
    </div>

    <DataTable
      v-if="!loading"
      :value="countries"
      dataKey="id"
      :loading="loading"
      selectionMode="single"
      @selection-change="onSelectionChange"
    >
      <Column field="name" header="Имя" sortable></Column>
      <Column header="Действия">
        <template #body="{ data }">
          <div class="flex gap-2 flex-wrap">
            <Button icon="pi pi-pencil" @click="editCountry(data)" />
            <Button
              icon="pi pi-trash"
              @click="confirmDeleteCountry(data.id)"
              class="p-button-danger"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="isDialogVisible"
      header="Редактирование страны"
      :modal="true"
      @hide="resetForm"
    >
      <CountryForm
        :country="selectCounry"
        @save="saveCountry"
        @cancel="isDialogVisible = false"
      />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useCountryStore } from "@/stores/countryStore.ts";
import CountryForm from "@/components/country/CountryForm.vue";

const { fetchCountries, deleteCountry, updateCountry, createCountry } =
  useCountryStore();
const { countries, loading } = storeToRefs(useCountryStore());
const toast = useToast();

const isDialogVisible = ref(false);
const selectCounry = ref(null);

// Загрузка данных о винограде при инициализации
fetchCountries();

// Обработчик изменения выбора
const onSelectionChange = (selection) => {
  selectCounry.value = selection;
};

// Функция для удаления винограда с подтверждением
const confirmDeleteCountry = (id) => {
  if (confirm("Вы уверены, что хотите удалить этот сорт винограда?")) {
    deleteCountry(id).then(() => {
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Сорт винограда удален",
        life: 3000,
      });
      fetchCountries(); // Перезагружаем данные
    });
  }
};

// Функция для редактирования винограда
const editCountry = (data) => {
  selectCounry.value = data;
  isDialogVisible.value = true;
};

// Функция для создания нового сорта винограда
const openCreateDialog = () => {
  selectCounry.value = null; // Сбросить выбранный сорт перед открытием
  isDialogVisible.value = true; // Показать диалог
};

// Функция для сохранения изменений
const saveCountry = async (country: Country) => {
  if (country.id) {
    await updateCountry(country.id, { name: country.name });
  } else {
    await createCountry({ name: country.name });
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Новый сорт винограда создан",
      life: 3000,
    });
  }
  isDialogVisible.value = false;
  await fetchCountries(); // Обновляем список винограда после изменения
};

// Функция для сброса формы
const resetForm = () => {
  selectCounry.value = null;
};
</script>

<style scoped>
/* Ваши стили */
</style>
