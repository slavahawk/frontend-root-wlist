<template>
  <div class="filter-container">
    <FilterSection
      v-if="filterState"
      :initialParams="params"
      :winesFilter="winesFilter"
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
            @toggleMenu="() => (filterState = !filterState)"
            @showCreateDialog="() => (showDialog = true)"
            :totalItems="wines?.page.totalElements"
          />
        </template>
        <Column field="name" header="Имя" sortable></Column>
        <Column header="Обложка">
          <template #body="{ data }">
            <Avatar
              :image="data.originalImagePath"
              size="xlarge"
              shape="circle"
              @error="(e) => (e.target.src = Logo)"
            />
          </template>
        </Column>
        <Column field="category" header="Категория" sortable></Column>
        <Column field="colour" header="Цвет"></Column>
        <Column field="bottleVolume" header="Объем (л)"></Column>
        <Column field="alcoholByVolume" header="Алкоголь (%)">
          <template #body="{ data }">
            {{ (data.alcoholByVolume * 10).toFixed(1) }}
          </template>
        </Column>
        <Column field="sugarType" header="Уровень сахара"></Column>
        <Column field="vintage" header="Год урожая"></Column>
        <Column field="isHidden" header="Скрыто">
          <template #body="{ data }">
            {{ data.isHidden ? "Да" : "Нет" }}
          </template>
        </Column>
        <Column header="Действия">
          <template #body="{ data }">
            <ActionButtons
              :wine="data"
              @edit="showEditDialog(data)"
              @delete="deleteWine(data.id)"
            />
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
import { reactive, ref } from "vue";
import { useWineStore } from "@/stores/wineStore";
import { storeToRefs } from "pinia";
import WineDialog from "./WineDialog.vue";
import Logo from "@/assets/images/logo.png";
import FilterSection from "./FilterSection.vue";
import HeaderSection from "./HeaderSection.vue";
import ActionButtons from "./ActionButtons.vue";

const filterState = ref(window.innerWidth > 991);
const showDialog = ref(false);
const createMode = ref(true);
const formData = ref({
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
  vintage: 2024,
  interestingFacts: "",
  regionId: 0,
  organoleptic: "",
});

const {
  fetchWines,
  createWine,
  updateWine,
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

const resetFilters = () => {
  Object.keys(params).forEach((key) => (params[key] = undefined));
  loadWines();
};

const loadWines = async () => {
  try {
    const wineData = await fetchWines(params);
    Object.assign(wines.value, wineData);
  } catch (error) {
    console.error("Error loading wines:", error);
  }
};

const onParamsChange = (newParams) => {
  // Обновляем params на основе нового состояния
  Object.assign(params, newParams);
  loadWines(); // Перезагрузка данных вин при изменении параметров
};

const onPageChange = async ({ page, rows }) => {
  params.page = page;
  params.size = rows;
  await loadWines();
};

await loadWines();

const saveWine = async (id) => {
  console.log(id);
};
</script>
