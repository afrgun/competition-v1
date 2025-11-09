"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { submitCommentInteractor, getCommentsInteractor } from "@/usecases/tickets";
import { Comment } from "@/shared/types";

/**
 * Ticket Detail Page - Placeholder
 * Will display detailed information about a specific ticket
 */
export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    const result = await getCommentsInteractor(ticketId);
    setIsLoadingComments(false);

    if (result.success && result.comments) {
      setComments(result.comments);
    }
  };

  const getRoleInitials = (role: string) => {
    if (role === "EMPLOYEE") return "EM";
    if (role === "ADMIN") return "AD";
    if (role === "AI") return "AI";
    return "??";
  };

  const getRoleLabel = (role: string) => {
    if (role === "EMPLOYEE") return "Employee";
    if (role === "ADMIN") return "Admin";
    if (role === "AI") return "AI Assistant";
    return "User";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch comments on mount
    fetchComments();
  }, [ticketId]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    // Reset messages
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmittingComment(true);

    // Call usecase
    const result = await submitCommentInteractor(ticketId, comment);

    setIsSubmittingComment(false);

    if (result.success) {
      setSuccessMessage(result.message || "Comment submitted successfully!");
      setComment(""); // Clear textarea

      // Refetch comments to show the new one
      await fetchComments();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      setErrorMessage(result.message || "Failed to submit comment");
    }
  };

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

      {/* Comments Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Comments</h3>

        {/* Loading Comments */}
        {isLoadingComments && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Comments List */}
        {!isLoadingComments && comments.length > 0 && (
          <div className="space-y-4 mb-6">
            {comments.map((commentItem) => (
              <div key={commentItem.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-300">
                      {getRoleInitials(commentItem.role)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">
                        {getRoleLabel(commentItem.role)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(commentItem.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {commentItem.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Comments */}
        {!isLoadingComments && comments.length === 0 && (
          <div className="text-center py-8 mb-6">
            <p className="text-gray-400 text-sm">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}

        {/* Add Comment Form */}
        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Add a Comment
          </h4>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-900 border border-green-700 rounded-lg p-3 mb-4">
              <p className="text-green-200 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </div>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment here..."
            rows={4}
            disabled={isSubmittingComment}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmitComment}
              disabled={isSubmittingComment || !comment.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
            >
              {isSubmittingComment ? "Submitting..." : "Submit Comment"}
            </button>
          </div>
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
