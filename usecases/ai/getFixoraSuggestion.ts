import { AiRepository } from "@/infrastructure/ai/AiRepository";
import { AiSuggestionItem } from "@/shared/types";

/**
 * Result type for Fixora suggestion interactor
 */
export interface FixoraSuggestionResult {
  success: boolean;
  suggestions?: AiSuggestionItem[];
  message?: string;
}

/**
 * Get Fixora AI suggestions based on user query
 * @param query - User input text
 * @returns FixoraSuggestionResult with suggestions or error message
 */
export const getFixoraSuggestionInteractor = async (
  query: string
): Promise<FixoraSuggestionResult> => {
  try {
    // Validate input
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: "Please enter your question or issue",
      };
    }

    // Call repository to get suggestions
    const suggestions = await AiRepository.getSuggestions({ query });

    // Check if we got results
    if (!suggestions || suggestions.length === 0) {
      return {
        success: true,
        suggestions: [],
        message: "No suggestions found for your query",
      };
    }

    return {
      success: true,
      suggestions,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get AI suggestions. Please try again.",
    };
  }
};
