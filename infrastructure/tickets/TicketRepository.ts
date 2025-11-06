import {
  SubmitSmartTicketPayload,
  SubmitSmartTicketResponse,
} from "@/shared/types";

/**
 * TicketRepository - handles ticket API calls
 * This is the infrastructure layer that communicates with ticket backend
 */

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details: any;
  };
  success: false;
}

/**
 * TicketRepository class with static methods
 */
export class TicketRepository {
  /**
   * Submit smart ticket with AI intake
   * @param payload - description and created_by user id
   * @returns Success status
   */
  static async submitSmartTicket(
    payload: SubmitSmartTicketPayload
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/tickets/ai-intake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: payload.description,
          created_by: payload.created_by,
        }),
      });

      const data: SubmitSmartTicketResponse | ApiErrorResponse =
        await response.json();

      if (!data.success) {
        const errorData = data as ApiErrorResponse;
        throw new Error(
          errorData.error?.message || "Failed to submit smart ticket"
        );
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred while submitting ticket");
    }
  }
}
