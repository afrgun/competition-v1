"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/atoms";

interface DashboardActionButtonsProps {
  onSmartTicket?: () => void;
  onConsultFixora?: () => void;
}

/**
 * DashboardActionButtons - Molecule component for dashboard action buttons
 * Contains two primary actions: Submit Smart Ticket and Consult with Fixora
 */
export const DashboardActionButtons: React.FC<
  DashboardActionButtonsProps
> = ({ onSmartTicket, onConsultFixora }) => {
  const router = useRouter();

  const handleSmartTicket = () => {
    if (onSmartTicket) {
      onSmartTicket();
    } else {
      // Default navigation to create ticket page
      router.push("/dashboard/my-ticket/create");
    }
  };

  const handleConsultFixora = () => {
    if (onConsultFixora) {
      onConsultFixora();
    } else {
      // Default navigation to fixora consultation
      router.push("/dashboard/fixora");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
      <Button
        onClick={handleSmartTicket}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        Submit Smart Ticket
      </Button>
      <Button
        onClick={handleConsultFixora}
        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        Konsultasikan dengan Fixora
      </Button>
    </div>
  );
};
