<!-- Родительский компонент -->
<template>
  <div>
    <div class="flex justify-between mb-4">
      <h2>Регион(ы)</h2>
      <Button
        label="Добавить новый регион"
        icon="pi pi-plus"
        @click="openCreateDialog"
      />
    </div>

    <DataTable
      v-if="!loading"
      :value="regions"
      dataKey="id"
      :loading="loading"
      selectionMode="single"
      @selection-change="onSelectionChange"
    >
      <Column field="name" header="Название" sortable></Column>
      <Column field="country.name" header="Страна" sortable></Column>
      <Column field="createdAt" header="Дата создания" sortable></Column>
      <Column field="updatedAt" header="Дата обновления" sortable></Column>
      <Column header="Действия">
        <template #body="{ data }">
          <div class="flex gap-2 flex-wrap">
            <Button icon="pi pi-pencil" @click="editRegion(data)" />
            <Button
              icon="pi pi-trash"
              @click="confirmDeleteRegion(data.id)"
              class="p-button-danger"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="isDialogVisible"
      header="Редактирование региона"
      :modal="true"
      @hide="resetForm"
    >
      <RegionForm
        :region="selectedRegion"
        @save="saveRegion"
        @cancel="isDialogVisible = false"
        :countriesOptions="countriesOptions"
      />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRegionStore } from "@/stores/regionStore.ts";
import RegionForm from "./RegionForm.vue";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useCountryStore } from "@/stores/countryStore.ts"; // Импортируем хранилище стран

const { fetchRegions, deleteRegion, updateRegion, createRegion } =
  useRegionStore();
const { countriesOptions } = storeToRefs(useCountryStore()); // Получение стран из хранилища

const { regions, loading } = storeToRefs(useRegionStore());
const toast = useToast();

const isDialogVisible = ref(false);
const selectedRegion = ref(null);

onMounted(fetchRegions);

const onSelectionChange = (selection) => {
  selectedRegion.value = selection;
};

const confirmDeleteRegion = (id) => {
  if (confirm("Вы уверены, что хотите удалить этот регион?")) {
    deleteRegion(id).then(() => {
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Регион успешно удален",
        life: 3000,
      });
      fetchRegions();
    });
  }
};

const editRegion = (data) => {
  selectedRegion.value = data;
  isDialogVisible.value = true;
};

const openCreateDialog = () => {
  selectedRegion.value = null;
  isDialogVisible.value = true;
};

const saveRegion = async (region) => {
  if (region.id) {
    await updateRegion(region.id, {
      name: region.name,
      countryId: region.country.id,
    });
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Регион обновлен",
      life: 3000,
    });
  } else {
    console.log(region);
    await createRegion({ name: region.name, countryId: region.countryId });
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Новый регион создан",
      life: 3000,
    });
  }

  isDialogVisible.value = false;
  await fetchRegions();
};

const resetForm = () => {
  selectedRegion.value = null;
};
</script>

<style scoped>
/* Ваши стили */
</style>
