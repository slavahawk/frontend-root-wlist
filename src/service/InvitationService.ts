import axios from "axios";
import type { Invitation, InvitationRequest } from "@/types/invitation";

const InvitationService = {
  async getAll(): Promise<Invitation[]> {
    try {
      const response = await axios.get("/invitations");
      return response.data;
    } catch (error) {
      console.error("Ошибка при отправке приглашения:", error);
      throw error;
    }
  },

  async send(invitationData: InvitationRequest): Promise<void> {
    try {
      await axios.post("/invitations/send", invitationData);
    } catch (error) {
      console.error("Ошибка при отправке приглашения:", error);
      throw error;
    }
  },

  async confirm(token: string): Promise<void> {
    try {
      await axios.post(`/invitations/${token}/confirm`);
    } catch (error) {
      console.error(
        `Ошибка при подтверждении приглашения с токеном ${token}:`,
        error,
      );
      throw error;
    }
  },
};

export default InvitationService;
