<template>
  <Dialog
    :visible="isVisible"
    header="Редактирование вина"
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
        >
          {{ $form.name.error.message }}
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

      <div class="input-container">
        <label for="bottleVolume">Объем (л):</label>
        <Select
          id="bottleVolume"
          name="bottleVolume"
          v-model="formData.bottleVolume"
          :options="bottleVolumeOptions"
          option-label="label"
          option-value="value"
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
        >
          {{ $form.alcoholByVolume.error.message }}
        </Message>
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
        >
          {{ $form.sugarType.error.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="vintage">Год урожая:</label>
        <InputNumber
          id="vintage"
          name="vintage"
          v-model="formData.vintage"
          :min="1900"
          :max="new Date().getFullYear()"
        />
        <Message
          v-if="$form.vintage?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.vintage.error.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="countryId">Страна:</label>
        <Select
          id="countryId"
          name="countryId"
          v-model="formData.countryId"
          :options="countriesOptions"
          option-label="label"
          option-value="value"
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
          v-model="formData.regionId"
          :options="regionOptions"
          option-label="label"
          option-value="value"
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

      <div class="input-container">
        <label for="grapeIds">Виноград:</label>
        <MultiSelect
          id="grapeIds"
          name="grapeIds"
          v-model="formData.grapeIds"
          :options="grapeOptions"
          option-label="label"
          option-value="value"
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
import {
  bottleVolumeOptions,
  categoryOptions,
  colourOptions,
  sugarTypesOptions,
} from "@/types/wine";
import { storeToRefs } from "pinia";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";

const props = defineProps<{
  isVisible: boolean;
  initialData: any; // Замените на правильный тип
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: any): void; // Замените на правильный тип
  (e: "update:visible", value: boolean): void;
}>();

const formData = ref({
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
    } else {
      resetForm();
    }
  },
);

// Функция сохранения
const saveWine = async ({ valid }) => {
  if (valid) {
    emit("save", formData.value);
    resetForm();
  }
};

// Функция сброса формы
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
  emit("close");
};

// Zod схема для валидации
const schema = z.object({
  name: z.string().nonempty("Имя обязательно."),
  category: z.enum(
    categoryOptions.map((option) => option.value),
    "Категория обязательна.",
  ),
  colour: z.enum(
    colourOptions.map((option) => option.value),
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
  vintage: z.number().min(1900, "Год урожая не может быть меньше 1900."),
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
</script>

<style scoped>
.input-container {
  margin-bottom: 1rem;
}
</style>
