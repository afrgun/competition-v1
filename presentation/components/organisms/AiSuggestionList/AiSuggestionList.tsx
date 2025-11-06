import { AiSuggestionItem } from "@/shared/types";
import { AiSuggestionCard } from "@/presentation/components/molecules";

interface AiSuggestionListProps {
  suggestions: AiSuggestionItem[];
  isLoading?: boolean;
  error?: string;
}

/**
 * AiSuggestionList - Organism component for displaying list of AI suggestions
 * Shows suggestions as step-by-step guide
 */
export const AiSuggestionList: React.FC<AiSuggestionListProps> = ({
  suggestions,
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
  if (!suggestions || suggestions.length === 0) {
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

  // Success state - show step-by-step suggestions
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Recommended Steps
        </h3>
        <p className="text-gray-400 text-sm">
          Follow these {suggestions.length} step{suggestions.length > 1 ? "s" : ""}{" "}
          to resolve your issue
        </p>
      </div>

      {/* Step by step list */}
      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <AiSuggestionCard
            key={suggestion.entry_id}
            suggestion={suggestion}
            stepNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
};
