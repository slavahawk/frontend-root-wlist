<template>
  <div>
    <Menubar :model="items" >
      <template #end>
        <div>
          <Button :label="exit.label" @click="exit.command"/>
        </div>
      </template>
    </Menubar>
    <div class="content">
      <router-view />
    </div>
  </div>


</template>

<script setup lang="ts">

import {Menubar} from "primevue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {AppRoutes} from "@/router";
import {useAuthStore} from "@/stores/authStore.ts";

const router = useRouter()
const authStore = useAuthStore();


const items = ref([
  {
    label: 'Вина',
    icon: 'pi pi-glass',
    command: () => {
      router.push({name: AppRoutes.HOME});
    },
  },
]);

const exit = ref( {
  label: 'Выход',
  icon: 'pi pi-sign-out',
  command: () => {
    authStore.logout();
  },
},);
</script>

<style scoped lang="scss">
.content {
  padding: 20px;
}
</style>

