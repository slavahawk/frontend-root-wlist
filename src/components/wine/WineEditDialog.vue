<template>
  <Dialog
    :visible="isVisible"
    header="Редактировать вино"
    modal
    @hide="resetForm"
    style="min-width: 50%"
    @update:visible="emit('close')"
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
          :options="colourOptions"
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
          <ToggleSwitch inputId="nonVintage" v-model="isNonVintage" />
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
          showClear
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

      <Button label="Сохранить" type="submit"></Button>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { z } from "zod";
import { type Wine } from "w-list-api";
import {
  bottleVolumeOptions,
  categoryOptions,
  colourOptions,
  sugarTypesOptions,
} from "w-list-api";
import { storeToRefs } from "pinia";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";

const props = defineProps<{
  isVisible: boolean;
  initialData: Wine; // Замените на правильный тип
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: any): void; // Замените на правильный тип
  (e: "update:visible", value: boolean): void;
}>();

const formData = ref({
  id: undefined,
  name: "",
  ruName: "",
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
  regionId: null,
  organoleptic: "",
});

// Получаем списки опций из Pinia
const { countriesOptions } = storeToRefs(useCountryStore());
const { regionOptions } = storeToRefs(useRegionStore());
const { grapeOptions } = storeToRefs(useGrapeStore());

// Обрабатываем изменения видимости
watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal && props.initialData) {
      formData.value = { ...props.initialData };
      if (formData.value.vintage) {
        // Если есть год урожая, преобразуем его в объект Date
        year.value = new Date(formData.value.vintage, 0, 1); // Январь первого числа года
      } else {
        isNonVintage.value = true; // Устанавливаем флажок
      }
    } else {
      resetForm();
    }
  },
);

// Функция сохранения
const saveWine = async ({ valid }) => {
  if (valid) {
    // Если regionId не указан, устанавливаем null
    if (!formData.value.regionId) {
      formData.value.regionId = null;
    }

    console.log(formData.value);

    emit("save", formData.value);
    resetForm();
  }
};

// Функция сброса формы
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: "",
    ruName: "",
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
    regionId: null,
    organoleptic: "",
  };
  isNonVintage.value = false; // Сброс чекбокса
  emit("close");
};

// Zod схема для валидации
const schema = z.object({
  name: z.string().nonempty("Имя обязательно."),
  category: z.string().nonempty("Выберите категорию"),
  colour: z.string().nonempty("Выберите цвет"),
  bottleVolume: z.number({
    message: "Объем бутылки обязателен.",
  }),
  sugarType: z.string().nonempty("Выберите уровень сахара"),
  alcoholByVolume: z
    .number({ message: "Алкогольное содержание обязательно" })
    .min(0, "Алкогольное содержание не может быть отрицательным.")
    .max(100, "Алкогольное содержание не может превышать 100."),
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
    .min(1, "Выберите хотя бы один сорт винограда.") // Добавлено требование минимум одно значение
    .optional(),
  // interestingFacts: z.string().nonempty("Интересные факты обязательны."),
  // organoleptic: z
  //   .string()
  //   .nonempty("Органолептические характеристики обязательны."),
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

const year = ref<Date>(new Date());
const isNonVintage = ref(false); // Определяет состояние Non-Vintage
const minDate = new Date(1900, 0, 1);
const maxDate = ref(new Date());

// Отслеживание изменений года урожая
watch(year, (val: Date) => {
  if (!isNonVintage.value) {
    formData.value.vintage = val.getFullYear(); // Устанавливаем год урожая
  }
});

// Установка значения окна в зависимости от Non-Vintage
watch(isNonVintage, (newVal) => {
  if (newVal) {
    formData.value.vintage = null; // Сбросить vintage
    year.value = new Date(); // Сбросить year, если Non-Vintage
  } else {
    formData.value.vintage = year.value.getFullYear(); // Устанавливаем год урожая
  }
});
</script>

<style scoped>
.input-container {
  margin-bottom: 1rem;
}
</style>
