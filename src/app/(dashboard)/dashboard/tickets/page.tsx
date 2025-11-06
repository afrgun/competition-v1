'use client'

import React, { useState, useEffect } from 'react'
import { TableDynamic, ColumnType } from '@/presentation/components/atoms/TableDynamic'
import { useRouter } from 'next/navigation'

interface Ticket {
  id: string
  ticket_code: string
  title: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  technician: string
  created_at: string
  description?: string
  category?: string
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    ticket_code: 'TKT-001',
    title: 'Login issue on main application',
    priority: 'High',
    status: 'Open',
    technician: 'John Doe',
    created_at: '2024-01-15 10:30:00',
    description: 'User cannot login to the main application',
    category: 'Authentication'
  },
  {
    id: '2',
    ticket_code: 'TKT-002',
    title: 'Printer not working',
    priority: 'Medium',
    status: 'In Progress',
    technician: 'Jane Smith',
    created_at: '2024-01-15 09:15:00',
    description: 'Office printer on 3rd floor not responding',
    category: 'Hardware'
  },
  {
    id: '3',
    ticket_code: 'TKT-003',
    title: 'Email server down',
    priority: 'Critical',
    status: 'Resolved',
    technician: 'Bob Johnson',
    created_at: '2024-01-14 14:20:00',
    description: 'Company email server experiencing downtime',
    category: 'Infrastructure'
  },
  {
    id: '4',
    ticket_code: 'TKT-004',
    title: 'Software installation request',
    priority: 'Low',
    status: 'Closed',
    technician: 'Alice Brown',
    created_at: '2024-01-14 11:45:00',
    description: 'Need to install Adobe Creative Suite',
    category: 'Software'
  },
  {
    id: '5',
    ticket_code: 'TKT-005',
    title: 'Network connectivity issue',
    priority: 'High',
    status: 'Open',
    technician: 'Unassigned',
    created_at: '2024-01-15 13:00:00',
    description: 'Cannot connect to network from conference room',
    category: 'Network'
  },
  {
    id: '6',
    ticket_code: 'TKT-006',
    title: 'Database performance slow',
    priority: 'Medium',
    status: 'In Progress',
    technician: 'Charlie Wilson',
    created_at: '2024-01-15 08:30:00',
    description: 'Database queries running slower than usual',
    category: 'Database'
  },
  {
    id: '7',
    ticket_code: 'TKT-007',
    title: 'Mobile app crash',
    priority: 'High',
    status: 'Open',
    technician: 'Diana Martinez',
    created_at: '2024-01-15 15:20:00',
    description: 'Mobile application crashes on startup',
    category: 'Mobile'
  },
  {
    id: '8',
    ticket_code: 'TKT-008',
    title: 'Password reset request',
    priority: 'Low',
    status: 'Resolved',
    technician: 'Eva Chen',
    created_at: '2024-01-14 16:45:00',
    description: 'User needs password reset for VPN access',
    category: 'Security'
  }
]

export default function TicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalTickets, setTotalTickets] = useState(0)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setTickets(mockTickets)
        setTotalTickets(mockTickets.length)
      } catch (error) {
        console.error('Error fetching tickets:', error)
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

  const handleRowClick = (ticket: Ticket) => {
    router.push(`/dashboard/tickets/${ticket.id}`)
  }

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page)
    // In real implementation, you would fetch data for the new page
  }

  const columns: ColumnType<Ticket>[] = [
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
            <button
              onClick={() => router.push('/dashboard/tickets/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Ticket
            </button>
          </div>
        </div>

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