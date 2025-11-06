import { TicketRepository } from "@/infrastructure/tickets/TicketRepository";

/**
 * Result type for submit comment interactor
 */
export interface SubmitCommentResult {
  success: boolean;
  message?: string;
}

/**
 * Submit comment to a ticket
 * @param ticketId - Ticket ID
 * @param commentBody - Comment text
 * @returns SubmitCommentResult with success status and message
 */
export const submitCommentInteractor = async (
  ticketId: string,
  commentBody: string
): Promise<SubmitCommentResult> => {
  try {
    // Validate input
    if (!commentBody || commentBody.trim().length === 0) {
      return {
        success: false,
        message: "Please enter a comment",
      };
    }

    if (!ticketId) {
      return {
        success: false,
        message: "Ticket ID is required",
      };
    }

    // Call repository to submit comment
    await TicketRepository.submitComment(ticketId, {
      body: commentBody.trim(),
    });

    return {
      success: true,
      message: "Comment submitted successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message || "Failed to submit comment. Please try again.",
    };
  }
};
