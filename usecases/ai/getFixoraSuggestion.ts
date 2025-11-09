import { AiRepository } from "@/infrastructure/ai/AiRepository";
import { AiSuggestionResponse } from "@/shared/types";

/**
 * Result type for Fixora suggestion interactor
 */
export interface FixoraSuggestionResult {
  success: boolean;
  data?: AiSuggestionResponse;
  message?: string;
}

/**
 * Get Fixora AI suggestions based on user query
 * @param query - User input text
 * @returns FixoraSuggestionResult with suggestion data or error message
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

    const payload = {
      query: query,
    };

    // Call repository to get suggestions
    const data = await AiRepository.getSuggestions(payload);

    // Check if we got results
    if (!data || !data.suggestion) {
      return {
        success: false,
        message: "No suggestions found for your query",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get AI suggestions. Please try again.",
    };
  }
};
