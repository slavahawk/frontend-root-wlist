<template>
  <Form
    v-slot="$form"
    :initialValues="formData"
    :resolver="resolver"
    @submit="onSubmit"
    class="p-fluid"
  >
    <div v-for="(field, index) in fields" :key="index" class="input-container">
      <label :for="field.name">{{ field.label }}:</label>
      <component
        :is="field.component"
        v-model="formData[field.name]"
        v-bind="field.props"
        :id="field.name"
        :name="field.name"
      />
      <Message
        v-if="$form[field.name]?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form[field.name].error.message }}
      </Message>
    </div>
    <Button label="Сохранить" type="submit"></Button>
  </Form>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "submit", data: any): void;
}>();

const props = defineProps<{
  formData: any;
  fields: Array<{ name: string; label: string; component: any; props?: any }>;
  resolver: any; // Custom resolver function for validation
}>();

const onSubmit = ({ valid }) => {
  if (valid) {
    emit("submit", props.formData);
  }
};
</script>

<style scoped>
.input-container {
  margin-bottom: 1rem;
}
</style>
