import { Ticket } from '@/shared/types/tickets'
import { ITicketRepository } from '@/infrastructure/tickets'

export interface AssignTicketUseCase {
  execute(ticketId: string, assignedTo: string): Promise<Ticket>
}

export class AssignTicketInteractor implements AssignTicketUseCase {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(ticketId: string, assignedTo: string): Promise<Ticket> {
    try {
      if (!ticketId) {
        throw new Error('Ticket ID is required')
      }

      if (!assignedTo || assignedTo.trim() === '') {
        throw new Error('Assigned user is required')
      }

      // Call repository to assign ticket
      const updatedTicket = await this.ticketRepository.assignTicket(ticketId, assignedTo.trim())

      console.log(`Ticket ${ticketId} assigned successfully to ${assignedTo}`)

      return updatedTicket
    } catch (error) {
      console.error('Error in assignTicket use case:', error)
      throw error
    }
  }
}