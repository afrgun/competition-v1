/**
 * Ticket types for Smart Ticket submission
 */

export interface SubmitSmartTicketPayload {
  description: string;
  created_by: string;
}

export interface SubmitSmartTicketResponse {
  success: boolean;
  data?: any;
}
