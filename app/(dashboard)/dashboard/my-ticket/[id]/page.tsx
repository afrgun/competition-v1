"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Ticket Detail Page - Placeholder
 * Will display detailed information about a specific ticket
 */
export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to My Tickets
          </button>
          <h1 className="text-3xl font-bold">Ticket Detail</h1>
          <p className="text-gray-400 mt-2">Ticket ID: {ticketId}</p>
        </div>
      </div>

      {/* Ticket Information Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-lg font-semibold text-blue-400">
              TKT-{ticketId}
            </span>
            <span className="px-3 py-1 bg-blue-900 text-blue-200 text-sm rounded-full">
              Open
            </span>
            <span className="px-3 py-1 bg-orange-900 text-orange-200 text-sm rounded-full">
              High Priority
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Ticket Title</h2>
            <p className="text-gray-400">
              Detailed information about this ticket will be displayed here.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-sm text-gray-400 mb-1">Category</p>
              <p className="text-white">General</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Created At</p>
              <p className="text-white">-</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Created By</p>
              <p className="text-white">You</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Assigned To</p>
              <p className="text-white">Unassigned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <p className="text-gray-400 leading-relaxed">
          The full ticket description will be displayed here. This will include
          all the details about the issue or request submitted by the user.
        </p>
      </div>

      {/* Timeline/Activity Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 text-gray-500 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-400 text-sm">
            Activity timeline will be displayed here
          </p>
        </div>
      </div>

      {/* Placeholder Notice */}
      <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
        <p className="text-blue-200 text-sm text-center">
          📝 This is a placeholder page. Full ticket detail functionality
          coming soon...
        </p>
      </div>
    </div>
  );
}
