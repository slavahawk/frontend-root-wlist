<template>
  <Dialog
    :visible="isVisible"
    header="Вино"
    modal
    @hide="resetForm"
    style="min-width: 50%"
    @update:visible="updateVisible"
  >
    <Form
      v-slot="$form"
      :initialValues="formData"
      :resolver="resolver"
      @submit="saveWine"
      class="p-fluid"
    >
      <div class="input-container">
        <label for="name">Имя:</label>
        <InputText id="name" name="name" v-model="formData.name" />
        <Message
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.name.error.message }}</Message
        >
      </div>

      <div class="input-container">
        <label for="category">Категория:</label>
        <Select
          id="category"
          name="category"
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
          >{{ $form.category.error.message }}</Message
        >
      </div>

      <div class="input-container">
        <label for="colour">Цвет:</label>
        <Select
          id="colour"
          name="colour"
          v-model="formData.colour"
          :options="сolourOptions"
          option-label="label"
          option-value="value"
        />
        <Message
          v-if="$form.colour?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.colour.error.message }}</Message
        >
      </div>

      <div class="input-container">
        <label for="bottleVolume">Объем (л):</label>
        <Select
          id="bottleVolume"
          name="bottleVolume"
          v-model="formData.bottleVolume"
          :options="bottleVolumeOptions"
          option-label="name"
          option-value="id"
        />
        <Message
          v-if="$form.bottleVolume?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.bottleVolume.error.message }}</Message
        >
      </div>

      <div class="input-container">
        <label for="sugarType">Уровень сахара:</label>
        <Select
          id="sugarType"
          name="sugarType"
          v-model="formData.sugarType"
          :options="sugarTypesOptions"
          option-label="label"
          option-value="value"
        />
        <Message
          v-if="$form.sugarType?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.sugarType.error.message }}</Message
        >
      </div>

      <div class="input-container">
        <label for="alcoholByVolume">Алкогольное содержание (%):</label>
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
          >{{ $form.alcoholByVolume.error.message }}</Message
        >
        <Slider class="mt-4" v-model="formData.alcoholByVolume" />
      </div>

      <div class="input-container">
        <label for="vintage">Год урожая:</label>
        <label class="flex items-center gap-2 mb-2">
          <ToggleSwitch id="nonVintage" v-model="isNonVintage" />
          NV
        </label>
        <DatePicker
          v-model="year"
          view="year"
          :disabled="isNonVintage"
          :minDate="minDate"
          :maxData="maxDate"
          dateFormat="yy"
          placeholder="Год урожая"
        />
      </div>

      <div class="input-container">
        <label for="countryId">Страна:</label>
        <Select
          id="countryId"
          name="countryId"
          v-model="formData.countryId"
          :options="countriesOptions"
          optionLabel="label"
          optionValue="value"
        />
        <Message
          v-if="$form.countryId?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.countryId.error.message }}</Message
        >
      </div>

      <div class="input-container">
        <label for="regionId">Регион:</label>
        <Select
          id="regionId"
          name="regionId"
          v-model="formData.regionId"
          :options="regionOptions"
          optionLabel="label"
          optionValue="value"
        />
        <Message
          v-if="$form.regionId?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.regionId.error.message }}</Message
        >
      </div>

      <div class="input-container">
        <label for="grapeIds">Виноград:</label>
        <MultiSelect
          id="grapeIds"
          name="grapeIds"
          v-model="formData.grapeIds"
          :options="grapeOptions"
          optionLabel="label"
          optionValue="value"
          filter
          placeholder="Выбрать виноград"
        />
        <Message
          v-if="$form.grapeIds?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.grapeIds.error.message }}</Message
        >
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
          >{{ $form.interestingFacts.error.message }}</Message
        >
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
          >{{ $form.organoleptic.error.message }}</Message
        >
      </div>

      <div class="input-container">
        <label for="isHidden">Скрыть вино:</label>
        <InputSwitch id="isHidden" v-model="formData.isHidden" />
      </div>

      <div class="input-container">
        <label for="image">Загрузить изображение:</label>
        <FileUpload
          id="image"
          name="image"
          accept="image/*"
          @select="handleFileUpload"
          customUpload
          auto
          mode="basic"
        />
        <Message v-if="imageFile" severity="info" size="small" variant="simple">
          Загружено: {{ imageFile.name }}
        </Message>
        <img
          v-if="imageSrc"
          :src="imageSrc"
          alt="Image"
          class="shadow-md rounded-xl w-full sm:w-64"
        />
      </div>

      <Button label="Сохранить" type="submit"></Button>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { z } from "zod";
import {
  bottleVolumeOptions,
  categoryOptions,
  type CreateWineRequest,
  sugarTypesOptions,
  type Wine,
  сolourOptions,
} from "@/types/wine";
import { storeToRefs } from "pinia";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";
import FileUpload from "primevue/fileupload";

// Ссылки на данные из Pinia
const { countriesOptions } = storeToRefs(useCountryStore());
const { regionOptions } = storeToRefs(useRegionStore());
const { grapeOptions } = storeToRefs(useGrapeStore());

// Свойства компонента
const props = defineProps<{
  isVisible: boolean;
  createMode: boolean;
  initialData: Wine | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: CreateWineRequest, image: File | null): void;
  (e: "update:visible", value: boolean): void;
}>();

// Реактивные ссылки
const year = ref<Date>(new Date());
const isNonVintage = ref(false); // Определяет состояние Non-Vintage
const minDate = new Date(1900, 0, 1);
const maxDate = ref(new Date());
const formData = ref<CreateWineRequest & { id?: number }>({
  id: undefined,
  name: "",
  category: undefined,
  colour: undefined,
  bottleVolume: 0,
  alcoholByVolume: 0,
  sugarType: undefined,
  countryId: 0,
  isHidden: false,
  grapeIds: [],
  vintage: new Date().getFullYear(),
  interestingFacts: "",
  regionId: 0,
  organoleptic: "",
});

// Реактивные ссылки для изображения
const imageFile = ref<File | null>(null);
const imageSrc = ref("");

// Отслеживание изменений года урожая
watch(year, (val: Date) => {
  if (!isNonVintage.value) {
    formData.value.vintage = val.getFullYear(); // Устанавливаем год урожая
  }
});

// Zod схема для валидации
const schema = z.object({
  name: z.string().nonempty("Имя обязательно."),
  category: z.enum(
    categoryOptions.map((option) => option.value),
    "Категория обязательна.",
  ),
  colour: z.enum(
    сolourOptions.map((option) => option.value),
    "Цвет обязателен.",
  ),
  bottleVolume: z.number().min(0, "Объем обязателен."),
  alcoholByVolume: z
    .number()
    .min(0, "Алкогольное содержание не может быть отрицательным.")
    .max(100, "Алкогольное содержание не может превышать 100."),
  sugarType: z.enum(
    sugarTypesOptions.map((option) => option.value),
    "Уровень сахара обязателен.",
  ),
  vintage: z.union([
    z.number().min(1900, "Год урожая не может быть меньше 1900."),
    z.literal("NV"),
  ]),
  countryId: z.number().min(1, "Страна обязательна."),
  regionId: z.number().min(1, "Регион обязателен."),
  grapeIds: z.array(z.number()).optional(),
  interestingFacts: z.string().nonempty("Интересные факты обязательны."),
  organoleptic: z
    .string()
    .nonempty("Органолептические характеристики обязательны."),
  isHidden: z.boolean(),
});

// Обработчик формы
const resolver = async ({ values }) => {
  try {
    schema.parse(values);
    return { errors: {} };
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.reduce((acc, error) => {
        const path = error.path[0];
        acc[path] = [{ message: error.message }];
        return acc;
      }, {});
      return { errors };
    }
    return { errors: {} };
  }
};

// Отслеживание изменений видимости компонента
watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal && props.initialData) {
      isNonVintage.value = props.initialData.vintage === "NV"; // Устанавливаем состояние Non-Vintage
      formData.value = {
        ...props.initialData,
      };
      year.value = new Date(props.initialData.vintage); // Устанавливаем год (если не NV)
    } else {
      resetForm();
    }
  },
);

// Функция для сохранения вина
const saveWine = async ({ valid }) => {
  if (valid) {
    if (isNonVintage.value) {
      formData.value.vintage = "NV"; // Устанавливаем в "NV", если чекбокс активен
    } else {
      formData.value.vintage = year.value.getFullYear(); // Устанавливаем год
    }
    emit("save", formData.value, imageFile.value);
    resetForm();
  }
};

// Функция для сброса формы
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: "",
    category: undefined,
    colour: undefined,
    bottleVolume: 0,
    alcoholByVolume: 0,
    sugarType: undefined,
    countryId: 0,
    isHidden: false,
    grapeIds: [],
    vintage: new Date().getFullYear(),
    interestingFacts: "",
    regionId: 0,
    organoleptic: "",
  };
  isNonVintage.value = false; // Сброс чекбокса
  imageFile.value = null;
  imageSrc.value = null;
  emit("close");
};

// Обработчик загрузки изображения
const handleFileUpload = (event: any) => {
  const files = event.files;
  const file = files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    imageSrc.value = e.target.result;
  };

  imageFile.value = files.length > 0 ? file : null;
  reader.readAsDataURL(file);
};

// Функция для подтверждения обновления видимости
const updateVisible = (value: boolean) => {
  emit("update:visible", value);
};

// Установка значения окна в зависимости от Non-Vintage
watch(isNonVintage, (newVal) => {
  if (newVal) {
    formData.value.vintage = "NV"; // Устанавливаем в "NV"
  } else {
    formData.value.vintage = year.value.getFullYear(); // Устанавливаем в полноценный год
  }
});
</script>
