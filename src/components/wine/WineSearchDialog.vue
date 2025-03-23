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
      <Column field="sugarType" header="Тип сахара"></Column>
      <Column field="vintage" header="Год урожая">
        <template #body="{ data }">
          <div v-if="showVintage(data.category)">
            {{ vintage(data?.vintage) }}
          </div>
        </template>
      </Column>
      <Column field="isHidden" header="Скрыто">
        <template #body="{ data }">
          {{ data.isHidden ? "Да" : "Нет" }}
        </template>
      </Column>
      <Column header="Действия">
        <template #body="{ data }">
          <ActionButtons
            @delete="deleteWine(data.id)"
            @edit="openEditWineDialog(data)"
            @editImage="openEditImageDialog(data)"
            @view="openDetailDialog(data)"
          />
        </template>
      </Column>
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

  <WineDialog
    v-model:show="showEditDialog"
    :initialData="formData"
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
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useWineStore } from "@/stores/wineStore.ts";
import { storeToRefs } from "pinia";
import { debounce, vintage } from "w-list-utils";
import { type SearchWineRequest, showVintage } from "w-list-api";
import Logo from "@/assets/images/logo.png";
import ActionButtons from "@/components/wine/ActionButtons.vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import WineEditImageDialog from "@/components/wine/WineEditImageDialog.vue";
import WineDetailsDialog from "@/components/wine/WineDetailsDialog.vue";
import WineDialog from "@/components/wine/WineDialog.vue";

const {
  fetchWinesSearch,
  deleteWine: wineDelete,
  updateWine: wineUpdate,
  updateWineImageAction,
} = useWineStore();
const { winesSearch, loadingSearch } = storeToRefs(useWineStore());

defineProps<{
  visible: boolean;
}>();

const params = reactive<SearchWineRequest>({
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

const confirm = useConfirm();
const toast = useToast();

const deleteWine = (id: number) => {
  confirm.require({
    message: "Вы уверены, что хотите удалить вино?",
    header: "Удалить вино",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Назад",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Удалить",
      severity: "danger",
    },
    accept: () => wineDelete(id),
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

const showEditDialog = ref(false);
const showEditImageDialog = ref(false);
const showDetailDialog = ref(false);
const formData = ref(null);
const selectedWine = ref(null);

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

const saveEditedWine = async (data) => {
  await wineUpdate(data.id, data);
  showEditDialog.value = false;
};
</script>

<style scoped>
/* Optionally add styles here */
</style>
