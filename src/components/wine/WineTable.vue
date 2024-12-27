<template>
  <div class="filter-container">
    <div v-if="filterState" class="filter">
      <div class="flex items-center justify-between mb-4">
        <div class="text-2xl">Фильтры</div>
        <Button
          label="Сбросить фильтры"
          icon="pi pi-times"
          size="small"
          variant="text"
          @click="resetFilters"
        />
      </div>
      <div class="input-container">
        <div class="text-l">Категории</div>
        <Dropdown
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
        <div class="text-l">Уровень сахара</div>
        <Dropdown
          id="sugarType"
          v-model="params.sugarType"
          :options="sugarTypeOptions"
          optionLabel="label"
          optionValue="value"
          showClear
          placeholder="Выберите уровень сахара"
        />
      </div>
      <div class="input-container">
        <div class="text-l">Страна</div>
        <Dropdown
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
        <DatePicker
          v-model="year"
          view="year"
          :minDate="minDate"
          dateFormat="yy"
          placeholder="Год урожая"
        />
      </div>

      <div class="input-container">
        <div class="text-l">Объем бутылки</div>
        <InputText v-model="params.bottleVolume" placeholder="Объем бутылки" />
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
                variant="text"
                @click="toggleMenu"
                v-tooltip.bottom="
                  `${filterState ? 'Скрыть' : 'Раскрыть'} фильтры`
                "
              />
              <Button
                icon="pi pi-plus"
                variant="text"
                @click="showCreateDialog"
                v-tooltip.bottom="`Добавить вино`"
              />
            </div>
          </div>
        </template>

        <Column field="name" header="Имя" sortable></Column>
        <Column field="category" header="Категория" sortable></Column>
        <Column field="colour" header="Цвет"></Column>
        <Column field="bottleVolume" header="Объем (мл)"></Column>
        <Column field="alcoholByVolume" header="Алкоголь (%)"></Column>
        <Column field="sugarType" header="Уровень сахара"></Column>
        <Column field="vintage" header="Год урожая"></Column>
        <Column field="interestingFacts" header="Интересные факты"></Column>
        <Column
          field="isHidden"
          header="Скрыто"
          :body="(data) => (data.isHidden ? 'Да' : 'Нет')"
        ></Column>
        <Column header="Действия">
          <template #body="{ data }">
            <div class="flex gap-2 flex-wrap">
              <Button
                icon="pi pi-pencil"
                variant="text"
                @click="showEditDialog(data)"
                v-tooltip.bottom="`Редактировать вино`"
              />
              <Button
                icon="pi pi-trash"
                @click="deleteWine(data.id)"
                variant="text"
                class="p-button-danger"
                v-tooltip.bottom="`Удалить вино`"
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
      >
        <template #start>
          <Button @click="loadWines" type="button" icon="pi pi-refresh" text />
        </template>
        <template #end>
          <!--          <Button type="button" icon="pi pi-refresh" text />-->
        </template>
      </Paginator>

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

const year = ref();
const minDate = new Date(1900, 0, 1);
watch(year, (val) => {
  params.vintage = val?.getFullYear() ?? undefined;
});

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
  category: undefined,
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
