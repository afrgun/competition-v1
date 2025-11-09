import React from 'react'

interface Admin {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AssignTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (assignedTo: string) => void
  loading?: boolean
  ticketTitle?: string
  currentAssignedTo?: string
}

const mockAdmins: Admin[] = [
  {
    id: 'admin-1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Senior Admin',
    avatar: 'JD'
  },
  {
    id: 'admin-2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'IT Support',
    avatar: 'JS'
  },
  {
    id: 'admin-3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    role: 'System Admin',
    avatar: 'BJ'
  },
  {
    id: 'admin-4',
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    role: 'Network Admin',
    avatar: 'AB'
  },
  {
    id: 'admin-5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@company.com',
    role: 'Database Admin',
    avatar: 'CW'
  }
]

export function AssignTicketModal({
  isOpen,
  onClose,
  onAssign,
  loading = false,
  ticketTitle = '',
  currentAssignedTo = ''
}: AssignTicketModalProps) {
  const [selectedAdmin, setSelectedAdmin] = React.useState<string>('')

  React.useEffect(() => {
    if (isOpen) {
      setSelectedAdmin('')
    }
  }, [isOpen])

  const handleAssign = () => {
    if (selectedAdmin && selectedAdmin !== currentAssignedTo) {
      onAssign(selectedAdmin)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setSelectedAdmin('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                    Assign Ticket
                  </h3>
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Ticket info */}
                {ticketTitle && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ticket: {ticketTitle}
                    </p>
                    {currentAssignedTo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Currently assigned to: {currentAssignedTo}
                      </p>
                    )}
                  </div>
                )}

                {/* Admin selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Admin/Technician
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {mockAdmins.map((admin) => (
                      <div
                        key={admin.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedAdmin === admin.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => setSelectedAdmin(admin.id)}
                      >
                        <input
                          type="radio"
                          name="admin"
                          value={admin.id}
                          checked={selectedAdmin === admin.id}
                          onChange={() => setSelectedAdmin(admin.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3 flex items-center flex-1">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                              {admin.avatar}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {admin.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {admin.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
              onClick={handleAssign}
              disabled={!selectedAdmin || selectedAdmin === currentAssignedTo || loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning...
                </>
              ) : (
                'Assign Ticket'
              )}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}