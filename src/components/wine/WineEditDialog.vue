<template>
  <Dialog
    :visible="isVisible"
    header="Редактирование Вина"
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
      <div class="grid grid-cols-2 gap-2">
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
          <label for="sugarType">Уровень сахара:</label>
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

      <div class="input-container">
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

      <div class="grid grid-cols-2 gap-2">
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
          >
            {{ $form.grapeIds.error.message }}
          </Message>
        </div>
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
  type Wine,
} from "w-list-api";
import { type CreateWineRequest } from "w-list-api";
import { storeToRefs } from "pinia";
import { useCountryStore } from "@/stores/countryStore.ts";
import { useRegionStore } from "@/stores/regionStore.ts";
import { useGrapeStore } from "@/stores/grapeStore.ts";

// Вызовы хранилищ для получения данных
const { countriesOptions } = storeToRefs(useCountryStore());
const { regionOptions, loading: loadingRegions } =
  storeToRefs(useRegionStore());
const { grapeOptions } = storeToRefs(useGrapeStore());
const { fetchRegions } = useRegionStore();

// Определение свойств компонента
const props = defineProps<{
  isVisible: boolean;
  initialData: Wine; // Замените на правильный тип
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: CreateWineRequest): void;
}>();

// Обрабатываем изменения видимости
watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal && props.initialData) {
      formData.value = { ...props.initialData };
      if (!formData.value.vintage) {
        isNonVintage.value = true; // Устанавливаем флажок
      }
    } else {
      resetForm();
    }
  },
);

// Реактивные ссылки
const isNonVintage = ref(false);
const regionDisabled = ref(true);
const formData = ref<CreateWineRequest & { id?: number }>({
  id: undefined,
  name: "",
  ruName: null,
  category: "",
  colour: "",
  bottleVolume: "",
  alcoholByVolume: undefined,
  sugarType: "",
  countryId: 0,
  isHidden: false,
  grapeIds: [],
  vintage: new Date().getFullYear(),
  interestingFacts: "",
  regionId: null,
  organoleptic: "",
});

// Следим за изменениями countryId и загружаем регионы
watch(
  () => formData.value.countryId,
  (val) => {
    regionDisabled.value = !val;
    if (val) {
      fetchRegions(val);
    }
  },
);

// Zod схема для валидации
const schema = z.object({
  name: z.string().nonempty("Имя обязательно."),
  category: z.string().nonempty("Выберите категорию"),
  colour: z.string().nonempty("Выберите цвет"),
  bottleVolume: z.number({ message: "Объем бутылки обязателен." }),
  sugarType: z.string().nonempty("Выберите уровень сахара"),
  alcoholByVolume: z
    .number()
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
    .min(1, "Выберите хотя бы один сорт винограда.")
    .optional(),
  isHidden: z.boolean(),
});

// Обработчик формы
const resolver = async ({ values }) => {
  try {
    schema.parse(values);
    return { errors: {} }; // Если валидация прошла успешно
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.reduce((acc, error) => {
        const path = error.path[0]; // Каждое сообщение ошибки ссылается на имя поля
        acc[path] = [{ message: error.message }];
        return acc;
      }, {});
      return { errors }; // Возвращаем ошибки
    }
    return { errors: {} };
  }
};

// Функция для сохранения вина
const saveWine = async ({ valid }) => {
  if (valid) {
    formData.value.vintage = isNonVintage.value
      ? null
      : new Date().getFullYear();
    emit("save", formData.value); // Передаем данные
  }
};

// Функция для сброса формы
const resetForm = () => {
  formData.value = {
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
    grapeIds: [],
    vintage: new Date().getFullYear(),
    interestingFacts: "",
    regionId: null,
    organoleptic: "",
  };
  isNonVintage.value = false; // Сброс чекбокса Non-Vintage
  emit("close");
};

// Обновление значения vintage в зависимости от значения чекбокса Non-Vintage
watch(isNonVintage, (newVal) => {
  formData.value.vintage = newVal ? null : new Date().getFullYear();
});
</script>
