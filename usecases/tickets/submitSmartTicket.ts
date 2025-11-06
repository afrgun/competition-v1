import { TicketRepository } from "@/infrastructure/tickets/TicketRepository";

/**
 * Result type for submit smart ticket interactor
 */
export interface SubmitSmartTicketResult {
  success: boolean;
  message?: string;
}

/**
 * Submit smart ticket with AI intake
 * @param description - User problem description
 * @param userId - User ID from auth/me
 * @returns SubmitSmartTicketResult with success status and message
 */
export const submitSmartTicketInteractor = async (
  description: string,
  userId: string
): Promise<SubmitSmartTicketResult> => {
  try {
    // Validate input
    if (!description || description.trim().length === 0) {
      return {
        success: false,
        message: "Please enter a description of your issue",
      };
    }

    if (!userId) {
      return {
        success: false,
        message: "User authentication required",
      };
    }

    // Call repository to submit ticket
    await TicketRepository.submitSmartTicket({
      description: description.trim(),
      created_by: userId,
    });

    return {
      success: true,
      message: "Smart Ticket berhasil dikirim! Anda akan segera mendapatkan bantuan.",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message || "Gagal mengirim Smart Ticket. Silakan coba lagi.",
    };
  }
};
