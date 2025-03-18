<template>
  <Button @click="isVisible = true">Открыть новый поиск</Button>
  <Dialog
    header="Найти вино"
    v-model:visible="isVisible"
    :modal="true"
    style="min-width: 400px"
  >
    <div>
      <p>
        Пример с годом должен быть: Chablis "Sainte Claire", Jean-Marc Brocard
        2023
      </p>
      <div>
        <InputText v-model="text" style="width: 100%" />
      </div>

      <div>
        <ProgressSpinner v-if="load" />
      </div>
      <WineCard
        v-if="result?.[0]"
        :img="result[0].vintages[0].image.location"
        :name="result[0].summary.name"
        :alcohol-by-volume="0"
        interesting-facts="none"
        organoleptic="none"
        :vintage="result[0].vintages[0].year"
        :grapes="result[0].vintages[0].grapes"
        sugar-type="none"
        :country="result[0].country.name"
        :category="result[0].summary.type"
        :colour="result[0].summary.type"
        :region="result[0].region.name"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import { debounce } from "w-list-utils";
import { WineCard } from "w-list-components";

const isVisible = ref(false);

const load = ref(false);
const text = ref("");
const result = ref();

// Замените на ваш API токен
const API_TOKEN = "apify_api_xDH7CnlVqxtJgNHYI8WgvGQfh6B6wX0fPaBW";

// Асинхронная функция для выполнения запроса к Apify
const fetchWinesByName = async (keyword: string) => {
  load.value = true;
  try {
    // Выполнить вызов актора и дождаться завершения

    const response = await axios.post(
      `https://api.apify.com/v2/acts/canadesk~vivino/run-sync-get-dataset-items?token=${API_TOKEN}`,
      {
        keyword, // Название вина для поиска
        delay: 2,
        proxy: {
          useApifyProxy: true,
          apifyProxyGroups: ["RESIDENTIAL"],
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    result.value = response.data;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  } finally {
    load.value = false;
  }
};

// Вызов функции, чтобы получить вина по названию
watch(
  text,
  debounce((val: string) => {
    fetchWinesByName(val);
  }, 2000),
);
</script>
