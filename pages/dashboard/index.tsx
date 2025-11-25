import { DashboardWelcome } from "@/presentation/components/organisms";
import { DashboardLayout } from "@/presentation/layouts";

/**
 * Dashboard Home Page
 * Displays welcome message and AI-style chat input
 */
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardWelcome />
    </DashboardLayout>
  );
}
