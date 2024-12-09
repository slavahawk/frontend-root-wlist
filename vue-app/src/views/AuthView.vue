<template>
  <div class="login-container">
    <h2>Войти</h2>
    <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="form">
      {{`test@mail.ru / 123`}}
      <div class="input-container">
        <InputText name="email" type="email" placeholder="Электронная почта" fluid autocomplete="email" />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>
      </div>
      <div class="input-container">
        <InputText name="password" type="password" placeholder="Пароль" fluid autocomplete="current-password" />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.password.error?.message }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="Войти" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import {InputText, Message} from "primevue";
import {reactive} from 'vue';
import {Form} from '@primevue/forms';
import {z} from 'zod';
import {useAuthStore} from "@/stores/authStore.ts";

const authStore = useAuthStore();

const initialValues = reactive({
  email: '',
  password: ''
});

const schema = z.object({
  email: z.string()
      .nonempty({ message: 'Электронная почта обязательна.' })
      .email({ message: 'Электронная почта недействительна.' }),
  password: z.string()
      .nonempty({ message: 'Пароль обязателен.' })
});

const resolver = async ({ values }) => {
  try {
    schema.parse(values);
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

const onFormSubmit = async ({valid, states}) => {

  if (valid) {
    try {
      await authStore.login(states.email.value, states.password.value)
    } catch (error) {
      alert(error.message);
    }
  }
};

</script>

<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px; /* заменяет gap-4 */
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 4px; /* заменяет gap-1 */
}
</style>
