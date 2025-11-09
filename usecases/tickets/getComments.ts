import { TicketRepository } from "@/infrastructure/tickets/TicketRepository";
import { Comment } from "@/shared/types";

/**
 * Result type for get comments interactor
 */
export interface GetCommentsResult {
  success: boolean;
  comments?: Comment[];
  message?: string;
}

/**
 * Get comments for a ticket
 * @param ticketId - Ticket ID
 * @returns GetCommentsResult with comments array
 */
export const getCommentsInteractor = async (
  ticketId: string
): Promise<GetCommentsResult> => {
  try {
    // Validate input
    if (!ticketId) {
      return {
        success: false,
        message: "Ticket ID is required",
      };
    }

    // Call repository to get comments
    const comments = await TicketRepository.getComments(ticketId);

    return {
      success: true,
      comments,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message || "Failed to fetch comments. Please try again.",
    };
  }
};
