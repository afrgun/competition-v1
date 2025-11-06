"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea, Modal } from "@/presentation/components/atoms";
import { DashboardActionButtons } from "@/presentation/components/molecules";
import { AiSuggestionList } from "@/presentation/components/organisms";
import { getFixoraSuggestionInteractor } from "@/usecases/ai";
import { submitSmartTicketInteractor } from "@/usecases/tickets";
import { AiSuggestionItem } from "@/shared/types";
import { storage } from "@/shared/utils";
import { User } from "@/domain/entities";

/**
 * DashboardWelcome - Organism component for dashboard welcome screen
 * Displays welcome message and AI-style chat input with action buttons
 */
export const DashboardWelcome: React.FC = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AiSuggestionItem[]>([]);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleConsultFixora = async () => {
    // Reset states
    setError("");
    setSuggestions([]);
    setSuccessMessage("");
    setIsLoading(true);
    setIsModalOpen(true);

    // Call usecase
    const result = await getFixoraSuggestionInteractor(inputValue);

    setIsLoading(false);

    if (result.success) {
      setSuggestions(result.suggestions || []);
    } else {
      setError(result.message || "Failed to get suggestions");
    }
  };

  const handleSubmitSmartTicket = async () => {
    // Reset states
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // Get user from localStorage
    const user = storage.getUserData<User>();
    if (!user) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    // Call usecase
    const result = await submitSmartTicketInteractor(inputValue, user.id);

    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message || "Smart Ticket submitted successfully!");
      setInputValue(""); // Clear input

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/my-ticket");
      }, 2000);
    } else {
      setError(result.message || "Failed to submit ticket");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset after modal close animation
    setTimeout(() => {
      setSuggestions([]);
      setError("");
    }, 300);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-white px-4">
        {/* Welcome Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Welcome to Dashboard 👋
        </h1>

        {/* AI Chat Input Section */}
        <div className="w-full max-w-3xl space-y-6">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ada yang bisa dibantu hari ini?"
            className="text-base md:text-lg"
            rows={4}
            disabled={isLoading}
          />

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-900 border border-green-700 rounded-lg p-4">
              <p className="text-green-200 text-center">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && !isModalOpen && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <DashboardActionButtons
            onConsultFixora={handleConsultFixora}
            onSmartTicket={handleSubmitSmartTicket}
          />
        </div>

        {/* Helper Text */}
        <p className="text-gray-400 text-sm mt-8 text-center">
          Ketik pertanyaan atau masalah Anda, lalu pilih cara yang tepat untuk
          mendapatkan bantuan
        </p>
      </div>

      {/* AI Suggestions Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Fixora AI Suggestions"
        size="xl"
      >
        <AiSuggestionList
          suggestions={suggestions}
          isLoading={isLoading}
          error={error}
        />
      </Modal>
    </>
  );
};
