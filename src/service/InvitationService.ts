import { api } from "@/api/api.ts";
import type { Invitation } from "@/types/invitation";

export class InvitationService {
  static async getAll(): Promise<Invitation[]> {
    try {
      const { data } = await api.get("/invitations");
      return data;
    } catch (error) {
      console.error("Ошибка получения приглашенных", error);
      throw new Error("Ошибка получения приглашенных");
    }
  }
  static async send(email: string): Promise<{
    success: boolean;
    details: {};
  }> {
    try {
      const { data } = await api.post("/invitations/send", { email });
      return data;
    } catch (error) {
      console.error("Ошибка отправления приглашения", error);
      throw new Error("Ошибка отправления приглашения");
    }
  }
  static async confirm(
    token: string,
    newPassword: string,
  ): Promise<{
    success: boolean;
    details: {};
  }> {
    try {
      const { data } = await api.post(`/invitations/${token}/confirm`, {
        newPassword,
      });
      return data;
    } catch (error) {
      console.error("Ошибка подтверждения", error);
      throw new Error("Ошибка подтверждения");
    }
  }
}
