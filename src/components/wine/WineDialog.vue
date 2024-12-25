<template>
  <Dialog
    :visible="isVisible"
    header="Вино"
    modal
    @hide="resetForm"
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
        <InputText id="name" name="name" v-model="formData.name" required />
        <Message
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.name.error?.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="category">Категория:</label>
        <Dropdown
          id="category"
          name="category"
          v-model="formData.category"
          :options="categoryOptions"
          optionLabel="label"
          optionValue="value"
          required
        />
        <Message
          v-if="$form.category?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.category.error?.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="colour">Цвет:</label>
        <InputText
          id="colour"
          name="colour"
          v-model="formData.colour"
          required
        />
        <Message
          v-if="$form.colour?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.colour.error?.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="bottleVolume">Объем (мл):</label>
        <InputText
          id="bottleVolume"
          name="bottleVolume"
          type="number"
          v-model="formData.bottleVolume"
          @input="convertToNumber('bottleVolume')"
          required
        />
        <Message
          v-if="$form.bottleVolume?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.bottleVolume.error?.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="alcoholByVolume">Алкогольное содержание (%):</label>
        <InputText
          id="alcoholByVolume"
          name="alcoholByVolume"
          type="number"
          v-model="formData.alcoholByVolume"
          @input="convertToNumber('alcoholByVolume')"
          required
        />
        <Message
          v-if="$form.alcoholByVolume?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.alcoholByVolume.error?.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="vintage">Год урожая:</label>
        <InputText
          id="vintage"
          name="vintage"
          type="number"
          v-model="formData.vintage"
          @input="convertToNumber('vintage')"
          required
        />
        <Message
          v-if="$form.vintage?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.vintage.error?.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="regionId">Регион ID:</label>
        <InputText
          id="regionId"
          name="regionId"
          type="number"
          v-model="formData.regionId"
          @input="convertToNumber('regionId')"
          required
        />
        <Message
          v-if="$form.regionId?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.regionId.error?.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="interestingFacts">Интересные факты:</label>
        <InputText
          id="interestingFacts"
          name="interestingFacts"
          v-model="formData.interestingFacts"
          required
        />
        <Message
          v-if="$form.interestingFacts?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.interestingFacts.error?.message }}
        </Message>
      </div>

      <div class="input-container">
        <label for="organoleptic">Органолептические характеристики:</label>
        <InputText
          id="organoleptic"
          name="organoleptic"
          v-model="formData.organoleptic"
          required
        />
        <Message
          v-if="$form.organoleptic?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.organoleptic.error?.message }}
        </Message>
      </div>

      <Button label="Сохранить" type="submit"></Button>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { z } from "zod";
import {
  type CreateWineRequest,
  type Wine,
  categoryOptions,
} from "@/types/wine";

const props = defineProps<{
  isVisible: boolean;
  createMode: boolean;
  initialData: Wine | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: CreateWineRequest): void;
  (e: "update:visible", value: boolean): void;
}>();

const formData = ref<CreateWineRequest>({
  name: "",
  category: "RED",
  colour: "RED",
  bottleVolume: 0,
  alcoholByVolume: 0,
  sugarType: "DRY",
  countryId: 0,
  isHidden: false,
  grapeIds: [],
  vintage: 0,
  regionId: 0,
  interestingFacts: "",
  organoleptic: "",
});

// Определите схему Zod для валидации
const schema = z.object({
  name: z.string().nonempty("Имя обязательно."),
  category: z.string().nonempty("Категория обязательна."),
  colour: z.string().nonempty("Цвет обязателен."),
  bottleVolume: z.number().min(1, "Объем должен быть больше 0."),
  alcoholByVolume: z
    .number()
    .min(0, "Алкогольное содержание не puede быть отрицательным."),
  vintage: z.number().min(1900, "Год урожая не может быть меньше 1900."),
  regionId: z.number().min(1, "Регион ID обязателен."),
  interestingFacts: z.string().optional(), // Можно не требовать
  organoleptic: z.string().optional(), // Можно не требовать
});

// Обработчик формы
const resolver = async ({ values }) => {
  try {
    // Преобразование значений перед передачей в схему Zod
    const parsedValues = {
      ...values,
      bottleVolume: Number(values.bottleVolume),
      alcoholByVolume: Number(values.alcoholByVolume),
      vintage: Number(values.vintage),
      regionId: Number(values.regionId),
    };

    schema.parse(parsedValues);
    return { errors: {} }; // Если ошибок нет, возвращаем пустой объект ошибок
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.reduce((acc, error) => {
        const path = error.path[0]; // Получаем путь к ошибке
        acc[path] = [{ message: error.message }]; // Добавляем ошибку по пути
        return acc;
      }, {});
      return { errors }; // Возвращаем ошибки
    }
    return { errors: {} }; // На случай других ошибок
  }
};

// Watcher для инициализации формы при изменении входных данных
watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal && props.initialData) {
      formData.value = {
        ...props.initialData,
      };
    } else {
      resetForm();
    }
  },
);

// Функция для сохранения вина
const saveWine = () => {
  emit("save", formData.value);
  resetForm();
};

// Функция для сброса формы
const resetForm = () => {
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
    vintage: 0,
    regionId: 0,
    interestingFacts: "",
    organoleptic: "",
  };
  emit("close");
};

// Обработка ввода в числовых полях и преобразование в число
const convertToNumber = (fieldName: keyof CreateWineRequest) => {
  formData.value[fieldName] = Number(formData.value[fieldName]);
};

// Обработчик для обновления видимости
const updateVisible = (value: boolean) => {
  emit("update:visible", value);
};
</script>

<style scoped>
/* Ваши стили здесь */
</style>
