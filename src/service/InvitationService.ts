import { api } from "@/api/api.ts";
import type { Invitation } from "@/types/invitation";

export class InvitationService {
  static async getInvitation(): Promise<Invitation[]> {
    try {
      const { data } = await api.get("/invitations");
      return data;
    } catch (error) {
      console.error("Ошибка получения приглашенных", error);
      throw new Error("Ошибка получения приглашенных");
    }
  }
}
