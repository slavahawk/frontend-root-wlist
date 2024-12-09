import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';
import Button from "primevue/button"
import App from './App.vue'
import router from './router'
import 'primeicons/primeicons.css'
import AuthLayout from "@/layouts/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
});
app.use(ToastService);
app.component('Button', Button);
app.component("AuthLayout", AuthLayout);
app.component("DefaultLayout", DefaultLayout);


app.mount('#app')
