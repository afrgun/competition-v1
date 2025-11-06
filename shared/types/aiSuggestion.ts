/**
 * AI Suggestion types for Fixora consultation feature
 */

export interface AiSuggestionItem {
  rank: number;
  score: number;
  entry_id: string;
  chunk_index: number;
  content_snippet: string;
  category: string;
  tags: string[];
}

export interface AiSuggestionResponse {
  success: boolean;
  data: {
    candidates: AiSuggestionItem[];
  };
}

export interface AiSuggestionRequest {
  query: string;
}
