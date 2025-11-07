'use client'

import React, { useState, useEffect } from 'react'
import { TableDynamic, ColumnType } from '@/presentation/components/atoms/TableDynamic'
import { useRouter } from 'next/navigation'

import { TicketRepository } from '@/infrastructure/tickets'
import { GetTicketsInteractor } from '@/usecases/tickets'
import { Ticket } from '@/shared/types/tickets'

interface TicketWithCode extends Ticket {
  ticket_code: string
  technician: string
}

export default function TicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<TicketWithCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalTickets, setTotalTickets] = useState(0)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      setError(null)

      try {
        // Initialize Clean Architecture layers
        const ticketRepository = new TicketRepository()
        const getTicketsInteractor = new GetTicketsInteractor(ticketRepository)

        // Execute use case
        const ticketsData = await getTicketsInteractor.execute()

        // Generate ticket codes for display and map assigned_to to technician
        const ticketsWithCodes: TicketWithCode[] = ticketsData.map((ticket, index) => ({
          ...ticket,
          ticket_code: `TKT-${String(index + 1).padStart(3, '0')}`,
          technician: ticket.assigned_to || 'Unassigned'
        }))

        setTickets(ticketsWithCodes)
        setTotalTickets(ticketsWithCodes.length)
      } catch (error) {
        console.error('Error fetching tickets:', error)
        // Repository sudah memiliki fallback data, jadi ini hanya error handling terakhir
        setError('Failed to load tickets. Please refresh the page.')
        setTickets([])
        setTotalTickets(0)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleRowClick = (ticket: TicketWithCode) => {
    router.push(`/dashboard/tickets/${ticket.id}`)
  }

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page)
    // In real implementation, you would fetch data for the new page
  }

  const columns: ColumnType<TicketWithCode>[] = [
    {
      key: 'ticket_code',
      title: 'Ticket Code',
      width: '120px',
      sorter: true,
      render: (value) => (
        <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
          {value}
        </span>
      )
    },
    {
      key: 'title',
      title: 'Title',
      sorter: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{value}</div>
          {record.category && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {record.category}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'priority',
      title: 'Priority',
      width: '100px',
      align: 'center',
      sorter: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      width: '120px',
      align: 'center',
      sorter: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'technician',
      title: 'Technician',
      width: '150px',
      sorter: true,
      render: (value) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {value === 'Unassigned' ? (
              <span className="text-gray-400 italic">Unassigned</span>
            ) : (
              value
            )}
          </span>
        </div>
      )
    },
    {
      key: 'created_at',
      title: 'Created At',
      width: '180px',
      sorter: true,
      render: (value) => (
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )
    }
  ]

  const paginatedTickets = tickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Tickets Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and track support tickets
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading tickets</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                    {tickets.filter(t => t.status === 'Open').length}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tickets</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">
                    {tickets.filter(t => t.status === 'In Progress').length}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tickets</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold">
                    {tickets.filter(t => t.status === 'Resolved').length}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tickets</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-sm font-bold">
                    {tickets.filter(t => t.priority === 'Critical').length}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Priority</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              All Tickets
            </h2>
          </div>
          <div className="p-6">
            <TableDynamic
              columns={columns}
              data={paginatedTickets}
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalTickets,
                onChange: handlePageChange
              }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record)
              })}
              emptyText="No tickets found. Create your first ticket to get started."
              scroll={{ x: 1000 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}