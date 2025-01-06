<template>
  <Dialog
    :visible="isVisible"
    header="Редактирование изображения"
    modal
    @hide="resetForm"
    style="min-width: 50%"
    @update:visible="emit('close')"
  >
    <div class="input-container">
      <label for="image">Загрузить новое изображение:</label>
      <FileUpload
        id="image"
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
    <Button label="Сохранить" @click="saveImage" />
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  isVisible: boolean;
  initialData: any; // Укажите правильный тип
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update-image", image: File): void;
}>();

const imageFile = ref<File | null>(null);
const imageSrc = ref("");

const resetForm = () => {
  imageFile.value = null;
  imageSrc.value = "";
  emit("close");
};

const handleFileUpload = (event: any) => {
  const files = event.files;
  const file = files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    imageSrc.value = e.target.result;
  };

  imageFile.value = files.length > 0 ? file : null;
  reader.readAsDataURL(file);
};

const saveImage = () => {
  if (imageFile.value) {
    emit("update-image", imageFile.value);
    resetForm();
  }
};
</script>
