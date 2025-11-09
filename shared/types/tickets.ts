export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
/**
 * Ticket types for Smart Ticket submission
 */

export interface SubmitSmartTicketPayload {
  description: string;
  created_by: string;
}

export interface SubmitCommentPayload {
  body: string;
}

export interface SubmitCommentResponse {
  status: boolean;
  data?: any;
}

export interface SubmitSmartTicketResponse {
  status: boolean;
  data?: any;
}

export interface Comment {
  id: string;
  ticket_id: string;
  author_id: string;
  role: "EMPLOYEE" | "ADMIN" | "AI";
  body: string;
  created_at: string;
}

export interface GetCommentsResponse {
  data: {
    comments: Comment[];
  };
}
