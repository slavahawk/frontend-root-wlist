import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { handleError } from "@/helper/handleError.ts";
import { checkData } from "@/helper/checkData.ts";
import type { Invitation } from "@/types/invitation.ts";
import { InvitationService } from "@/service/InvitationService.ts";

export const useInvitationStore = defineStore("invitation", () => {
  const invitations = ref<Invitation[]>([]);
  const isLoad = ref(false);
  const toast = useToast();

  const getInvitations = async () => {
    isLoad.value = true;
    try {
      const data = await InvitationService.getInvitation();

      checkData(data);

      toast.add({
        severity: "success",
        summary: "Данные получены",
        life: 3000,
      });
      invitations.value = data;
      return data;
    } catch (error) {
      handleError(error, toast);
    } finally {
      isLoad.value = false;
    }
  };

  return {
    invitations,
    isLoad,
    getInvitations,
  };
});
