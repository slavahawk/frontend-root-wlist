<template>
  <div class="filter-container">
    <div v-if="filterState" class="filter">
      <div class="flex items-center justify-between mb-4">
        <div class="text-2xl">Фильтры</div>
        <Button
          label="Сбросить фильтры"
          icon="pi pi-times"
          size="small"
          @click="resetFilters"
        />
      </div>
      <div class="input-container">
        <div class="text-l">Категории</div>
        <Dropdown
          class="w-full md:w-56"
          id="category"
          v-model="params.category"
          :options="categoryOptions"
          optionLabel="label"
          optionValue="value"
          showClear
          placeholder="Выберите категорию"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Цвет</div>
        <Dropdown
          class="w-full md:w-56"
          id="colour"
          v-model="params.colour"
          :options="colourOptions"
          optionLabel="label"
          optionValue="value"
          showClear
          placeholder="Выберите цвет"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Тип сахара</div>
        <Dropdown
          class="w-full md:w-56"
          id="sugarType"
          v-model="params.sugarType"
          :options="sugarTypeOptions"
          optionLabel="label"
          optionValue="value"
          showClear
          placeholder="Выберите тип сахара"
        />
      </div>
      <div class="input-container">
        <div class="text-l">Страна</div>
        <Dropdown
          class="w-full md:w-56"
          id="country"
          v-model="params.countryId"
          :options="countriesOptions"
          optionLabel="label"
          optionValue="value"
          showClear
          placeholder="Выберите страну"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Регион</div>
        <Dropdown
          class="w-full md:w-56"
          id="region"
          v-model="params.regionId"
          :options="regionOptions"
          optionLabel="label"
          optionValue="value"
          showClear
          placeholder="Выберите регион"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Виноград</div>
        <Dropdown
          class="w-full md:w-56"
          id="grape"
          v-model="params.grapeId"
          :options="grapeOptions"
          optionLabel="label"
          optionValue="value"
          showClear
          placeholder="Выберите виноград"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Год урожая</div>
        <InputText
          class="w-full md:w-56"
          v-model="params.vintage"
          placeholder="Год урожая"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Объем бутылки</div>
        <InputText
          class="w-full md:w-56"
          v-model="params.bottleVolume"
          placeholder="Объем бутылки"
        />
      </div>
    </div>

    <div class="flex-1">
      <DataTable
        :value="wines._embedded?.rootWineResponseList"
        :loading="loading"
        dataKey="id"
        selectionMode="single"
        filterDisplay="row"
      >
        <template #empty> No customers found. </template>
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-xl font-bold">Список вин</span>
              <Button
                :icon="`pi ${filterState ? 'pi-filter-slash' : 'pi-filter'} `"
                link
                @click="toggleMenu"
              />
              <Button
                icon="pi pi-plus"
                rounded
                raised
                @click="showCreateDialog"
              />
            </div>
            <Button icon="pi pi-refresh" rounded raised @click="loadWines" />
          </div>
        </template>
        <Column field="name" header="Имя" sortable></Column>
        <Column field="category" header="Категория" sortable></Column>
        <Column field="colour" header="Цвет"></Column>
        <Column field="bottleVolume" header="Объем (мл)"></Column>
        <Column header="Действия">
          <template #body="{ data }">
            <div class="flex gap-2 flex-wrap">
              <Button icon="pi pi-pencil" @click="showEditDialog(data)" />
              <Button
                icon="pi pi-trash"
                @click="deleteWine(data.id)"
                class="p-button-danger"
              />
            </div>
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
      />

      <WineDialog
        :isVisible="showDialog"
        :createMode="createMode"
        :initialData="formData"
        @close="showDialog = false"
        @save="saveWine"
        @update:visible="showDialog = $event"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { useWineStore } from "@/stores/wineStore";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import {
  categoryOptions,
  colourOptions,
  type CreateWineRequest,
  sugarTypeOptions,
  type Wine,
  type WineQueryParams,
} from "@/types/wine";
import WineDialog from "./WineDialog.vue";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";

const filterState = ref(true);
filterState.value = window.innerWidth > 991;

const toggleMenu = () => {
  filterState.value = !filterState.value;
};

const {
  fetchWines,
  createWine,
  updateWine,
  deleteWine: wineDelete,
} = useWineStore();
const { wines, loading } = storeToRefs(useWineStore());
const { countriesOptions } = storeToRefs(useCountryStore());
const { regionOptions } = storeToRefs(useRegionStore());
const { grapeOptions } = storeToRefs(useGrapeStore());

const route = useRoute();
const router = useRouter();

const showDialog = ref(false);
const createMode = ref(true);
const formData = ref<CreateWineRequest & { id?: number }>({
  id: undefined,
  name: "",
  category: "RED",
  colour: "RED",
  bottleVolume: 0,
  alcoholByVolume: 0,
  sugarType: "DRY",
  countryId: 0,
  isHidden: false,
  grapeIds: [],
});

// Задайте начальные параметры фильтрации
const initialParams = {
  page: 0,
  size: 10,
  colour: undefined,
  sugarType: undefined,
  countryId: undefined,
  regionId: undefined,
  grapeId: undefined,
  vintage: undefined,
  bottleVolume: undefined,
  sort: undefined,
};

const parseQueryParams = (query: Record<string, any>): WineQueryParams => {
  return {
    page: parseInt(query.page) || 0,
    size: parseInt(query.size) || 10,
    colour: query.colour || undefined,
    sugarType: query.sugarType || undefined,
    countryId: parseInt(query.countryId) || undefined,
    regionId: parseInt(query.regionId) || undefined,
    grapeId: parseInt(query.grapeId) || undefined,
    vintage: parseInt(query.vintage) || undefined,
    bottleVolume: parseInt(query.bottleVolume) || undefined,
    sort: query.sort || undefined,
  };
};

// Инициализация параметров из URL с помощью функции
const params = reactive<WineQueryParams>({
  ...initialParams,
  ...parseQueryParams(route.query), // Преобразуем параметры
});

// Загрузка вин при монтировании
const loadWines = async () => {
  await fetchWines(params);
};

// Загрузка данных при монтировании
await loadWines();

// Используйте watch для отслеживания изменений в params
watch(
  () => params,
  async () => {
    await loadWines(); // Запрашиваем данные при каждом изменении params
    updateParamsInRoute(); // Обновляем параметры URL
  },
  { deep: true }, // Обязательно используйте deep для отслеживания изменений во вложенных объектах
);

// Функция для обновления параметров в маршруте
const updateParamsInRoute = () => {
  router.replace({ query: { ...params } }); // Обновляем параметры в URL
};

// Функция для сброса фильтров
const resetFilters = () => {
  Object.assign(params, { ...initialParams }); // Сброс параметров к начальным значениям
  loadWines(); // Перезагрузите данные
};

// Предыдущий watch для диалогового окна
watch(showDialog, (newValue) => {
  if (!newValue) {
    clearForm();
  }
});

const clearForm = () => {
  formData.value = {
    name: "",
    category: "RED",
    colour: "RED",
    bottleVolume: 0,
    alcoholByVolume: 0,
    sugarType: "DRY",
    countryId: 0,
    isHidden: false,
    grapeIds: [],
  };
};

const showCreateDialog = () => {
  createMode.value = true;
  showDialog.value = true;
};

const showEditDialog = (wine: Wine) => {
  createMode.value = false;
  formData.value = {
    id: wine.id,
    name: wine.name,
    category: wine.category,
    colour: wine.colour,
    bottleVolume: wine.bottleVolume,
    alcoholByVolume: wine.alcoholByVolume,
    sugarType: wine.sugarType,
    countryId: wine.country?.id ?? 0,
    isHidden: wine.isHidden,
    grapeIds: wine.grapes?.map((grape) => grape.id) ?? [],
    vintage: wine.vintage,
    regionId: wine.region?.id ?? 0,
    interestingFacts: wine.interestingFacts,
    organoleptic: wine.organoleptic,
  };

  showDialog.value = true;
};

const saveWine = async (data: CreateWineRequest) => {
  if (createMode.value) {
    await createWine(data);
  } else {
    const { id, ...wineData } = formData.value;
    await updateWine(id, wineData);
  }
  showDialog.value = false;
  await loadWines();
};

const deleteWine = async (id: number) => {
  if (confirm("Вы уверены, что хотите удалить это вино?")) {
    await wineDelete(id);
    await loadWines();
  }
};

const onPageChange = async ({
  page,
  rows,
}: {
  page: number;
  first: number;
  rows: number;
  pageCount: number;
}) => {
  params.page = page;
  params.size = rows;
  await loadWines(); // Запрашиваем данные при смене страницы
  updateParamsInRoute(); // Обновляем параметры в URL
};
</script>

<style scoped></style>
