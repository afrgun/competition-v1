"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/presentation/layouts";
import { Text } from "@/presentation/components/atoms";
import { storage } from "@/shared/utils";
import { User } from "@/domain/entities";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = storage.getToken();
    const userData = storage.getUserData<User>();

    if (!token || !userData) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    setUser(userData);
  }, [router]);

  const handleLogout = () => {
    storage.clearAll();
    router.push("/login");
  };

  if (!user) {
    return null; // or loading spinner
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Text as="h1" variant="h2" className="mb-2">
            Welcome to Dashboard
          </Text>
          <Text color="secondary">You are successfully logged in!</Text>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Text variant="h4" className="mb-4">
            User Information
          </Text>
          <div className="space-y-2">
            <div>
              <Text weight="medium" className="inline">
                Name:{" "}
              </Text>
              <Text className="inline" color="secondary">
                {user.fullName}
              </Text>
            </div>
            <div>
              <Text weight="medium" className="inline">
                Email:{" "}
              </Text>
              <Text className="inline" color="secondary">
                {user.email}
              </Text>
            </div>
            <div>
              <Text weight="medium" className="inline">
                User ID:{" "}
              </Text>
              <Text className="inline" color="secondary">
                {user.id}
              </Text>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </MainLayout>
  );
}
