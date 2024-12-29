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

      <ToggleSwitch v-model="checked">
        <template #handle="{ checked }">
          <i
            :class="[
              '!text-xs pi',
              { 'pi-check': checked, 'pi-times': !checked },
            ]"
          />
        </template>
      </ToggleSwitch>

      <MySelect
        id="category"
        :modelValue="selectedFilters.category"
        :options="optionsFilter.category"
        label="Категории"
        @update="updateSelectedFilter('category', $event)"
      />
      <MySelect
        id="colour"
        :modelValue="selectedFilters.colour"
        :options="optionsFilter.colour"
        label="Цвет"
        @update="updateSelectedFilter('colour', $event)"
      />
      <MySelect
        id="sugarType"
        :modelValue="selectedFilters.sugarType"
        :options="optionsFilter.sugarType"
        label="Уровень сахара"
        @update="updateSelectedFilter('sugarType', $event)"
      />
      <MySelect
        id="country"
        :modelValue="selectedFilters.country"
        :options="optionsFilter.country"
        label="Страна"
        @update="updateSelectedFilter('country', $event)"
      />
      <MySelect
        id="region"
        :modelValue="selectedFilters.region"
        :options="optionsFilter.region"
        label="Регион"
        @update="updateSelectedFilter('region', $event)"
      />
      <MySelect
        id="grape"
        :modelValue="selectedFilters.grape"
        :options="optionsFilter.grapes"
        label="Виноград"
        @update="updateSelectedFilter('grape', $event)"
      />
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
      <MySelect
        id="bottleVolume"
        :modelValue="selectedFilters.bottleVolume"
        :options="optionsFilter.bottleVolume"
        label="Объем бутылки"
        @update="updateSelectedFilter('bottleVolume', $event)"
      />
    </div>

    <div class="flex-1">
      <DataTable
        :value="wines._embedded?.rootWineResponseList"
        :loading="loading"
        dataKey="id"
        selectionMode="single"
        filterDisplay="row"
      >
        <template #empty>No wines found.</template>
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-xl font-bold">Список вин</span>
              <Button
                :icon="`pi ${filterState ? 'pi-filter-slash' : 'pi-filter'}`"
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
        <Column field="bottleVolume" header="Объем (л)"></Column>
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
  type CreateWineRequest,
  type Wine,
  type WineFilter,
  type WineFilters,
  type WineQueryParams,
} from "@/types/wine";
import MySelect from "@/components/MySelect.vue";
import WineDialog from "./WineDialog.vue";

const checked = ref(false);

const year = ref();
const minDate = new Date(1900, 0, 1);

const filterState = ref(window.innerWidth > 991);
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

const optionsFilter = reactive<WineFilters>({
  category: [],
  colour: [],
  sugarType: [],
  vintage: [],
  country: [],
  region: [],
  grapes: [],
  bottleVolume: [],
});

const selectedFilters = reactive({
  category: null,
  colour: null,
  sugarType: null,
  country: null,
  region: null,
  grape: null,
  bottleVolume: null,
});

const route = useRoute();
const router = useRouter();
const {
  fetchWines,
  fetchWinesFilter,
  createWine,
  updateWine,
  deleteWine: wineDelete,
} = useWineStore();
const { wines, loading, winesFilter } = storeToRefs(useWineStore());

const initializeParams = (query: Record<string, any>): WineQueryParams => ({
  page: parseInt(query.page) || 0,
  size: parseInt(query.size) || 10,
  category: undefined,
  colour: undefined,
  sugarType: undefined,
  countryId: undefined,
  regionId: undefined,
  grapeId: undefined,
  vintage: undefined,
  bottleVolume: undefined,
  sort: undefined,
});

const params = reactive<WineQueryParams>(initializeParams(route.query));

watch(year, (val) => {
  params.vintage = val?.getFullYear() ?? undefined;
});

watch(winesFilter, (val: WineFilters) => {
  Object.assign(optionsFilter, val);
});

watch(
  () => params,
  async () => {
    await loadWines();
    updateParamsInRoute();
  },
  { deep: true },
);

// Функции для обновления фильтров
const updateSelectedFilter = async (
  filterName: string,
  value: WineFilter | null,
) => {
  // Обновляем параметры запроса
  params[filterName] = value?.id;

  // Загружаем вина и обновляем фильтры
  await loadWines();

  // Обновляем выбранные фильтры значениями из optionsFilter
  if (optionsFilter[filterName]) {
    const foundFilter = optionsFilter[filterName].find(
      (option) => option.id === value?.id,
    );

    if (foundFilter) {
      // Заменяем все поля в selectedFilters, если они есть в найденном фильтре
      selectedFilters[filterName] = foundFilter;

      // Если нужно обновить все поля, можно пройти по всем полям в selectedFilters
      for (const key in selectedFilters) {
        if (optionsFilter[key]) {
          const match = optionsFilter[key].find(
            (option) => option.id === selectedFilters[key]?.id,
          );
          // Если нашли соответствующий фильтр, обновляем значение
          if (match) {
            selectedFilters[key] = match;
          }
        }
      }
    } else {
      selectedFilters[filterName] = null; // Если не найден, можно оставить null
    }
  }
};

const resetFilters = () => {
  Object.keys(params).forEach((key) => {
    params[key] = undefined;
  });

  Object.keys(selectedFilters).forEach((key) => {
    selectedFilters[key].value = null;
  });

  loadWines();
};

const loadWines = async () => {
  try {
    const wineData = await fetchWines(params); // Получение данных о вине
    const filterData = await fetchWinesFilter(params); // Получение фильтров с количеством

    Object.assign(wines.value, wineData); // Установка данных о вине
    Object.assign(optionsFilter, filterData); // Обновление optionsFilter с новыми значениями
  } catch (error) {
    console.error("Error loading wines:", error);
  }
};

// Обновление параметров в маршруте
const updateParamsInRoute = () => {
  router.replace({ query: { ...params } });
};

// Функции для работы с диалоговым окном
const showCreateDialog = () => {
  createMode.value = true;
  showDialog.value = true;
};

const showEditDialog = (wine: Wine) => {
  createMode.value = false;
  formData.value = { ...wine }; // Используем оператор распаковки для копирования свойств
  showDialog.value = true;
};

const saveWine = async (data: CreateWineRequest) => {
  try {
    if (createMode.value) {
      await createWine(data);
    } else {
      const { id, ...wineData } = formData.value;
      await updateWine(id, wineData);
    }
    showDialog.value = false;
    await loadWines();
  } catch (error) {
    console.error("Error saving wine:", error);
  }
};

const deleteWine = async (id: number) => {
  if (confirm("Вы уверены, что хотите удалить это вино?")) {
    await wineDelete(id);
    await loadWines();
  }
};

const onPageChange = async ({ page, rows }) => {
  params.page = page;
  params.size = rows;
  await loadWines();
};

// Упрощение переключения состояния фильтров
const toggleMenu = () => {
  filterState.value = !filterState.value;
};

// Инициализация загрузки вин при монтировании
await loadWines();
</script>
