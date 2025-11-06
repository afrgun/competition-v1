import {
  AiSuggestionRequest,
  AiSuggestionResponse,
  AiSuggestionItem,
} from "@/shared/types";

/**
 * AiRepository - handles AI API calls
 * This is the infrastructure layer that communicates with AI backend
 */

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details: any;
  };
  success: false;
}

/**
 * AiRepository class with static methods
 */
export class AiRepository {
  /**
   * Get AI suggestions based on user query
   * @param request - query text from user
   * @returns List of AI suggestion candidates
   */
  static async getSuggestions(
    request: AiSuggestionRequest
  ): Promise<AiSuggestionItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ai/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: request.query,
        }),
      });

      const data: AiSuggestionResponse | ApiErrorResponse =
        await response.json();

      if (!data.success) {
        const errorData = data as ApiErrorResponse;
        throw new Error(
          errorData.error?.message ||
            "Failed to get AI suggestions"
        );
      }

      const successData = data as AiSuggestionResponse;
      return successData.data.candidates || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred while fetching AI suggestions");
    }
  }
}
