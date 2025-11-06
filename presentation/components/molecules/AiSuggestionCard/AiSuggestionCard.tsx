import { AiSuggestionItem } from "@/shared/types";

interface AiSuggestionCardProps {
  suggestion: AiSuggestionItem;
  stepNumber: number;
}

/**
 * AiSuggestionCard - Molecule component for displaying single AI suggestion as a step
 * Shows only the content snippet in step-by-step format
 */
export const AiSuggestionCard: React.FC<AiSuggestionCardProps> = ({
  suggestion,
  stepNumber,
}) => {
  return (
    <div className="flex gap-4 items-start">
      {/* Step Number */}
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-bold text-sm">
        {stepNumber}
      </div>

      {/* Content Snippet */}
      <div className="flex-1 pt-1">
        <p className="text-gray-200 text-base leading-relaxed">
          {suggestion.content_snippet}
        </p>
      </div>
    </div>
  );
};
