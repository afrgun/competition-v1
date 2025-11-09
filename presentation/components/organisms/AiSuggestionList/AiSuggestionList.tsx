import { AiSuggestionResponse } from "@/shared/types";
import { AiSuggestionCard } from "@/presentation/components/molecules";

interface AiSuggestionListProps {
  suggestion: AiSuggestionResponse | null;
  isLoading?: boolean;
  error?: string;
}

/**
 * AiSuggestionList - Organism component for displaying AI suggestion
 * Shows suggestion from Fixora AI
 */
export const AiSuggestionList: React.FC<AiSuggestionListProps> = ({
  suggestion,
  isLoading,
  error,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400">Getting suggestions from Fixora...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          className="w-16 h-16 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!suggestion) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          className="w-16 h-16 text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-400 text-center">
          No suggestions found for your query.
        </p>
        <p className="text-gray-500 text-sm text-center mt-2">
          Try rephrasing your question or being more specific.
        </p>
      </div>
    );
  }

  // Success state - show AI suggestion
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          AI Analysis & Recommendation
        </h3>
        <p className="text-gray-400 text-sm">
          Here's what Fixora AI suggests for your query
        </p>
      </div>

      <AiSuggestionCard suggestion={suggestion} />
    </div>
  );
};
