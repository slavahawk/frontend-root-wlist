<template>
  <div class="flex flex-wrap items-center justify-between gap-2">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xl font-bold">Список вин {{ totalItems }}</span>
      <Button
        :icon="`pi ${filterState ? 'pi-filter-slash' : 'pi-filter'}`"
        variant="text"
        @click="$emit('toggleMenu')"
        v-tooltip.bottom="`${filterState ? 'Скрыть' : 'Раскрыть'} фильтры`"
      />
      <Button
        icon="pi pi-plus"
        variant="text"
        @click="$emit('showCreateDialog')"
        v-tooltip.bottom="`Добавить вино`"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  filterState: Boolean,
  totalItems: Number,
});
</script>
