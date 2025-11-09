import { AiSuggestionResponse } from "@/shared/types";
import ReactMarkdown from "react-markdown";

interface AiSuggestionCardProps {
  suggestion: AiSuggestionResponse;
}

/**
 * AiSuggestionCard - Molecule component for displaying AI suggestion
 * Shows suggestion text, confidence score, category, and source
 */
export const AiSuggestionCard: React.FC<AiSuggestionCardProps> = ({
  suggestion,
}) => {
  const confidencePercentage = Math.round(suggestion.confidence * 100);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
      {/* Header: Category & Confidence */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-200 border border-blue-700">
          {suggestion.category}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200 border border-green-700">
          {confidencePercentage}% Confidence
        </span>
      </div>

      {/* Suggestion Text with Markdown */}
      <div className="mt-4">
        <ReactMarkdown
          components={{
            // Custom styling untuk markdown elements
            p: ({ children }) => <p className="mb-3 text-gray-200">{children}</p>,
            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
            em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
            h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-3 mt-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-2 mt-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2 mt-3">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-200">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-200">{children}</ol>,
            li: ({ children }) => <li className="text-gray-200">{children}</li>,
            code: ({ children }) => <code className="bg-gray-900 px-2 py-1 rounded text-blue-300 text-sm">{children}</code>,
            pre: ({ children }) => <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto mb-3">{children}</pre>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-3">{children}</blockquote>,
          }}
        >
          {suggestion.suggestion}
        </ReactMarkdown>
      </div>

      {/* Footer: Source & Cache Info */}
      <div className="pt-4 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span>Powered by {suggestion.source}</span>
        </div>
        {suggestion.used_cache && (
          <span className="text-xs text-gray-500">Cached response</span>
        )}
      </div>
    </div>
  );
};
