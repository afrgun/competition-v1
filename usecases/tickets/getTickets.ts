import { Ticket } from '@/shared/types/tickets'
import { ITicketRepository } from '@/infrastructure/tickets'

export interface GetTicketsUseCase {
  execute(): Promise<Ticket[]>
}

export class GetTicketsInteractor implements GetTicketsUseCase {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(): Promise<Ticket[]> {
    try {
      const tickets = await this.ticketRepository.getTickets()

      // Sort tickets by created_at descending (newest first)
      return tickets.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } catch (error) {
      console.error('Error in getTickets use case:', error)
      throw error
    }
  }
}