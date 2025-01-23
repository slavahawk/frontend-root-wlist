<template>
  <div class="filter-container">
    <FilterSection
      v-if="filterState"
      :initialParams="params"
      :winesFilter="winesFilter"
      :filterState="filterState"
      @toggleMenu="() => (filterState = !filterState)"
      @reset="resetFilters"
      @paramsChange="onParamsChange"
    />

    <div class="flex-1">
      <DataTable
        :value="wines._embedded?.rootWineResponseList"
        :loading="loading"
        dataKey="id"
        selectionMode="single"
      >
        <template #empty>No wines found.</template>
        <template #header>
          <HeaderSection
            :filterState="filterState"
            @toggleMenu="filterState = !filterState"
            @showCreateDialog="showCreateDialog = true"
            :totalItems="wines?.page.totalElements"
          />
        </template>
        <Column field="name" header="Имя" sortable></Column>
        <Column header="Обложка">
          <template #body="{ data }">
            <Avatar
              :image="data.tinyImagePath"
              size="xlarge"
              shape="circle"
              @error="(e) => (e.target.src = Logo)"
            />
          </template>
        </Column>
        <Column field="category" header="Категория" sortable></Column>
        <Column field="colour" header="Цвет"></Column>
        <Column field="bottleVolume" header="Объем (л)"></Column>
        <Column field="alcoholByVolume" header="Алкоголь (%)"></Column>
        <Column field="sugarType" header="Уровень сахара"></Column>
        <Column field="vintage" header="Год урожая">
          <template #body="{ data }">
            {{ vintage(data?.vintage) }}
          </template>
        </Column>
        <Column field="isHidden" header="Скрыто">
          <template #body="{ data }">
            <ToggleButton
              :onLabel="'Да'"
              :offLabel="'Нет'"
              :modelValue="data.isHidden"
              @change="toggleWineVisibility(data)"
            />
          </template>
        </Column>
        <Column header="Действия">
          <template #body="{ data }">
            <ActionButtons
              v-if="!data.isDeleted"
              @delete="deleteWine(data.id)"
              @edit="openEditWineDialog(data)"
              @editImage="openEditImageDialog(data)"
              @view="openDetailDialog(data)"
            />
            <div v-else>Удалено, но Леха хуй сосал</div>
          </template>
        </Column>
      </DataTable>

      <Paginator
        v-if="wines.page"
        :first="params.page * params.size"
        :rows="params.size"
        :totalRecords="wines.page.totalElements"
        @page="onPageChange"
        :rowsPerPageOptions="[10, 20, 50]"
      >
        <template #start>
          <Button @click="loadWines" type="button" icon="pi pi-refresh" text />
        </template>
      </Paginator>

      <WineDialog
        :isVisible="showCreateDialog"
        @close="showCreateDialog = false"
        @save="saveCreatedWine"
      />

      <WineEditDialog
        :isVisible="showEditDialog"
        :initialData="formData"
        @close="showEditDialog = false"
        @save="saveEditedWine"
      />

      <WineEditImageDialog
        :isVisible="showEditImageDialog"
        :initialData="selectedWine"
        @close="showEditImageDialog = false"
        @update-image="updateWineImage"
      />

      <WineDetailsDialog
        v-model:show="showDetailDialog"
        :wine="selectedWine"
        @close="showDetailDialog = false"
      />
    </div>
    <ConfirmDialog />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useWineStore } from "@/stores/wineStore";
import { storeToRefs } from "pinia";
import WineEditDialog from "./WineEditDialog.vue";
import WineEditImageDialog from "./WineEditImageDialog.vue";
import ActionButtons from "./ActionButtons.vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Logo from "@/assets/images/logo.png";
import WineDialog from "@/components/wine/WineDialog.vue";
import FilterSection from "@/components/wine/FilterSection.vue";
import HeaderSection from "@/components/wine/HeaderSection.vue";
import WineDetailsDialog from "@/components/wine/WineDetailsDialog.vue";
import type { Wine } from "w-list-api";
import { vintage } from "w-list-utils";

const filterState = ref(false);
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const showEditImageDialog = ref(false);
const showDetailDialog = ref(false);
const formData = ref(null);
const selectedWine = ref(null);

const {
  fetchWines,
  createWine,
  updateWine,
  updateWineImageAction,
  deleteWine: wineDelete,
} = useWineStore();
const { wines, loading, winesFilter } = storeToRefs(useWineStore());

const params = reactive({
  page: 0,
  size: 10,
  category: undefined,
  colour: undefined,
  sugarType: undefined,
  countryId: undefined,
  regionId: undefined,
  grapeId: undefined,
  vintage: undefined,
  bottleVolume: undefined,
});

const toggleWineVisibility = async (wine: Wine) => {
  const { id, ...rest } = wine; // Деструктурируем wine на id и остальные свойства
  const updatedWine = { ...rest, isHidden: !rest.isHidden }; // Обновляем состояние isHidden
  await updateWine(id, updatedWine); // Передаем id и обновленные данные без id
};

const resetFilters = () => {
  // Сбрасываем все параметры к начальным значениям
  Object.keys(params).forEach((key) => {
    if (key === "page") {
      params[key] = 0; // Сбрасываем page до 0
    } else if (key === "size") {
      params[key] = 10; // Сбрасываем size до 10
    } else {
      params[key] = undefined; // Остальные параметры сбрасываем до undefined
    }
  });
  loadWines(); // Загружаем вина после сброса фильтров
};

const loadWines = async () => {
  try {
    await fetchWines(params);
  } catch (error) {
    console.error("Error loading wines:", error);
  }
};

const onParamsChange = (newParams) => {
  Object.assign(params, newParams);
  loadWines();
};

const onPageChange = async ({ page, rows }) => {
  params.page = page;
  params.size = rows;
  await loadWines();
};

const saveEditedWine = async (data) => {
  await updateWine(data.id, data);
  showEditDialog.value = false;
};

const saveCreatedWine = async (data, image) => {
  await createWine(data, image);
  showCreateDialog.value = false;
};

const confirm = useConfirm();
const toast = useToast();

const deleteWine = (id) => {
  confirm.require({
    message: "Вы уверены, что хотите удалить вино?",
    header: "Удалить вино",
    icon: "pi pi-info-circle",
    rejectLabel: "Отменить",
    rejectProps: {
      label: "Назад",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Удалить",
      severity: "danger",
    },
    accept: async () => {
      await wineDelete(id);
      await loadWines();
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
};

const openEditWineDialog = (wine) => {
  formData.value = wine;
  showEditDialog.value = true;
};

const openDetailDialog = (wine) => {
  selectedWine.value = wine;
  showDetailDialog.value = true;
};

const openEditImageDialog = (wine) => {
  selectedWine.value = wine;
  showEditImageDialog.value = true;
};

const updateWineImage = async (image) => {
  if (selectedWine.value) {
    await updateWineImageAction(selectedWine.value.id, image);
    showEditImageDialog.value = false;
    await loadWines();
  }
};

await loadWines();
</script>
