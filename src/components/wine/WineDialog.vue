<template>
  <Dialog
    v-model:visible="isVisible"
    :header="isEditMode ? 'Редактирование Вина' : 'Добавление Вина'"
    modal
    @hide="resetForm"
    style="max-width: 60vw; width: 100%"
  >
    <template #header>
      <div class="flex justify-between items-center w-full mr-4">
        <div class="p-dialog-title">
          {{ isEditMode ? "Редактирование Вина" : "Добавление Вина" }}
        </div>
        <div class="flex gap-2">
          <label for="isHidden">Скрыть</label>
          <ToggleSwitch id="isHidden" v-model="formData.isHidden" />
        </div>
      </div>
    </template>
    <Form
      v-slot="$form"
      :initialValues="formData"
      :resolver="resolver"
      @submit="saveWine"
      class="p-fluid"
    >
      <div class="flex gap-4">
        <div class="flex-1">
          <div class="input-container">
            <label for="name">Имя:</label>
            <InputText id="name" name="name" v-model="formData.name" />
            <Message
              v-if="$form.name?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.name.error.message }}
            </Message>
          </div>

          <div class="input-container">
            <label for="ruName">Русское имя:</label>
            <InputText id="ruName" name="ruName" v-model="formData.ruName" />
            <Message
              v-if="$form.ruName?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.ruName.error.message }}
            </Message>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="input-container">
              <label for="category">Категория:</label>
              <Select
                id="category"
                name="category"
                filter
                v-model="formData.category"
                :options="categoryOptions"
                option-label="label"
                option-value="value"
              />
              <Message
                v-if="$form.category?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.category.error.message }}
              </Message>
            </div>

            <div class="input-container">
              <label for="colour">Цвет:</label>
              <Select
                id="colour"
                name="colour"
                v-model="formData.colour"
                filter
                :options="colourOptions"
                option-label="label"
                option-value="value"
              />
              <Message
                v-if="$form.colour?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.colour.error.message }}
              </Message>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="input-container">
              <label for="bottleVolume">Объем (л):</label>
              <Select
                id="bottleVolume"
                name="bottleVolume"
                v-model="formData.bottleVolume"
                filter
                :options="bottleVolumeOptions"
                option-label="name"
                option-value="id"
              />
              <Message
                v-if="$form.bottleVolume?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.bottleVolume.error.message }}
              </Message>
            </div>

            <div class="input-container">
              <label for="sugarType">Тип сахара:</label>
              <Select
                id="sugarType"
                name="sugarType"
                v-model="formData.sugarType"
                :options="sugarTypesOptions"
                filter
                option-label="label"
                option-value="value"
              />
              <Message
                v-if="$form.sugarType?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.sugarType.error.message }}
              </Message>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="input-container">
              <label for="countryId">Страна:</label>
              <Select
                id="countryId"
                name="countryId"
                v-model="formData.countryId"
                :options="countriesOptions"
                filter
                optionLabel="label"
                optionValue="value"
              />
              <Message
                v-if="$form.countryId?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.countryId.error.message }}
              </Message>
            </div>

            <div class="input-container">
              <label for="regionId">Регион:</label>
              <Select
                id="regionId"
                name="regionId"
                showClear
                v-model="formData.regionId"
                :options="regionOptions"
                :loading="loadingRegions"
                :disabled="regionDisabled"
                filter
                optionLabel="label"
                optionValue="value"
              />
              <Message
                v-if="$form.regionId?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.regionId.error.message }}
              </Message>
            </div>
          </div>

          <div
            class="input-container"
            :disabled="disabledVintage"
            :class="{ disabled: disabledVintage }"
          >
            <label for="vintage">Год урожая:</label>
            <div class="flex items-center gap-2">
              <label class="flex items-center gap-2">
                <ToggleSwitch input-id="nonVintage" v-model="isNonVintage" />
                NV
              </label>
              <InputText
                class="flex-1"
                v-keyfilter.num
                v-model="formData.vintage"
                placeholder="Год урожая"
                :disabled="isNonVintage"
                id="vinage"
                name="vinage"
              />
            </div>
          </div>

          <div class="input-container">
            <label for="alcoholByVolume">Алкоголь, %:</label>
            <InputNumber
              id="alcoholByVolume"
              name="alcoholByVolume"
              v-model="formData.alcoholByVolume"
              :min="0"
              :max="100"
              :minFractionDigits="0"
              :maxFractionDigits="2"
            />
            <Message
              v-if="$form.alcoholByVolume?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.alcoholByVolume.error.message }}
            </Message>
          </div>

          <div class="input-container">
            <label for="grapeData">Виноград:</label>
            <MultiSelect
              id="grapeData"
              name="grapeData"
              v-model="formData.grapes"
              :options="grapeOptions"
              optionLabel="label"
              optionValue="value"
              display="chip"
              showClear
              filter
              placeholder="Выбрать виноград"
            />
            <Message
              v-if="$form.grapeIds?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.grapeIds.error.message }}
            </Message>
          </div>
          <div class="input-container">
            <label for="interestingFacts">Интересные факты:</label>
            <Textarea
              id="interestingFacts"
              name="interestingFacts"
              v-model="formData.interestingFacts"
              rows="5"
              cols="30"
            />
            <Message
              v-if="$form.interestingFacts?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.interestingFacts.error.message }}
            </Message>
          </div>

          <div class="input-container">
            <label for="organoleptic">Органолептические характеристики:</label>
            <Textarea
              id="organoleptic"
              name="organoleptic"
              v-model="formData.organoleptic"
              rows="5"
              cols="30"
            />
            <Message
              v-if="$form.organoleptic?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.organoleptic.error.message }}
            </Message>
          </div>
        </div>

        <div class="input-container flex-1" v-if="!isEditMode">
          <FileUpload
            id="image"
            name="image"
            accept="image/*"
            @select="handleFileUpload"
            customUpload
            choose-label="Загрузить изображение"
            auto
            mode="basic"
          />
          <Message
            v-if="imageFile"
            severity="info"
            size="small"
            variant="simple"
          >
            Загружено: {{ imageFile.name }}
          </Message>
          <img
            v-if="imageSrc"
            :src="imageSrc"
            alt="Image"
            class="shadow-md rounded-xl w-full sm:w-64"
          />
        </div>
      </div>

      <Button
        label="Сохранить"
        size="large"
        class="max-w-full w-full"
        type="submit"
      ></Button>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, watchEffect } from "vue";
import { z } from "zod";
import {
  bottleVolumeOptions,
  categoryOptions,
  colourOptions,
  sugarTypesOptions,
} from "w-list-api";
import {
  type Wine,
  WineCategoryEnum,
  type CreateWineRequest,
} from "wlist-types";
import { showVintage } from "w-list-utils";
import { storeToRefs } from "pinia";
import { useCountryStore } from "@/stores/countryStore";
import { useRegionStore } from "@/stores/regionStore";
import { useGrapeStore } from "@/stores/grapeStore";

// Получение данных из хранилищ
const { countriesOptions } = storeToRefs(useCountryStore());
const { regionOptions, loading: loadingRegions } =
  storeToRefs(useRegionStore());
const { grapeOptions } = storeToRefs(useGrapeStore());

const { fetchRegions } = useRegionStore();

// Определение свойств компонента
const props = defineProps<{
  show: boolean;
  initialData?: Wine;
}>();

const emit = defineEmits<{
  (e: "update:show", bol: boolean): void;
  (e: "save", data: CreateWineRequest, image?: File | null): void; // image опционально
}>();

const isVisible = computed({
  get: () => props.show,
  set: (value) => emit("update:show", value),
});

const isEditMode = computed(() => !!props.initialData);

// Реактивные ссылки
const imageFile = ref<File | null>(null);
const imageSrc = ref("");
const isNonVintage = ref(false);
const regionDisabled = ref(true);
const formData = ref<any>({
  ...props.initialData,
  vintage: props.initialData?.vintage ?? new Date().getFullYear(),
  isHidden: props.initialData?.isHidden ?? false,
  grapes: props.initialData?.grapeData.map((g) => g.grapeId) || [],
});

// Функция для обновления formData
const updateFormData = () => {
  if (!isEditMode.value) return;
  const data = props.initialData;

  formData.value = {
    id: data?.id,
    name: data?.name || "",
    ruName: data?.ruName ?? null,
    category: data?.category || "",
    colour: data?.colour || "",
    bottleVolume: data?.bottleVolume || "",
    alcoholByVolume: data?.alcoholByVolume,
    sugarType: data?.sugarType || "",
    countryId: data?.countryId || 0,
    isHidden: data?.isHidden || false,
    grapes: data?.grapeData.map((g) => g.grapeId) || [],
    vintage: data?.vintage,
    interestingFacts: data?.interestingFacts || "",
    regionId: data?.regionId ?? null,
    organoleptic: data?.organoleptic || "",
  };

  if (!data.vintage) isNonVintage.value = true;
};

watchEffect(() => {
  if (props.show) updateFormData();
});

const disabledVintage = ref(false);
watch(
  () => formData.value.category,
  (val: WineCategoryEnum) => {
    const bol = showVintage(val);

    if (!bol) {
      formData.value.vintage = null;
    }
    disabledVintage.value = !bol;
  },
);

// Следим за изменениями countryId и загружаем регионы
watch(
  () => formData.value.countryId,
  (val) => {
    regionDisabled.value = !val;
    if (val) fetchRegions(val);
  },
);

// Zod схема для валидации
const schema = z.object({
  name: z.string().nonempty("Имя обязательно."),
  category: z.string().nonempty("Выберите категорию"),
  colour: z.string().nonempty("Выберите цвет"),
  bottleVolume: z.number().min(0, "Объем бутылки обязателен."),
  sugarType: z.string().nonempty("Выберите Тип сахара"),
  alcoholByVolume: z
    .number()
    .min(0, "Алкоголь не может быть отрицательным.")
    .max(100, "Алкоголь не может превышать 100."),
  vintage: z
    .union([
      z.number().min(1900, "Год урожая не может быть меньше 1900."),
      z.literal(null),
    ])
    .optional(),
  countryId: z.number().min(1, "Страна обязательна."),
  regionId: z
    .union([z.number().min(1, "Регион обязателен."), z.literal(null)])
    .optional(),
  grapeIds: z
    .array(z.number())
    .min(1, "Выберите хотя бы один сорт винограда.")
    .optional(),
  isHidden: z.boolean(),
});

// Обработчик формы
const resolver = async ({ values }) => {
  try {
    schema.parse(values);
    return { errors: {} };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        errors: e.errors.reduce(
          (acc, error) => ({
            ...acc,
            [error.path[0]]: [{ message: error.message }],
          }),
          {},
        ),
      };
    }
    return { errors: {} };
  }
};

// Функция для сохранения вина
const saveWine = async ({ valid }) => {
  if (valid) {
    const result = { ...formData.value };

    result.vintage = isNonVintage.value ? null : result.vintage;
    result.grapeData =
      result.grapes?.map((g, index) => ({ grapeId: g, position: index + 1 })) ||
      [];

    // Remove the grapes field from result, if it exists
    delete result.grapes;

    emit("save", result, imageFile.value);
  }
};

// Функция для сброса формы
const resetForm = () => {
  Object.assign(formData.value, {
    id: undefined,
    name: "",
    ruName: null,
    category: undefined,
    colour: undefined,
    bottleVolume: 0,
    alcoholByVolume: 0,
    sugarType: undefined,
    countryId: 0,
    isHidden: false,
    grapes: [],
    vintage: new Date().getFullYear(),
    interestingFacts: "",
    regionId: null,
    organoleptic: "",
  });
  isNonVintage.value = false;
  imageFile.value = null;
  imageSrc.value = "";
};

// Обработчик загрузки изображения
const handleFileUpload = (event: any) => {
  const file = event.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imageFile.value = null;
  }
};

// Обновление значения vintage в зависимости от значения чекбокса Non-Vintage
watch(isNonVintage, (newVal) => {
  formData.value.vintage = newVal ? null : new Date().getFullYear();
});
</script>

<style scoped>
.disabled {
  pointer-events: none;
  background: var(--p-select-disabled-background);
  border-radius: 6px;
}
</style>
