"use client";

import { UserRole } from "@/domain/entities";
import { DASHBOARD_MENU } from "@/shared/constants";
import { SidebarMenu } from "@/presentation/components/molecules";
import { Button } from "@/presentation/components/atoms";
import { logoutUserInteractor } from "@/usecases/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  userRole: UserRole;
}

/**
 * Sidebar - Organism component for dashboard navigation
 * Filters menu items based on user role and handles responsive behavior
 */
export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Filter menu items based on user role
  const filteredMenu = DASHBOARD_MENU.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUserInteractor();
      router.push("/login");
    } catch (error) {
      // Even if logout fails, redirect to login
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-64 bg-gray-900 text-white
          flex flex-col
          transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1 capitalize">{userRole}</p>
        </div>

        {/* Menu */}
        <div className="flex-1 p-4 overflow-y-auto">
          <SidebarMenu items={filteredMenu} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Smart Ticketing Platform 2025
          </p>
        </div>
      </aside>
    </>
  );
};
