<template>
  <Dialog
    :visible="visible"
    modal
    @update:visible="handleHide"
    header="Найти вино"
    style="width: 100%; height: 100%"
  >
    <InputText
      id="search"
      name="search"
      placeholder="Название вина"
      v-model="searchText"
      class="w-full mb-4"
    />

    <DataTable
      :value="winesSearch?._embedded?.rootWineResponseList"
      :loading="loadingSearch"
      dataKey="id"
      selectionMode="single"
    >
      <template #empty>No wines found.</template>
      <!--      <template #header>-->
      <!--        <HeaderSection-->
      <!--            :filterState="filterState"-->
      <!--            @toggleMenu="() => (filterState = !filterState)"-->
      <!--            @showCreateDialog="() => (showDialog = true)"-->
      <!--            :totalItems="wines?.page.totalElements"-->
      <!--        />-->
      <!--      </template>-->
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
      <!--      <Column header="Действия">-->
      <!--        <template #body="{ data }">-->
      <!--          &lt;!&ndash;          <ActionButtons&ndash;&gt;-->
      <!--          &lt;!&ndash;              :wine="data"&ndash;&gt;-->
      <!--          &lt;!&ndash;              @edit="showEditDialog(data)"&ndash;&gt;-->
      <!--          &lt;!&ndash;              @delete="deleteWine(data.id)"&ndash;&gt;-->
      <!--          &lt;!&ndash;          />&ndash;&gt;-->
      <!--        </template>-->
      <!--      </Column>-->
    </DataTable>
    <Paginator
      v-if="winesSearch?.page"
      :first="params.page * params.size"
      :rows="params.size"
      :totalRecords="winesSearch?.page.totalElements"
      @page="onPageChange"
      :rowsPerPageOptions="[10, 20, 50]"
    >
      <template #start>
        <Button @click="loadWines" type="button" icon="pi pi-refresh" text />
      </template>
    </Paginator>
  </Dialog>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, watch } from "vue";
import { useWineStore } from "@/stores/wineStore.ts";
import { storeToRefs } from "pinia";
import { debounce } from "@/utils/debounce";
import type { WineRequestSearch } from "@/types/wine.ts";
import Logo from "@/assets/images/logo.png";

const { fetchWinesSearch } = useWineStore();
const { winesSearch, loadingSearch } = storeToRefs(useWineStore());

defineProps<{
  visible: boolean;
}>();

const params = reactive<WineRequestSearch>({
  name: "",
  page: 0,
  size: 12,
  sort: undefined,
});

// Emits the event to notify parent to hide the dialog
const emit = defineEmits(["update:visible"]);

const searchText = ref("");

watch(
  searchText,
  debounce((val: string) => {
    params.name = val;
    params.page = 0;
    loadWines();
  }, 300),
);

const onPageChange = async ({ page, rows }) => {
  params.page = page;
  params.size = rows;
  await loadWines();
};

const loadWines = async () => {
  await fetchWinesSearch(params);
};

// Function to handle dialog hide event
function handleHide(value: boolean) {
  emit("update:visible", value);
}
</script>

<style scoped>
/* Optionally add styles here */
</style>
