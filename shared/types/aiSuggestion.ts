/**
 * AI Suggestion types for Fixora consultation feature
 */

export interface AiSuggestionResponse {
  suggestion: string;
  confidence: number;
  category: string;
  source: string;
  used_cache: boolean;
}

export interface AiSuggestionRequest {
  query: string;
}
