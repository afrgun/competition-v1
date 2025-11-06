/**
 * My Ticket Page - Placeholder
 * Will display list of user's tickets
 */
export default function MyTicketPage() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
        <svg
          className="w-16 h-16 text-gray-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>

        <h2 className="text-xl font-semibold text-gray-300 mb-2">
          My Tickets List
        </h2>
        <p className="text-gray-400 mb-4">
          This page will display all your submitted tickets and their status.
        </p>
        <p className="text-sm text-gray-500">
          Feature coming soon...
        </p>
      </div>
    </div>
  );
}
