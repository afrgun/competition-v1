import {
  AiSuggestionRequest,
  AiSuggestionResponse,
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
  status: boolean;
}

/**
 * AiRepository class with static methods
 */
export class AiRepository {
  /**
   * Get AI suggestions based on user query
   * @param request - query text from user
   * @returns AI suggestion response object
   */
  static async getSuggestions(
    request: AiSuggestionRequest
  ): Promise<AiSuggestionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ai/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        },
        body: JSON.stringify({
          query: request.query,
          description: request.query
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as AiSuggestionResponse;

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred while fetching AI suggestions");
    }
  }
}
