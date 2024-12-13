<template>
  <div>
    <h1 class="text-2xl font-medium mb-4">
      Приглашенные сомелье
      <span class="text-gray-500">{{ invitations.length }}</span>
    </h1>
    <DataTable :loading="isLoad" :value="invitations">
      <Column field="id" header="ID"></Column>
      <Column field="sentMail" header="sentMail"></Column>
      <Column field="expiredAt" header="expiredAt"></Column>
      <Column field="confirmedAt" header="confirmedAt"></Column>
      <Column field="createdAt" header="createdAt"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { useInvitationStore } from "@/stores/invitaionStore.ts";
import { storeToRefs } from "pinia";

const { getInvitations } = useInvitationStore();
const { invitations, isLoad } = storeToRefs(useInvitationStore());

getInvitations();
</script>

<style scoped></style>
