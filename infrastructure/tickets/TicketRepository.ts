
import {
  SubmitSmartTicketPayload,
  SubmitSmartTicketResponse,
  SubmitCommentPayload,
  SubmitCommentResponse,
  Ticket,
  Comment,
  GetCommentsResponse,
} from "@/shared/types";

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
export interface ITicketRepository {
  getTickets(): Promise<Ticket[]>
  getTicketById(id: string): Promise<Ticket>
  assignTicket(ticketId: string, assignedTo: string): Promise<Ticket>
}

export class TicketRepository implements ITicketRepository {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = 'https://private-anon-9d923a4b14-vibecoding.apiary-mock.com/v1'
  }

  private getMockTickets(): any[] {
    // Mock data sesuai dengan API response yang diharapkan (3 data)
    return [
      {
        id: '1',
        title: 'Login issue on main application',
        description: 'User cannot login to the main application',
        status: 'Open',
        category: 'Authentication',
        priority: 'High',
        created_by: 'user1',
        assigned_to: 'John Doe',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Printer not working',
        description: 'Office printer on 3rd floor not responding',
        status: 'In Progress',
        category: 'Hardware',
        priority: 'Medium',
        created_by: 'user2',
        assigned_to: 'Jane Smith',
        created_at: '2024-01-15T09:15:00Z',
        updated_at: '2024-01-15T09:15:00Z'
      },
      {
        id: '3',
        title: 'Email server down',
        description: 'Company email server experiencing downtime',
        status: 'Resolved',
        category: 'Infrastructure',
        priority: 'Critical',
        created_by: 'user3',
        assigned_to: 'Bob Johnson',
        created_at: '2024-01-14T14:20:00Z',
        updated_at: '2024-01-14T14:20:00Z'
      }
    ]
  }

  async getTickets(): Promise<Ticket[]> {
    try {
      console.log('Attempting to fetch tickets from API...')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${this.baseUrl}/tickets`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.warn(`API responded with status: ${response.status}, falling back to mock data`)
        return this.getMockTickets()
      }

      const data = await response.json()
      console.log('Successfully fetched tickets from API:', data)

      // Map API response to our domain entity
      return data.map((ticket: any) => ({
        id: ticket.id?.toString() || '',
        title: ticket.title || '',
        description: ticket.description || '',
        status: ticket.status || 'Open',
        category: ticket.category || 'General',
        priority: ticket.priority || 'Medium',
        created_by: ticket.created_by || '',
        assigned_to: ticket.assigned_to || null,
        created_at: ticket.created_at || new Date().toISOString(),
        updated_at: ticket.updated_at || new Date().toISOString(),
      }))
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error)
      // Return mock data instead of throwing error
      return this.getMockTickets()
    }
  }

  async getTicketById(id: string): Promise<Ticket> {
    try {
      const response = await fetch(`${this.baseUrl}/tickets/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Map API response to our domain entity
      return {
        id: data.id?.toString() || '',
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'Open',
        category: data.category || 'General',
        priority: data.priority || 'Medium',
        created_by: data.created_by || '',
        assigned_to: data.assigned_to || null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching ticket:', error)
      throw new Error('Failed to fetch ticket')
    }
  }

  async assignTicket(ticketId: string, assignedTo: string): Promise<Ticket> {
    try {
      const response = await fetch(`${this.baseUrl}/tickets/${assignedTo}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Ticket assigned successfully:', data)

      // Map API response to our domain entity
      if (data.success && data.data) {
        return {
          id: data.data.id?.toString() || ticketId,
          title: data.data.title || '',
          description: data.data.description || '',
          status: data.data.status || 'IN_PROGRESS',
          category: data.data.category || 'General',
          priority: data.data.priority || 'Medium',
          created_by: data.data.created_by || '',
          assigned_to: data.data.assigned_to || assignedTo,
          created_at: data.data.created_at || new Date().toISOString(),
          updated_at: data.data.updated_at || new Date().toISOString(),
        }
      }

      throw new Error('Invalid response from API')
    } catch (error) {
      console.error('Error assigning ticket:', error)
      throw new Error('Failed to assign ticket')
    }
  }

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

  /**
   * Submit comment to a ticket
   * @param ticketId - Ticket ID
   * @param payload - Comment body
   * @returns Success status
   */
  static async submitComment(
    ticketId: string,
    payload: SubmitCommentPayload
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: payload.body,
        }),
      });

      const data: SubmitCommentResponse | ApiErrorResponse =
        await response.json();

      if (!data.success) {
        const errorData = data as ApiErrorResponse;
        throw new Error(
          errorData.error?.message || "Failed to submit comment"
        );
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred while submitting comment");
    }
  }

  /**
   * Get comments for a ticket
   * @param ticketId - Ticket ID
   * @returns Array of comments
   */
  static async getComments(ticketId: string): Promise<Comment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/tickets/${ticketId}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GetCommentsResponse = await response.json();

      return data.data.comments || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred while fetching comments");
    }
  }
}
