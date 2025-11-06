"use client";

import { useState } from "react";
import { Textarea } from "@/presentation/components/atoms";
import { DashboardActionButtons } from "@/presentation/components/molecules";

/**
 * DashboardWelcome - Organism component for dashboard welcome screen
 * Displays welcome message and AI-style chat input with action buttons
 */
export const DashboardWelcome: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  return (
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
        />

        {/* Action Buttons */}
        <DashboardActionButtons />
      </div>

      {/* Helper Text */}
      <p className="text-gray-400 text-sm mt-8 text-center">
        Ketik pertanyaan atau masalah Anda, lalu pilih cara yang tepat untuk
        mendapatkan bantuan
      </p>
    </div>
  );
};
